'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ArrowLeft, Clock3, Loader2, Stethoscope } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

const DiagnosisDetailPage = () => {
  const params = useParams();
  const diagnosisId = params?.id as string;
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;

  const { data, isLoading } = useQuery({
    queryKey: ['diagnosis-detail', userId, diagnosisId],
    queryFn: async () => {
      if (!userId) return { diagnoses: [] };
      const res = await axios.get(
        `http://localhost:5000/api/ai/diagnoses/${userId}`,
      );
      return res.data;
    },
    enabled: !!userId && !!diagnosisId,
  });

  const diagnosis = (data?.diagnoses || []).find(
    (item: any) => item._id === diagnosisId,
  );

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-[#16503b]" size={36} />
      </div>
    );
  }

  if (!diagnosis) {
    return (
      <div className="mx-auto max-w-3xl rounded-[2.5rem] border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <Stethoscope className="mx-auto text-gray-400" size={40} />
        <h1 className="mt-4 text-2xl font-black text-gray-900 dark:text-white">
          Diagnosis not found
        </h1>
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
          The requested analysis could not be loaded.
        </p>
        <Link
          href="/dashboard/farmer/history"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#16503b] px-5 py-3 text-sm font-black text-white"
        >
          <ArrowLeft size={14} /> Back to history
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-8">
      <Link
        href="/dashboard/farmer/history"
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#16503b]"
      >
        <ArrowLeft size={14} /> Back to history
      </Link>

      <div className="mt-6 overflow-hidden rounded-[2.5rem] border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <img
          src={diagnosis.imageUrl}
          alt="Crop diagnosis"
          className="h-80 w-full object-cover"
        />
        <div className="p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#16503b] dark:text-green-400">
                AI crop doctor
              </p>
              <h1 className="mt-2 text-3xl font-black text-gray-900 dark:text-white">
                {diagnosis.analysis.cropIdentified}
              </h1>
            </div>
            <div className="rounded-full bg-[#16503b]/10 px-4 py-2 text-sm font-black text-[#16503b] dark:text-green-400">
              {diagnosis.analysis.severity}
            </div>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl bg-gray-50 p-6 dark:bg-gray-950">
              <h2 className="text-lg font-black text-gray-900 dark:text-white">
                Diagnosis summary
              </h2>
              <p className="mt-4 text-sm leading-8 text-gray-600 dark:text-gray-400">
                {diagnosis.analysis.diagnosis}
              </p>
            </div>
            <div className="space-y-4 rounded-3xl bg-gray-50 p-6 dark:bg-gray-950">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-400">
                <Clock3 size={16} />{' '}
                {new Date(diagnosis.createdAt).toLocaleString()}
              </div>
              <div className="rounded-2xl border border-gray-200 p-4 dark:border-gray-800">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
                  Confidence
                </p>
                <p className="mt-2 text-3xl font-black text-gray-900 dark:text-white">
                  {diagnosis.analysis.confidencePercent}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosisDetailPage;
