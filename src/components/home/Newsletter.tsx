'use client';

import React, { useState } from 'react';
import { Send } from 'lucide-react';

const Newsletter = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Subscribed with: ${email}`);
    setEmail('');
  };

  return (
    <section className="px-4 py-16 bg-[#f8faf9] dark:bg-gray-950 transition-colors">
      {/* এখানে 'container' এর বদলে 'max-w-7xl' বা 'max-w-6xl' ব্যবহার করুন */}
      <div className="container mx-auto w-full bg-[#16503b] rounded-[2.5rem] p-8 md:p-16 text-center shadow-2xl relative overflow-hidden group">
        {/* Background Decorative Circles */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl transition-all group-hover:bg-white/10" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/5 rounded-full blur-3xl transition-all group-hover:bg-white/10" />

        <div className="relative z-10 space-y-6">
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">
            Stay Updated with Smart <br className="hidden md:block" /> Farming
          </h2>
          <p className="text-green-50/80 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Get the latest AI insights, market trends, and sustainable farming
            tips delivered directly to your inbox every week.
          </p>

          <form
            onSubmit={handleSubscribe}
            className="flex flex-col md:flex-row items-center justify-center gap-4 mt-8 max-w-lg mx-auto"
          >
            <input
              type="email"
              placeholder="Enter your email address"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full md:flex-1 px-6 py-4 rounded-full bg-white text-gray-900 outline-none focus:ring-4 focus:ring-green-400/30 transition-all placeholder:text-gray-400"
            />
            <button
              type="submit"
              className="w-full md:w-auto bg-[#c2f2da] hover:bg-white text-[#16503b] font-bold px-8 py-4 rounded-full transition-all cursor-pointer active:scale-95 shadow-lg flex items-center justify-center gap-2"
            >
              Subscribe Now <Send size={18} />
            </button>
          </form>

          <p className="text-green-50/60 text-xs mt-6 italic">
            No spam, only harvest. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
