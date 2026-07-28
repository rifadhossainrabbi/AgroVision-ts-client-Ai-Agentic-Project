'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Settings, Save, Shield, Database, Cpu, Bell, Lock } from 'lucide-react';
import AuthGuard from '@/components/shared/AuthGuard';

const AdminSettingsPage = () => {
  const [autoApprove, setAutoApprove] = useState(false);
  const [aiModelProvider, setAiModelProvider] = useState('Grok / Llama-3.3');
  const [maxListingLimit, setMaxListingLimit] = useState(50);
  const [emailAlerts, setEmailAlerts] = useState(true);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Admin platform settings updated successfully!');
  };

  return (
    <AuthGuard requireAdmin>
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-slate-800 p-8 rounded-3xl text-white shadow-xl flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Settings className="text-emerald-400" size={20} />
              <span className="text-xs font-black tracking-widest uppercase bg-white/10 px-3 py-1 rounded-full text-emerald-300">
                Control Panel
              </span>
            </div>
            <h1 className="text-3xl font-black mt-2">Platform Global Settings</h1>
            <p className="text-gray-300 text-sm mt-1">
              Configure marketplace rules, AI engine defaults, and system notifications.
            </p>
          </div>
        </div>

        {/* Settings Form */}
        <form onSubmit={handleSaveSettings} className="space-y-6">
          {/* Marketplace Rules */}
          <div className="bg-white dark:bg-[#0b1120] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 space-y-4">
            <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
              <Shield className="text-[#16503b]" size={20} /> Listing & Approval Rules
            </h2>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#1e293b] rounded-2xl">
              <div>
                <p className="font-bold text-sm text-gray-900 dark:text-white">
                  Automatic Product Approval
                </p>
                <p className="text-xs text-gray-400">
                  Automatically set new farmer listings to 'active' without manual admin review.
                </p>
              </div>
              <input
                type="checkbox"
                checked={autoApprove}
                onChange={e => setAutoApprove(e.target.checked)}
                className="w-5 h-5 accent-[#16503b] cursor-pointer"
              />
            </div>

            <div className="p-4 bg-gray-50 dark:bg-[#1e293b] rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <p className="font-bold text-sm text-gray-900 dark:text-white">Max Items Per Seller</p>
                <p className="text-xs text-gray-400">Maximum active products allowed per farmer user.</p>
              </div>
              <input
                type="number"
                value={maxListingLimit}
                onChange={e => setMaxListingLimit(Number(e.target.value))}
                className="w-24 px-3 py-1.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm font-bold"
              />
            </div>
          </div>

          {/* AI Provider Config */}
          <div className="bg-white dark:bg-[#0b1120] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 space-y-4">
            <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
              <Cpu className="text-[#16503b]" size={20} /> AI Agentic Intelligence Provider
            </h2>
            <div className="p-4 bg-gray-50 dark:bg-[#1e293b] rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <p className="font-bold text-sm text-gray-900 dark:text-white">Primary LLM Provider</p>
                <p className="text-xs text-gray-400">Engine used for AI Chat Assistant and Description Generator.</p>
              </div>
              <select
                value={aiModelProvider}
                onChange={e => setAiModelProvider(e.target.value)}
                className="px-4 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs font-bold"
              >
                <option value="Grok / Llama-3.3">Groq (Llama 3.3 70B Versatile)</option>
                <option value="Google Gemini 1.5">Google Gemini 1.5 Flash</option>
              </select>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white dark:bg-[#0b1120] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 space-y-4">
            <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
              <Bell className="text-[#16503b]" size={20} /> Admin Email Notifications
            </h2>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#1e293b] rounded-2xl">
              <div>
                <p className="font-bold text-sm text-gray-900 dark:text-white">New Pending Listing Alerts</p>
                <p className="text-xs text-gray-400">Receive an email when a farmer submits a new product for approval.</p>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={e => setEmailAlerts(e.target.checked)}
                className="w-5 h-5 accent-[#16503b] cursor-pointer"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-8 py-3.5 bg-[#16503b] text-white font-black uppercase text-xs rounded-xl hover:bg-[#1a6b4f] transition-all flex items-center gap-2 shadow-lg shadow-green-900/10 cursor-pointer"
            >
              <Save size={16} /> Save Settings
            </button>
          </div>
        </form>
      </div>
    </AuthGuard>
  );
};

export default AdminSettingsPage;
