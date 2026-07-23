'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import {
  Sun,
  Moon,
  User,
  LayoutDashboard,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Better Auth Session Hook
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  console.log(user?.image, 'user')

  useEffect(() => {
    setMounted(true);
    // ড্রপডাউনের বাইরে ক্লিক করলে সেটি বন্ধ করার লজিক
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          // router.push('/login');
          setDropdownOpen(false);
        },
      },
    });
  };

  if (!mounted) return null;

  return (
    <nav className="w-full bg-[#f8faf9] dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <Link
              href="/"
              className="text-2xl font-bold text-[#16503b] dark:text-green-500"
            >
              AgroVision AI
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-[#16503b] dark:text-green-500 font-bold border-b-2 border-[#16503b] pb-1"
            >
              Home
            </Link>
            <Link
              href="/marketplace"
              className="text-gray-600 dark:text-gray-300 hover:text-[#16503b] transition-colors"
            >
              Explore Marketplace
            </Link>
            <Link
              href="/resources"
              className="text-gray-600 dark:text-gray-300 hover:text-[#16503b] transition-colors"
            >
              Resources
            </Link>
            <Link
              href="/pricing"
              className="text-gray-600 dark:text-gray-300 hover:text-[#16503b] transition-colors"
            >
              Pricing
            </Link>
          </div>

          {/* Right Side Section */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all cursor-pointer"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {/* Auth Logic */}
            {!isPending && (
              <>
                {session ? (
                  /* Logged In: Profile Dropdown */
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all cursor-pointer"
                    >
                      {user?.image ? (
                        <Image
                          src={user.image}
                          alt="profile"
                          width={36}
                          height={36}
                          className="rounded-full object-cover border-2 border-[#16503b]/20"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-[#16503b] text-white flex items-center justify-center font-bold text-sm">
                          {user?.name?.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <ChevronDown
                        size={16}
                        className={`text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {/* Dropdown Menu */}
                    {dropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl py-2 animate-in fade-in zoom-in duration-200">
                        <div className="px-4 py-3 border-b border-gray-50 dark:border-gray-800">
                          <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                            {user?.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {user?.email}
                          </p>
                        </div>

                        <div className="py-1">
                          <Link
                            href="/dashboard"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 gap-3"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <LayoutDashboard size={18} /> Dashboard
                          </Link>

                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 gap-3 cursor-pointer"
                          >
                            <LogOut size={18} /> Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Not Logged In: Login/Register Buttons */
                  <div className="flex items-center space-x-3">
                    <Link
                      href="/login"
                      className="hidden sm:block text-gray-600 dark:text-gray-300 font-medium hover:text-[#16503b]"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="bg-[#16503b] hover:bg-[#12402f] text-white px-5 py-2 rounded-full font-semibold transition-all shadow-sm"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
