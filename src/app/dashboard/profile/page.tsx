'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { authClient } from '@/lib/auth-client';
import toast from 'react-hot-toast';
import {
  UserCircle,
  Mail,
  Calendar,
  Shield,
  User,
  Save,
  Loader2,
  KeyRound,
  ImageIcon,
  Eye,
  EyeOff,
  Check,
} from 'lucide-react';
import AuthGuard from '@/components/shared/AuthGuard';

const ProfilePage = () => {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user as any;

  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password strength and requirements (live)
  const strength = useMemo(() => {
    let score = 0;
    if (newPassword.length >= 8) score++;
    if (/[A-Z]/.test(newPassword)) score++;
    if (/[0-9]/.test(newPassword)) score++;
    if (/[^A-Za-z0-9]/.test(newPassword)) score++;
    return score;
  }, [newPassword]);

  const strengthColor = [
    'bg-gray-200',
    'bg-red-500',
    'bg-yellow-500',
    'bg-blue-500',
    'bg-green-500',
  ][strength];
  const strengthText = ['None', 'Weak', 'Fair', 'Good', 'Strong'][strength];

  // Pre-fill form once session data is available
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setImage(user.image || '');
    }
  }, [user?.name, user?.image]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }
    setIsSavingProfile(true);
    try {
      await authClient.updateUser({
        name: name.trim(),
        image: image.trim() || undefined,
      });
      toast.success('Profile updated successfully!');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update profile');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error('Please fill in both password fields');
      return;
    }
    // Enforce the same password rules as register
    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }
    if (!/[A-Z]/.test(newPassword)) {
      toast.error('New password must include at least one uppercase letter');
      return;
    }
    if (!/[0-9]/.test(newPassword)) {
      toast.error('New password must include at least one number');
      return;
    }
    if (!/[^A-Za-z0-9]/.test(newPassword)) {
      toast.error('New password must include at least one special character');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New password and confirmation do not match');
      return;
    }
    setIsSavingPassword(true);
    try {
      const { error } = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });

      if (!error) {
        toast.success('Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        return;
      }

      // Fallback: some auth handlers expect different field names (oldPassword, password)
      // Try direct POST to the Next.js auth route with several common payload shapes.
      const tries = [
        { currentPassword, newPassword, revokeOtherSessions: true },
        {
          oldPassword: currentPassword,
          newPassword,
          revokeOtherSessions: true,
        },
        {
          oldPassword: currentPassword,
          password: newPassword,
          revokeOtherSessions: true,
        },
      ];

      let success = false;
      for (const body of tries) {
        try {
          const res = await fetch('/api/auth/change-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(body),
          });
          if (res.ok) {
            success = true;
            break;
          }
        } catch {
          // ignore and try next
        }
      }

      if (success) {
        toast.success('Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error(error?.message || 'Failed to change password');
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Failed to change password';
      toast.error(msg);
    } finally {
      setIsSavingPassword(false);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#16503b]" size={40} />
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-slate-800 p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center font-black text-3xl overflow-hidden shrink-0 ring-2 ring-white/20">
            {user?.image ? (
              <img
                src={user.image}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              user?.name?.charAt(0) || 'U'
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-black">{user?.name}</h1>
              <span
                className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase px-3 py-1 rounded-full ${
                  user?.role === 'admin'
                    ? 'bg-purple-500/20 text-purple-300'
                    : 'bg-green-500/20 text-green-300'
                }`}
              >
                {user?.role === 'admin' ? (
                  <Shield size={12} />
                ) : (
                  <User size={12} />
                )}
                {user?.role || 'user'}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-300">
              <span className="flex items-center gap-1.5">
                <Mail size={14} /> {user?.email}
              </span>
              {user?.createdAt && (
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  Joined {new Date(user.createdAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Edit Profile Form */}
        <form
          onSubmit={handleProfileSave}
          className="bg-white dark:bg-[#0b1120] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 space-y-5"
        >
          <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
            <UserCircle className="text-[#16503b]" size={20} /> Edit Profile
          </h2>

          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your full name"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#1e293b] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 outline-none text-sm font-semibold focus:ring-2 focus:ring-[#16503b]/30"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
              Avatar Image URL
            </label>
            <div className="relative">
              <ImageIcon
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="url"
                value={image}
                onChange={e => setImage(e.target.value)}
                placeholder="https://example.com/your-photo.jpg"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-[#1e293b] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 outline-none text-sm font-semibold focus:ring-2 focus:ring-[#16503b]/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-900 text-gray-400 border border-gray-200 dark:border-gray-800 outline-none text-sm font-semibold cursor-not-allowed"
            />
          </div>

          {/* Strength Meter */}
          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-tight">
                Strength
              </span>
              <span
                className={`text-xs font-bold uppercase ${strength > 2 ? 'text-green-500' : 'text-red-400'}`}
              >
                {strengthText}
              </span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mb-3 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${strengthColor}`}
                style={{ width: `${(strength / 4) * 100}%` }}
              ></div>
            </div>
            <div className="grid grid-cols-2 gap-y-2">
              <ReqItem label="8+ Characters" met={newPassword.length >= 8} />
              <ReqItem label="1 Number" met={/[0-9]/.test(newPassword)} />
              <ReqItem
                label="1 Special"
                met={/[^A-Za-z0-9]/.test(newPassword)}
              />
              <ReqItem label="Uppercase" met={/[A-Z]/.test(newPassword)} />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSavingProfile}
              className="px-8 py-3.5 bg-[#16503b] text-white font-black uppercase text-xs rounded-xl hover:bg-[#1a6b4f] transition-all flex items-center gap-2 shadow-lg shadow-green-900/10 cursor-pointer disabled:opacity-50"
            >
              {isSavingProfile ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              Save Changes
            </button>
          </div>
        </form>

        {/* Change Password Form */}
        <form
          onSubmit={handlePasswordSave}
          className="bg-white dark:bg-[#0b1120] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 space-y-5"
        >
          <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
            <KeyRound className="text-[#16503b]" size={20} /> Change Password
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-gray-50 dark:bg-[#1e293b] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 outline-none text-sm font-semibold focus:ring-2 focus:ring-[#16503b]/30"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#16503b]"
                >
                  {showCurrentPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-gray-50 dark:bg-[#1e293b] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 outline-none text-sm font-semibold focus:ring-2 focus:ring-[#16503b]/30"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#16503b]"
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-gray-50 dark:bg-[#1e293b] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 outline-none text-sm font-semibold focus:ring-2 focus:ring-[#16503b]/30"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#16503b]"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSavingPassword}
              className="px-8 py-3.5 bg-gray-900 dark:bg-white dark:text-gray-900 text-white font-black uppercase text-xs rounded-xl hover:opacity-90 transition-all flex items-center gap-2 shadow-lg cursor-pointer disabled:opacity-50"
            >
              {isSavingPassword ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <KeyRound size={16} />
              )}
              Update Password
            </button>
          </div>
        </form>
      </div>
    </AuthGuard>
  );
};

const ReqItem = ({ label, met }: { label: string; met: boolean }) => (
  <div
    className={`flex items-center gap-2 text-[10px] font-bold uppercase transition-colors duration-300 ${
      met ? 'text-green-600 dark:text-green-400' : 'text-gray-400'
    }`}
  >
    <div
      className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
        met
          ? 'bg-green-100 dark:bg-green-900/30 border-green-500'
          : 'border-gray-200 dark:border-gray-700'
      }`}
    >
      <Check size={10} className={met ? 'opacity-100' : 'opacity-0'} />
    </div>{' '}
    {label}
  </div>
);

export default ProfilePage;
