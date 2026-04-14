'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  MessageSquare, 
  Settings, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase';

const menuItems = [
  { name: 'Хяналтын самбар', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Хэрэглэгчид', icon: Users, href: '/dashboard/customers' },
  { name: 'Нэхэмжлэлүүд', icon: FileText, href: '/dashboard/invoices' },
  { name: 'Мессеж', icon: MessageSquare, href: '/dashboard/chat' },
  { name: 'Тохиргоо', icon: Settings, href: '/dashboard/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200 w-64">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-600">BizFlow</h1>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <item.icon className={cn('mr-3 h-5 w-5', isActive ? 'text-blue-600' : 'text-gray-400')} />
              {item.name}
              {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Гарах
        </button>
      </div>
    </div>
  );
}
