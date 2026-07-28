'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { authClient } from '@/lib/auth-client';
import {
  ShoppingCart,
  Trash2,
  ExternalLink,
  Loader2,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import DeleteModal from '@/components/DeleteModal';

const API_BASE = 'http://localhost:5000/api';

interface CartItem {
  _id: string;
  productId: string;
  productTitle: string;
  mainImage: string;
  price: number;
  unit: string;
  category: string;
  addedAt: string;
}

const MyCartPage = () => {
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  const currentUser = session?.user;

  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Fetch cart items for current user
  const { data, isLoading } = useQuery({
    queryKey: ['my-cart', currentUser?.id],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE}/cart/${currentUser?.id}`);
      return res.data;
    },
    enabled: !!currentUser?.id,
  });

  // Remove from cart mutation
  const deleteCartMutation = useMutation({
    mutationFn: async (productId: string) => {
      await axios.delete(`${API_BASE}/cart/${productId}/${currentUser?.id}`);
    },
    onSuccess: () => {
      setIsDeleteModalOpen(false);
      setSelectedProductId(null);
      queryClient.invalidateQueries({ queryKey: ['my-cart'] });
    },
    onError: (err: any) => {
      alert(`❌ Failed to remove from cart: ${err.response?.data?.error || err.message}`);
    },
  });

  const handleDeleteClick = (productId: string) => {
    setSelectedProductId(productId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedProductId) {
      deleteCartMutation.mutate(selectedProductId);
    }
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-[#16503b]" size={48} />
        <p className="text-gray-500 font-medium">Loading your shopping cart...</p>
      </div>
    );
  }

  const cartItems: CartItem[] = data?.cartItems || [];
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + Number(item.price || 0),
    0,
  );

  return (
    <div className="max-w-[1440px] mx-auto p-4 md:p-8">
      {/* Page Header */}
      <div className="mb-8 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <ShoppingCart size={32} className="text-[#16503b]" /> My Cart
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm font-medium">
            Manage products saved in your cart
          </p>
        </div>
        <Link
          href="/marketplace"
          className="bg-[#16503b] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#124130] active:scale-95 transition-all cursor-pointer shadow-lg shadow-green-900/10 text-xs uppercase tracking-wider flex items-center gap-2"
        >
          Explore More Products
        </Link>
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm transition-colors mb-8">
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
                  Date Added
                </th>
                <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {cartItems.length > 0 ? (
                cartItems.map(item => (
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

                    {/* Category */}
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold px-3 py-1 bg-green-50 dark:bg-green-900/20 text-[#16503b] dark:text-green-400 rounded-full border border-green-100 dark:border-green-800/30">
                        {item.category || 'General'}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4 font-black text-gray-900 dark:text-gray-100">
                      ${Number(item.price).toFixed(2)}
                      <span className="text-[10px] text-gray-400 font-medium ml-1">
                        / {item.unit || 'unit'}
                      </span>
                    </td>

                    {/* Date Added */}
                    <td className="px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400">
                      {new Date(item.addedAt).toLocaleDateString()}
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
                          className="px-3 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                          title="Delete Cart Item"
                        >
                          <Trash2 size={15} /> Delete Cart
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <p className="text-gray-400 font-bold text-sm">
                      Your cart is empty.
                    </p>
                    <Link
                      href="/marketplace"
                      className="mt-3 inline-block text-xs font-black text-[#16503b] hover:underline uppercase tracking-wider"
                    >
                      Browse Marketplace & Add Items
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Cart Total Summary */}
        {cartItems.length > 0 && (
          <div className="p-6 bg-gray-50/50 dark:bg-gray-800/30 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center flex-wrap gap-4">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Total Items: {cartItems.length}
              </p>
              <p className="text-2xl font-black text-[#16503b] dark:text-green-400 mt-0.5">
                Total: ${totalPrice.toFixed(2)}
              </p>
            </div>
            <Link
              href="/marketplace"
              className="bg-[#16503b] text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-wider hover:bg-[#124130] transition-all cursor-pointer shadow-lg shadow-green-900/10 flex items-center gap-2"
            >
              <Zap size={16} /> Continue Shopping
            </Link>
          </div>
        )}
      </div>

      {/* Reusable Delete Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={deleteCartMutation.isPending}
        title="Remove Item from Cart?"
        description="Are you sure you want to delete this product from your shopping cart?"
      />
    </div>
  );
};

export default MyCartPage;