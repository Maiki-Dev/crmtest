'use client';

import React, { useState, useEffect } from 'react';
import { CreditCard, Check, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase';
import { Profile, Business } from '@/types';

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    const { data: bus } = await supabase.from('businesses').select('*').eq('owner_id', user.id).single();

    if (prof) setProfile(prof);
    if (bus) setBusiness(bus);
    setLoading(false);
  }

  const handleUpgrade = async () => {
    setUpgrading(true);
    setTimeout(async () => {
      if (profile) {
        const { error } = await supabase
          .from('profiles')
          .update({ plan: 'pro' })
          .eq('id', profile.id);

        if (!error) {
          setProfile({ ...profile, plan: 'pro' });
          alert('Баяр хүргэе! Та Pro эрхтэй боллоо.');
        }
      }
      setUpgrading(false);
    }, 2000);
  };

  if (loading) return <div>Уншиж байна...</div>;

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Тохиргоо</h1>
        <p className="text-gray-500">Бизнесийн мэдээлэл болон төлбөрийн тохиргоо</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Бизнесийн мэдээлэл</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">Бизнесийн нэр</label>
            <div className="mt-1 font-medium">{business?.name}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Имэйл</label>
            <div className="mt-1 font-medium">{profile?.email}</div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Таны төлөвлөгөө</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`p-6 rounded-xl border-2 transition-all ${
            profile?.plan === 'free' ? 'border-blue-600 bg-blue-50/50' : 'border-gray-200 bg-white'
          }`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-xl font-bold">Үнэгүй (Free)</h4>
                <p className="text-gray-500 text-sm">Жижиг бизнесүүдэд</p>
              </div>
              {profile?.plan === 'free' && (
                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">Идэвхтэй</span>
              )}
            </div>
            <div className="text-3xl font-bold mb-6">0 ₮ <span className="text-sm font-normal text-gray-500">/ сар</span></div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-sm text-gray-600">
                <Check className="h-4 w-4 text-green-500 mr-2" /> Макс 20 хэрэглэгч
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <Check className="h-4 w-4 text-green-500 mr-2" /> Макс 10 нэхэмжлэл
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <Check className="h-4 w-4 text-green-500 mr-2" /> Үндсэн чаат
              </li>
            </ul>
            <Button 
              variant="outline" 
              className="w-full" 
              disabled={profile?.plan === 'free'}
            >
              {profile?.plan === 'free' ? 'Одоо ашиглаж буй' : 'Сонгох'}
            </Button>
          </div>

          <div className={`p-6 rounded-xl border-2 transition-all relative overflow-hidden ${
            profile?.plan === 'pro' ? 'border-blue-600 bg-blue-50/50' : 'border-gray-200 bg-white shadow-lg'
          }`}>
            <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] uppercase font-bold px-4 py-1 rotate-45 translate-x-4 translate-y-2">
              Санал болгож буй
            </div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-xl font-bold flex items-center">
                  Pro <Zap className="h-4 w-4 text-yellow-500 ml-2 fill-yellow-500" />
                </h4>
                <p className="text-gray-500 text-sm">Өсөж буй бизнесүүдэд</p>
              </div>
              {profile?.plan === 'pro' && (
                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">Идэвхтэй</span>
              )}
            </div>
            <div className="text-3xl font-bold mb-6">49,000 ₮ <span className="text-sm font-normal text-gray-500">/ сар</span></div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-sm text-gray-600">
                <Check className="h-4 w-4 text-green-500 mr-2" /> Хязгааргүй хэрэглэгч
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <Check className="h-4 w-4 text-green-500 mr-2" /> Хязгааргүй нэхэмжлэл
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <Check className="h-4 w-4 text-green-500 mr-2" /> Нарийвчилсан график
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <ShieldCheck className="h-4 w-4 text-blue-500 mr-2" /> VIP дэмжлэг
              </li>
            </ul>
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={profile?.plan === 'pro' || upgrading}
              onClick={handleUpgrade}
            >
              {upgrading ? 'Уншиж байна...' : profile?.plan === 'pro' ? 'Одоо ашиглаж буй' : 'Pro эрх рүү шилжих'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
