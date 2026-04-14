'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createClient } from '@/lib/supabase';
import { Message, Customer } from '@/types';
import { useSearchParams } from 'next/navigation';

export default function ChatPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [businessId, setBusinessId] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const customerIdParam = searchParams.get('customer');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchInitialData();
  }, []);

  async function fetchInitialData() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: business } = await supabase.from('businesses').select('id').eq('owner_id', user.id).single();
    if (business) {
      setBusinessId(business.id);
      fetchCustomers(business.id);
    }
  }

  async function fetchCustomers(bid: string) {
    const { data } = await supabase.from('customers').select('*').eq('business_id', bid).order('name');
    if (data) {
      setCustomers(data);
      if (customerIdParam) {
        const c = data.find((cust: Customer) => cust.id === customerIdParam);
        if (c) setSelectedCustomer(c);
      } else if (data.length > 0) {
        setSelectedCustomer(data[0]);
      }
    }
    setLoading(false);
  }

  useEffect(() => {
    if (selectedCustomer) {
      fetchMessages(selectedCustomer.id);
      
      const channel = supabase
        .channel(`messages:${selectedCustomer.id}`)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'messages', filter: `customer_id=eq.${selectedCustomer.id}` },
          (payload: { new: Message }) => {
            setMessages(prev => [...prev, payload.new]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedCustomer]);

  async function fetchMessages(cid: string) {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('customer_id', cid)
      .order('created_at', { ascending: true });
    if (data) setMessages(data);
    scrollToBottom();
  }

  const scrollToBottom = () => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedCustomer) return;

    const content = newMessage.trim();
    setNewMessage('');

    const { error } = await supabase.from('messages').insert([
      {
        customer_id: selectedCustomer.id,
        content: content,
        role: 'user',
      },
    ]);

    if (error) {
      alert('Мессеж илгээхэд алдаа гарлаа.');
    }
  };

  const filteredCustomers = customers.filter((c: Customer) => 
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-160px)] flex bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="w-80 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              className="pl-10 h-9" 
              placeholder="Хэрэглэгч хайх..." 
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Уншиж байна...</div>
          ) : filteredCustomers.length === 0 ? (
            <div className="p-4 text-center text-gray-500">Хэрэглэгч олдсонгүй.</div>
          ) : (
            filteredCustomers.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCustomer(c)}
                className={`w-full flex items-center p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                  selectedCustomer?.id === c.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 mr-3">
                  <User className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">{c.name}</div>
                  <div className="text-xs text-gray-500">{c.phone || 'Утасгүй'}</div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-gray-50">
        {selectedCustomer ? (
          <>
            <div className="bg-white p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <h3 className="font-semibold text-gray-800">{selectedCustomer.name}</h3>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m) => (
                <div 
                  key={m.id} 
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${
                      m.role === 'user' 
                        ? 'bg-blue-600 text-white rounded-br-none' 
                        : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                    }`}
                  >
                    <div>{m.content}</div>
                    <div className={`text-[10px] mt-1 ${m.role === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                      {new Date(m.created_at).toLocaleTimeString('mn-MN', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="bg-white p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <Input 
                  className="flex-1" 
                  placeholder="Мессеж бичих..." 
                  value={newMessage}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewMessage(e.target.value)}
                />
                <Button type="submit" disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Хэрэглэгч сонгоно уу
          </div>
        )}
      </div>
    </div>
  );
}
