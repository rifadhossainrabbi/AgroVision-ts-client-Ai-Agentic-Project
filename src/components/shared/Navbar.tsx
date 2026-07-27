'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import {
  Sun,
  Moon,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  Menu,
  X,
  User,
  Home,
  Globe,
  Info,
  PlusCircle,
  Package,
  Users,
  Settings,
} from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import Image from 'next/image';
import { NavbarNavConfig, NavItem, UserRole } from './NavbarNabConfig';

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const role = ((user as any)?.role as UserRole) || 'public';

  const navItems: NavItem[] = session
    ? NavbarNavConfig[role] || NavbarNavConfig.public
    : NavbarNavConfig.public;

  useEffect(() => {
    setMounted(true);
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

  // ক্লোজ মোবাইল মেনু যখন রুট চেঞ্জ হবে
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: { onSuccess: () => setDropdownOpen(false) },
    });
  };

  if (!mounted) return null;

  return (
    <nav className="w-full bg-[#f8faf9] dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link
              href="/"
              className="text-2xl font-bold text-[#16503b] dark:text-green-500"
            >
              AgroVision AI
            </Link>
          </div>

          {/* Desktop Navigation (Requirement: Role Based) */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-[#16503b] dark:hover:text-green-400 ${
                  pathname === item.href
                    ? 'text-[#16503b] dark:text-green-500 font-bold border-b-2 border-[#16503b] pb-1'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                {item.title}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Theme Toggle (Desktop & Mobile) */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all cursor-pointer"
            >
              {theme === 'dark' ? (
                <Sun size={20} className="text-yellow-400" />
              ) : (
                <Moon size={20} className="text-gray-600" />
              )}
            </button>

            {/* Desktop Auth Logic */}
            <div className="hidden md:block">
              {!isPending && (
                <>
                  {session ? (
                    <div className="relative" ref={dropdownRef}>
                      <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                      >
                        {user?.image ? (
                          <Image
                            src={user.image}
                            alt="profile"
                            width={32}
                            height={32}
                            className="rounded-full object-cover border-2 border-[#16503b]/20"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-[#16503b] text-white flex items-center justify-center font-bold text-xs uppercase">
                            {user?.name?.slice(0, 2)}
                          </div>
                        )}
                        <ChevronDown
                          size={14}
                          className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                        />
                      </button>

                      {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-xl py-2 animate-in fade-in zoom-in duration-200">
                          <div className="px-4 py-2 border-b dark:border-gray-800">
                            <p className="text-sm font-bold truncate">
                              {user?.name}
                            </p>
                            <p className="text-[10px] text-gray-400 uppercase">
                              Role: {role}
                            </p>
                          </div>
                          <Link
                            href={
                              role === 'admin'
                                ? '/dashboard/admin'
                                : '/dashboard/farmer'
                            }
                            className="flex items-center px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 gap-3"
                          >
                            <LayoutDashboard size={16} /> Dashboard
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 gap-3 cursor-pointer"
                          >
                            <LogOut size={16} /> Logout
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <Link
                        href="/login"
                        className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-[#16503b]"
                      >
                        Login
                      </Link>
                      <Link
                        href="/register"
                        className="bg-[#16503b] text-white px-5 py-2 rounded-full text-sm font-semibold transition-all"
                      >
                        Register
                      </Link>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Requirement: Shows All NavItems) */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${mobileMenuOpen ? 'visible' : 'invisible'}`}
      >
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Drawer Content */}
        <div
          className={`absolute right-0 top-0 h-full w-[280px] bg-white dark:bg-gray-950 shadow-2xl transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="p-6 flex flex-col h-full">
            <div className="flex justify-between items-center mb-8">
              <span className="font-bold text-[#16503b] dark:text-green-500">
                Menu
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-full bg-gray-100 dark:bg-gray-800"
              >
                <X size={20} />
              </button>
            </div>

            {/* User Profile in Drawer if Logged In */}
            {session && (
              <div className="mb-8 p-4 bg-green-50 dark:bg-green-900/10 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#16503b] text-white flex items-center justify-center font-bold">
                  {user?.name?.slice(0, 1)}
                </div>
                <div>
                  <p className="text-sm font-bold truncate max-w-[150px]">
                    {user?.name}
                  </p>
                  <p className="text-[10px] text-gray-500 uppercase">{role}</p>
                </div>
              </div>
            )}

            {/* Navigation Links */}
            <div className="flex flex-col space-y-2">
              {navItems.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                    pathname === item.href
                      ? 'bg-[#16503b] text-white font-bold'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <span className="text-sm">{item.title}</span>
                </Link>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="mt-auto pt-6 border-t dark:border-gray-800 space-y-3">
              {session ? (
                <>
                  <Link
                    href={
                      role === 'admin'
                        ? '/dashboard/admin'
                        : '/dashboard/farmer'
                    }
                    className="flex items-center gap-3 p-3 text-sm font-medium text-gray-600 dark:text-gray-300"
                  >
                    <LayoutDashboard size={18} /> Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 p-3 text-sm font-bold text-red-600 bg-red-50 dark:bg-red-900/10 rounded-xl"
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/login"
                    className="flex items-center justify-center p-3 text-sm font-bold border rounded-xl dark:border-gray-800"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center justify-center p-3 text-sm font-bold bg-[#16503b] text-white rounded-xl"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
