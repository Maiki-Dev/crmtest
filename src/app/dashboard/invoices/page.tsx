'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, CheckCircle, Clock, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createClient } from '@/lib/supabase';
import { Invoice, Customer } from '@/types';
import { useSearchParams } from 'next/navigation';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<(Invoice & { customer: Customer })[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState<Partial<Invoice>>({});
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [plan, setPlan] = useState<'free' | 'pro'>('free');

  const searchParams = useSearchParams();
  const customerIdParam = searchParams.get('customer');

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
      fetchInvoices(business.id);
      fetchCustomers(business.id);
    }
  }

  async function fetchInvoices(bid: string) {
    const { data } = await supabase
      .from('invoices')
      .select('*, customer:customers(*)')
      .eq('business_id', bid)
      .order('created_at', { ascending: false });
    
    if (data) setInvoices(data as any);
    setLoading(false);
  }

  async function fetchCustomers(bid: string) {
    const { data } = await supabase.from('customers').select('*').eq('business_id', bid);
    if (data) setCustomers(data);
  }

  const filteredInvoices = invoices.filter((i: Invoice & { customer: Customer }) => 
    i.customer?.name.toLowerCase().includes(search.toLowerCase()) || 
    i.amount.toString().includes(search)
  );

  const handleSaveInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessId) return;

    if (plan === 'free' && !currentInvoice.id && invoices.length >= 10) {
      alert('Таны үнэгүй эрх дууссан байна. Pro эрх рүү шилжүүлнэ үү.');
      return;
    }

    const payload = {
      ...currentInvoice,
      business_id: businessId,
      status: currentInvoice.status || 'pending',
    };

    if (currentInvoice.id) {
      await supabase.from('invoices').update(payload).eq('id', currentInvoice.id);
    } else {
      await supabase.from('invoices').insert([payload]);
    }

    setIsModalOpen(false);
    fetchInvoices(businessId);
  };

  const toggleStatus = async (invoice: Invoice) => {
    const newStatus = invoice.status === 'pending' ? 'paid' : 'pending';
    await supabase.from('invoices').update({ status: newStatus }).eq('id', invoice.id);
    if (businessId) fetchInvoices(businessId);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Та энэ нэхэмжлэлийг устгахдаа итгэлтэй байна уу?')) {
      await supabase.from('invoices').delete().eq('id', id);
      if (businessId) fetchInvoices(businessId);
    }
  };

  useEffect(() => {
    if (customerIdParam && customers.length > 0) {
      setCurrentInvoice({ customer_id: customerIdParam });
      setIsModalOpen(true);
    }
  }, [customerIdParam, customers]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Нэхэмжлэлүүд</h1>
          <p className="text-gray-500">Нийт {invoices.length} нэхэмжлэл</p>
        </div>
        <Button onClick={() => { setCurrentInvoice({}); setIsModalOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Нэхэмжлэл үүсгэх
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              className="pl-10" 
              placeholder="Хэрэглэгчийн нэрээр хайх..." 
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-medium">
              <tr>
                <th className="px-6 py-3">Хэрэглэгч</th>
                <th className="px-6 py-3">Дүн</th>
                <th className="px-6 py-3">Төлөв</th>
                <th className="px-6 py-3">Огноо</th>
                <th className="px-6 py-3 text-right">Үйлдэл</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-500">Уншиж байна...</td></tr>
              ) : filteredInvoices.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-500">Нэхэмжлэл олдсонгүй.</td></tr>
              ) : (
                filteredInvoices.map((i) => (
                  <tr key={i.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{i.customer?.name}</td>
                    <td className="px-6 py-4 text-gray-900 font-semibold">{Number(i.amount).toLocaleString()} ₮</td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => toggleStatus(i)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          i.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {i.status === 'paid' ? (
                          <><CheckCircle className="mr-1 h-3 w-3" /> Төлөгдсөн</>
                        ) : (
                          <><Clock className="mr-1 h-3 w-3" /> Хүлээгдэж буй</>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm">
                      {new Date(i.created_at).toLocaleDateString('mn-MN')}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(i.id)}>
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
            <h2 className="text-xl font-bold mb-4">Шинэ нэхэмжлэл</h2>
            <form onSubmit={handleSaveInvoice} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Хэрэглэгч сонгох</label>
                <select 
                  required
                  className="w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={currentInvoice.customer_id || ''}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCurrentInvoice({...currentInvoice, customer_id: e.target.value})}
                >
                  <option value="">Сонгох...</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>
                  ))}
                </select>
              </div>
              <Input 
                label="Дүн (₮)" 
                type="number"
                required 
                value={currentInvoice.amount || ''} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentInvoice({...currentInvoice, amount: Number(e.target.value)})}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Төлөв</label>
                <select 
                  className="w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={currentInvoice.status || 'pending'}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCurrentInvoice({...currentInvoice, status: e.target.value as any})}
                >
                  <option value="pending">Хүлээгдэж буй</option>
                  <option value="paid">Төлөгдсөн</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Болих
                </Button>
                <Button type="submit">
                  Үүсгэх
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
