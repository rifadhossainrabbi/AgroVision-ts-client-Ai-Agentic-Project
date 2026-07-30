'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/lib/axios';
import toast from 'react-hot-toast';
import { authClient } from '@/lib/auth-client';
import {
  Edit,
  Trash2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Package,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import DeleteModal from '@/components/DeleteModal';

const MyProductPage = () => {
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  const [page, setPage] = useState(1);
  const [productToDelete, setProductToDelete] = useState<any | null>(null);

  // ১. TanStack Query: ইউজার ভিত্তিক প্রোডাক্ট ফেচ করা
  const { data, isLoading, isError } = useQuery({
    queryKey: ['my-products', session?.user?.id, page],
    queryFn: async () => {
      const res = await axios.get(
        `/my-products/${session?.user?.id}?page=${page}`,
      );
      return res.data;
    },
    enabled: !!session?.user?.id, // সেশন পাওয়ার পর কল হবে
  });

  // ২. TanStack Mutation: প্রোডাক্ট ডিলিট করা
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/products/${id}`);
    },
    onSuccess: () => {
      toast.success('Product deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['my-products'] });
      setProductToDelete(null);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error || 'Failed to delete product');
    },
  });

  const handleDelete = (product: any) => {
    setProductToDelete(product);
  };

  const confirmDelete = () => {
    if (!productToDelete) return;
    deleteMutation.mutate(productToDelete._id);
  };

  if (isLoading)
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-[#16503b]" size={48} />
        <p className="text-gray-500 font-medium">Syncing your inventory...</p>
      </div>
    );

  return (
    <div className="max-w-[1440px] mx-auto p-4 md:p-8">
      {/* Page Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <Package size={32} className="text-[#16503b]" /> My Inventory
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage and track your published crops & machines
          </p>
        </div>
        <Link
          href="/dashboard/farmer/add-crop"
          className="bg-[#16503b] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#0f3a2a] transition-all cursor-pointer shadow-lg shadow-green-900/10"
        >
          + Add New
        </Link>
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
                  Category
                </th>
                <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">
                  Price
                </th>
                <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">
                  Status
                </th>
                <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {data?.products?.map((product: any) => (
                <tr
                  key={product._id}
                  className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-all"
                >
                  <td className="px-6 py-4">
                    <Link
                      href={`/marketplace/${product._id}`}
                      className="flex items-center gap-4 cursor-pointer group/item"
                    >
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden border dark:border-gray-700 shadow-sm">
                        <img
                          src={product.mainImage}
                          alt={product.title}
                          className="object-cover w-full h-full group-hover/item:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <span className="font-bold text-gray-900 dark:text-gray-100 group-hover/item:text-[#16503b] transition-colors line-clamp-1">
                        {product.title}
                      </span>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold px-3 py-1 bg-green-50 dark:bg-green-900/20 text-[#16503b] dark:text-green-400 rounded-full">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-black text-gray-900 dark:text-gray-100">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${product.status === 'active' ? 'bg-green-500' : 'bg-orange-400'} animate-pulse`}
                      />
                      <span className="text-xs font-medium capitalize">
                        {product.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/dashboard/farmer/edit-product/${product._id}`}
                        className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 text-gray-500 hover:text-blue-600 transition-all cursor-pointer"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(product)}
                        className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-500 hover:text-red-600 transition-all cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                      <Link
                        href={`/marketplace/${product._id}`}
                        className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 text-gray-500 hover:text-green-600 transition-all cursor-pointer"
                      >
                        <ExternalLink size={16} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-6 bg-gray-50/30 dark:bg-gray-800/10 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Showing Page {data?.currentPage} of {data?.totalPages}
          </p>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(prev => prev - 1)}
              className="p-2 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-white dark:hover:bg-gray-800 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed dark:text-white shadow-sm"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              disabled={page >= data?.totalPages}
              onClick={() => setPage(prev => prev + 1)}
              className="p-2 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-white dark:hover:bg-gray-800 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed dark:text-white shadow-sm"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      <DeleteModal
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={confirmDelete}
        isLoading={deleteMutation.isPending}
        title="Delete listing"
        description={
          productToDelete
            ? `Remove "${productToDelete.title}" from your inventory? This cannot be undone.`
            : 'Remove this product from your inventory?'
        }
      />
    </div>
  );
};

export default MyProductPage;
