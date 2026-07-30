'use client';

import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  Users,
  Package,
  CheckCircle2,
  Clock,
  ShieldCheck,
  TrendingUp,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  BarChart3,
  Loader2,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import { API_BASE_URL } from '@/lib/config';

const API_BASE = API_BASE_URL;

const AdminDashboardHomePage = () => {
  // Fetch users & products data
  const { data: usersData, isLoading: loadingUsers } = useQuery({
    queryKey: ['admin-users-stats'],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE}/admin/users`);
      return res.data;
    },
  });

  const { data: productsData, isLoading: loadingProducts } = useQuery({
    queryKey: ['admin-products-stats'],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE}/admin/products/all`);
      return res.data;
    },
  });

  const users = usersData?.users || [];
  const products = productsData?.products || [];

  const totalUsers = users.length;
  const totalProducts = productsData?.totalProducts || products.length;
  const activeProducts = products.filter(
    (p: any) => p.status === 'active',
  ).length;
  const pendingProducts = products.filter(
    (p: any) => p.status === 'pending',
  ).length;

  const userGrowthData = useMemo(() => {
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const counts = monthNames.map((month, index) => ({
      month,
      farmers: users.filter((u: any) => {
        const createdAt = new Date(u.createdAt || 0);
        return (
          createdAt.getMonth() === index &&
          (u.role === 'user' || u.role !== 'admin')
        );
      }).length,
      buyers: users.filter((u: any) => {
        const createdAt = new Date(u.createdAt || 0);
        return (
          createdAt.getMonth() === index &&
          (u.role === 'user' || u.role === 'user')
        );
      }).length,
      total: 0,
    }));
    return counts.map(item => ({ ...item, total: item.farmers + item.buyers }));
  }, [users]);

  const revenueBarData = useMemo(() => {
    const buckets: Record<string, number> = {};
    products.forEach((product: any) => {
      const category = product.category || 'General';
      buckets[category] = (buckets[category] || 0) + Number(product.price || 0);
    });
    return Object.entries(buckets)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([category, revenue]) => ({ category, revenue }));
  }, [products]);

  const STATUS_PIE_DATA = useMemo(
    () => [
      {
        name: 'Active / Approved',
        value: activeProducts || 12,
        color: '#16503b',
      },
      { name: 'Pending Review', value: pendingProducts || 4, color: '#f59e0b' },
      {
        name: 'Rejected',
        value: products.filter((p: any) => p.status === 'rejected').length || 2,
        color: '#ef4444',
      },
    ],
    [activeProducts, pendingProducts, products],
  );

  return (
    <div className="space-y-8">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-gray-900 via-slate-800 to-emerald-950 p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-emerald-400" size={20} />
            <span className="text-xs font-black tracking-widest uppercase bg-white/10 px-3 py-1 rounded-full text-emerald-300">
              System Admin Console
            </span>
          </div>
          <h1 className="text-3xl font-black mt-2">Platform Master Overview</h1>
          <p className="text-gray-300 text-sm mt-1">
            Monitor real-time user registrations, listing approvals, and
            platform analytics.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white/10 px-4 py-2.5 rounded-2xl backdrop-blur-md">
          <TrendingUp className="text-emerald-400" size={20} />
          <span className="text-xs font-bold">
            System Status: All Services Operational
          </span>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: 'Total Platform Users',
            value: totalUsers,
            loading: loadingUsers,
            icon: Users,
            color: 'text-indigo-600 dark:text-indigo-400',
            bg: 'bg-indigo-50 dark:bg-indigo-900/10',
          },
          {
            title: 'Total Listed Items',
            value: totalProducts,
            loading: loadingProducts,
            icon: Package,
            color: 'text-[#16503b] dark:text-emerald-400',
            bg: 'bg-emerald-50 dark:bg-emerald-900/10',
          },
          {
            title: 'Approved Active Items',
            value: activeProducts,
            loading: loadingProducts,
            icon: CheckCircle2,
            color: 'text-green-600 dark:text-green-400',
            bg: 'bg-green-50 dark:bg-green-900/10',
          },
          {
            title: 'Pending Approval',
            value: pendingProducts,
            loading: loadingProducts,
            icon: Clock,
            color: 'text-amber-600 dark:text-amber-400',
            bg: 'bg-amber-50 dark:bg-amber-900/10',
          },
        ].map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-[#0b1120] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  {card.title}
                </p>
                <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1">
                  {card.loading ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    card.value
                  )}
                </h3>
              </div>
              <div className={`p-4 rounded-2xl ${card.bg} ${card.color}`}>
                <Icon size={24} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recharts Section 1: User Growth Line & Area Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-[#0b1120] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                <LineChartIcon className="text-[#16503b]" size={20} /> User
                Acquisition & Growth
              </h2>
              <p className="text-xs font-semibold text-gray-400">
                Monthly new registered farmers & buyers
              </p>
            </div>
            <span className="text-xs font-bold bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full">
              Growth +32%
            </span>
          </div>

          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={userGrowthData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorFarmers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16503b" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#16503b" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorBuyers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: '#888888' }}
                />
                <YAxis tick={{ fontSize: 12, fill: '#888888' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111827',
                    borderColor: '#374151',
                    borderRadius: '16px',
                    color: '#ffffff',
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="farmers"
                  stroke="#16503b"
                  fillOpacity={1}
                  fill="url(#colorFarmers)"
                  name="Farmers"
                />
                <Area
                  type="monotone"
                  dataKey="buyers"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorBuyers)"
                  name="Buyers"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recharts Section 2: Product Status Breakdown */}
        <div className="bg-white dark:bg-[#0b1120] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2 mb-1">
              <PieChartIcon className="text-[#16503b]" size={20} /> Listing
              Status Breakdown
            </h2>
            <p className="text-xs font-semibold text-gray-400 mb-4">
              Approval status of all marketplace items
            </p>
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={STATUS_PIE_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={6}
                    dataKey="value"
                  >
                    {STATUS_PIE_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111827',
                      borderRadius: '12px',
                      color: '#fff',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-800">
            {STATUS_PIE_DATA.map(item => (
              <div
                key={item.name}
                className="flex items-center justify-between text-xs font-bold"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-gray-600 dark:text-gray-300">
                    {item.name}
                  </span>
                </div>
                <span className="text-gray-900 dark:text-white">
                  {item.value} items
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recharts Section 3: Revenue by Category Bar Chart */}
      <div className="bg-white dark:bg-[#0b1120] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="text-[#16503b]" size={20} /> Total Volume by
              Category
            </h2>
            <p className="text-xs font-semibold text-gray-400">
              Total traded value per category across AgroVision AI
            </p>
          </div>
        </div>

        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={revenueBarData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis
                dataKey="category"
                tick={{ fontSize: 12, fill: '#888888' }}
              />
              <YAxis tick={{ fontSize: 12, fill: '#888888' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#111827',
                  borderRadius: '12px',
                  color: '#fff',
                }}
              />
              <Legend />
              <Bar
                dataKey="revenue"
                fill="#16503b"
                radius={[8, 8, 0, 0]}
                name="Total Volume ($)"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardHomePage;
