'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart as LineChartIcon,
  Sparkles,
  Loader2,
  Gauge,
  Wallet,
  Sprout,
  AlertTriangle,
  Droplets,
  CalendarClock,
  TrendingUp,
  ListChecks,
  Clock3,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { authClient } from '@/lib/auth-client';

import { API_BASE_URL } from '@/lib/config';

const API_BASE = API_BASE_URL;

const SOIL_TYPES = ['Loamy', 'Clay', 'Sandy', 'Silty', 'Peaty', 'Chalky'];
const SEASONS = [
  'Kharif (Monsoon)',
  'Rabi (Winter)',
  'Zaid (Summer)',
  'Year-round',
];
const IRRIGATION_TYPES = [
  'Rain-fed',
  'Drip Irrigation',
  'Sprinkler',
  'Flood Irrigation',
  'Canal',
  'Tube Well',
];
const FARMING_TYPES = ['Conventional', 'Organic', 'Mixed'];
const EXPERIENCE_LEVELS = [
  'Beginner (0-2 yrs)',
  'Intermediate (3-8 yrs)',
  'Expert (9+ yrs)',
];
const LAND_UNITS = ['acres', 'hectares', 'bigha', 'katha'];

type FarmAnalysis = {
  _id: string;
  createdAt: string;
  analysis: {
    suitabilityScore: number;
    summary: string;
    estimatedYield: { min: number; max: number; unit: string };
    estimatedROI: { min: number; max: number; currency: string };
    riskFactors: {
      risk: string;
      level: 'Low' | 'Medium' | 'High';
      mitigation: string;
    }[];
    recommendedCrops: {
      name: string;
      suitabilityPercent: number;
      reason: string;
    }[];
    fertilizerPlan: { name: string; purpose: string; timing: string }[];
    irrigationAdvice: string;
    timeline: { phase: string; durationWeeks: number; tasks: string[] }[];
    marketInsight: string;
  };
};

