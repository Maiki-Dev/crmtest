'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          business_name: businessName,
        },
      },
    });

    if (authError) {
      if (authError.message.includes('rate limit')) {
        setError('Имэйл илгээх хязгаар хэтэрсэн байна. Та түр хүлээгээд дахин оролдоно уу эсвэл Supabase Dashboard-оос "Confirm Email" тохиргоог унтраана уу.');
      } else {
        setError(authError.message);
      }
      setLoading(false);
      return;
    }

    if (authData.user) {
      // Хэрэв имэйл баталгаажуулалт идэвхтэй бол session байхгүй байна
      if (!authData.session) {
        alert('Бүртгэл амжилттай. Та имэйлээ шалгаж баталгаажуулна уу.');
        router.push('/login');
        return;
      }

      const { error: businessError } = await supabase
        .from('businesses')
        .insert([
          {
            name: businessName,
            owner_id: authData.user.id,
          },
        ]);

      if (businessError) {
        setError('Бизнесийн мэдээлэл үүсгэхэд алдаа гарлаа.');
        setLoading(false);
        return;
      }

      router.push('/dashboard');
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            BizFlow CRM
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Шинэ бүртгэл үүсгэх
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <Input
              label="Бизнесийн нэр"
              type="text"
              required
              value={businessName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBusinessName(e.target.value)}
              placeholder="Миний дэлгүүр"
            />
            <Input
              label="Имэйл хаяг"
              type="email"
              required
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
            />
            <Input
              label="Нууц үг"
              type="password"
              required
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Уншиж байна...' : 'Бүртгүүлэх'}
            </Button>
          </div>
        </form>
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Бүртгэлтэй юу?{' '}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Нэвтрэх
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
