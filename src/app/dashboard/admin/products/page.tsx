'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  Package,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  Loader2,
  Eye,
} from 'lucide-react';
import Link from 'next/link';
import AuthGuard from '@/components/shared/AuthGuard';

const API_BASE = 'http://localhost:5000/api';

interface ProductItem {
  _id: string;
  title: string;
  category: string;
  productType: string;
  price: number;
  unit: string;
  mainImage: string;
  status: 'active' | 'pending' | 'rejected';
  sellerName?: string;
  createdAt?: string;
}

const AdminManageProductsPage = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [actionId, setActionId] = useState<string | null>(null);

  // Fetch all products for admin (includes pending, active, rejected)
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-products-list', statusFilter, searchTerm],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE}/admin/products/all`, {
        params: {
          search: searchTerm,
          status: statusFilter,
        },
      });
      return res.data;
    },
  });

  const products: ProductItem[] = data?.products || [];

  // Update Product Status Mutation (Approve / Reject)
  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'active' | 'pending' | 'rejected' }) => {
      const res = await axios.patch(`${API_BASE}/admin/products/${id}/status`, { status });
      return res.data;
    },
    onSuccess: (data, variables) => {
      const statusText =
        variables.status === 'active'
          ? 'Approved & Published to Marketplace!'
          : variables.status === 'rejected'
            ? 'Rejected & Hidden from Marketplace'
            : 'Set to Pending Review';
      toast.success(statusText);
      setActionId(null);
      queryClient.invalidateQueries({ queryKey: ['admin-products-list'] });
    },
    onError: (err: any) => {
      toast.error(`Failed to update status: ${err.response?.data?.error || err.message}`);
      setActionId(null);
    },
  });

  // Delete Product Mutation (Cascading Deletion)
  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await axios.delete(`${API_BASE}/products/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Product and all related likes, comments, cart, and orders deleted!');
      setActionId(null);
      queryClient.invalidateQueries({ queryKey: ['admin-products-list'] });
    },
    onError: (err: any) => {
      toast.error(`Failed to delete product: ${err.response?.data?.error || err.message}`);
      setActionId(null);
    },
  });

  const handleStatusChange = (id: string, status: 'active' | 'pending' | 'rejected') => {
    setActionId(id);
    statusMutation.mutate({ id, status });
  };

  const handleDeleteProduct = (id: string, title: string) => {
    if (
      confirm(
        `Are you sure you want to delete product "${title}"? This will delete all associated likes, comments, cart items, and buy requests!`,
      )
    ) {
      setActionId(id);
      deleteProductMutation.mutate(id);
    }
  };

  return (
    <AuthGuard requireAdmin>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Package className="text-emerald-400" size={20} />
              <span className="text-xs font-black tracking-widest uppercase bg-white/10 px-3 py-1 rounded-full text-emerald-300">
                Marketplace Approvals
              </span>
            </div>
            <h1 className="text-3xl font-black mt-2">Manage All Platform Items</h1>
            <p className="text-gray-300 text-sm mt-1">
              Approve pending listings before they appear in the marketplace, or delete invalid items.
            </p>
          </div>
          <div className="bg-white/10 px-4 py-2 rounded-2xl backdrop-blur-md font-bold text-sm">
            Total Listings: {data?.totalProducts || products.length}
          </div>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-[#0b1120] p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search product title..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-[#1e293b] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 outline-none text-sm"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter size={16} className="text-gray-400" />
            <span className="text-xs font-bold text-gray-400 uppercase">Status:</span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-[#1e293b] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 outline-none text-xs font-bold"
            >
              <option value="All">All Statuses</option>
              <option value="pending">Pending Approval</option>
              <option value="active">Active / Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white dark:bg-[#0b1120] rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="p-12 text-center">
              <Loader2 className="animate-spin text-[#16503b] mx-auto" size={40} />
              <p className="mt-3 text-xs font-bold text-gray-400 uppercase tracking-widest">
                Fetching platform listings...
              </p>
            </div>
          ) : error ? (
            <div className="p-12 text-center text-red-500 font-bold">
              Failed to load products list.
            </div>
          ) : products.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#1e293b]/50 text-[10px] font-black uppercase text-gray-400 tracking-wider">
                    <th className="px-6 py-4">Item Info</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Current Status</th>
                    <th className="px-6 py-4 text-center">Approval Actions</th>
                    <th className="px-6 py-4 text-right">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
                  {products.map(product => {
                    const isBusy = actionId === product._id;
                    return (
                      <tr key={product._id} className="hover:bg-gray-50/50 dark:hover:bg-[#1e293b]/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.mainImage}
                              alt={product.title}
                              className="w-12 h-12 rounded-xl object-cover border border-gray-100 dark:border-gray-800 shrink-0"
                            />
                            <div>
                              <p className="font-bold text-gray-900 dark:text-white truncate max-w-[220px]">
                                {product.title}
                              </p>
                              <span className="text-[10px] font-semibold text-gray-400">
                                Seller: {product.sellerName || 'AgroVision Member'}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">
                          {product.category}
                        </td>
                        <td className="px-6 py-4 font-black text-[#16503b] dark:text-green-500">
                          ${Number(product.price).toFixed(2)} / {product.unit}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-black uppercase px-3 py-1 rounded-full ${
                              product.status === 'active'
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                                : product.status === 'pending'
                                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
                                  : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                            }`}
                          >
                            {product.status === 'active' && <CheckCircle size={12} />}
                            {product.status === 'pending' && <Clock size={12} />}
                            {product.status === 'rejected' && <XCircle size={12} />}
                            {product.status === 'active' ? 'Approved' : product.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            {product.status !== 'active' && (
                              <button
                                onClick={() => handleStatusChange(product._id, 'active')}
                                disabled={isBusy}
                                className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-40 cursor-pointer flex items-center gap-1"
                              >
                                {isBusy ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle size={12} />}
                                Approve
                              </button>
                            )}
                            {product.status !== 'rejected' && (
                              <button
                                onClick={() => handleStatusChange(product._id, 'rejected')}
                                disabled={isBusy}
                                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-40 cursor-pointer flex items-center gap-1"
                              >
                                {isBusy ? <Loader2 size={12} className="animate-spin" /> : <XCircle size={12} />}
                                Reject
                              </button>
                            )}
                            <Link
                              href={`/marketplace/${product._id}`}
                              className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-white rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye size={16} />
                            </Link>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDeleteProduct(product._id, product.title)}
                            disabled={isBusy}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors disabled:opacity-40 cursor-pointer"
                            title="Delete Product & Cascading Data"
                          >
                            {isBusy ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-gray-400 font-bold text-sm">
              No matching products found.
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
};

export default AdminManageProductsPage;
