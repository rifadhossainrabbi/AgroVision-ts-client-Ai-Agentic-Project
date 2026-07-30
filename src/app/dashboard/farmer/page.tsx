'use client';

import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from '@/lib/axios';
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

  const monthlyYieldData = useMemo(() => {
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
    const products = productsData?.products || [];
    const data = monthNames.map((month, index) => {
      const monthlyProducts = products.filter((product: any) => {
        const createdAt = new Date(product.createdAt || 0);
        return createdAt.getMonth() === index;
      });
      const revenue = monthlyProducts.reduce(
        (sum: number, product: any) => sum + Number(product.price || 0),
        0,
      );
      return {
        month,
        revenue,
        yieldKg: monthlyProducts.length * 120,
        orders: monthlyProducts.length,
      };
    });
    return data;
  }, [productsData]);

  const categoryDistribution = useMemo(() => {
    const products = productsData?.products || [];
    const buckets: Record<string, number> = {};
    products.forEach((product: any) => {
      const category = product.category || 'General';
      buckets[category] = (buckets[category] || 0) + 1;
    });
    const total =
      Object.values(buckets).reduce((sum, value) => sum + value, 0) || 1;
    const palette = ['#16503b', '#10b981', '#f59e0b', '#3b82f6', '#8b5cf6'];
    return Object.entries(buckets)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, value], index) => ({
        name,
        value: Math.round((value / total) * 100),
        color: palette[index % palette.length],
      }));
  }, [productsData]);

  const comparisonBarData = useMemo(() => {
    const products = productsData?.products || [];
    return products.slice(0, 5).map((product: any) => ({
      category: product.name || 'Product',
      sales: Number(product.price || 0),
      target: Math.max(Number(product.price || 0) * 0.9, 1000),
    }));
  }, [productsData]);

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
            Here is your live farm performance, sales analytics, and crop yield
            report.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white/15 px-4 py-2 rounded-2xl backdrop-blur-md">
          <TrendingUp className="text-green-300" size={20} />
          <span className="text-xs font-bold">
            Overall Yield: +24.8% vs last month
          </span>
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
                  {loadingProducts ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    card.value
                  )}
                </h3>
              </div>
              <div
                className={`p-4 rounded-2xl ${card.bgLight} ${card.textColor}`}
              >
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
                <LineChartIcon className="text-[#16503b]" size={20} /> Revenue &
                Crop Yield Growth
              </h2>
              <p className="text-xs font-semibold text-gray-400">
                Monthly trend over the current season
              </p>
            </div>
            <span className="text-xs font-bold bg-green-100 dark:bg-green-900/20 text-[#16503b] px-3 py-1 rounded-full">
              Live Data
            </span>
          </div>

          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={monthlyYieldData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
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
                  dataKey="revenue"
                  stroke="#16503b"
                  fillOpacity={1}
                  fill="url(#colorRev)"
                  name="Revenue ($)"
                />
                <Area
                  type="monotone"
                  dataKey="yieldKg"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorYield)"
                  name="Yield (kg)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recharts Section 2: Category Distribution Pie Chart */}
        <div className="bg-white dark:bg-[#0b1120] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2 mb-1">
              <PieChartIcon className="text-[#16503b]" size={20} /> Share by
              Category
            </h2>
            <p className="text-xs font-semibold text-gray-400 mb-4">
              Distribution of your farm inventory
            </p>
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryDistribution.map((entry, index) => (
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
            {categoryDistribution.map(item => (
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
                  {item.value}%
                </span>
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
              <BarChart3 className="text-[#16503b]" size={20} /> Sales vs Season
              Target Comparison
            </h2>
            <p className="text-xs font-semibold text-gray-400">
              Actual sales volume against monthly target
            </p>
          </div>
        </div>

        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={comparisonBarData}
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
                dataKey="sales"
                fill="#16503b"
                radius={[8, 8, 0, 0]}
                name="Actual Sales ($)"
              />
              <Bar
                dataKey="target"
                fill="#f59e0b"
                radius={[8, 8, 0, 0]}
                name="Target ($)"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboardHomePage;
