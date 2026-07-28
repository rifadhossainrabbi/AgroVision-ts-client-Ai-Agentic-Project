'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { authClient } from '@/lib/auth-client';
import {
  Package,
  ShoppingCart,
  ShoppingBag,
  Heart,
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

const API_BASE = 'http://localhost:5000/api';

// Mock/Interactive Chart Data for Recharts Visualization
const MONTHLY_YIELD_DATA = [
  { month: 'Jan', revenue: 2400, yieldKg: 1800, orders: 12 },
  { month: 'Feb', revenue: 3200, yieldKg: 2200, orders: 18 },
  { month: 'Mar', revenue: 4500, yieldKg: 2900, orders: 25 },
  { month: 'Apr', revenue: 3800, yieldKg: 2600, orders: 20 },
  { month: 'May', revenue: 5600, yieldKg: 3500, orders: 32 },
  { month: 'Jun', revenue: 6400, yieldKg: 4100, orders: 40 },
  { month: 'Jul', revenue: 7200, yieldKg: 4800, orders: 45 },
];

const CATEGORY_DISTRIBUTION = [
  { name: 'Crops & Grains', value: 45, color: '#16503b' },
  { name: 'Vegetables & Fruits', value: 30, color: '#10b981' },
  { name: 'Farm Machinery', value: 15, color: '#f59e0b' },
  { name: 'Fertilizers & Seeds', value: 10, color: '#3b82f6' },
];

const COMPARISON_BAR_DATA = [
  { category: 'Wheat', sales: 4200, target: 4000 },
  { category: 'Organic Rice', sales: 6800, target: 6000 },
  { category: 'Tractors', sales: 9500, target: 8000 },
  { category: 'Potato', sales: 3100, target: 3500 },
  { category: 'Harvesters', sales: 8200, target: 7500 },
];

const FarmerDashboardHomePage = () => {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;

  // Fetch real statistics
  const { data: productsData, isLoading: loadingProducts } = useQuery({
    queryKey: ['my-products-count', userId],
    queryFn: async () => {
      if (!userId) return { total: 0 };
      const res = await axios.get(`${API_BASE}/my-products/${userId}`);
      return res.data;
    },
    enabled: !!userId,
  });

  const { data: cartData } = useQuery({
    queryKey: ['my-cart-count', userId],
    queryFn: async () => {
      if (!userId) return { cartItems: [] };
      const res = await axios.get(`${API_BASE}/cart/${userId}`);
      return res.data;
    },
    enabled: !!userId,
  });

  const { data: requestsData } = useQuery({
    queryKey: ['my-requests-count', userId],
    queryFn: async () => {
      if (!userId) return { requests: [] };
      const res = await axios.get(`${API_BASE}/buy-requests/user/${userId}`);
      return res.data;
    },
    enabled: !!userId,
  });

  const { data: ordersData } = useQuery({
    queryKey: ['my-orders-count', userId],
    queryFn: async () => {
      if (!userId) return { orders: [] };
      const res = await axios.get(`${API_BASE}/buy-requests/seller/${userId}`);
      return res.data;
    },
    enabled: !!userId,
  });

  const totalProducts = productsData?.products?.length || 0;
  const totalCart = cartData?.cartItems?.length || 0;
  const totalRequests = requestsData?.requests?.length || 0;
  const totalOrders = ordersData?.orders?.length || 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#16503b] to-[#1e6b4f] p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-black tracking-widest uppercase bg-white/20 px-3 py-1 rounded-full">
            Farmer Workspace
          </span>
          <h1 className="text-3xl font-black mt-2">
            Welcome back, {session?.user?.name || 'Farmer'}! 👋
          </h1>
          <p className="text-green-100 text-sm mt-1">
            Here is your live farm performance, sales analytics, and crop yield report.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white/15 px-4 py-2 rounded-2xl backdrop-blur-md">
          <TrendingUp className="text-green-300" size={20} />
          <span className="text-xs font-bold">Overall Yield: +24.8% vs last month</span>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: 'My Listed Products',
            value: totalProducts,
            icon: Package,
            color: 'bg-emerald-500',
            bgLight: 'bg-emerald-50 dark:bg-emerald-900/10',
            textColor: 'text-emerald-600 dark:text-emerald-400',
          },
          {
            title: 'Cart Saved Items',
            value: totalCart,
            icon: ShoppingCart,
            color: 'bg-blue-500',
            bgLight: 'bg-blue-50 dark:bg-blue-900/10',
            textColor: 'text-blue-600 dark:text-blue-400',
          },
          {
            title: 'My Buy Requests',
            value: totalRequests,
            icon: ShoppingBag,
            color: 'bg-amber-500',
            bgLight: 'bg-amber-50 dark:bg-amber-900/10',
            textColor: 'text-amber-600 dark:text-amber-400',
          },
          {
            title: 'Incoming Orders',
            value: totalOrders,
            icon: Heart,
            color: 'bg-purple-500',
            bgLight: 'bg-purple-50 dark:bg-purple-900/10',
            textColor: 'text-purple-600 dark:text-purple-400',
          },
        ].map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-[#0b1120] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  {card.title}
                </p>
                <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1">
                  {loadingProducts ? <Loader2 className="animate-spin" size={24} /> : card.value}
                </h3>
              </div>
              <div className={`p-4 rounded-2xl ${card.bgLight} ${card.textColor}`}>
                <Icon size={24} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recharts Section 1: Revenue & Yield Area Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-[#0b1120] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                <LineChartIcon className="text-[#16503b]" size={20} /> Revenue & Crop Yield Growth
              </h2>
              <p className="text-xs font-semibold text-gray-400">Monthly trend over the current season</p>
            </div>
            <span className="text-xs font-bold bg-green-100 dark:bg-green-900/20 text-[#16503b] px-3 py-1 rounded-full">
              Live Data
            </span>
          </div>

          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_YIELD_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16503b" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#16503b" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#888888' }} />
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
                <Area type="monotone" dataKey="revenue" stroke="#16503b" fillOpacity={1} fill="url(#colorRev)" name="Revenue ($)" />
                <Area type="monotone" dataKey="yieldKg" stroke="#10b981" fillOpacity={1} fill="url(#colorYield)" name="Yield (kg)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recharts Section 2: Category Distribution Pie Chart */}
        <div className="bg-white dark:bg-[#0b1120] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2 mb-1">
              <PieChartIcon className="text-[#16503b]" size={20} /> Share by Category
            </h2>
            <p className="text-xs font-semibold text-gray-400 mb-4">Distribution of your farm inventory</p>
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={CATEGORY_DISTRIBUTION}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {CATEGORY_DISTRIBUTION.map((entry, index) => (
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
            {CATEGORY_DISTRIBUTION.map(item => (
              <div key={item.name} className="flex items-center justify-between text-xs font-bold">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-600 dark:text-gray-300">{item.name}</span>
                </div>
                <span className="text-gray-900 dark:text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recharts Section 3: Performance Bar Chart */}
      <div className="bg-white dark:bg-[#0b1120] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="text-[#16503b]" size={20} /> Sales vs Season Target Comparison
            </h2>
            <p className="text-xs font-semibold text-gray-400">Actual sales volume against monthly target</p>
          </div>
        </div>

        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={COMPARISON_BAR_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="category" tick={{ fontSize: 12, fill: '#888888' }} />
              <YAxis tick={{ fontSize: 12, fill: '#888888' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#111827',
                  borderRadius: '12px',
                  color: '#fff',
                }}
              />
              <Legend />
              <Bar dataKey="sales" fill="#16503b" radius={[8, 8, 0, 0]} name="Actual Sales ($)" />
              <Bar dataKey="target" fill="#f59e0b" radius={[8, 8, 0, 0]} name="Target ($)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboardHomePage;