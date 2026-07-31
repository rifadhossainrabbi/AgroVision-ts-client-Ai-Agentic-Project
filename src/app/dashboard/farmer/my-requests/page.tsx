'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { authClient } from '@/lib/auth-client';
import {
  ShoppingBag,
  Trash2,
  ExternalLink,
  Loader2,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import DeleteModal from '@/components/DeleteModal';

import { API_BASE_URL } from '@/lib/config';

const API_BASE = API_BASE_URL;

interface BuyRequestItem {
  _id: string;
  productId: string;
  productTitle: string;
  mainImage: string;
  price: number;
  unit: string;
  sellerName: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

const MyRequestsPage = () => {
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  const currentUser = session?.user;

  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Fetch purchase requests made by current user
  const { data, isLoading, isError } = useQuery({
    queryKey: ['my-requests', currentUser?.id],
    queryFn: async () => {
      const res = await api.get(
        `${API_BASE}/buy-requests/user/${currentUser?.id}`,
      );
      return res.data;
    },
    enabled: !!currentUser?.id,
  });

  // Delete buy request mutation
  const deleteMutation = useMutation({
    mutationFn: async (productId: string) => {
      await api.delete(
        `${API_BASE}/buy-requests/${productId}/${currentUser?.id}`,
      );
    },
    onSuccess: () => {
      setIsDeleteModalOpen(false);
      setSelectedProductId(null);
      queryClient.invalidateQueries({ queryKey: ['my-requests'] });
    },
    onError: (err: any) => {
      alert(`❌ Delete failed: ${err.response?.data?.error || err.message}`);
    },
  });

  const handleDeleteClick = (productId: string) => {
    setSelectedProductId(productId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedProductId) {
      deleteMutation.mutate(selectedProductId);
    }
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-[#16503b]" size={48} />
        <p className="text-gray-500 font-medium">
          Loading your purchase requests...
        </p>
      </div>
    );
  }

  const requests: BuyRequestItem[] = data?.requests || [];

  return (
    <div className="max-w-[1440px] mx-auto p-4 md:p-8">
      {/* Page Header */}
      <div className="mb-8 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <ShoppingBag size={32} className="text-[#16503b]" /> My Buy Requests
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm font-medium">
            Track and manage purchase requests you sent to sellers
          </p>
        </div>
        <Link
          href="/marketplace"
          className="bg-[#16503b] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#124130] active:scale-95 transition-all cursor-pointer shadow-lg shadow-green-900/10 text-xs uppercase tracking-wider flex items-center gap-2"
        >
          Browse Marketplace
        </Link>
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm transition-colors">
        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-gray-50 dark:divide-gray-800">
          {requests.length > 0 ? (
            requests.map(item => (
              <div key={item.productId} className="p-4 flex flex-col gap-3">
                <Link
                  href={`/marketplace/${item.productId}`}
                  className="flex items-center gap-3"
                >
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden border dark:border-gray-700 shadow-sm shrink-0 bg-gray-100 dark:bg-gray-800">
                    <img
                      src={item.mainImage || '/placeholder.png'}
                      alt={item.productTitle}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <span className="font-bold text-gray-900 dark:text-gray-100 line-clamp-1 block">
                      {item.productTitle}
                    </span>
                    <span className="text-[10px] text-gray-400 font-semibold">
                      Seller: {item.sellerName || 'AgroVision Seller'}
                    </span>
                  </div>
                </Link>

                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="font-black text-gray-900 dark:text-gray-100 text-sm">
                    ${Number(item.price).toFixed(2)}
                    <span className="text-[10px] text-gray-400 font-medium ml-1">
                      / {item.unit || 'unit'}
                    </span>
                  </span>
                  {item.status === 'accepted' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full text-xs font-bold border border-green-200 dark:border-green-800">
                      <CheckCircle2 size={14} /> Accepted
                    </span>
                  )}
                  {item.status === 'rejected' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-full text-xs font-bold border border-red-200 dark:border-red-800">
                      <XCircle size={14} /> Rejected
                    </span>
                  )}
                  {item.status === 'pending' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-full text-xs font-bold border border-amber-200 dark:border-amber-800">
                      <Clock size={14} className="animate-spin" /> Pending
                    </span>
                  )}
                </div>

                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Requested: {new Date(item.createdAt).toLocaleDateString()}
                </p>

                <div className="flex gap-2 pt-1">
                  <Link
                    href={`/marketplace/${item.productId}`}
                    className="flex-1 flex items-center justify-center gap-1.5 p-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-500 hover:text-green-600 transition-all cursor-pointer text-xs font-bold"
                  >
                    <ExternalLink size={16} /> View
                  </Link>
                  <button
                    onClick={() => handleDeleteClick(item.productId)}
                    className="flex-1 flex items-center justify-center gap-1.5 p-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-500 hover:text-red-600 transition-all cursor-pointer text-xs font-bold"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-400 font-bold text-sm">
                You haven't submitted any buy requests yet.
              </p>
              <Link
                href="/marketplace"
                className="mt-3 inline-block text-xs font-black text-[#16503b] hover:underline uppercase tracking-wider"
              >
                Browse Products
              </Link>
            </div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
              <tr>
                <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">
                  Product
                </th>
                <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">
                  Seller
                </th>
                <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">
                  Price
                </th>
                <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">
                  Status
                </th>
                <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">
                  Requested Date
                </th>
                <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {requests.length > 0 ? (
                requests.map(item => (
                  <tr
                    key={item.productId}
                    className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-all"
                  >
                    {/* Product */}
                    <td className="px-6 py-4">
                      <Link
                        href={`/marketplace/${item.productId}`}
                        className="flex items-center gap-4 cursor-pointer group/item"
                      >
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden border dark:border-gray-700 shadow-sm shrink-0 bg-gray-100 dark:bg-gray-800">
                          <img
                            src={item.mainImage || '/placeholder.png'}
                            alt={item.productTitle}
                            className="object-cover w-full h-full group-hover/item:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <span className="font-bold text-gray-900 dark:text-gray-100 group-hover/item:text-[#16503b] dark:group-hover/item:text-green-400 transition-colors line-clamp-1">
                          {item.productTitle}
                        </span>
                      </Link>
                    </td>

                    {/* Seller */}
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                        {item.sellerName || 'AgroVision Seller'}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4 font-black text-gray-900 dark:text-gray-100">
                      ${Number(item.price).toFixed(2)}
                      <span className="text-[10px] text-gray-400 font-medium ml-1">
                        / {item.unit || 'unit'}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      {item.status === 'accepted' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full text-xs font-bold border border-green-200 dark:border-green-800">
                          <CheckCircle2 size={14} /> Accepted
                        </span>
                      )}
                      {item.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-full text-xs font-bold border border-red-200 dark:border-red-800">
                          <XCircle size={14} /> Rejected
                        </span>
                      )}
                      {item.status === 'pending' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-full text-xs font-bold border border-amber-200 dark:border-amber-800">
                          <Clock size={14} className="animate-spin" /> Pending
                        </span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/marketplace/${item.productId}`}
                          className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30 text-gray-500 hover:text-green-600 transition-all cursor-pointer"
                          title="View Product"
                        >
                          <ExternalLink size={16} />
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(item.productId)}
                          className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-500 hover:text-red-600 transition-all cursor-pointer"
                          title="Delete Request"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <p className="text-gray-400 font-bold text-sm">
                      You haven't submitted any buy requests yet.
                    </p>
                    <Link
                      href="/marketplace"
                      className="mt-3 inline-block text-xs font-black text-[#16503b] hover:underline uppercase tracking-wider"
                    >
                      Browse Products
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reusable Delete Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
        title="Delete Purchase Request?"
        description="This buy request will be permanently removed from your requests and seller's orders list."
      />
    </div>
  );
};

export default MyRequestsPage;
