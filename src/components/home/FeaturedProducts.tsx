'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Sparkles, Star, MapPin, ArrowRight } from 'lucide-react';

import api from '@/lib/api';

interface FeaturedProduct {
  _id: string;
  title: string;
  category: string;
  price: number;
  unit: string;
  mainImage: string;
  location?: string;
  rating?: number;
}

const FeaturedProducts = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => {
      const res = await api.get('/products/featured');
      return res.data;
    },
  });

  const products: FeaturedProduct[] = data?.products || [];

  // Keep a real section visible so the homepage always feels complete.
  const showEmptyState = !isLoading && products.length === 0;

  return (
    <section className="py-20 w-full bg-white dark:bg-[#020617] px-4 transition-colors">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-900/20 px-4 py-1.5 rounded-full mb-4">
            <Sparkles
              size={14}
              className="text-[#16503b] dark:text-green-500"
            />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#16503b] dark:text-green-500">
              Handpicked by AgroVision
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Featured Listings
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A curated selection of top-rated crops and machinery from verified
            farmers across the platform.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-100 dark:bg-gray-800 rounded-[2.5rem] h-[360px] animate-pulse"
              />
            ))}
          </div>
        ) : showEmptyState ? (
          <div className="rounded-[2.5rem] border border-dashed border-gray-200 bg-gray-50 px-6 py-14 text-center text-gray-600 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400">
            <p className="text-lg font-black text-gray-900 dark:text-white">
              Featured listings will appear here soon.
            </p>
            <p className="mt-3 text-sm">
              Admins can curate products to showcase them in this section.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {products.map(product => (
              <div
                key={product._id}
                className="bg-white dark:bg-[#0b1120] rounded-[2.5rem] border border-gray-100 dark:border-gray-800 flex flex-col h-full group hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 shadow-sm overflow-hidden"
              >
                <Link
                  href={`/marketplace/${product._id}`}
                  className="block relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-pointer"
                >
                  <img
                    src={product.mainImage}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  <span className="absolute top-4 left-4 bg-amber-500 text-[8px] font-black text-white px-3 py-1.5 rounded-full shadow-lg uppercase tracking-widest flex items-center gap-1">
                    <Star size={10} fill="currentColor" /> Featured
                  </span>
                </Link>

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

                  {product.location && (
                    <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                      <MapPin size={12} className="text-[#16503b]" />{' '}
                      {product.location}
                    </div>
                  )}

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
        )}

        <div className="text-center mt-14">
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 text-[#16503b] dark:text-green-500 font-bold hover:underline cursor-pointer"
          >
            Explore Full Marketplace <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
