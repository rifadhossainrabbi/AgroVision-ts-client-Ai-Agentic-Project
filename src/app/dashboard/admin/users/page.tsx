'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import {
  Users,
  Trash2,
  Shield,
  User,
  Loader2,
  AlertTriangle,
  Search,
} from 'lucide-react';
import Link from 'next/link';
import AuthGuard from '@/components/shared/AuthGuard';
import DeleteModal from '@/components/DeleteModal';

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

const AdminManageUsersPage = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Fetch Users
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-users-list'],
    queryFn: async () => {
      const res = await api.get(`${API_BASE}/admin/users`);
      return res.data;
    },
  });

  const users: UserData[] = data?.users || [];

  // Delete User Mutation (Cascading Deletion)
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const res = await api.delete(`${API_BASE}/admin/users/${userId}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success(
        'User and all associated products, likes, and comments deleted successfully!',
      );
      setDeletingId(null);
      setUserToDelete(null);
      queryClient.invalidateQueries({ queryKey: ['admin-users-list'] });
      queryClient.invalidateQueries({ queryKey: ['admin-products-list'] });
    },
    onError: (err: any) => {
      toast.error(
        `Failed to delete user: ${err.response?.data?.error || err.message}`,
      );
      setDeletingId(null);
    },
  });

  const handleDeleteUser = (userId: string, userName: string) => {
    setUserToDelete({ id: userId, name: userName });
  };

  const confirmDeleteUser = () => {
    if (!userToDelete) return;
    setDeletingId(userToDelete.id);
    deleteUserMutation.mutate(userToDelete.id);
  };

  const filteredUsers = users.filter(
    u =>
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <AuthGuard requireAdmin>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-slate-800 p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Users className="text-emerald-400" size={20} />
              <span className="text-xs font-black tracking-widest uppercase bg-white/10 px-3 py-1 rounded-full text-emerald-300">
                User Management
              </span>
            </div>
            <h1 className="text-3xl font-black mt-2">
              Registered Users Directory
            </h1>
            <p className="text-gray-300 text-sm mt-1">
              View, manage, or remove registered platform members with automatic
              cascading data cleanup.
            </p>
          </div>
          <div className="bg-white/10 px-4 py-2 rounded-2xl backdrop-blur-md font-bold text-sm">
            Total Users: {users.length}
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-[#0b1120] p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
          <div className="relative flex-1 w-full">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search user by name or email..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-[#1e293b] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 outline-none text-sm"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white dark:bg-[#0b1120] rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="p-12 text-center">
              <Loader2
                className="animate-spin text-[#16503b] mx-auto"
                size={40}
              />
              <p className="mt-3 text-xs font-bold text-gray-400 uppercase tracking-widest">
                Loading user accounts...
              </p>
            </div>
          ) : error ? (
            <div className="p-12 text-center text-red-500 font-bold">
              Failed to load users directory.
            </div>
          ) : filteredUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#1e293b]/50 text-[10px] font-black uppercase text-gray-400 tracking-wider">
                    <th className="px-6 py-4">User Details</th>
                    <th className="px-6 py-4">Email Address</th>
                    <th className="px-6 py-4">Account Role</th>
                    <th className="px-6 py-4">Joined Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
                  {filteredUsers.map(user => {
                    const userId = user.id || user._id;
                    const isDeleting = deletingId === userId;
                    return (
                      <tr
                        key={userId}
                        className="hover:bg-gray-50/50 dark:hover:bg-[#1e293b]/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <Link
                            href={`/dashboard/admin/users/${userId}`}
                            className="flex items-center gap-3 group/user cursor-pointer w-fit"
                            title="View user's products"
                          >
                            <div className="w-10 h-10 rounded-full bg-[#16503b] text-white flex items-center justify-center font-black text-sm overflow-hidden shrink-0 ring-2 ring-transparent group-hover/user:ring-[#16503b] transition-all">
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
                            <span className="font-bold text-gray-900 dark:text-white group-hover/user:text-[#16503b] dark:group-hover/user:text-green-400 group-hover/user:underline transition-colors">
                              {user.name}
                            </span>
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300 font-medium">
                          {user.email}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase px-3 py-1 rounded-full ${
                              user.role === 'admin'
                                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400'
                                : 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                            }`}
                          >
                            {user.role === 'admin' ? (
                              <Shield size={12} />
                            ) : (
                              <User size={12} />
                            )}
                            {user.role || 'user'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-400 text-xs font-semibold">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString()
                            : 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDeleteUser(userId, user.name)}
                            disabled={isDeleting}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors disabled:opacity-40 cursor-pointer"
                            title="Delete User & Cascading Data"
                          >
                            {isDeleting ? (
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
          ) : (
            <div className="p-12 text-center text-gray-400 font-bold text-sm">
              No matching users found.
            </div>
          )}
        </div>
      </div>

      <DeleteModal
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={confirmDeleteUser}
        isLoading={deleteUserMutation.isPending}
        title="Delete User"
        description={
          userToDelete
            ? `Are you sure you want to delete user "${userToDelete.name}"? This will also permanently remove ALL products, likes, comments, cart items, and buy requests associated with this user.`
            : undefined
        }
      />
    </AuthGuard>
  );
};

export default AdminManageUsersPage;