const RISK_COLORS: Record<string, string> = {
  Low: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  Medium:
    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  High: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const BAR_COLORS = ['#16503b', '#10b981', '#f59e0b', '#3b82f6'];

const FarmAnalyzerPage = () => {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    cropType: '',
    soilType: SOIL_TYPES[0],
    landSize: '',
    landUnit: LAND_UNITS[0],
    location: '',
    season: SEASONS[0],
    budget: '',
    irrigationType: IRRIGATION_TYPES[0],
    farmingType: FARMING_TYPES[0],
    experience: EXPERIENCE_LEVELS[0],
  });

  const [result, setResult] = useState<FarmAnalysis | null>(null);

  const { data: recentData } = useQuery({
    queryKey: ['farm-analyses', userId],
    queryFn: async () => {
      if (!userId) return { analyses: [] };
      const res = await axios.get(`${API_BASE}/ai/farm-analyses/${userId}`);
      return res.data;
    },
    enabled: !!userId,
  });

  const analyzeMutation = useMutation({
    mutationFn: async () => {
      if (!form.cropType || !form.soilType || !form.landSize) {
        throw new Error('Crop type, soil type and land size are required');
      }
      const res = await axios.post(`${API_BASE}/ai/farm-analyzer`, {
        ...form,
        userId: userId || 'anonymous',
      });
      return res.data;
    },
    onSuccess: data => {
      if (data?.success) {
        setResult(data.analysis);
        queryClient.invalidateQueries({ queryKey: ['farm-analyses', userId] });
        toast.success('📊 Farm analysis ready!');
      } else {
        toast.error(data?.error || 'Analysis failed');
      }
    },
    onError: (err: any) =>
      toast.error(
        err.response?.data?.error || err.message || 'Analysis failed',
      ),
  });

  const analysis = result?.analysis;
  const recentAnalyses: FarmAnalysis[] = recentData?.analyses || [];

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#16503b] to-[#1e6b4f] p-8 rounded-3xl text-white shadow-xl">
        <span className="text-xs font-black tracking-widest uppercase bg-white/20 px-3 py-1 rounded-full flex items-center gap-1.5 w-fit">
          <LineChartIcon size={12} /> AI Farm Analyzer
        </span>
        <h1 className="text-3xl font-black mt-2">
          Plan Smarter, Harvest Better
        </h1>
        <p className="text-green-100 text-sm mt-1 max-w-2xl">
          Enter your farm plan and AgroAnalyst AI will estimate yield, ROI,
          risks, and give you a season-ready action plan grounded in your own
          listing history.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Form Panel */}
        <div className="xl:col-span-1 bg-white dark:bg-[#0b1120] p-6 md:p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-5 h-fit">
          <h2 className="text-lg font-black text-[#16503b] dark:text-green-500 uppercase flex items-center gap-2 italic">
            <Sprout size={20} /> Farm Plan Details
          </h2>

          <Field label="Crop Type *">
            <input
              value={form.cropType}
              onChange={e => setForm({ ...form, cropType: e.target.value })}
              placeholder="e.g. Rice, Wheat, Tomato..."
              className={inputClass}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Soil Type *">
              <select
                value={form.soilType}
                onChange={e => setForm({ ...form, soilType: e.target.value })}
                className={selectClass}
              >
                {SOIL_TYPES.map(s => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>
            <Field label="Season">
              <select
                value={form.season}
                onChange={e => setForm({ ...form, season: e.target.value })}
                className={selectClass}
              >
                {SEASONS.map(s => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Land Size *">
              <input
                type="number"
                min={0}
                value={form.landSize}
                onChange={e => setForm({ ...form, landSize: e.target.value })}
                placeholder="e.g. 5"
                className={inputClass}
              />
            </Field>
            <Field label="Unit">
              <select
                value={form.landUnit}
                onChange={e => setForm({ ...form, landUnit: e.target.value })}
                className={selectClass}
              >
                {LAND_UNITS.map(u => (
                  <option key={u}>{u}</option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Location">
            <input
              value={form.location}
              onChange={e => setForm({ ...form, location: e.target.value })}
              placeholder="e.g. Rangpur, Bangladesh"
              className={inputClass}
            />
          </Field>

          <Field label="Budget (optional)">
            <input
              value={form.budget}
              onChange={e => setForm({ ...form, budget: e.target.value })}
              placeholder="e.g. 50000 BDT"
              className={inputClass}
            />
          </Field>

          <Field label="Irrigation Type">
            <select
              value={form.irrigationType}
              onChange={e =>
                setForm({ ...form, irrigationType: e.target.value })
              }
              className={selectClass}
            >
              {IRRIGATION_TYPES.map(i => (
                <option key={i}>{i}</option>
              ))}
            </select>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Farming Type">
              <select
                value={form.farmingType}
                onChange={e =>
                  setForm({ ...form, farmingType: e.target.value })
                }
                className={selectClass}
              >
                {FARMING_TYPES.map(f => (
                  <option key={f}>{f}</option>
                ))}
              </select>
            </Field>
            <Field label="Experience">
              <select
                value={form.experience}
                onChange={e => setForm({ ...form, experience: e.target.value })}
                className={selectClass}
              >
                {EXPERIENCE_LEVELS.map(e => (
                  <option key={e}>{e}</option>
                ))}
              </select>
            </Field>
          </div>

          <button
            onClick={() => analyzeMutation.mutate()}
            disabled={analyzeMutation.isPending}
            className="w-full flex items-center justify-center gap-2 bg-[#16503b] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-green-900/20 disabled:opacity-50 active:scale-95 transition-all cursor-pointer"
          >
            {analyzeMutation.isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Analyzing Farm
                Plan...
              </>
            ) : (
              <>
                <Sparkles size={16} /> Run AI Analysis
              </>
            )}
          </button>

          {/* Recent Analyses */}
          {recentAnalyses.length > 0 && (
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                <Clock3 size={12} /> Recent Analyses
              </h3>
              {recentAnalyses.slice(0, 4).map(a => (
                <button
                  key={a._id}
                  onClick={() => setResult(a)}
                  className="w-full text-left px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-between"
                >
                  <span className="text-xs font-bold text-gray-600 dark:text-gray-300 truncate">
                    {a.analysis.summary.slice(0, 36)}...
                  </span>
                  <span className="text-[10px] font-black text-[#16503b] dark:text-green-500 flex-shrink-0 ml-2">
                    {a.analysis.suitabilityScore}%
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Result Panel */}
        <div className="xl:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            {!analysis && !analyzeMutation.isPending && (
              <div className="bg-white dark:bg-[#0b1120] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm h-[500px] flex flex-col items-center justify-center text-center text-gray-400 gap-3">
                <LineChartIcon size={40} className="opacity-30" />
                <p className="text-sm font-semibold max-w-xs">
                  Fill in your farm plan and run the analysis to see yield, ROI,
                  risks and a full action plan.
                </p>
              </div>
            )}

            {analyzeMutation.isPending && (
              <div className="bg-white dark:bg-[#0b1120] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm h-[500px] flex flex-col items-center justify-center text-center gap-3">
                <Loader2 size={36} className="animate-spin text-[#16503b]" />
                <p className="text-sm font-bold text-gray-500">
                  AgroAnalyst AI is crunching the numbers...
                </p>
              </div>
            )}

            {analysis && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <StatCard
                    icon={<Gauge size={20} />}
                    label="Suitability Score"
                    value={`${analysis.suitabilityScore}%`}
                    color="text-[#16503b] dark:text-green-500"
                    bg="bg-green-50 dark:bg-green-900/10"
                  />
                  <StatCard
                    icon={<TrendingUp size={20} />}
                    label="Estimated Yield"
                    value={`${analysis.estimatedYield.min}-${analysis.estimatedYield.max} ${analysis.estimatedYield.unit}`}
                    color="text-blue-600 dark:text-blue-400"
                    bg="bg-blue-50 dark:bg-blue-900/10"
                  />
                  <StatCard
                    icon={<Wallet size={20} />}
                    label="Estimated ROI"
                    value={`${analysis.estimatedROI.min}-${analysis.estimatedROI.max} ${analysis.estimatedROI.currency}`}
                    color="text-amber-600 dark:text-amber-400"
                    bg="bg-amber-50 dark:bg-amber-900/10"
                  />
                </div>

                <p className="bg-white dark:bg-[#0b1120] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 text-sm text-gray-600 dark:text-gray-300 leading-relaxed shadow-sm">
                  {analysis.summary}
                </p>

                {/* Recommended Crops Chart */}
                {analysis.recommendedCrops?.length > 0 && (
                  <div className="bg-white dark:bg-[#0b1120] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                    <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Sprout
                        size={16}
                        className="text-[#16503b] dark:text-green-500"
                      />{' '}
                      Recommended Crops
                    </h3>
                    <div className="h-[220px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={analysis.recommendedCrops}
                          margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                          <XAxis
                            dataKey="name"
                            tick={{ fontSize: 11, fill: '#888' }}
                          />
                          <YAxis
                            tick={{ fontSize: 11, fill: '#888' }}
                            unit="%"
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#111827',
                              borderRadius: '12px',
                              color: '#fff',
                              border: 'none',
                            }}
                          />
                          <Bar
                            dataKey="suitabilityPercent"
                            radius={[8, 8, 0, 0]}
                            name="Suitability %"
                          >
                            {analysis.recommendedCrops.map((_, idx) => (
                              <Cell
                                key={idx}
                                fill={BAR_COLORS[idx % BAR_COLORS.length]}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-2 mt-4">
                      {analysis.recommendedCrops.map((c, idx) => (
                        <div
                          key={idx}
                          className="text-xs text-gray-500 dark:text-gray-400 flex gap-1.5"
                        >
                          <span className="font-black text-gray-800 dark:text-gray-200">
                            {c.name}:
                          </span>
                          {c.reason}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Risk Factors */}
                {analysis.riskFactors?.length > 0 && (
                  <div className="bg-white dark:bg-[#0b1120] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-3">
                    <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider mb-1 flex items-center gap-2">
                      <AlertTriangle size={16} className="text-amber-500" />{' '}
                      Risk Factors
                    </h3>
                    {analysis.riskFactors.map((r, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-900"
                      >
                        <span
                          className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full w-fit ${RISK_COLORS[r.level]}`}
                        >
                          {r.level}
                        </span>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                            {r.risk}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {r.mitigation}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Fertilizer Plan */}
                  {analysis.fertilizerPlan?.length > 0 && (
                    <div className="bg-white dark:bg-[#0b1120] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                      <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                        <ListChecks
                          size={16}
                          className="text-[#16503b] dark:text-green-500"
                        />{' '}
                        Fertilizer Plan
                      </h3>
                      <div className="space-y-2.5">
                        {analysis.fertilizerPlan.map((f, idx) => (
                          <div
                            key={idx}
                            className="text-xs border-b border-gray-100 dark:border-gray-800 pb-2 last:border-0"
                          >
                            <p className="font-black text-gray-800 dark:text-gray-200">
                              {f.name}
                            </p>
                            <p className="text-gray-500 dark:text-gray-400">
                              {f.purpose} · {f.timing}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Irrigation Advice */}
                  <div className="bg-white dark:bg-[#0b1120] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                    <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Droplets size={16} className="text-blue-500" />{' '}
                      Irrigation Advice
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                      {analysis.irrigationAdvice}
                    </p>
                  </div>
                </div>

                {/* Timeline */}
                {analysis.timeline?.length > 0 && (
                  <div className="bg-white dark:bg-[#0b1120] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                    <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                      <CalendarClock
                        size={16}
                        className="text-[#16503b] dark:text-green-500"
                      />{' '}
                      Season Timeline
                    </h3>
                    <div className="space-y-4">
                      {analysis.timeline.map((t, idx) => (
                        <div key={idx} className="flex gap-4">
                          <div className="flex flex-col items-center flex-shrink-0">
                            <div className="w-8 h-8 rounded-full bg-[#16503b] text-white flex items-center justify-center text-xs font-black">
                              {idx + 1}
                            </div>
                            {idx < analysis.timeline.length - 1 && (
                              <div className="w-0.5 flex-1 bg-gray-200 dark:bg-gray-800 mt-1" />
                            )}
                          </div>
                          <div className="pb-4">
                            <p className="text-sm font-black text-gray-800 dark:text-gray-200">
                              {t.phase}{' '}
                              <span className="text-gray-400 font-semibold">
                                · {t.durationWeeks} wks
                              </span>
                            </p>
                            <ul className="mt-1 space-y-0.5">
                              {t.tasks.map((task, i2) => (
                                <li
                                  key={i2}
                                  className="text-xs text-gray-500 dark:text-gray-400"
                                >
                                  • {task}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Market Insight */}
                <div className="bg-gradient-to-r from-[#16503b]/5 to-transparent dark:from-green-900/10 p-6 rounded-3xl border border-[#16503b]/10 dark:border-green-900/20">
                  <h3 className="text-sm font-black text-[#16503b] dark:text-green-500 uppercase tracking-wider mb-2">
                    Market Insight
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    {analysis.marketInsight}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const inputClass =
  'w-full p-3.5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 dark:text-white font-semibold text-sm outline-none focus:border-[#16503b] shadow-inner';
const selectClass =
  'w-full p-3.5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 dark:text-white font-semibold text-sm outline-none focus:border-[#16503b] shadow-inner cursor-pointer';

const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div>
    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
      {label}
    </label>
    <div className="mt-1.5">{children}</div>
  </div>
);

const StatCard = ({
  icon,
  label,
  value,
  color,
  bg,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  bg: string;
}) => (
  <div className="bg-white dark:bg-[#0b1120] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
    <div
      className={`w-10 h-10 rounded-xl ${bg} ${color} flex items-center justify-center mb-3`}
    >
      {icon}
    </div>
    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
      {label}
    </p>
    <p className={`text-lg font-black mt-0.5 ${color}`}>{value}</p>
  </div>
);

export default FarmAnalyzerPage;
