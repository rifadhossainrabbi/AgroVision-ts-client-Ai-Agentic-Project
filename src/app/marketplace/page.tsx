'use client';

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ArrowRight,
  Sparkles,
  LayoutGrid,
  Tractor,
  Sprout,
} from 'lucide-react';
import Link from 'next/link';

// --- AddCropPage এর সাথে হুবহু মিল রেখে ক্যাটাগরি ---
const MARKET_CATEGORIES: any = {
  Crop: [
    'RICE',
    'WHEAT',
    'CORN',
    'VEGETABLES',
    'FRUITS',
    'LENTILS',
    'SPICES',
    'ORGANIC HERBS',
    'OTHERS',
  ],
  Machine: [
    'TRACTOR',
    'HARVESTER',
    'POWER TILLER',
    'IRRIGATION PUMP',
    'SEEDING MACHINE',
    'SPRAYING DRONE',
    'SENSORS',
    'OTHERS',
  ],
};

const MarketPlacePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [productType, setProductType] = useState<'All' | 'Crop' | 'Machine'>(
    'All',
  );
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);

  // টাইপ পরিবর্তন হলে ক্যাটাগরি রিসেট করা
  useEffect(() => {
    setCategory('All');
    setPage(1);
  }, [productType]);

  // TanStack Query: ডাটা ফেচিং (Super Fast with Caching)
  const { data, isLoading } = useQuery({
    queryKey: ['marketplace', searchTerm, productType, category, page],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:5000/api/products/all`, {
        params: {
          search: searchTerm,
          type: productType === 'All' ? undefined : productType,
          category: category === 'All' ? undefined : category,
          page,
        },
      });
      return res.data;
    },
  });

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-[1440px] mx-auto p-4 md:p-10">
        {/* --- আধুনিক হেডার সেকশন --- */}
        <div className="mb-12 text-center space-y-2">
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic">
            Agro Marketplace
          </h1>
          <p className="text-[#16503b] dark:text-green-500 font-black uppercase tracking-[0.4em] text-[10px]">
            The Future of Digital Farming
          </p>
        </div>

        {/* --- ইন্টেলিজেন্ট ফিল্টার বার --- */}
        <div className="bg-gray-50/50 dark:bg-gray-900 p-6 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-sm mb-12 flex flex-col lg:flex-row gap-6 items-center">
          {/* সার্চ ইনপুট */}
          <div className="relative flex-1 w-full group">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#16503b]"
              size={20}
            />
            <input
              type="text"
              placeholder="SEARCH BY CROP OR MACHINE NAME..."
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full pl-14 pr-6 py-5 rounded-[1.8rem] bg-white dark:bg-gray-800 dark:text-white border-none outline-none focus:ring-4 focus:ring-green-500/10 transition-all font-bold uppercase text-xs tracking-widest shadow-inner"
            />
          </div>

          {/* টাইপ সিলেকশন (Crop/Machine) */}
          <div className="flex bg-white dark:bg-gray-800 p-2 rounded-[1.5rem] shadow-inner border dark:border-gray-700 w-full lg:w-auto">
            {['All', 'Crop', 'Machine'].map(t => (
              <button
                key={t}
                onClick={() => setProductType(t as any)}
                className={`flex-1 lg:flex-none px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${productType === t ? 'bg-[#16503b] text-white shadow-xl' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
              >
                {t === 'Crop' ? 'Crops' : t === 'Machine' ? 'Machines' : 'All'}
              </button>
            ))}
          </div>

          {/* ডাইনামিক ক্যাটাগরি ফিল্টার */}
          <div className="relative w-full lg:w-[280px]">
            <Filter
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full pl-14 pr-10 py-5 rounded-[1.8rem] bg-white dark:bg-gray-800 dark:text-white font-black text-[10px] uppercase tracking-widest outline-none cursor-pointer border-none shadow-sm appearance-none"
            >
              <option value="All">All Categories</option>
              {productType !== 'All' &&
                MARKET_CATEGORIES[productType].map((cat: string) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              {productType === 'All' &&
                [...MARK_CATEGORIES.Crop, ...MARK_CATEGORIES.Machine]
                  .slice(0, 10)
                  .map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
            </select>
          </div>
        </div>

        {/* --- প্রোডাক্ট ডিসপ্লে গ্রিড --- */}
        {isLoading ? (
          <div className="h-[50vh] flex flex-col items-center justify-center gap-6">
            <Loader2 className="animate-spin text-[#16503b]" size={64} />
            <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">
              Syncing Marketplace...
            </p>
          </div>
        ) : data?.products?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {data.products.map((product: any) => (
              <div
                key={product._id}
                className="bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-100 dark:border-gray-800 overflow-hidden group hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 cursor-pointer"
              >
                {/* ইমেজ এবং ব্যাজ */}
                <div className="aspect-[4/5] relative overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-inner">
                  <img
                    src={product.mainImage}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute top-5 left-5 flex flex-col gap-2">
                    <span className="bg-[#16503b] text-[8px] font-black text-white px-4 py-1.5 rounded-full shadow-2xl uppercase tracking-widest">
                      Verified
                    </span>
                    {product.productType === 'Crop' ? (
                      <span className="bg-orange-500 text-[8px] font-black text-white px-4 py-1.5 rounded-full shadow-2xl uppercase tracking-widest flex items-center gap-1">
                        <Sprout size={10} /> Fresh
                      </span>
                    ) : (
                      <span className="bg-blue-600 text-[8px] font-black text-white px-4 py-1.5 rounded-full shadow-2xl uppercase tracking-widest flex items-center gap-1">
                        <Tractor size={10} /> Used
                      </span>
                    )}
                  </div>
                </div>

                {/* কন্টেন্ট এরিয়া */}
                <div className="p-8 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black text-[#16503b] dark:text-green-500 uppercase tracking-[0.3em] bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full">
                      {product.category}
                    </span>
                    <Sparkles
                      size={14}
                      className="text-orange-400"
                      fill="currentColor"
                    />
                  </div>
                  <h3 className="font-black text-xl text-gray-900 dark:text-white truncate uppercase italic tracking-tighter leading-tight">
                    {product.name}
                  </h3>

                  <div className="pt-4 border-t dark:border-gray-800 flex justify-between items-center">
                    <div className="space-y-1">
                      <p className="text-3xl font-black text-[#16503b] dark:text-green-500 tracking-tighter leading-none">
                        ${product.price.toFixed(2)}
                      </p>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                        Per {product.unit}
                      </p>
                    </div>
                    <Link
                      href={`/products/${product._id}`}
                      className="w-12 h-12 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-2xl text-gray-400 hover:bg-[#16503b] hover:text-white transition-all shadow-sm hover:rotate-45 group"
                    >
                      <ArrowRight
                        size={22}
                        className="group-hover:scale-125 transition-transform"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-gray-50/30 dark:bg-gray-900 rounded-[4rem] border-4 border-dashed dark:border-gray-800">
            <LayoutGrid
              className="mx-auto text-gray-200 dark:text-gray-800 mb-6"
              size={80}
            />
            <p className="text-gray-400 font-black uppercase tracking-[0.5em] text-xs">
              No matching listings found
            </p>
          </div>
        )}

        {/* --- আধুনিক পেজিনেশন --- */}
        {data?.totalPages > 1 && (
          <div className="mt-20 flex justify-center items-center gap-6">
            <button
              disabled={page === 1}
              onClick={() => {
                setPage(prev => prev - 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-16 h-16 flex items-center justify-center border-2 border-gray-100 dark:border-gray-800 rounded-[1.5rem] bg-white dark:bg-gray-900 dark:text-white hover:bg-[#16503b] hover:text-white transition-all shadow-xl cursor-pointer disabled:opacity-20 active:scale-90"
            >
              <ChevronLeft size={28} />
            </button>

            <div className="h-16 px-8 flex items-center bg-white dark:bg-gray-900 rounded-[1.5rem] border-2 border-gray-100 dark:border-gray-800 shadow-inner">
              <span className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">
                Listing {page} of {data?.totalPages}
              </span>
            </div>

            <button
              disabled={page >= data?.totalPages}
              onClick={() => {
                setPage(prev => prev + 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-16 h-16 flex items-center justify-center border-2 border-gray-100 dark:border-gray-800 rounded-[1.5rem] bg-white dark:bg-gray-900 dark:text-white hover:bg-[#16503b] hover:text-white transition-all shadow-xl cursor-pointer disabled:opacity-20 active:scale-90"
            >
              <ChevronRight size={28} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper: All Categories Union for Initial State
const MARK_CATEGORIES = MARKET_CATEGORIES;

export default MarketPlacePage;
