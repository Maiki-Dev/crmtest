'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, MoreVertical, Edit2, Trash2, MessageCircle, FilePlus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createClient } from '@/lib/supabase';
import { Customer } from '@/types';
import Link from 'next/link';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<Partial<Customer> | null>(null);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [plan, setPlan] = useState<'free' | 'pro'>('free');

  const supabase = createClient();

  useEffect(() => {
    fetchInitialData();
  }, []);

  async function fetchInitialData() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase.from('profiles').select('plan').eq('id', user.id).single();
    const { data: business } = await supabase.from('businesses').select('id').eq('owner_id', user.id).single();

    if (profile) setPlan(profile.plan);
    if (business) {
      setBusinessId(business.id);
      fetchCustomers(business.id);
    }
  }

  async function fetchCustomers(bid: string) {
    const { data } = await supabase
      .from('customers')
      .select('*')
      .eq('business_id', bid)
      .order('created_at', { ascending: false });
    
    if (data) setCustomers(data);
    setLoading(false);
  }

  const filteredCustomers = customers.filter((c: Customer) => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.phone?.includes(search)
  );

  const handleSaveCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessId) return;

    if (plan === 'free' && !currentCustomer?.id && customers.length >= 20) {
      alert('Таны үнэгүй эрх дууссан байна. Pro эрх рүү шилжүүлнэ үү.');
      return;
    }

    const payload = {
      ...currentCustomer,
      business_id: businessId,
    };

    if (currentCustomer?.id) {
      await supabase.from('customers').update(payload).eq('id', currentCustomer.id);
    } else {
      await supabase.from('customers').insert([payload]);
    }

    setIsModalOpen(false);
    fetchCustomers(businessId);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Та энэ хэрэглэгчийг устгахдаа итгэлтэй байна уу?')) {
      await supabase.from('customers').delete().eq('id', id);
      if (businessId) fetchCustomers(businessId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Хэрэглэгчид</h1>
          <p className="text-gray-500">Нийт {customers.length} хэрэглэгч</p>
        </div>
        <Button onClick={() => { setCurrentCustomer({}); setIsModalOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Хэрэглэгч нэмэх
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              className="pl-10" 
              placeholder="Нэр эсвэл утсаар хайх..." 
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-medium">
              <tr>
                <th className="px-6 py-3">Нэр</th>
                <th className="px-6 py-3">Утас</th>
                <th className="px-6 py-3">Тэмдэглэл</th>
                <th className="px-6 py-3">Бүртгэсэн огноо</th>
                <th className="px-6 py-3 text-right">Үйлдэл</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-500">Уншиж байна...</td></tr>
              ) : filteredCustomers.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-500">Хэрэглэгч олдсонгүй.</td></tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{c.name}</td>
                    <td className="px-6 py-4 text-gray-600">{c.phone || '-'}</td>
                    <td className="px-6 py-4 text-gray-600 truncate max-w-[200px]">{c.note || '-'}</td>
                    <td className="px-6 py-4 text-gray-500 text-sm">
                      {new Date(c.created_at).toLocaleDateString('mn-MN')}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link href={`/dashboard/chat?customer=${c.id}`}>
                        <Button variant="ghost" size="icon" title="Чаат">
                          <MessageCircle className="h-4 w-4 text-blue-600" />
                        </Button>
                      </Link>
                      <Link href={`/dashboard/invoices?customer=${c.id}`}>
                        <Button variant="ghost" size="icon" title="Нэхэмжлэл">
                          <FilePlus className="h-4 w-4 text-green-600" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon" onClick={() => { setCurrentCustomer(c); setIsModalOpen(true); }}>
                        <Edit2 className="h-4 w-4 text-gray-600" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(c.id)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">
              {currentCustomer?.id ? 'Хэрэглэгч засах' : 'Шинэ хэрэглэгч'}
            </h2>
            <form onSubmit={handleSaveCustomer} className="space-y-4">
              <Input 
                label="Нэр" 
                required 
                value={currentCustomer?.name || ''} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentCustomer({...currentCustomer, name: e.target.value})}
              />
              <Input 
                label="Утас" 
                value={currentCustomer?.phone || ''} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentCustomer({...currentCustomer, phone: e.target.value})}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Тэмдэглэл</label>
                <textarea 
                  className="w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                  rows={3}
                  value={currentCustomer?.note || ''}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCurrentCustomer({...currentCustomer, note: e.target.value})}
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Болих
                </Button>
                <Button type="submit">
                  Хадгалах
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
