'use client';

import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Stethoscope,
  Camera,
  Upload,
  X,
  Loader2,
  Sparkles,
  Leaf,
  AlertTriangle,
  ShieldCheck,
  Sprout,
  FlaskConical,
  History,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { authClient } from '@/lib/auth-client';

const API_BASE = 'http://localhost:5000/api';

type Diagnosis = {
  _id: string;
  imageUrl: string;
  cropHint: string;
  notes: string;
  createdAt: string;
  analysis: {
    cropIdentified: string;
    isHealthy: boolean;
    diagnosis: string;
    severity: 'Healthy' | 'Low' | 'Moderate' | 'High';
    confidencePercent: number;
    symptoms: string[];
    likelyCauses: string[];
    organicTreatment: string[];
    chemicalTreatment: string[];
    preventionTips: string[];
    estimatedRecoveryTime: string;
  };
};

const SEVERITY_STYLES: Record<string, string> = {
  Healthy:
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  Low: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  Moderate:
    'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  High: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const SEVERITY_RING: Record<string, string> = {
  Healthy: 'stroke-emerald-500',
  Low: 'stroke-yellow-500',
  Moderate: 'stroke-orange-500',
  High: 'stroke-red-500',
};

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const CropDoctorPage = () => {
  const { data: session } = authClient.useSession();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [cropHint, setCropHint] = useState('');
  const [notes, setNotes] = useState('');
  const [result, setResult] = useState<Diagnosis | null>(null);

  const uploadToImgBB = async (imgFile: File) => {
    const body = new FormData();
    body.append('image', imgFile);
    const res = await axios.post(
      `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
      body,
    );
    return res.data.data.url as string;
  };

  const handleFileChange = (selected: File | null) => {
    setFile(selected);
    setResult(null);
    if (selected) {
      setPreview(URL.createObjectURL(selected));
    } else {
      setPreview(null);
    }
  };

  const diagnoseMutation = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error('Please upload a crop or plant photo first');

      const [base64, uploadedUrl] = await Promise.all([
        fileToBase64(file),
        uploadToImgBB(file),
      ]);

      const res = await axios.post(`${API_BASE}/ai/crop-doctor`, {
        imageBase64: base64,
        mimeType: file.type,
        imageUrl: uploadedUrl,
        userId: session?.user?.id || 'anonymous',
        userName: session?.user?.name || 'Anonymous',
        cropHint,
        notes,
      });
      return res.data;
    },
    onSuccess: data => {
      if (data?.success) {
        setResult(data.diagnosis);
        queryClient.invalidateQueries({ queryKey: ['diagnosis-history'] });
        toast.success('🌾 Diagnosis complete!');
      } else {
        toast.error(data?.error || 'Diagnosis failed');
      }
    },
    onError: (err: any) =>
      toast.error(
        err.response?.data?.error || err.message || 'Diagnosis failed',
      ),
  });

  const analysis = result?.analysis;

  return (
    <div className="space-y-8 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#16503b] to-[#1e6b4f] p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-black tracking-widest uppercase bg-white/20 px-3 py-1 rounded-full flex items-center gap-1.5 w-fit">
            <Stethoscope size={12} /> AI Crop Doctor
          </span>
          <h1 className="text-3xl font-black mt-2">
            Diagnose Your Crop Instantly
          </h1>
          <p className="text-green-100 text-sm mt-1">
            Upload a photo of a leaf or plant — AgroDoc AI identifies diseases,
            pests, and deficiencies with treatment steps.
          </p>
        </div>
        <Link
          href="/dashboard/farmer/history"
          className="flex items-center gap-2 bg-white/15 hover:bg-white/25 px-4 py-2.5 rounded-2xl backdrop-blur-md text-xs font-bold uppercase tracking-widest transition-colors"
        >
          <History size={16} /> Diagnosis History
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Panel */}
        <div className="bg-white dark:bg-[#0b1120] p-6 md:p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
          <h2 className="text-lg font-black text-[#16503b] dark:text-green-500 uppercase flex items-center gap-2 italic">
            <Camera size={20} /> Upload Photo
          </h2>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={e => handleFileChange(e.target.files?.[0] || null)}
            className="hidden"
          />

          {!preview ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-[2rem] p-12 text-center bg-gray-50/50 dark:bg-gray-900 hover:border-[#16503b] transition-all cursor-pointer flex flex-col items-center gap-3"
            >
              <div className="w-16 h-16 rounded-full bg-[#16503b]/10 flex items-center justify-center text-[#16503b] dark:text-green-500">
                <Upload size={26} />
              </div>
              <p className="font-bold text-gray-700 dark:text-gray-200 text-sm">
                Click to upload a crop / leaf photo
              </p>
              <p className="text-xs text-gray-400">PNG, JPG up to a few MB</p>
            </div>
          ) : (
            <div className="relative rounded-[2rem] overflow-hidden border border-gray-100 dark:border-gray-800 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Crop preview"
                className="w-full h-72 object-cover"
              />
              <button
                onClick={() => {
                  handleFileChange(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
          )}

          <div>
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
              Crop Name (optional)
            </label>
            <input
              value={cropHint}
              onChange={e => setCropHint(e.target.value)}
              placeholder="e.g. Tomato, Rice, Wheat..."
              className="w-full mt-2 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 dark:text-white font-semibold text-sm outline-none focus:border-[#16503b] shadow-inner"
            />
          </div>

          <div>
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              placeholder="Any symptoms you've noticed, when it started, weather conditions..."
              className="w-full mt-2 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 dark:text-white font-medium text-sm outline-none focus:border-[#16503b] shadow-inner resize-none"
            />
          </div>

          <button
            onClick={() => diagnoseMutation.mutate()}
            disabled={!file || diagnoseMutation.isPending}
            className="w-full flex items-center justify-center gap-2 bg-[#16503b] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-green-900/20 disabled:opacity-50 active:scale-95 transition-all cursor-pointer"
          >
            {diagnoseMutation.isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Analyzing
                Photo...
              </>
            ) : (
              <>
                <Sparkles size={16} /> Diagnose Crop
              </>
            )}
          </button>
        </div>

        {/* Result Panel */}
        <div className="bg-white dark:bg-[#0b1120] p-6 md:p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <h2 className="text-lg font-black text-[#16503b] dark:text-green-500 uppercase flex items-center gap-2 italic mb-6">
            <Leaf size={20} /> Diagnosis Report
          </h2>

          <AnimatePresence mode="wait">
            {!analysis && !diagnoseMutation.isPending && (
              <div className="h-[420px] flex flex-col items-center justify-center text-center text-gray-400 gap-3">
                <Stethoscope size={40} className="opacity-30" />
                <p className="text-sm font-semibold max-w-xs">
                  Upload a photo and click Diagnose Crop to get an instant AI
                  health report.
                </p>
              </div>
            )}

            {diagnoseMutation.isPending && (
              <div className="h-[420px] flex flex-col items-center justify-center text-center gap-3">
                <Loader2 size={36} className="animate-spin text-[#16503b]" />
                <p className="text-sm font-bold text-gray-500">
                  AgroDoc AI is examining your photo...
                </p>
              </div>
            )}

            {analysis && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Top summary */}
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <svg viewBox="0 0 80 80" className="w-20 h-20 -rotate-90">
                      <circle
                        cx="40"
                        cy="40"
                        r="34"
                        strokeWidth="8"
                        className="stroke-gray-100 dark:stroke-gray-800"
                        fill="none"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r="34"
                        strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        className={
                          SEVERITY_RING[analysis.severity] || 'stroke-[#16503b]'
                        }
                        strokeDasharray={2 * Math.PI * 34}
                        strokeDashoffset={
                          2 *
                          Math.PI *
                          34 *
                          (1 - analysis.confidencePercent / 100)
                        }
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-sm font-black text-gray-900 dark:text-white">
                      {analysis.confidencePercent}%
                    </div>
                  </div>
                  <div className="flex-1">
                    <span
                      className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                        SEVERITY_STYLES[analysis.severity] ||
                        SEVERITY_STYLES.Moderate
                      }`}
                    >
                      {analysis.severity} Severity
                    </span>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white mt-1.5">
                      {analysis.cropIdentified}
                    </h3>
                    <p className="text-xs font-semibold text-gray-400 flex items-center gap-1 mt-0.5">
                      <Clock size={12} /> Recovery:{' '}
                      {analysis.estimatedRecoveryTime}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                  {analysis.diagnosis}
                </p>

                {analysis.symptoms?.length > 0 && (
                  <ReportSection
                    icon={
                      <AlertTriangle size={16} className="text-amber-500" />
                    }
                    title="Symptoms Observed"
                    items={analysis.symptoms}
                  />
                )}

                {analysis.likelyCauses?.length > 0 && (
                  <ReportSection
                    icon={
                      <AlertTriangle size={16} className="text-orange-500" />
                    }
                    title="Likely Causes"
                    items={analysis.likelyCauses}
                  />
                )}

                {analysis.organicTreatment?.length > 0 && (
                  <ReportSection
                    icon={<Sprout size={16} className="text-emerald-500" />}
                    title="Organic Treatment"
                    items={analysis.organicTreatment}
                  />
                )}

                {analysis.chemicalTreatment?.length > 0 && (
                  <ReportSection
                    icon={<FlaskConical size={16} className="text-blue-500" />}
                    title="Chemical Treatment"
                    items={analysis.chemicalTreatment}
                  />
                )}

                {analysis.preventionTips?.length > 0 && (
                  <ReportSection
                    icon={
                      <ShieldCheck
                        size={16}
                        className="text-[#16503b] dark:text-green-500"
                      />
                    }
                    title="Prevention Tips"
                    items={analysis.preventionTips}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const ReportSection = ({
  icon,
  title,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
}) => (
  <div>
    <h4 className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-2">
      {icon} {title}
    </h4>
    <ul className="space-y-1.5">
      {items.map((item, idx) => (
        <li
          key={idx}
          className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300 font-medium"
        >
          <CheckCircle2
            size={14}
            className="text-[#16503b] dark:text-green-500 mt-0.5 flex-shrink-0"
          />
          {item}
        </li>
      ))}
    </ul>
  </div>
);

export default CropDoctorPage;
