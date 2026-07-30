'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { authClient } from '@/lib/auth-client';
import { Eye, EyeOff, Info, Rocket } from 'lucide-react';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // ইমেইল এবং পাসওয়ার্ড দিয়ে লগইন লজিক
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await authClient.signIn.email(
      {
        email,
        password,
        callbackURL: '/',
      },
      {
        onRequest: () => setLoading(true),
        onResponse: () => setLoading(false),
        onError: ctx => {
          toast.error(ctx.error.message || 'Login failed');
        },
      },
    );
  };

  const handleDemoLogin = () => {
    setEmail('demo@agrovision.ai');
    setPassword('Demo@1234');
    toast.success('Demo credentials filled in');
  };

  // গুগল দিয়ে লগইন করার লজিক
  const handleGoogleLogin = async () => {
    await authClient.signIn.social(
      {
        provider: 'google',
        callbackURL: '/', // লগইন সফল হওয়ার পর কোথায় যাবে
      },
      {
        onRequest: () => setLoading(true),
        onResponse: () => setLoading(false),
        onError: ctx => {
          toast.error(ctx.error.message || 'Google login failed');
        },
      },
    );
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] dark:bg-gray-950 flex flex-col items-center justify-center p-4 transition-colors duration-300">
      {/* AI Badge */}
      <div className="bg-[#c2f2da] dark:bg-green-900/30 text-[#16503b] dark:text-green-400 px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 mb-8 shadow-sm">
        <span className="text-[10px]">✨</span> AI POWERED AGRICULTURE
      </div>

      <div className="bg-white dark:bg-gray-900 p-8 md:p-10 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.02)] border border-gray-100 dark:border-gray-800 w-full max-w-[480px]">
        <div className="text-center mb-8">
          <h1 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
            Welcome Back
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Sign in to access your AI farming workspace
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@company.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#16503b]/10 focus:border-[#16503b] transition-all"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <div className="flex justify-between mb-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <Link
                href="#"
                className="text-sm font-semibold text-[#16503b] dark:text-green-400 hover:underline cursor-pointer"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#16503b]/10 focus:border-[#16503b] transition-all"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#16503b] transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-[#16503b] dark:bg-green-600 text-white py-3.5 rounded-xl font-bold hover:bg-[#12402f] dark:hover:bg-green-700 transition-all shadow-md active:scale-[0.98] cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login to Dashboard'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100 dark:border-gray-800"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-gray-900 px-4 text-gray-400 font-semibold tracking-wider">
              Or continue with
            </span>
          </div>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            type="button"
            onClick={handleGoogleLogin} // গুগল লগইন কল করা হয়েছে
            disabled={loading}
            className="flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-800 dark:text-white py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-semibold text-sm cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="w-5 h-5"
              alt="Google"
            />{' '}
            Google
          </button>
          <button
            type="button"
            onClick={handleDemoLogin}
            className="flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-800 dark:text-white py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-semibold text-sm cursor-pointer active:scale-95"
          >
            <Rocket size={18} className="text-gray-500" /> Demo Login
          </button>
        </div>

        {/* Info Box */}
        <div className="bg-[#eefcf4] dark:bg-green-900/10 p-4 rounded-2xl flex gap-3 border border-green-50 dark:border-green-900/20">
          <Info
            size={20}
            className="text-[#16503b] dark:text-green-400 shrink-0 mt-0.5"
          />
          <p className="text-[13px] text-gray-600 dark:text-gray-400">
            Use{' '}
            <span className="font-bold text-[#16503b] dark:text-green-400">
              demo@agrovision.ai
            </span>{' '}
            with any password.
          </p>
        </div>
      </div>

      {/* Register Link */}
      <p className="mt-8 text-sm text-gray-600 dark:text-gray-400">
        Don't have an account?{' '}
        <Link
          href="/register"
          className="text-[#16503b] dark:text-green-400 font-bold hover:underline cursor-pointer"
        >
          Create Account
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
