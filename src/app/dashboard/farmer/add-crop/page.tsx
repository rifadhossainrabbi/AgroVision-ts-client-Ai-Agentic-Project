'use client';

import React, { useState, useMemo } from 'react';
import {
  Eye,
  Send,
  Loader2,
  Camera,
  X,
  PlusCircle,
  Layout,
  Image as ImageIcon,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Truck,
  Settings2,
} from 'lucide-react';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// --- কৃষি সম্পর্কিত কনস্ট্যান্টস ---
const CATEGORIES = {
  Crop: [
    'RICE',
    'WHEAT',
    'CORN',
    'VEGETABLES',
    'FRUITS',
    'LENTILS',
    'SPICES',
    'ORGANIC HERBS',
    'OTHERS',
  ],
  Machine: [
    'TRACTOR',
    'HARVESTER',
    'POWER TILLER',
    'IRRIGATION PUMP',
    'SEEDING MACHINE',
    'SPRAYING DRONE',
    'SENSORS',
    'OTHERS',
  ],
};

const UNITS = ['KG', 'TON', 'PIECE', 'MOUND', 'BUSHEL', 'UNIT', 'SET'];
const CONDITIONS = ['NEW', 'LIKE NEW', 'GOOD', 'FAIR', 'NEEDS REPAIR'];
const GRADES = ['GRADE A (PREMIUM)', 'GRADE B (STANDARD)', 'GRADE C (AVERAGE)'];
const FUEL_TYPES = ['DIESEL', 'PETROL', 'OCTANE', 'ELECTRIC', 'MANUAL'];

