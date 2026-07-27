'use client';

import React, { useState, useMemo } from 'react';
import {
  Eye,
  Send,
  Loader2,
  Camera,
  X,
  PlusCircle,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const CATEGORIES = {
  Crop: ['Vegetables', 'Fruits', 'Grains', 'Organic', 'Fresh Herbs'],
  Machine: [
    'Tractors',
    'Irrigation System',
    'Seeding Tools',
    'Harvesters',
    'Sensors',
  ],
};

const AddCropPage = () => {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [isPreview, setIsPreview] = useState(false);
  const [productType, setProductType] = useState<'Crop' | 'Machine'>('Crop');
  const [images, setImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    price: 0,
    quantity: 0,
    unit: 'kg',
  });

  // ১. ইমেজ আপলোড লজিক
  const uploadToImgBB = async (file: File) => {
    const body = new FormData();
    body.append('image', file);
    const res = await axios.post(
      `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
      body,
    );
    return res.data.data.url;
  };

  // ২. TanStack Mutation (পোর্ট ৫০০০ এ সরাসরি কল)
  const publishMutation = useMutation({
    mutationFn: async (payload: any) => {
      const response = await axios.post(
        'http://localhost:5000/api/products/add',
        payload,
      );
      return response.data;
    },
    onSuccess: () => {
      alert('✅ Product Published!');
      router.push('/dashboard/farmer/my-products');
    },
    onError: (err: any) => {
      alert(`❌ Error: ${err.response?.data?.error || err.message}`);
    },
  });

  const handlePublish = async () => {
    if (images.length === 0) return alert('⚠️ Image is required');
    if (!formData.title || !formData.category)
      return alert('⚠️ Missing fields');

    setUploading(true);
    try {
      const urls = await Promise.all(images.map(img => uploadToImgBB(img)));
      const payload = {
        ...formData,
        userId: session?.user?.id || 'anonymous',
        mainImage: urls[0],
        extraImages: urls.slice(1),
        productType,
      };
      publishMutation.mutate(payload);
    } catch (err) {
      alert('❌ Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const listingQuality = useMemo(() => {
    let score = 0;
    if (formData.title.length > 5) score += 25;
    if (formData.description.length > 20) score += 25;
    if (images.length >= 1) score += 25;
    if (formData.category) score += 25;
    return score;
  }, [formData, images]);

  return (
    <div className="max-w-[1440px] mx-auto p-4 md:p-8 bg-white dark:bg-gray-950 transition-colors duration-300">
      <div className="flex justify-between items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            Create Listing
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Enterprise Smart Farming System
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setIsPreview(!isPreview)}
            className="flex items-center gap-2 px-5 py-2.5 border dark:border-gray-800 dark:text-white rounded-2xl cursor-pointer font-bold text-sm bg-white dark:bg-gray-900 transition-all hover:bg-gray-50"
          >
            {isPreview ? <X size={18} /> : <Eye size={18} />}{' '}
            {isPreview ? 'Close' : 'Preview'}
          </button>
          <button
            onClick={handlePublish}
            disabled={uploading || publishMutation.isPending}
            className="flex items-center gap-2 px-8 py-2.5 bg-[#16503b] text-white rounded-2xl font-bold shadow-lg shadow-green-900/10 disabled:opacity-50 cursor-pointer active:scale-95 transition-all"
          >
            {uploading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Send size={18} />
            )}
            {uploading ? 'Processing...' : 'Publish'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div
          className={`lg:col-span-2 space-y-8 ${isPreview ? 'hidden' : 'block'}`}
        >
          <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm transition-colors">
            <h3 className="text-lg font-black mb-8 dark:text-white flex items-center gap-3 uppercase tracking-wider">
              <PlusCircle className="text-[#16503b] dark:text-green-500" />{' '}
              Basic Details
            </h3>
            <div className="space-y-6">
              <input
                type="text"
                value={formData.title}
                onChange={e =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Product Title *"
                className="w-full px-5 py-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 dark:text-white focus:border-[#16503b] outline-none transition-all"
              />
              <div className="grid grid-cols-2 gap-6">
                <select
                  value={productType}
                  onChange={e => setProductType(e.target.value as any)}
                  className="px-5 py-4 rounded-2xl border dark:border-gray-800 bg-gray-50 dark:bg-gray-800/20 dark:text-white outline-none cursor-pointer"
                >
                  <option value="Crop">Crops</option>
                  <option value="Machine">Machines</option>
                </select>
                <select
                  value={formData.category}
                  onChange={e =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="px-5 py-4 rounded-2xl border dark:border-gray-800 bg-gray-50 dark:bg-gray-800/20 dark:text-white outline-none cursor-pointer"
                >
                  <option value="">Category *</option>
                  {CATEGORIES[productType].map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <textarea
                rows={5}
                value={formData.description}
                onChange={e =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Full Description..."
                className="w-full px-5 py-4 rounded-2xl border dark:border-gray-800 bg-gray-50 dark:bg-gray-800/20 dark:text-white focus:border-[#16503b] outline-none"
              />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm transition-colors">
            <h3 className="text-lg font-black mb-8 dark:text-white flex items-center gap-3 uppercase tracking-wider">
              <ImageIcon className="text-[#16503b] dark:text-green-500" /> Media
            </h3>
            <div className="border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-[2rem] p-12 text-center bg-gray-50/30 dark:bg-gray-800/10 relative hover:border-[#16503b] transition-all">
              <input
                type="file"
                multiple
                id="img-up"
                onChange={e =>
                  setImages(Array.from(e.target.files || []).slice(0, 5))
                }
                className="hidden"
              />
              <label
                htmlFor="img-up"
                className="cursor-pointer flex flex-col items-center"
              >
                <Camera className="text-[#16503b] mb-4" size={32} />
                <p className="font-bold text-gray-900 dark:text-white uppercase tracking-tighter">
                  Click to upload images
                </p>
              </label>
              {images.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-4 justify-center">
                  {images.map((img, i) => (
                    <div
                      key={i}
                      className="relative w-24 h-24 rounded-2xl overflow-hidden shadow-lg border-2 border-white dark:border-gray-700 group"
                    >
                      <img
                        src={URL.createObjectURL(img)}
                        className="object-cover w-full h-full"
                        alt="p"
                      />
                      <button
                        onClick={() =>
                          setImages(images.filter((_, idx) => idx !== i))
                        }
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Live Preview / Listing Score */}
        <div
          className={`${isPreview ? 'lg:col-span-3' : 'lg:col-span-1'} space-y-8`}
        >
          <div className="bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl sticky top-24 transition-colors">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 px-2">
              Market Preview
            </h3>
            <div className="border border-gray-100 dark:border-gray-800 rounded-[2rem] p-5 bg-gray-50/50 dark:bg-gray-800/10 shadow-inner">
              <div className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-2xl mb-4 relative overflow-hidden flex items-center justify-center shadow-md">
                {images[0] ? (
                  <img
                    src={URL.createObjectURL(images[0])}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon size={48} className="text-gray-400 opacity-20" />
                )}
                <div className="absolute top-3 left-3 flex flex-col gap-1">
                  <span className="bg-[#16503b] text-[8px] font-bold text-white px-3 py-1 rounded-full shadow-lg">
                    VERIFIED
                  </span>
                </div>
              </div>
              <h4 className="font-black text-xl dark:text-white truncate uppercase tracking-tight">
                {formData.title || 'Product Name'}
              </h4>
              <p className="text-2xl font-black text-[#16503b] dark:text-green-500 mt-2 tracking-tighter">
                ${formData.price.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 line-clamp-3 leading-relaxed font-medium">
                {formData.description || 'Description description...'}
              </p>
              <button className="w-full bg-[#16503b] text-white py-4 rounded-2xl mt-6 font-black shadow-lg shadow-green-900/10 active:scale-95 transition-all cursor-pointer">
                BUY NOW
              </button>
            </div>

            {!isPreview && (
              <div className="mt-8 px-4">
                <div className="flex justify-between mb-2">
                  <span className="text-[10px] font-black text-gray-400 uppercase">
                    Listing Quality
                  </span>
                  <span className="text-[10px] font-black dark:text-white">
                    {listingQuality}%
                  </span>
                </div>
                <div className="w-full h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all duration-700"
                    style={{ width: `${listingQuality}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCropPage;
