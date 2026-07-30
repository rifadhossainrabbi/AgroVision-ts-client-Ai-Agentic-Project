'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { ArrowLeft, Loader2, MapPin, Package, Star } from 'lucide-react';

const SellerProfilePage = () => {
  const params = useParams();
  const sellerId = params?.id as string;

  const { data, isLoading } = useQuery({
    queryKey: ['seller-products', sellerId],
    queryFn: async () => {
      const res = await axios.get(`/my-products/${sellerId}`);
      return res.data;
    },
    enabled: !!sellerId,
  });

  const products = data?.products || [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">
      <Link
        href="/marketplace"
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#16503b]"
      >
        <ArrowLeft size={14} /> Back to marketplace
      </Link>

      <div className="mt-6 rounded-[2.5rem] border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:p-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#16503b] dark:text-green-400">
              Seller profile
            </p>
            <h1 className="mt-2 text-3xl font-black text-gray-900 dark:text-white">
              Seller {sellerId.slice(0, 8)}
            </h1>
            <p className="mt-3 text-sm leading-8 text-gray-600 dark:text-gray-400">
              Explore the active products this seller is currently offering in
              AgroVision AI.
            </p>
          </div>
          <div className="rounded-2xl bg-[#16503b]/10 px-4 py-3 text-sm font-black text-[#16503b] dark:text-green-400">
            {products.length} active listings
          </div>
        </div>

        {isLoading ? (
          <div className="mt-10 flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-[#16503b]" size={32} />
          </div>
        ) : products.length > 0 ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product: any) => (
              <div
                key={product._id}
                className="overflow-hidden rounded-[2rem] border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950"
              >
                <img
                  src={product.mainImage}
                  alt={product.title}
                  className="h-44 w-full object-cover"
                />
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-[#16503b]/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em] text-[#16503b] dark:text-green-400">
                      {product.category}
                    </span>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star size={12} fill="currentColor" />
                      <span className="text-xs font-semibold text-gray-500">
                        {product.rating || 5}
                      </span>
                    </div>
                  </div>
                  <h2 className="mt-4 text-lg font-black text-gray-900 dark:text-white">
                    {product.title}
                  </h2>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {product.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <MapPin size={14} /> {product.location || 'Online'}
                    </span>
                    <span className="font-black text-[#16503b] dark:text-green-400">
                      ${Number(product.price).toFixed(2)}
                    </span>
                  </div>
                  <Link
                    href={`/marketplace/${product._id}`}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#16503b] dark:text-green-400"
                  >
                    <Package size={14} /> View listing
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-3xl border border-dashed border-gray-200 p-10 text-center text-gray-500 dark:border-gray-800">
            No products are available from this seller at the moment.
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerProfilePage;
