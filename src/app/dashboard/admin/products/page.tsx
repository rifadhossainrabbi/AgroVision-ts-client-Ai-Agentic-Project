'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
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
  Star,
} from 'lucide-react';
import Link from 'next/link';
import AuthGuard from '@/components/shared/AuthGuard';
import DeleteModal from '@/components/DeleteModal';

import { API_BASE_URL } from '@/lib/config';

const API_BASE = API_BASE_URL;

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
  isFeatured?: boolean;
}

const AdminManageProductsPage = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [actionId, setActionId] = useState<string | null>(null);
  const [productToDelete, setProductToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

  // Fetch all products for admin (includes pending, active, rejected)
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-products-list', statusFilter, searchTerm],
    queryFn: async () => {
      const res = await api.get(`${API_BASE}/admin/products/all`, {
        params: {
          search: searchTerm,
          status: statusFilter,
        },
      });
      return res.data;
    },
  });

  const products: ProductItem[] = data?.products || [];

  // Fetch currently featured products (home page section, max 6)
  const { data: featuredData } = useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => {
      const res = await api.get(`${API_BASE}/products/featured`);
      return res.data;
    },
  });
  const featuredCount = featuredData?.products?.length || 0;

  // Toggle Featured Mutation (Home Page Featured Section, Max 6)
  const featureMutation = useMutation({
    mutationFn: async ({ id, featured }: { id: string; featured: boolean }) => {
      const res = await api.patch(`${API_BASE}/admin/products/${id}/feature`, {
        featured,
      });
      return res.data;
    },
    onSuccess: (_data, variables) => {
      toast.success(
        variables.featured
          ? 'Added to Home Page Featured section!'
          : 'Removed from Featured section',
      );
      setActionId(null);
      queryClient.invalidateQueries({ queryKey: ['admin-products-list'] });
      queryClient.invalidateQueries({ queryKey: ['featured-products'] });
    },
    onError: (err: any) => {
      toast.error(
        err.response?.data?.error ||
          `Failed to update featured status: ${err.message}`,
      );
      setActionId(null);
    },
  });

  const handleToggleFeatured = (id: string, current: boolean) => {
    setActionId(id);
    featureMutation.mutate({ id, featured: !current });
  };

  // Update Product Status Mutation (Approve / Reject)
  const statusMutation = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: 'active' | 'pending' | 'rejected';
    }) => {
      const res = await api.patch(`${API_BASE}/admin/products/${id}/status`, {
        status,
      });
      return res.data;
    },
    onSuccess: (data, variables) => {
      const statusText =
        variables.status === 'active'
          ? 'Approved & Published to Marketplace!'
          : 'Rejected & Moved back to Pending Review';
      toast.success(statusText);
      setActionId(null);
      queryClient.invalidateQueries({ queryKey: ['admin-products-list'] });
    },
    onError: (err: any) => {
      toast.error(
        `Failed to update status: ${err.response?.data?.error || err.message}`,
      );
      setActionId(null);
    },
  });

  // Delete Product Mutation (Cascading Deletion)
  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`${API_BASE}/products/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success(
        'Product and all related likes, comments, cart, and orders deleted!',
      );
      setActionId(null);
      setProductToDelete(null);
      queryClient.invalidateQueries({ queryKey: ['admin-products-list'] });
    },
    onError: (err: any) => {
      toast.error(
        `Failed to delete product: ${err.response?.data?.error || err.message}`,
      );
      setActionId(null);
    },
  });

  const handleStatusChange = (
    id: string,
    status: 'active' | 'pending' | 'rejected',
  ) => {
    setActionId(id);
    statusMutation.mutate({ id, status });
  };

  const handleDeleteProduct = (id: string, title: string) => {
    setProductToDelete({ id, title });
  };

  const confirmDeleteProduct = () => {
    if (!productToDelete) return;
    setActionId(productToDelete.id);
    deleteProductMutation.mutate(productToDelete.id);
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
            <h1 className="text-3xl font-black mt-2">
              Manage All Platform Items
            </h1>
            <p className="text-gray-300 text-sm mt-1">
              Approve pending listings before they appear in the marketplace, or
              delete invalid items.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="bg-white/10 px-4 py-2 rounded-2xl backdrop-blur-md font-bold text-sm">
              Total Listings: {data?.totalProducts || products.length}
            </div>
            <div className="bg-white/10 px-4 py-2 rounded-2xl backdrop-blur-md font-bold text-sm flex items-center gap-2">
              <Star size={14} className="text-amber-300" fill="currentColor" />
              Featured on Home: {featuredCount}/6
            </div>
          </div>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-[#0b1120] p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
          <div className="relative flex-1 w-full">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
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
            <span className="text-xs font-bold text-gray-400 uppercase">
              Status:
            </span>
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
              <Loader2
                className="animate-spin text-[#16503b] mx-auto"
                size={40}
              />
              <p className="mt-3 text-xs font-bold text-gray-400 uppercase tracking-widest">
                Fetching platform listings...
              </p>
            </div>
          ) : error ? (
            <div className="p-12 text-center text-red-500 font-bold">
              Failed to load products list.
            </div>
          ) : products.length > 0 ? (
            <>
              {/* Mobile Card View */}
              <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-800">
                {products.map(product => {
                  const isBusy = actionId === product._id;
                  return (
                    <div key={product._id} className="p-4 flex flex-col gap-3">
                      <div className="flex items-start justify-between gap-3">
                        <Link
                          href={`/marketplace/${product._id}`}
                          className="flex items-center gap-3 min-w-0"
                        >
                          <img
                            src={product.mainImage}
                            alt={product.title}
                            className="w-12 h-12 rounded-xl object-cover border border-gray-100 dark:border-gray-800 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-gray-900 dark:text-white truncate">
                              {product.title}
                            </p>
                            <span className="text-[10px] font-semibold text-gray-400">
                              Seller:{' '}
                              {product.sellerName || 'AgroVision Member'}
                            </span>
                          </div>
                        </Link>
                        <button
                          onClick={() =>
                            handleDeleteProduct(product._id, product.title)
                          }
                          disabled={isBusy}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors disabled:opacity-40 cursor-pointer shrink-0"
                          title="Delete Product & Cascading Data"
                        >
                          {isBusy ? (
                            <Loader2 size={18} className="animate-spin" />
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>
                      </div>

                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="font-black text-[#16503b] dark:text-green-500 text-sm">
                          ${Number(product.price).toFixed(2)} / {product.unit}
                        </span>
                        <span className="font-semibold text-xs text-gray-700 dark:text-gray-300">
                          {product.category}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-black uppercase px-3 py-1 rounded-full ${
                            product.status === 'active'
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                              : product.status === 'pending'
                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
                                : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                          }`}
                        >
                          {product.status === 'active' && (
                            <CheckCircle size={12} />
                          )}
                          {product.status === 'pending' && <Clock size={12} />}
                          {product.status === 'rejected' && (
                            <XCircle size={12} />
                          )}
                          {product.status === 'active'
                            ? 'Approved'
                            : product.status}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-1">
                        <button
                          onClick={() =>
                            handleToggleFeatured(
                              product._id,
                              !!product.isFeatured,
                            )
                          }
                          disabled={
                            isBusy ||
                            (!product.isFeatured && featuredCount >= 6) ||
                            product.status !== 'active'
                          }
                          title={
                            product.status !== 'active'
                              ? 'Only approved/active products can be featured'
                              : product.isFeatured
                                ? 'Remove from Home Page Featured section'
                                : featuredCount >= 6
                                  ? 'Maximum 6 featured products reached'
                                  : 'Add to Home Page Featured section'
                          }
                          className={`p-2 rounded-xl transition-all disabled:opacity-30 cursor-pointer ${
                            product.isFeatured
                              ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'
                              : 'text-gray-300 bg-gray-50 dark:bg-gray-800 dark:text-gray-600'
                          }`}
                        >
                          {isBusy && featureMutation.isPending ? (
                            <Loader2 size={18} className="animate-spin" />
                          ) : (
                            <Star
                              size={18}
                              fill={
                                product.isFeatured ? 'currentColor' : 'none'
                              }
                            />
                          )}
                        </button>

                        <div className="flex items-center gap-2">
                          {product.status !== 'active' && (
                            <button
                              onClick={() =>
                                handleStatusChange(product._id, 'active')
                              }
                              disabled={isBusy}
                              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-40 cursor-pointer flex items-center gap-1"
                            >
                              {isBusy ? (
                                <Loader2 size={12} className="animate-spin" />
                              ) : (
                                <CheckCircle size={12} />
                              )}
                              Approve
                            </button>
                          )}
                          {product.status === 'active' && (
                            <button
                              onClick={() =>
                                handleStatusChange(product._id, 'pending')
                              }
                              disabled={isBusy}
                              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-40 cursor-pointer flex items-center gap-1"
                            >
                              {isBusy ? (
                                <Loader2 size={12} className="animate-spin" />
                              ) : (
                                <XCircle size={12} />
                              )}
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
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#1e293b]/50 text-[10px] font-black uppercase text-gray-400 tracking-wider">
                      <th className="px-6 py-4">Item Info</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4">Current Status</th>
                      <th className="px-6 py-4 text-center">Featured</th>
                      <th className="px-6 py-4 text-center">
                        Approval Actions
                      </th>
                      <th className="px-6 py-4 text-right">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
                    {products.map(product => {
                      const isBusy = actionId === product._id;
                      return (
                        <tr
                          key={product._id}
                          className="hover:bg-gray-50/50 dark:hover:bg-[#1e293b]/30 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <Link
                              href={`/marketplace/${product._id}`}
                              className="flex items-center gap-3 group/item cursor-pointer w-fit"
                              title="View product details"
                            >
                              <img
                                src={product.mainImage}
                                alt={product.title}
                                className="w-12 h-12 rounded-xl object-cover border border-gray-100 dark:border-gray-800 shrink-0 group-hover/item:ring-2 group-hover/item:ring-[#16503b] transition-all"
                              />
                              <div>
                                <p className="font-bold text-gray-900 dark:text-white truncate max-w-[220px] group-hover/item:text-[#16503b] dark:group-hover/item:text-green-400 group-hover/item:underline transition-colors">
                                  {product.title}
                                </p>
                                <span className="text-[10px] font-semibold text-gray-400">
                                  Seller:{' '}
                                  {product.sellerName || 'AgroVision Member'}
                                </span>
                              </div>
                            </Link>
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
                              {product.status === 'active' && (
                                <CheckCircle size={12} />
                              )}
                              {product.status === 'pending' && (
                                <Clock size={12} />
                              )}
                              {product.status === 'rejected' && (
                                <XCircle size={12} />
                              )}
                              {product.status === 'active'
                                ? 'Approved'
                                : product.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-center">
                              <button
                                onClick={() =>
                                  handleToggleFeatured(
                                    product._id,
                                    !!product.isFeatured,
                                  )
                                }
                                disabled={
                                  isBusy ||
                                  (!product.isFeatured && featuredCount >= 6) ||
                                  product.status !== 'active'
                                }
                                title={
                                  product.status !== 'active'
                                    ? 'Only approved/active products can be featured'
                                    : product.isFeatured
                                      ? 'Remove from Home Page Featured section'
                                      : featuredCount >= 6
                                        ? 'Maximum 6 featured products reached'
                                        : 'Add to Home Page Featured section'
                                }
                                className={`p-2 rounded-xl transition-all disabled:opacity-30 cursor-pointer ${
                                  product.isFeatured
                                    ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'
                                    : 'text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-600'
                                }`}
                              >
                                {isBusy && featureMutation.isPending ? (
                                  <Loader2 size={18} className="animate-spin" />
                                ) : (
                                  <Star
                                    size={18}
                                    fill={
                                      product.isFeatured
                                        ? 'currentColor'
                                        : 'none'
                                    }
                                  />
                                )}
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              {product.status !== 'active' && (
                                <button
                                  onClick={() =>
                                    handleStatusChange(product._id, 'active')
                                  }
                                  disabled={isBusy}
                                  className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-40 cursor-pointer flex items-center gap-1"
                                >
                                  {isBusy ? (
                                    <Loader2
                                      size={12}
                                      className="animate-spin"
                                    />
                                  ) : (
                                    <CheckCircle size={12} />
                                  )}
                                  Approve
                                </button>
                              )}
                              {product.status === 'active' && (
                                <button
                                  onClick={() =>
                                    handleStatusChange(product._id, 'pending')
                                  }
                                  disabled={isBusy}
                                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-40 cursor-pointer flex items-center gap-1"
                                >
                                  {isBusy ? (
                                    <Loader2
                                      size={12}
                                      className="animate-spin"
                                    />
                                  ) : (
                                    <XCircle size={12} />
                                  )}
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
                              onClick={() =>
                                handleDeleteProduct(product._id, product.title)
                              }
                              disabled={isBusy}
                              className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors disabled:opacity-40 cursor-pointer"
                              title="Delete Product & Cascading Data"
                            >
                              {isBusy ? (
                                <Loader2 size={18} className="animate-spin" />
                              ) : (
                                <Trash2 size={18} />
                              )}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-gray-400 font-bold text-sm">
              No matching products found.
            </div>
          )}
        </div>
      </div>

      <DeleteModal
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={confirmDeleteProduct}
        isLoading={deleteProductMutation.isPending}
        title="Delete Product"
        description={
          productToDelete
            ? `Are you sure you want to delete "${productToDelete.title}"? This will delete all associated likes, comments, cart items, and buy requests.`
            : undefined
        }
      />
    </AuthGuard>
  );
};

export default AdminManageProductsPage;