const AddCropPage = () => {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [productType, setProductType] = useState<'Crop' | 'Machine'>('Crop');
  const [images, setImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  // সম্পূর্ণ ডাইনামিক ফর্ম স্টেট
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: 0,
    quantity: 0,
    unit: 'KG',
    location: '',
    // Crop Specific
    harvestDate: '',
    freshness: 'Fresh',
    isOrganic: false,
    grade: 'GRADE A (PREMIUM)',
    // Machine Specific
    brand: '',
    model: '',
    mfgYear: '',
    condition: 'GOOD',
    hoursUsed: 0,
    fuelType: 'DIESEL',
    warranty: '',
    // Logistics
    deliveryAvailable: true,
    pickupAvailable: true,
  });

  // ইনপুট ফিল্ড থেকে অ্যারো সরানোর জন্য CSS ক্লাস
  const inputClass =
    'w-full p-5 rounded-[1.5rem] border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 dark:text-white font-bold focus:border-[#16503b] outline-none shadow-inner [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none transition-all uppercase tracking-tighter text-sm';

  // ImgBB আপলোড লজিক
  const uploadToImgBB = async (file: File) => {
    const body = new FormData();
    body.append('image', file);
    const res = await axios.post(
      `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
      body,
    );
    return res.data.data.url;
  };

  // TanStack Query Mutation
  const publishMutation = useMutation({
    mutationFn: async (payload: any) => {
      return (
        await axios.post('http://localhost:5000/api/products/add', payload)
      ).data;
    },
    onSuccess: () => {
      alert('✅ LISTING PUBLISHED SUCCESSFULLY!');
      router.push('/dashboard/farmer/my-products');
    },
    onError: (err: any) =>
      alert(`❌ FAILED: ${err.response?.data?.error || err.message}`),
  });

  const handlePublish = async () => {
    if (images.length === 0) return alert('⚠️ UPLOAD AT LEAST ONE IMAGE');
    if (!formData.name || !formData.category)
      return alert('⚠️ NAME AND CATEGORY ARE REQUIRED');

    setUploading(true);
    try {
      const urls = await Promise.all(images.map(img => uploadToImgBB(img)));
      const payload = {
        ...formData,
        userId: session?.user?.id || 'anonymous',
        mainImage: urls[0],
        extraImages: urls.slice(1),
        productType,
        createdAt: new Date(),
      };
      publishMutation.mutate(payload);
    } catch (err) {
      alert('❌ IMAGE UPLOAD FAILED');
    } finally {
      setUploading(false);
    }
  };

  // কোয়ালিটি মিটার ক্যালকুলেশন
  const listingQuality = useMemo(() => {
    let score = 0;
    if (formData.name.length > 5) score += 25;
    if (formData.category) score += 25;
    if (images.length >= 1) score += 25;
    if (formData.description.length > 20) score += 25;
    return score;
  }, [formData, images]);

  return (
    <div className="max-w-[1440px] mx-auto p-4 md:p-8 bg-white dark:bg-gray-950 transition-colors duration-300">
      {/* --- STICKY HEADER --- */}
      <div className="flex justify-between items-center mb-10 sticky top-0 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md z-40 py-4 border-b dark:border-gray-800">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic">
            Create Listing
          </h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
            Global Farming Marketplace
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsPreview(!isPreview)}
            className="flex items-center gap-2 px-6 py-2.5 border border-gray-200 dark:border-gray-800 rounded-2xl dark:text-white cursor-pointer font-black text-[10px] uppercase tracking-widest shadow-sm transition hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            {isPreview ? <X size={14} /> : <Eye size={14} />}{' '}
            {isPreview ? 'EDIT' : 'PREVIEW'}
          </button>
          <button
            onClick={handlePublish}
            disabled={uploading || publishMutation.isPending}
            className="flex items-center gap-2 px-8 py-2.5 bg-[#16503b] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-green-900/20 disabled:opacity-50 cursor-pointer active:scale-95 transition-all"
          >
            {uploading ? (
              <Loader2 className="animate-spin" size={14} />
            ) : (
              <Send size={14} />
            )}{' '}
            PUBLISH NOW
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* --- LEFT FORM COLUMN --- */}
        <div
          className={`lg:col-span-2 space-y-10 ${isPreview ? 'hidden' : 'block'}`}
        >
          {/* 1. MEDIA ASSETS (ON TOP) */}
          <div className="bg-gray-50/50 dark:bg-gray-900 p-8 rounded-[3rem] border border-gray-100 dark:border-gray-800 space-y-6 shadow-sm">
            <h3 className="text-lg font-black text-[#16503b] dark:text-green-500 uppercase flex items-center gap-3 italic mb-8">
              <Camera size={22} /> Media Assets *
            </h3>
            <div className="border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-[2.5rem] p-12 text-center bg-white dark:bg-gray-950/50 relative hover:border-[#16503b] transition-all group">
              <input
                type="file"
                multiple
                accept="image/*"
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
                <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center shadow-lg mb-4 border dark:border-gray-800 group-hover:scale-110 transition-transform">
                  <ImageIcon className="text-[#16503b]" size={32} />
                </div>
                <p className="font-black text-gray-900 dark:text-white uppercase tracking-tighter text-xs">
                  CLICK TO SELECT PRODUCT PHOTOS
                </p>
                <p className="text-[9px] text-gray-400 mt-2 font-bold uppercase tracking-widest">
                  MINIMUM 1 PHOTO REQUIRED (MAX 5)
                </p>
              </label>
              {images.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-4 justify-center">
                  {images.map((img, i) => (
                    <div
                      key={i}
                      className="relative w-28 h-28 rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800 group"
                    >
                      <img
                        src={URL.createObjectURL(img)}
                        className="object-cover w-full h-full"
                        alt="upload"
                      />
                      <button
                        onClick={() =>
                          setImages(images.filter((_, idx) => idx !== i))
                        }
                        className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-all transform hover:rotate-90 shadow-md"
                      >
                        <X size={12} />
                      </button>
                      {i === 0 && (
                        <span className="absolute bottom-2 left-2 bg-[#16503b] text-[8px] text-white px-2 py-0.5 rounded-lg font-black tracking-widest shadow-lg">
                          COVER
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 2. CORE INFORMATION */}
          <div className="bg-gray-50/50 dark:bg-gray-900 p-8 rounded-[3rem] border border-gray-100 dark:border-gray-800 space-y-8 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="text-lg font-black text-[#16503b] dark:text-green-500 uppercase flex items-center gap-3">
                <PlusCircle size={22} /> Listing Identity
              </h3>
              <div className="flex bg-gray-200 dark:bg-gray-800 p-1 rounded-2xl w-full sm:w-auto">
                <button
                  onClick={() => setProductType('Crop')}
                  className={`flex-1 sm:px-8 py-2.5 rounded-xl text-[10px] font-black transition-all ${productType === 'Crop' ? 'bg-[#16503b] text-white shadow-lg' : 'text-gray-500'}`}
                >
                  FRESH CROP
                </button>
                <button
                  onClick={() => setProductType('Machine')}
                  className={`flex-1 sm:px-8 py-2.5 rounded-xl text-[10px] font-black transition-all ${productType === 'Machine' ? 'bg-[#16503b] text-white shadow-lg' : 'text-gray-500'}`}
                >
                  USED MACHINE
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <input
                type="text"
                placeholder={
                  productType === 'Crop'
                    ? 'NAME OF YOUR CROP (E.G. BASMATI RICE)'
                    : 'NAME OF YOUR MACHINE (E.G. MAHINDRA TRACTOR)'
                }
                value={formData.name}
                onChange={e =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className={inputClass}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <select
                  value={formData.category}
                  onChange={e =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className={inputClass + ' cursor-pointer'}
                >
                  <option value="">CHOOSE CATEGORY *</option>
                  {CATEGORIES[productType].map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="EXPECTED PRICE ($) *"
                    value={formData.price || ''}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        price: Number(e.target.value),
                      })
                    }
                    className={inputClass}
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 font-black">
                    $
                  </span>
                </div>
              </div>

              {/* DYNAMIC FIELD GENERATION BASED ON TYPE */}
              <AnimatePresence mode="wait">
                {productType === 'Crop' ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    key="crop-fields"
                    className="space-y-6 pt-4 border-t dark:border-gray-800"
                  >
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      <input
                        type="number"
                        placeholder="QUANTITY (0.00)"
                        value={formData.quantity || ''}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            quantity: Number(e.target.value),
                          })
                        }
                        className={inputClass}
                      />
                      <select
                        value={formData.unit}
                        onChange={e =>
                          setFormData({ ...formData, unit: e.target.value })
                        }
                        className={inputClass + ' cursor-pointer'}
                      >
                        {UNITS.map(u => (
                          <option key={u} value={u}>
                            UNIT: {u}
                          </option>
                        ))}
                      </select>
                      <select
                        value={formData.grade}
                        onChange={e =>
                          setFormData({ ...formData, grade: e.target.value })
                        }
                        className={
                          inputClass +
                          ' cursor-pointer col-span-2 md:col-span-1'
                        }
                      >
                        {GRADES.map(g => (
                          <option key={g} value={g}>
                            {g}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">
                          HARVEST DATE *
                        </label>
                        <input
                          type="date"
                          value={formData.harvestDate}
                          onChange={e =>
                            setFormData({
                              ...formData,
                              harvestDate: e.target.value,
                            })
                          }
                          className={inputClass}
                        />
                      </div>
                      <label className="flex items-center gap-4 p-5 rounded-2xl border dark:border-gray-800 bg-white dark:bg-gray-800 cursor-pointer self-end shadow-sm">
                        <input
                          type="checkbox"
                          checked={formData.isOrganic}
                          onChange={e =>
                            setFormData({
                              ...formData,
                              isOrganic: e.target.checked,
                            })
                          }
                          className="w-5 h-5 accent-[#16503b]"
                        />
                        <span className="text-[10px] font-black uppercase dark:text-white tracking-widest italic">
                          Organic Certified Produce
                        </span>
                      </label>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    key="machine-fields"
                    className="space-y-6 pt-4 border-t dark:border-gray-800"
                  >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <input
                        type="text"
                        placeholder="BRAND NAME"
                        value={formData.brand}
                        onChange={e =>
                          setFormData({ ...formData, brand: e.target.value })
                        }
                        className={inputClass}
                      />
                      <input
                        type="text"
                        placeholder="MODEL NO"
                        value={formData.model}
                        onChange={e =>
                          setFormData({ ...formData, model: e.target.value })
                        }
                        className={inputClass}
                      />
                      <input
                        type="text"
                        placeholder="MFG YEAR"
                        value={formData.mfgYear}
                        onChange={e =>
                          setFormData({ ...formData, mfgYear: e.target.value })
                        }
                        className={inputClass}
                      />
                      <input
                        type="number"
                        placeholder="HOURS USED"
                        value={formData.hoursUsed || ''}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            hoursUsed: Number(e.target.value),
                          })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      <select
                        value={formData.condition}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            condition: e.target.value,
                          })
                        }
                        className={inputClass + ' cursor-pointer'}
                      >
                        {CONDITIONS.map(c => (
                          <option key={c} value={c}>
                            CONDITION: {c}
                          </option>
                        ))}
                      </select>
                      <select
                        value={formData.fuelType}
                        onChange={e =>
                          setFormData({ ...formData, fuelType: e.target.value })
                        }
                        className={inputClass + ' cursor-pointer'}
                      >
                        {FUEL_TYPES.map(f => (
                          <option key={f} value={f}>
                            FUEL: {f}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        placeholder="WARRANTY PERIOD (OPTIONAL)"
                        value={formData.warranty}
                        onChange={e =>
                          setFormData({ ...formData, warranty: e.target.value })
                        }
                        className={inputClass}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <textarea
                rows={4}
                placeholder="WRITE A COMPELLING PRODUCT OVERVIEW FOR YOUR BUYERS... (ORIGIN, QUALITY, STORAGE, ETC.)"
                value={formData.description}
                onChange={e =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full p-6 rounded-[2rem] border dark:border-gray-800 bg-white dark:bg-gray-800 dark:text-white font-medium outline-none focus:border-[#16503b] shadow-inner text-sm tracking-tight"
              />
            </div>
          </div>

          {/* 3. LOGISTICS & LOCATION */}
          <div className="bg-gray-50/50 dark:bg-gray-900 p-8 rounded-[3rem] border border-gray-100 dark:border-gray-800 space-y-8 shadow-sm">
            <h3 className="text-lg font-black text-[#16503b] dark:text-green-500 uppercase tracking-widest flex items-center gap-3 italic">
              <MapPin size={22} /> Shipping & Pickup
            </h3>
            <input
              type="text"
              placeholder="FARM OR SHOP ADDRESS (CITY, STATE, COUNTRY) *"
              value={formData.location}
              onChange={e =>
                setFormData({ ...formData, location: e.target.value })
              }
              className={inputClass}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="flex items-center gap-4 p-5 rounded-[1.5rem] border dark:border-gray-800 bg-white dark:bg-gray-800 cursor-pointer hover:bg-green-50/50 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.deliveryAvailable}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      deliveryAvailable: e.target.checked,
                    })
                  }
                  className="w-6 h-6 accent-[#16503b]"
                />
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Doorstep Delivery
                  </span>
                  <span className="text-[9px] text-gray-400 font-bold">
                    I CAN SHIP TO CUSTOMER
                  </span>
                </div>
              </label>
              <label className="flex items-center gap-4 p-5 rounded-[1.5rem] border dark:border-gray-800 bg-white dark:bg-gray-800 cursor-pointer hover:bg-green-50/50 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.pickupAvailable}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      pickupAvailable: e.target.checked,
                    })
                  }
                  className="w-6 h-6 accent-[#16503b]"
                />
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    On-Site Pickup
                  </span>
                  <span className="text-[9px] text-gray-400 font-bold">
                    PICKUP FROM MY FARM/SHOP
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* --- DYNAMIC MOCKUP SIDEBAR --- */}
        <div
          className={`${isPreview ? 'lg:col-span-3' : 'lg:col-span-1'} space-y-8`}
        >
          <div className="bg-white dark:bg-gray-900 p-8 rounded-[3.5rem] border border-gray-100 dark:border-gray-800 shadow-2xl sticky top-32 transition-all">
            <h3 className="text-xs font-black text-gray-300 uppercase tracking-[0.3em] mb-8 text-center italic">
              Live Marketplace Preview
            </h3>

            <div className="border-2 border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-6 bg-gray-50/30 dark:bg-gray-950 shadow-inner group">
              <div className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-[2rem] mb-6 relative overflow-hidden flex items-center justify-center shadow-xl">
                {images[0] ? (
                  <img
                    src={URL.createObjectURL(images[0])}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    alt="p"
                  />
                ) : (
                  <ImageIcon size={64} className="text-gray-400 opacity-20" />
                )}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span className="bg-[#16503b] text-[8px] font-black text-white px-4 py-1.5 rounded-full shadow-lg uppercase tracking-widest">
                    Verified Seller
                  </span>
                  {formData.isOrganic && productType === 'Crop' && (
                    <span className="bg-orange-500 text-[8px] font-black text-white px-4 py-1.5 rounded-full shadow-lg uppercase tracking-widest flex items-center gap-1">
                      <Sparkles size={10} /> Organic
                    </span>
                  )}
                </div>
              </div>
              <h4 className="font-black text-2xl dark:text-white truncate uppercase italic tracking-tighter leading-none">
                {formData.name || 'PRODUCT NAME'}
              </h4>
              <div className="mt-4 flex items-baseline gap-2">
                <p className="text-3xl font-black text-[#16503b] dark:text-green-500 tracking-tighter">
                  ${formData.price.toFixed(2)}
                </p>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  / {productType === 'Crop' ? formData.unit : 'unit'}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-[9px] font-black bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full text-gray-600 dark:text-gray-400 uppercase tracking-widest">
                  {formData.category || 'TYPE'}
                </span>
                <span className="text-[9px] font-black bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-full text-[#16503b] dark:text-green-400 uppercase tracking-widest shadow-sm">
                  {productType === 'Crop' ? formData.grade : formData.condition}
                </span>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-6 line-clamp-4 leading-relaxed font-bold tracking-tight">
                {formData.description ||
                  'YOUR PRODUCT DESCRIPTION WILL BE ANALYZED BY BUYERS HERE...'}
              </p>
              <button className="w-full bg-[#16503b] text-white py-5 rounded-[1.5rem] mt-10 font-black shadow-2xl shadow-green-900/30 hover:translate-y-[-2px] active:scale-95 transition-all uppercase tracking-[0.2em] text-xs">
                Explore Full Details
              </button>
            </div>

            {!isPreview && (
              <div className="mt-10 px-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                    Listing Quality
                  </span>
                  <span
                    className={`text-[10px] font-black ${listingQuality > 75 ? 'text-green-500' : 'text-orange-500'}`}
                  >
                    {listingQuality}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden shadow-inner">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${listingQuality}%` }}
                    className="h-full bg-gradient-to-r from-green-400 to-[#16503b] rounded-full shadow-[0_0_15px_rgba(22,80,59,0.3)]"
                  />
                </div>
                <div className="mt-8 space-y-4">
                  <ScoreItem
                    met={formData.name.length > 8}
                    text="Descriptive Name"
                  />
                  <ScoreItem
                    met={formData.category !== ''}
                    text="Category Optimized"
                  />
                  <ScoreItem met={images.length >= 3} text="Rich Media (3+)" />
                  <ScoreItem
                    met={formData.location.length > 5}
                    text="Traceability (Location)"
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

const ScoreItem = ({ met, text }: { met: boolean; text: string }) => (
  <div
    className={`flex items-center gap-3 text-[9px] font-black uppercase tracking-widest transition-all duration-500 ${met ? 'text-green-600 dark:text-green-400' : 'text-gray-400 opacity-50'}`}
  >
    <div
      className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${met ? 'border-green-500 bg-green-500/10' : 'border-gray-200 dark:border-gray-800'}`}
    >
      {met ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
    </div>
    {text}
  </div>
);

export default AddCropPage;
