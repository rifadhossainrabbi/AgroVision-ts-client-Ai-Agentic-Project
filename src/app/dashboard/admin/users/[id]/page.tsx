'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Shield,
  User,
  Mail,
  Calendar,
  Package,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Star,
  MapPin,
  AlertTriangle,
} from 'lucide-react';
import AuthGuard from '@/components/shared/AuthGuard';

import { API_BASE_URL } from '@/lib/config';

const API_BASE = API_BASE_URL;

interface UserData {
  _id: string;
  id?: string;
  name: string;
  email: string;
  role?: string;
  image?: string;
  createdAt?: string;
}

interface ProductItem {
  _id: string;
  title: string;
  description?: string;
  category: string;
  price: number;
  unit: string;
  mainImage: string;
  location?: string;
  rating?: number;
  status: 'active' | 'pending' | 'rejected';
}

const statusStyles: Record<string, string> = {
  active:
    'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
  pending:
    'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
};

const AdminUserDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const userId = params?.id as string;
  const [page, setPage] = useState(1);

  const {
    data: userResData,
    isLoading: isUserLoading,
    error: userError,
  } = useQuery({
    queryKey: ['admin-user-detail', userId],
    queryFn: async () => {
      const res = await api.get(`${API_BASE}/admin/users/${userId}`);
      return res.data;
    },
    enabled: !!userId,
  });

  const user: UserData | undefined = userResData?.user;

  const { data: productsData, isLoading: isProductsLoading } = useQuery({
    queryKey: ['admin-user-products', userId, page],
    queryFn: async () => {
      const res = await api.get(
        `${API_BASE}/my-products/${userId}?page=${page}`,
      );
      return res.data;
    },
    enabled: !!userId,
  });

  const products: ProductItem[] = productsData?.products || [];

  if (userError) {
    return (
      <AuthGuard requireAdmin>
        <div className="max-w-3xl mx-auto py-24 text-center">
          <AlertTriangle className="mx-auto text-red-400 mb-4" size={40} />
          <p className="font-bold text-gray-500 dark:text-gray-400">
            Could not load this user. They may have been removed.
          </p>
          <button
            onClick={() => router.push('/dashboard/admin/users')}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#16503b] text-white text-xs font-black uppercase tracking-widest cursor-pointer"
          >
            <ArrowLeft size={14} /> Back to Users
          </button>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard requireAdmin>
      <div className="space-y-8">
        {/* Back Link */}
        <Link
          href="/dashboard/admin/users"
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-[#16503b] dark:hover:text-green-400 transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} /> Back to All Users
        </Link>

        {/* User Header */}
        {isUserLoading ? (
          <div className="p-12 flex justify-center bg-white dark:bg-[#0b1120] rounded-3xl border border-gray-100 dark:border-gray-800">
            <Loader2 className="animate-spin text-[#16503b]" size={36} />
          </div>
        ) : user ? (
          <div className="bg-gradient-to-r from-gray-900 to-slate-800 p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center font-black text-3xl overflow-hidden shrink-0 ring-2 ring-white/20">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                user.name?.charAt(0) || 'U'
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-black">{user.name}</h1>
                <span
                  className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase px-3 py-1 rounded-full ${
                    user.role === 'admin'
                      ? 'bg-purple-500/20 text-purple-300'
                      : 'bg-green-500/20 text-green-300'
                  }`}
                >
                  {user.role === 'admin' ? (
                    <Shield size={12} />
                  ) : (
                    <User size={12} />
                  )}
                  {user.role || 'user'}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-300">
                <span className="flex items-center gap-1.5">
                  <Mail size={14} /> {user.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  Joined{' '}
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : 'N/A'}
                </span>
                <span className="flex items-center gap-1.5">
                  <Package size={14} />
                  {userResData?.productCount ?? products.length} Products Listed
                </span>
              </div>
            </div>
          </div>
        ) : null}

        {/* Products Section */}
        <div>
          <h2 className="text-lg font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Package className="text-[#16503b]" size={20} />
            Products by {user?.name || 'this user'}
          </h2>

          {isProductsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-100 dark:bg-gray-800 rounded-[2rem] h-[360px] animate-pulse"
                />
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map(product => (
                  <div
                    key={product._id}
                    className="bg-white dark:bg-[#0b1120] rounded-[2rem] border border-gray-100 dark:border-gray-800 flex flex-col h-full group hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    <Link
                      href={`/marketplace/${product._id}`}
                      className="block relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-pointer"
                    >
                      <img
                        src={product.mainImage}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <span
                        className={`absolute top-3 left-3 text-[9px] font-black uppercase px-2.5 py-1 rounded-full ${statusStyles[product.status] || statusStyles.pending}`}
                      >
                        {product.status}
                      </span>
                    </Link>
                    <div className="p-5 flex flex-col flex-grow space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-black text-[#16503b] dark:text-green-500 uppercase tracking-widest bg-green-50 dark:bg-green-900/20 px-2.5 py-1 rounded-full">
                          {product.category}
                        </span>
                        <div className="flex items-center gap-1 text-orange-400">
                          <Star size={11} fill="currentColor" />
                          <span className="text-[10px] font-bold text-gray-400">
                            {product.rating || '5.0'}
                          </span>
                        </div>
                      </div>
                      <Link href={`/marketplace/${product._id}`}>
                        <h3 className="font-black text-gray-900 dark:text-white truncate hover:text-[#16503b] dark:hover:text-green-400 transition-colors cursor-pointer">
                          {product.title}
                        </h3>
                      </Link>
                      {product.location && (
                        <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                          <MapPin size={11} className="text-[#16503b]" />{' '}
                          {product.location}
                        </div>
                      )}
                      <div className="pt-3 mt-auto border-t dark:border-gray-800">
                        <p className="text-xl font-black text-[#16503b] dark:text-green-500 tracking-tighter">
                          ${Number(product.price).toFixed(2)}
                          <span className="text-[10px] text-gray-400 font-bold ml-1">
                            / {product.unit}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {productsData?.totalPages > 1 && (
                <div className="mt-10 flex justify-center items-center gap-4">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(prev => prev - 1)}
                    className="w-11 h-11 flex items-center justify-center border-2 border-gray-100 dark:border-gray-800 rounded-2xl bg-white dark:bg-[#0b1120] dark:text-white hover:bg-[#16503b] hover:text-white transition-all cursor-pointer disabled:opacity-20"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <span className="text-xs font-black dark:text-white uppercase tracking-widest">
                    Page {productsData?.currentPage} /{' '}
                    {productsData?.totalPages}
                  </span>
                  <button
                    disabled={page >= productsData?.totalPages}
                    onClick={() => setPage(prev => prev + 1)}
                    className="w-11 h-11 flex items-center justify-center border-2 border-gray-100 dark:border-gray-800 rounded-2xl bg-white dark:bg-[#0b1120] dark:text-white hover:bg-[#16503b] hover:text-white transition-all cursor-pointer disabled:opacity-20"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 bg-gray-50/50 dark:bg-[#0b1120] rounded-[2.5rem] border-2 border-dashed border-gray-100 dark:border-gray-800">
              <Package
                className="mx-auto text-gray-300 dark:text-gray-700 mb-3"
                size={36}
              />
              <p className="text-gray-400 font-bold text-sm">
                This user hasn&apos;t listed any products yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
};

export default AdminUserDetailPage;
