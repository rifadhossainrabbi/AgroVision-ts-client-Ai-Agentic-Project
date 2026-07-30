'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { authClient } from '@/lib/auth-client';
import {
  ClipboardList,
  Check,
  X,
  Loader2,
  Clock,
  CheckCircle2,
  XCircle,
  User,
} from 'lucide-react';
import Link from 'next/link';

import { API_BASE_URL } from '@/lib/config';

const API_BASE = API_BASE_URL;

interface OrderItem {
  _id: string;
  productId: string;
  productTitle: string;
  mainImage: string;
  price: number;
  unit: string;
  userId: string;
  userName: string;
  userEmail: string;
  userImage?: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

const MyOrdersPage = () => {
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  const currentUser = session?.user;

  // Fetch incoming orders/requests for products created by this seller
  const { data, isLoading } = useQuery({
    queryKey: ['my-orders', currentUser?.id],
    queryFn: async () => {
      const res = await axios.get(
        `${API_BASE}/buy-requests/seller/${currentUser?.id}`,
      );
      return res.data;
    },
    enabled: !!currentUser?.id,
  });

  // Mutation to update request status (Accept / Reject)
  const updateStatusMutation = useMutation({
    mutationFn: async ({
      productId,
      userId,
      status,
    }: {
      productId: string;
      userId: string;
      status: 'accepted' | 'rejected';
    }) => {
      const res = await axios.patch(`${API_BASE}/buy-requests/status`, {
        productId,
        userId,
        status,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
    },
    onError: (err: any) => {
      alert(
        `❌ Status update failed: ${err.response?.data?.error || err.message}`,
      );
    },
  });

  const handleStatusChange = (
    productId: string,
    userId: string,
    status: 'accepted' | 'rejected',
  ) => {
    updateStatusMutation.mutate({ productId, userId, status });
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-[#16503b]" size={48} />
        <p className="text-gray-500 font-medium">Loading incoming orders...</p>
      </div>
    );
  }

  const orders: OrderItem[] = data?.orders || [];

  return (
    <div className="max-w-[1440px] mx-auto p-4 md:p-8">
      {/* Page Header */}
      <div className="mb-8 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <ClipboardList size={32} className="text-[#16503b]" /> Incoming
            Orders
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm font-medium">
            Review and accept/reject buy requests for your published inventory
          </p>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
              <tr>
                <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">
                  Product
                </th>
                <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">
                  Buyer Information
                </th>
                <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">
                  Price
                </th>
                <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">
                  Status
                </th>
                <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">
                  Request Date
                </th>
                <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {orders.length > 0 ? (
                orders.map((item, idx) => (
                  <tr
                    key={`${item.productId}-${item.userId}-${idx}`}
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
                            src={item?.mainImage || '/placeholder.png'}
                            alt={item?.productTitle}
                            className="object-cover w-full h-full group-hover/item:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <span className="font-bold text-gray-900 dark:text-gray-100 group-hover/item:text-[#16503b] dark:group-hover/item:text-green-400 transition-colors line-clamp-1">
                          {item.productTitle}
                        </span>
                      </Link>
                    </td>

                    {/* Buyer */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#16503b] text-white flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                          {item.userImage ? (
                            <img
                              src={item?.userImage}
                              alt={item.userName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User size={16} />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-xs text-gray-900 dark:text-gray-100">
                            {item?.userName || 'Anonymous Buyer'}
                          </p>
                          <p className="text-[10px] text-gray-400 font-medium">
                            {item.userEmail || 'No email provided'}
                          </p>
                        </div>
                      </div>
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
                        <button
                          onClick={() =>
                            handleStatusChange(
                              item.productId,
                              item.userId,
                              'accepted',
                            )
                          }
                          disabled={
                            updateStatusMutation.isPending ||
                            item.status === 'accepted'
                          }
                          className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-40 flex items-center gap-1 shadow-sm active:scale-95"
                          title="Accept Request"
                        >
                          <Check size={14} /> Accept
                        </button>
                        <button
                          onClick={() =>
                            handleStatusChange(
                              item.productId,
                              item.userId,
                              'rejected',
                            )
                          }
                          disabled={
                            updateStatusMutation.isPending ||
                            item.status === 'rejected'
                          }
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-40 flex items-center gap-1 shadow-sm active:scale-95"
                          title="Reject Request"
                        >
                          <X size={14} /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <p className="text-gray-400 font-bold text-sm">
                      No incoming buy requests for your products yet.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyOrdersPage;
