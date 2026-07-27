'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, HeadphonesIcon } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { DashboardNavConfig } from './DashboardNavConfig';

// এখানে 'export default' ব্যবহার করুন
export default function DashboardSidebar({ role }: { role: 'admin' | 'user' }) {
  const pathname = usePathname();
  const navItems =
    role === 'admin' ? DashboardNavConfig.admin : DashboardNavConfig.user;

  return (
    <aside className="w-64 bg-white dark:bg-gray-950 border-r border-gray-100 dark:border-gray-800 h-screen sticky top-0 flex flex-col p-4">
      <div className="mb-8 px-2">
        <h1 className="text-xl font-bold text-[#16503b] dark:text-green-500">
          AgroVision AI
        </h1>
        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">
          Enterprise Smart Farming
        </p>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map(item => {
          // আইকন চেক করা হচ্ছে যাতে এরর না দেয়
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                pathname === item.href
                  ? 'bg-green-50 dark:bg-green-900/20 text-[#16503b] dark:text-green-400 border-r-4 border-[#16503b]'
                  : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-900'
              }`}
            >
              {Icon && <Icon size={18} />} {item.title}
            </Link>
          );
        })}

        <div className="pt-6">
          <p className="px-3 text-[10px] font-bold text-gray-400 uppercase mb-2 tracking-widest">
            System
          </p>
          {DashboardNavConfig.system.map(item => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                {Icon && <Icon size={18} />} {item.title}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Logout button */}
      <button
        onClick={() => authClient.signOut()}
        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 cursor-pointer mt-4"
      >
        <LogOut size={18} /> Sign Out
      </button>
    </aside>
  );
}
