'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import {
  Check,
  ChevronRight,
  Rocket,
  Eye,
  EyeOff,
  Loader2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const RegisterPage = () => {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    farmName: '',
    image: '',
    location: '',
    farmSize: '',
    crop: 'Corn',
    password: '',
  });

  // Handle Input Changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 1. Email Sign Up Logic
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    await authClient.signUp.email(
      {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        image: formData.image, // ইমেজ ইউআরএল এখানে যাচ্ছে
      },
      {
        onRequest: () => setLoading(true),
        onSuccess: () => {
          setLoading(false);
          router.push('/'); // একাউন্ট হলে হোম পেজে যাবে
        },
        onError: ctx => {
          setLoading(false);
          alert(ctx.error.message);
        },
      },
    );
  };

  // 2. Google Sign Up Logic
  const handleGoogleLogin = async () => {
    await authClient.signIn.social({
      provider: 'google',
      callbackURL: '/',
    });
  };

  // Password Strength Logic
  const strength = useMemo(() => {
    let score = 0;
    if (formData.password.length >= 8) score++;
    if (/[A-Z]/.test(formData.password)) score++;
    if (/[0-9]/.test(formData.password)) score++;
    if (/[^A-Za-z0-9]/.test(formData.password)) score++;
    return score;
  }, [formData.password]);

  const strengthColor = [
    'bg-gray-200',
    'bg-red-500',
    'bg-yellow-500',
    'bg-blue-500',
    'bg-green-500',
  ][strength];
  const strengthText = ['None', 'Weak', 'Fair', 'Good', 'Strong'][strength];

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 bg-[#f8faf9] dark:bg-gray-950 transition-colors duration-300">
      <div className="bg-[#e0ede6] dark:bg-green-900/30 text-[#4d7260] dark:text-green-400 px-4 py-1 rounded-full text-xs font-bold mb-6">
        Create Your Smart Farm Account
      </div>

      <div className="text-center mb-8">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          Get Started
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Empowering farmers with intelligent precision.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.02)] border border-gray-100 dark:border-gray-800 w-full max-w-[650px] transition-colors duration-300">
        <form onSubmit={handleRegister} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputGroup
              label="Full Name"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <InputGroup
              label="Email Address"
              name="email"
              placeholder="john@example.com"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <InputGroup
              label="Phone Number"
              name="phone"
              placeholder="+1 (555) 000-0000"
              value={formData.phone}
              onChange={handleChange}
            />
            <InputGroup
              label="Farm Name"
              name="farmName"
              placeholder="Green Valley Estates"
              value={formData.farmName}
              onChange={handleChange}
            />

            <div className="md:col-span-2">
              <InputGroup
                label="Profile Image URL"
                name="image"
                placeholder="https://example.com/avatar.jpg"
                type="url"
                value={formData.image}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InputGroup
              label="Location"
              name="location"
              placeholder="City, Country"
              value={formData.location}
              onChange={handleChange}
            />
            <InputGroup
              label="Farm Size (Acres)"
              name="farmSize"
              placeholder="50"
              type="number"
              value={formData.farmSize}
              onChange={handleChange}
            />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Primary Crop
              </label>
              <select
                name="crop"
                value={formData.crop}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:border-[#16503b] transition-all"
              >
                <option>Corn</option>
                <option>Wheat</option>
                <option>Rice</option>
              </select>
            </div>
          </div>

          {/* Password Section */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                name="password"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:border-[#16503b] transition-all"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#16503b] cursor-pointer"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Strength Meter */}
          <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-700">
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
            <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mb-4 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${strengthColor}`}
                style={{ width: `${(strength / 4) * 100}%` }}
              ></div>
            </div>
            <div className="grid grid-cols-2 gap-y-2">
              <ReqItem
                label="8+ Characters"
                met={formData.password.length >= 8}
              />
              <ReqItem label="1 Number" met={/[0-9]/.test(formData.password)} />
              <ReqItem
                label="1 Special"
                met={/[^A-Za-z0-9]/.test(formData.password)}
              />
              <ReqItem
                label="Uppercase"
                met={/[A-Z]/.test(formData.password)}
              />
            </div>
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-[#16503b] dark:bg-green-600 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#12402f] dark:hover:bg-green-700 transition-all cursor-pointer active:scale-95 disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              'Create Account'
            )}{' '}
            <ChevronRight size={18} />
          </button>
        </form>

        <div className="relative my-8 flex items-center justify-center">
          <div className="absolute w-full border-t border-gray-100 dark:border-gray-800"></div>
          <span className="relative bg-white dark:bg-gray-900 px-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
            OR
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-800 dark:text-white py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-semibold text-sm cursor-pointer active:scale-95"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="w-5 h-5"
              alt="Google"
            />{' '}
            Sign up with Google
          </button>
          <button className="flex items-center justify-center gap-2 border border-[#16503b] dark:border-green-600 text-[#16503b] dark:text-green-400 py-3 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 font-semibold text-sm cursor-pointer active:scale-95">
            <Rocket size={18} /> Explore Demo
          </button>
        </div>

        <div className="text-center mt-8 pt-6 border-t border-gray-50 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-[#16503b] dark:text-green-400 font-bold hover:underline cursor-pointer"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

// Reusable Components
const InputGroup = ({
  label,
  name,
  placeholder,
  type = 'text',
  value,
  onChange,
  required = false,
}: any) => (
  <div className="space-y-1.5 w-full">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors tracking-tight">
      {label}
    </label>
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:border-[#16503b] transition-all cursor-text shadow-sm"
    />
  </div>
);

const ReqItem = ({ label, met }: { label: string; met: boolean }) => (
  <div
    className={`flex items-center gap-2 text-[10px] font-bold uppercase transition-colors duration-300 ${met ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}
  >
    <div
      className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${met ? 'bg-green-100 dark:bg-green-900/30 border-green-500' : 'border-gray-200 dark:border-gray-700'}`}
    >
      <Check size={10} className={met ? 'opacity-100' : 'opacity-0'} />
    </div>{' '}
    {label}
  </div>
);

export default RegisterPage;
