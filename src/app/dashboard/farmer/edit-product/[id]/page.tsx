'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api-client';
import { ArrowLeft, Loader2, Save, Sparkles } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const EditProductPage = () => {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    price: '0',
    unit: 'kg',
    location: '',
    mainImage: '',
    status: 'active',
  });

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      try {
        const res = await api.get(`/products/${productId}`);
        const product = res.data?.product;
        setFormData({
          title: product?.title || '',
          category: product?.category || '',
          description: product?.description || '',
          price: String(product?.price || 0),
          unit: product?.unit || 'kg',
          location: product?.location || '',
          mainImage: product?.mainImage || '',
          status: product?.status || 'active',
        });
      } catch (error) {
        toast.error('Unable to load this product right now.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // store as data URL so the backend receives an image string
        setFormData(prev => ({ ...prev, mainImage: result }));
        setImageUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setImageUploading(false);
      toast.error('Failed to read image file');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.patch(`/products/${productId}`, {
        ...formData,
        price: Number(formData.price),
      });
      toast.success('Product updated successfully');
      router.push('/dashboard/farmer/my-products');
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-[#16503b]" size={36} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#16503b]">
            Edit listing
          </p>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">
            Update your product details
          </h1>
        </div>
        <Link
          href="/dashboard/farmer/my-products"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#16503b]"
        >
          <ArrowLeft size={16} /> Back
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:p-8"
      >
        <div className="flex items-center gap-2 rounded-2xl bg-[#f3fbf6] p-3 text-sm font-semibold text-[#16503b] dark:bg-green-900/20 dark:text-green-400">
          <Sparkles size={16} /> Adjust the listing without losing the current
          content.
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Title
            </label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-[#16503b] dark:border-gray-700 dark:bg-gray-800"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Category
            </label>
            <input
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-[#16503b] dark:border-gray-700 dark:bg-gray-800"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              required
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-[#16503b] dark:border-gray-700 dark:bg-gray-800"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Unit
            </label>
            <input
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-[#16503b] dark:border-gray-700 dark:bg-gray-800"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Location
            </label>
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-[#16503b] dark:border-gray-700 dark:bg-gray-800"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-[#16503b] dark:border-gray-700 dark:bg-gray-800"
            >
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="sold">Sold</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={6}
            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-[#16503b] dark:border-gray-700 dark:bg-gray-800"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Main image
          </label>
          {formData.mainImage ? (
            <div className="mb-3 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <img
                src={formData.mainImage}
                alt={formData.title}
                className="w-full h-64 object-cover"
              />
            </div>
          ) : (
            <div className="mb-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-dashed border-gray-200 dark:border-gray-700 h-64 flex items-center justify-center text-gray-400">
              No image set
            </div>
          )}

          <div className="flex items-center gap-3">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
              <span className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-sm font-semibold">
                Upload Image
              </span>
            </label>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, mainImage: '' }))}
              className="px-4 py-2 rounded-xl border border-gray-200 text-sm"
            >
              Remove Image
            </button>
            {imageUploading && (
              <span className="text-sm text-gray-500">Uploading...</span>
            )}
          </div>

          <div className="mt-4">
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
              Or enter image URL
            </label>
            <input
              name="mainImage"
              value={formData.mainImage}
              onChange={handleChange}
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-[#16503b] dark:border-gray-700 dark:bg-gray-800"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-2xl bg-[#16503b] px-5 py-3 text-sm font-black text-white transition hover:bg-[#0f3a2a] disabled:opacity-60"
        >
          {saving ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <Save size={16} />
          )}{' '}
          Save changes
        </button>
      </form>
    </div>
  );
};

export default EditProductPage;
