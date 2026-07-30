'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  History,
  Stethoscope,
  Trash2,
  Loader2,
  PlusCircle,
  Clock,
} from 'lucide-react';
import { authClient } from '@/lib/auth-client';

import axios from '@/lib/axios';

const SEVERITY_STYLES: Record<string, string> = {
  Healthy:
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  Low: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  Moderate:
    'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  High: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

type Diagnosis = {
  _id: string;
  imageUrl: string;
  createdAt: string;
  analysis: {
    cropIdentified: string;
    diagnosis: string;
    severity: 'Healthy' | 'Low' | 'Moderate' | 'High';
    confidencePercent: number;
  };
};

const DiagnosisHistoryPage = () => {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['diagnosis-history', userId],
    queryFn: async () => {
      if (!userId) return { diagnoses: [] };
      const res = await axios.get(`/ai/diagnoses/${userId}`);
      return res.data;
    },
    enabled: !!userId,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return (await axios.delete(`/ai/diagnoses/${id}`)).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['diagnosis-history', userId],
      });
      toast.success('Diagnosis removed');
    },
    onError: () => toast.error('Failed to delete diagnosis'),
  });

  const diagnoses: Diagnosis[] = data?.diagnoses || [];

  return (
    <div className="space-y-8 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#16503b] to-[#1e6b4f] p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-black tracking-widest uppercase bg-white/20 px-3 py-1 rounded-full flex items-center gap-1.5 w-fit">
            <History size={12} /> Diagnosis History
          </span>
          <h1 className="text-3xl font-black mt-2">
            Your Crop Health Timeline
          </h1>
          <p className="text-green-100 text-sm mt-1">
            Every AI Crop Doctor diagnosis you've run, saved for reference.
          </p>
        </div>
        <Link
          href="/dashboard/farmer/crop-doctor"
          className="flex items-center gap-2 bg-white/15 hover:bg-white/25 px-4 py-2.5 rounded-2xl backdrop-blur-md text-xs font-bold uppercase tracking-widest transition-colors"
        >
          <PlusCircle size={16} /> New Diagnosis
        </Link>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center h-64 text-gray-400">
          <Loader2 size={32} className="animate-spin" />
        </div>
      )}

      {!isLoading && diagnoses.length === 0 && (
        <div className="bg-white dark:bg-[#0b1120] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm h-64 flex flex-col items-center justify-center text-center gap-3">
          <Stethoscope size={36} className="text-gray-300 dark:text-gray-700" />
          <p className="text-sm font-semibold text-gray-400 max-w-xs">
            No diagnoses yet. Upload a crop photo to get your first AI health
            report.
          </p>
          <Link
            href="/dashboard/farmer/crop-doctor"
            className="mt-2 flex items-center gap-2 bg-[#16503b] text-white px-6 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg cursor-pointer"
          >
            <Sparkle /> Diagnose a Crop
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {diagnoses.map(d => (
          <div
            key={d._id}
            className="bg-white dark:bg-[#0b1120] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden group"
          >
            <div className="relative h-40 bg-gray-100 dark:bg-gray-900">
              {d.imageUrl ? (
                <Link href={`/dashboard/farmer/history/${d._id}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={d.imageUrl}
                    alt={d.analysis.cropIdentified}
                    className="w-full h-full object-cover"
                  />
                </Link>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <Stethoscope size={32} />
                </div>
              )}
              <span
                className={`absolute top-3 left-3 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                  SEVERITY_STYLES[d.analysis.severity] ||
                  SEVERITY_STYLES.Moderate
                }`}
              >
                {d.analysis.severity}
              </span>
              <button
                onClick={() => deleteMutation.mutate(d._id)}
                disabled={deleteMutation.isPending}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 cursor-pointer"
              >
                <Trash2 size={14} />
              </button>
            </div>
            <div className="p-5 space-y-2">
              <Link
                href={`/dashboard/farmer/history/${d._id}`}
                className="text-base font-black text-gray-900 hover:text-[#16503b] dark:text-white dark:hover:text-green-400"
              >
                {d.analysis.cropIdentified}
              </Link>
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                {d.analysis.diagnosis}
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                  <Clock size={11} />
                  {new Date(d.createdAt).toLocaleDateString()}
                </span>
                <span className="text-[10px] font-black text-[#16503b] dark:text-green-500">
                  {d.analysis.confidencePercent}% confidence
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Sparkle = () => <span className="text-sm">✨</span>;

export default DiagnosisHistoryPage;
