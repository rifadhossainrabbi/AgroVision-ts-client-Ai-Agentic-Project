'use client';

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from '@/lib/axios';
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
  X,
  MapPin,
  Star,
  Calendar,
} from 'lucide-react';
import Link from 'next/link';

const MARKET_CATEGORIES: any = {
  Crop: [
    'Rice',
    'Wheat',
    'Corn',
    'Vegetables',
    'Fruits',
    'Lentils',
    'Spices',
    'Organic Herbs',
    'Others',
  ],
  Machine: [
    'Tractor',
    'Harvester',
    'Power Tiller',
    'Irrigation Pump',
    'Seeding Machine',
    'Spraying Drone',
    'Sensors',
    'Others',
  ],
};

const MarketPlacePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [productType, setProductType] = useState<'All' | 'Crop' | 'Machine'>(
    'All',
  );
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);

  useEffect(() => {
    setCategory('All');
    setPage(1);
  }, [productType]);

  const { data, isLoading } = useQuery({
    queryKey: ['marketplace', searchTerm, productType, category, sortBy, page],
    queryFn: async () => {
      const res = await api.get(`/products/all`, {
        params: {
          search: searchTerm || undefined,
          type: productType === 'All' ? undefined : productType,
          category: category === 'All' ? undefined : category,
          sort: sortBy,
          page,
        },
      });
      return res.data;
    },
  });

  return (
    <div className="min-h-screen bg-white dark:bg-[#020617] transition-colors duration-300">
      <div className="max-w-[1440px] mx-auto p-4 md:p-10">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic">
            Agro Marketplace
          </h1>
          <p className="text-[#16503b] dark:text-green-500 font-black uppercase tracking-[0.4em] text-[10px] mt-2">
            The Future of Digital Farming
          </p>
        </div>

        {/* --- Filter Bar --- */}
        <div className="bg-gray-50 dark:bg-[#0b1120] p-6 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-sm mb-12 flex flex-col lg:flex-row gap-6 items-center">
          <div className="relative flex-1 w-full group">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#16503b]"
              size={20}
            />
            <input
              type="text"
              placeholder="SEARCH BY PRODUCT TITLE..."
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full pl-14 pr-12 py-5 rounded-[1.8rem] bg-white dark:bg-[#1e293b] dark:text-white border-none outline-none focus:ring-4 focus:ring-green-500/10 transition-all font-bold text-xs uppercase shadow-inner"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 cursor-pointer"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <div className="flex bg-white dark:bg-[#1e293b] p-2 rounded-[1.5rem] border dark:border-gray-700 w-full lg:w-auto shadow-inner">
            {['All', 'Crop', 'Machine'].map(t => (
              <button
                key={t}
                onClick={() => setProductType(t as any)}
                className={`flex-1 lg:flex-none px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${productType === t ? 'bg-[#16503b] text-white shadow-xl' : 'text-gray-400'}`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-[280px]">
            <Filter
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <select
              value={category}
              onChange={e => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="w-full pl-14 pr-10 py-5 rounded-[1.8rem] bg-white dark:bg-[#1e293b] dark:text-white font-black text-[10px] uppercase outline-none cursor-pointer border-none shadow-sm appearance-none"
            >
              <option value="All">All Categories</option>
              {productType !== 'Machine' &&
                MARKET_CATEGORIES.Crop.map((cat: string) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              {productType !== 'Crop' &&
                MARKET_CATEGORIES.Machine.map((cat: string) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
            </select>
          </div>

          {/* Sort (Requirement: Sorting options) */}
          <div className="relative w-full lg:w-[220px]">
            <select
              value={sortBy}
              onChange={e => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="w-full pl-6 pr-10 py-5 rounded-[1.8rem] bg-white dark:bg-[#1e293b] dark:text-white font-black text-[10px] uppercase outline-none cursor-pointer border-none shadow-sm appearance-none"
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* --- Product Grid (Desktop 4 columns, same style) --- */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : data?.products?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {data.products.map((product: any) => (
              <div
                key={product._id}
                className="bg-white dark:bg-[#0b1120] rounded-[2.5rem] border border-gray-100 dark:border-gray-800 flex flex-col h-full group hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 shadow-sm overflow-hidden"
              >
                {/* Image Section - Click to navigate */}
                <Link
                  href={`/marketplace/${product._id}`}
                  className="block relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-pointer"
                >
                  <img
                    src={product.mainImage}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <span className="bg-[#16503b] text-[8px] font-black text-white px-3 py-1.5 rounded-full shadow-lg uppercase tracking-widest">
                      Verified
                    </span>
                  </div>
                </Link>

                {/* Content Section */}
                <div className="p-6 flex flex-col flex-grow space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black text-[#16503b] dark:text-green-500 uppercase tracking-[0.2em] bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full">
                      {product.category}
                    </span>
                    <div className="flex items-center gap-1 text-orange-400">
                      <Star size={12} fill="currentColor" />
                      <span className="text-[10px] font-bold text-gray-400">
                        {product.rating || '5.0'}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-black text-xl text-gray-900 dark:text-white truncate uppercase italic tracking-tighter leading-tight">
                    {product.title}
                  </h3>

                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Meta Info (Location & Date) */}
                  <div className="pt-2 flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                      <MapPin size={12} className="text-[#16503b]" />{' '}
                      {product.location || 'N/A'}
                    </div>
                  </div>

                  {/* Price & Action Button */}
                  <div className="pt-4 mt-auto border-t dark:border-gray-800 flex justify-between items-center">
                    <div>
                      <p className="text-2xl font-black text-[#16503b] dark:text-green-500 tracking-tighter leading-none">
                        ${Number(product.price).toFixed(2)}
                      </p>
                      <p className="text-[9px] font-bold text-gray-400 uppercase mt-1 tracking-widest">
                        Per {product.unit}
                      </p>
                    </div>
                    <Link
                      href={`/marketplace/${product._id}`}
                      className="bg-[#16503b] hover:bg-[#0f3a2a] text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer shadow-lg active:scale-90"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-gray-50/20 dark:bg-[#0b1120] rounded-[4rem] border-4 border-dashed dark:border-gray-800">
            <p className="text-gray-400 font-black uppercase tracking-[0.5em] text-sm">
              No Listings Found
            </p>
          </div>
        )}

        {/* --- Pagination --- */}
        {data?.totalPages > 1 && (
          <div className="mt-20 flex justify-center items-center gap-6">
            <button
              disabled={page === 1}
              onClick={() => setPage(prev => prev - 1)}
              className="w-16 h-16 flex items-center justify-center border-2 border-gray-100 dark:border-gray-800 rounded-[1.5rem] bg-white dark:bg-[#0b1120] dark:text-white hover:bg-[#16503b] hover:text-white transition-all cursor-pointer disabled:opacity-10 shadow-lg"
            >
              <ChevronLeft size={28} />
            </button>
            <div className="h-16 px-10 flex items-center bg-white dark:bg-[#0b1120] rounded-[1.5rem] border-2 border-gray-100 dark:border-gray-800 shadow-inner">
              <span className="text-sm font-black dark:text-white uppercase tracking-widest">
                {page} / {data?.totalPages}
              </span>
            </div>
            <button
              disabled={page >= data?.totalPages}
              onClick={() => setPage(prev => prev + 1)}
              className="w-16 h-16 flex items-center justify-center border-2 border-gray-100 dark:border-gray-800 rounded-[1.5rem] bg-white dark:bg-[#0b1120] dark:text-white hover:bg-[#16503b] hover:text-white transition-all cursor-pointer disabled:opacity-10 shadow-lg"
            >
              <ChevronRight size={28} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Skeleton Card (Requirement 4)
const SkeletonCard = () => (
  <div className="bg-gray-100 dark:bg-gray-800 rounded-[2.5rem] h-[450px] animate-pulse" />
);

export default MarketPlacePage;
