// app/products/[id]/page.tsx
'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import axios from '@/lib/axios';
import { API_BASE_URL } from '@/lib/config';
import {
  Star,
  StarHalf,
  ShoppingCart,
  Zap,
  CheckCircle,
  Loader2,
  Heart,
  Share2,
  MapPin,
  MessageCircle,
  Trash2,
  Send,
} from 'lucide-react';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import AuthGuard from '@/components/shared/AuthGuard';
import toast from 'react-hot-toast';

const API_BASE = API_BASE_URL;

// use shared api client

// Types
interface Product {
  _id: string;
  title: string;
  description: string;
  fullDescription?: string;
  price: number;
  originalPrice?: number;
  category: string;
  productType: 'Crop' | 'Machine';
  mainImage: string;
  images?: string[];
  extraImages?: string[];
  unit: string;
  stock?: number;
  quantity?: number;
  status: 'active' | 'pending' | 'sold';
  rating?: number;
  reviews?: number;
  location?: string;
  seller?: {
    name: string;
    image?: string | null;
    email?: string | null;
    rating: number;
    responseTime: string;
    verified: boolean;
  };
  specifications?: Record<string, string>;
  warranty?: string;
  delivery?: string;
  certification?: string;
  aiInsights?: {
    roiEstimation: string;
    maintenance: string;
    bestSeason: string;
  };
}

interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

interface Comment {
  _id: string;
  productId: string;
  userId: string;
  userName: string;
  userImage?: string | null;
  comment: string;
  rating?: number;
  createdAt: string;
}

const ProductDetailsPage = () => {
  const params = useParams();
  const productId = params.id as string;
  const queryClient = useQueryClient();

  const { data: session } = authClient.useSession();
  const currentUser = session?.user;

  const [activeTab, setActiveTab] = useState<
    'overview' | 'specifications' | 'reviews' | 'seller' | 'related'
  >('overview');
  const [commentText, setCommentText] = useState('');
  const [commentRating, setCommentRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);

  // --- Product ---
  const {
    data: productData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE}/products/${productId}`);
      return res.data;
    },
    enabled: !!productId,
  });

  const product: Product = productData?.product;
  const reviews: Review[] = productData?.reviews || [];

  // --- Related products ---
  const { data: relatedProducts } = useQuery({
    queryKey: ['related-products', product?.category],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE}/products/all`, {
        params: { category: product?.category, limit: 4 },
      });
      return res.data;
    },
    enabled: !!product?.category,
  });

  // --- Likes ---
  const { data: likeData } = useQuery({
    queryKey: ['likes', productId, currentUser?.name],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE}/likes/${productId}`, {
        params: { userName: currentUser?.name },
      });
      return res.data;
    },
    enabled: !!productId,
  });

  const likeMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post(`${API_BASE}/likes/toggle`, {
        productId,
        userName: currentUser?.name,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['likes', productId] });
    },
  });

  const isAuthor = Boolean(
    currentUser &&
    (currentUser.id === (product as any)?.userId ||
      (currentUser.email &&
        product?.seller?.email &&
        currentUser.email === product.seller.email)),
  );

  const handleLikeToggle = () => {
    if (!currentUser) {
      toast.error('Please log in to like products');
      return;
    }
    likeMutation.mutate();
  };

  // --- Buy Now & Add to Cart Mutations ---
  const buyNowMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post(`${API_BASE}/buy-requests`, {
        productId,
        productTitle: product.title,
        mainImage: product.mainImage,
        price: product.price,
        unit: product.unit,
        sellerId: (product as any).userId || 'anonymous',
        sellerName: product.seller?.name || 'AgroVision Seller',
        user: {
          userId: currentUser?.id,
          userName: currentUser?.name,
          userEmail: currentUser?.email,
          userImage: currentUser?.image,
        },
      });
      return res.data;
    },
    onSuccess: data => {
      if (data?.alreadyExists) {
        toast('You have already submitted a buy request for this product', {
          icon: 'ℹ️',
        });
      } else {
        toast.success('Buy request submitted successfully!');
      }
    },
    onError: (err: any) => {
      toast.error(
        `Failed to submit buy request: ${err.response?.data?.error || err.message}`,
      );
    },
  });

  const handleBuyNow = () => {
    if (!currentUser) {
      toast.error('Please log in to buy products');
      return;
    }
    if (isAuthor) {
      toast.error('Author cannot buy their own product!');
      return;
    }
    buyNowMutation.mutate();
  };

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post(`${API_BASE}/cart`, {
        productId,
        productTitle: product.title,
        mainImage: product.mainImage,
        price: product.price,
        unit: product.unit,
        category: product.category,
        sellerId: (product as any).userId || 'anonymous',
        user: {
          userId: currentUser?.id,
          userName: currentUser?.name,
          userEmail: currentUser?.email,
          userImage: currentUser?.image,
        },
      });
      return res.data;
    },
    onSuccess: data => {
      if (data?.alreadyExists) {
        toast('Product is already in your cart', { icon: '🛒' });
      } else {
        toast.success('Product added to cart successfully!');
      }
    },
    onError: (err: any) => {
      toast.error(
        `Failed to add to cart: ${err.response?.data?.error || err.message}`,
      );
    },
  });

  const handleAddToCart = () => {
    if (!currentUser) {
      toast.error('Please log in to add to cart');
      return;
    }
    if (isAuthor) {
      toast.error('Author cannot add their own product to cart!');
      return;
    }
    addToCartMutation.mutate();
  };

  // --- Comments ---
  const { data: commentsData, isLoading: commentsLoading } = useQuery({
    queryKey: ['comments', productId],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE}/comments/${productId}`);
      return res.data;
    },
    enabled: !!productId,
  });

  const comments: Comment[] = commentsData?.comments || [];

  const addCommentMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post(`${API_BASE}/comments/add`, {
        productId,
        userId: currentUser?.id,
        userName: currentUser?.name,
        userImage: currentUser?.image,
        comment: commentText,
        rating: commentRating,
      });
      return res.data;
    },
    onSuccess: () => {
      setCommentText('');
      setCommentRating(5);
      queryClient.invalidateQueries({ queryKey: ['comments', productId] });
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const res = await axios.delete(`${API_BASE}/comments/${commentId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', productId] });
    },
  });

  const handleAddComment = () => {
    if (!currentUser) {
      alert('Comment korte hole age login korte hobe');
      return;
    }
    if (!commentText.trim()) return;
    addCommentMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f7f3] dark:bg-[#020617] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-[#16503b] mx-auto" size={64} />
          <p className="mt-4 text-gray-400 font-black uppercase tracking-[0.4em] text-[10px]">
            Loading Product Details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#f8f7f3] dark:bg-[#020617] flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-black text-red-500">Product Not Found</p>
          <Link
            href="/marketplace"
            className="mt-4 inline-block text-[#16503b] hover:underline"
          >
            Return to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  // Fake fallback data — jokhon backend e nai
  const fallback = {
    warranty: product.warranty || '1 Year',
    delivery: product.delivery || 'Standard Shipping',
    certification: product.certification || 'ISO 9001',
    location: product.location || 'Dhaka, Bangladesh',
    images:
      product.images && product.images.length > 0
        ? product.images
        : product.extraImages && product.extraImages.length > 0
          ? product.extraImages
          : [
              product.mainImage,
              product.mainImage,
              product.mainImage,
              product.mainImage,
            ],
    seller: product.seller || {
      name: 'AgroVision Direct',
      rating: 4.8,
      responseTime: '< 3 hours',
      verified: true,
    },
    aiInsights: product.aiInsights || {
      roiEstimation: '12 Months',
      maintenance: 'Low',
      bestSeason: 'Year Round',
    },
  };

  const renderStars = (rating: number = 0) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="fill-yellow-400 text-yellow-400" size={18} />,
      );
    }
    if (hasHalfStar) {
      stars.push(
        <StarHalf
          key="half"
          className="fill-yellow-400 text-yellow-400"
          size={18}
        />,
      );
    }
    while (stars.length < 5) {
      stars.push(
        <Star key={stars.length} className="text-gray-300" size={18} />,
      );
    }
    return stars;
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#f8f7f3] dark:bg-[#020617] transition-colors duration-300">
        {/* Breadcrumb */}
        <div className="max-w-[1200px] mx-auto px-4 md:px-10 pt-6">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 dark:text-gray-500">
            <Link href="/" className="hover:text-[#16503b]">
              Home
            </Link>
            <span>›</span>
            <Link href="/marketplace" className="hover:text-[#16503b]">
              Marketplace
            </Link>
            <span>›</span>
            <Link
              href={`/marketplace?category=${product.category}`}
              className="hover:text-[#16503b]"
            >
              {product.category}
            </Link>
            <span>›</span>
            <span className="text-gray-700 dark:text-gray-300 font-semibold truncate max-w-[200px]">
              {product.title}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-[1200px] mx-auto px-4 md:px-10 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left Column - Images */}
            <div className="space-y-4">
              <div className="relative aspect-[4/3] bg-white dark:bg-[#1e293b] rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800">
                <img
                  src={product.mainImage}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                {product.status === 'active' && (
                  <div className="absolute top-4 left-4 flex flex-col gap-2 items-start">
                    <span className="bg-[#16503b] text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase shadow">
                      ✓ Verified
                    </span>
                    {fallback.aiInsights && (
                      <span className="bg-orange-500 text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase flex items-center gap-1 shadow">
                        <Zap size={10} /> AI Recommended
                      </span>
                    )}
                  </div>
                )}
              </div>
              {/* Thumbnail Gallery */}
              <div className="grid grid-cols-4 gap-3">
                {fallback.images.slice(0, 4).map((img, idx) => (
                  <div
                    key={idx}
                    className="aspect-square bg-white dark:bg-[#1e293b] rounded-xl overflow-hidden cursor-pointer hover:ring-2 hover:ring-[#16503b] transition-all border border-gray-100 dark:border-gray-800"
                  >
                    <img
                      src={img}
                      alt={`${product.title} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Product Info */}
            <div className="space-y-5">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-[10px] font-black text-gray-500 bg-white dark:bg-[#1e293b] dark:text-gray-300 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700 uppercase">
                  AgroVision Official Store
                </span>
                <span className="text-[10px] font-black text-[#16503b] flex items-center gap-1">
                  <CheckCircle size={12} /> Verified Seller
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white leading-tight">
                {product.title}
              </h1>

              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1">
                  {renderStars(product.rating || 0)}
                  <span className="text-sm font-bold text-gray-500 dark:text-gray-300 ml-1">
                    ({product.reviews || reviews.length} reviews)
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-400 dark:text-gray-500">
                  <MapPin size={14} />
                  <span>{fallback.location}</span>
                </div>
              </div>

              {/* Price */}
              <div className="bg-white dark:bg-[#0b1120] p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
                <div className="flex items-end gap-3">
                  <span className="text-4xl font-black text-[#16503b] dark:text-green-500">
                    ${Number(product.price).toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg text-gray-400 line-through">
                      ${Number(product.originalPrice).toFixed(2)}
                    </span>
                  )}
                </div>
                <p className="text-xs font-bold text-green-600 mt-1">
                  ●{' '}
                  {(product.stock ?? product.quantity ?? 0) > 0
                    ? 'In Stock'
                    : 'Out of Stock'}
                </p>

                {isAuthor && (
                  <div className="mt-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2">
                    <span>⚠️</span> You listed this product. Buying and adding
                    to cart are disabled for the author.
                  </div>
                )}

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={handleBuyNow}
                    disabled={buyNowMutation.isPending || isAuthor}
                    className="flex-1 px-6 py-3.5 bg-[#16503b] text-white rounded-xl font-black uppercase tracking-wide text-xs hover:bg-[#1a6b4f] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-green-900/10"
                  >
                    {buyNowMutation.isPending ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Zap size={16} />
                    )}
                    Buy Now
                  </button>
                  <button
                    onClick={handleAddToCart}
                    disabled={addToCartMutation.isPending || isAuthor}
                    className="flex-1 px-6 py-3.5 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-black uppercase tracking-wide text-xs hover:border-[#16503b] hover:text-[#16503b] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {addToCartMutation.isPending ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <ShoppingCart size={16} />
                    )}
                    Add to Cart
                  </button>
                  <button
                    onClick={handleLikeToggle}
                    disabled={likeMutation.isPending}
                    className={`w-14 flex flex-col items-center justify-center rounded-xl border-2 transition-all ${
                      likeData?.isLiked
                        ? 'border-red-400 bg-red-50 dark:bg-red-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-red-300'
                    }`}
                  >
                    <Heart
                      size={18}
                      className={
                        likeData?.isLiked
                          ? 'fill-red-500 text-red-500'
                          : 'text-gray-400'
                      }
                    />
                    <span className="text-[9px] font-black text-gray-500 dark:text-gray-400">
                      {likeData?.likesCount ?? 0}
                    </span>
                  </button>
                  <button className="w-14 flex items-center justify-center rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 transition-all">
                    <Share2 size={18} className="text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Quick Info Tags */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Category', value: product.category },
                  { label: 'Warranty', value: fallback.warranty },
                  { label: 'Delivery', value: fallback.delivery },
                  { label: 'Certification', value: fallback.certification },
                ].map(item => (
                  <div
                    key={item.label}
                    className="bg-white dark:bg-[#0b1120] p-3 rounded-xl border border-gray-100 dark:border-gray-800 text-center"
                  >
                    <div className="text-[9px] font-black text-gray-400 uppercase tracking-wider">
                      {item.label}
                    </div>
                    <div className="text-xs font-bold text-gray-900 dark:text-white mt-1 truncate">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="mt-16">
            <div className="border-b border-gray-200 dark:border-gray-800">
              <nav className="flex gap-8 overflow-x-auto">
                {(
                  [
                    'overview',
                    'specifications',
                    'reviews',
                    'seller',
                    'related',
                  ] as const
                ).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 text-sm font-bold uppercase tracking-wider transition-colors whitespace-nowrap border-b-2 ${
                      activeTab === tab
                        ? 'border-[#16503b] text-[#16503b] dark:text-green-500'
                        : 'border-transparent text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            <div className="py-8">
              {/* Overview */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">
                      Product Overview
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {product.fullDescription || product.description}
                    </p>
                  </div>

                  <div className="bg-[#16503b] p-6 rounded-2xl">
                    <h4 className="text-lg font-black text-white flex items-center gap-2 mb-4">
                      <Zap size={20} /> AI Product Insights
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white/10 p-4 rounded-xl">
                        <div className="text-[10px] font-black text-green-200 uppercase tracking-wider">
                          ROI Estimation
                        </div>
                        <div className="text-xl font-black text-white mt-1">
                          {fallback.aiInsights.roiEstimation}
                        </div>
                      </div>
                      <div className="bg-white/10 p-4 rounded-xl">
                        <div className="text-[10px] font-black text-green-200 uppercase tracking-wider">
                          Maintenance
                        </div>
                        <div className="text-xl font-black text-white mt-1">
                          {fallback.aiInsights.maintenance}
                        </div>
                      </div>
                      <div className="bg-white/10 p-4 rounded-xl">
                        <div className="text-[10px] font-black text-green-200 uppercase tracking-wider">
                          Best Season
                        </div>
                        <div className="text-xl font-black text-white mt-1">
                          {fallback.aiInsights.bestSeason}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Specifications */}
              {activeTab === 'specifications' && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">
                    Technical Specifications
                  </h3>
                  {product.specifications &&
                  Object.keys(product.specifications).length > 0 ? (
                    <div className="bg-white dark:bg-[#0b1120] rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
                      <table className="w-full">
                        <tbody>
                          {Object.entries(product.specifications).map(
                            ([key, value], idx) => (
                              <tr
                                key={key}
                                className={
                                  idx % 2 === 0
                                    ? 'bg-gray-50 dark:bg-[#020617]'
                                    : ''
                                }
                              >
                                <td className="px-6 py-4 text-sm font-bold text-gray-700 dark:text-gray-300 uppercase border-b border-gray-100 dark:border-gray-800">
                                  {key}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800">
                                  {value}
                                </td>
                              </tr>
                            ),
                          )}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-500">
                      No specifications available for this product.
                    </p>
                  )}
                </div>
              )}

              {/* Reviews */}
              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                    Customer Reviews
                  </h3>
                  {reviews.length > 0 ? (
                    <div className="space-y-6">
                      {reviews.map(review => (
                        <div
                          key={review.id}
                          className="p-6 bg-white dark:bg-[#0b1120] rounded-2xl border border-gray-100 dark:border-gray-800"
                        >
                          <div className="flex items-start justify-between flex-wrap gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-gray-900 dark:text-white">
                                  {review.user}
                                </span>
                                {review.verified && (
                                  <span className="text-[8px] font-black text-[#16503b] bg-green-100 dark:bg-green-900/20 px-2 py-0.5 rounded-full uppercase">
                                    Verified Purchase
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1 mt-1">
                                {renderStars(review.rating)}
                              </div>
                            </div>
                            <span className="text-sm text-gray-400">
                              {new Date(review.date).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="mt-3 text-gray-600 dark:text-gray-300">
                            {review.comment}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No reviews yet.</p>
                  )}
                </div>
              )}

              {/* Seller */}
              {activeTab === 'seller' && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                    Seller Information
                  </h3>
                  <div className="bg-white dark:bg-[#0b1120] p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <div className="flex items-start gap-6 flex-wrap">
                      <Link
                        href={`/seller/${(product as any)?.userId || product?.seller?.email || productId}`}
                        className="w-20 h-20 rounded-full bg-[#16503b] flex items-center justify-center text-white font-black text-2xl overflow-hidden shrink-0"
                      >
                        {fallback.seller.image ? (
                          <img
                            src={fallback.seller.image}
                            alt={fallback.seller.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          fallback.seller.name.charAt(0)
                        )}
                      </Link>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                            {fallback.seller.name}
                          </h4>
                          {fallback.seller.verified && (
                            <span className="text-[10px] font-black text-[#16503b] bg-green-100 dark:bg-green-900/20 px-3 py-1 rounded-full uppercase flex items-center gap-1">
                              <CheckCircle size={14} /> Verified Seller
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-6 mt-2 flex-wrap text-sm text-gray-600 dark:text-gray-300">
                          <span>⭐ {fallback.seller.rating} / 5.0</span>
                          <span>⏱ {fallback.seller.responseTime}</span>
                          {fallback.seller.email && (
                            <span className="text-xs text-gray-400">
                              {fallback.seller.email}
                            </span>
                          )}
                        </div>
                        <div className="mt-4 flex flex-wrap gap-3">
                          <Link
                            href={`/seller/${(product as any)?.userId || product?.seller?.email || productId}`}
                            className="inline-flex items-center gap-2 rounded-xl bg-[#16503b] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1a6b4f]"
                          >
                            <MessageCircle size={16} /> View Seller Profile
                          </Link>
                          {fallback.seller.email ? (
                            <a
                              href={`mailto:${fallback.seller.email}`}
                              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-6 py-3 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                            >
                              <MessageCircle size={16} /> Contact Seller
                            </a>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Related */}
              {activeTab === 'related' && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                    Related Products You Might Need
                  </h3>
                  {relatedProducts?.products?.filter(
                    (p: any) => p._id !== productId,
                  ).length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {relatedProducts.products
                        .filter((p: any) => p._id !== productId)
                        .slice(0, 4)
                        .map((related: any) => (
                          <Link
                            href={`/marketplace/${related._id}`}
                            key={related._id}
                          >
                            <div className="bg-white dark:bg-[#0b1120] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer">
                              <div className="aspect-square bg-gray-100 dark:bg-[#1e293b] overflow-hidden">
                                <img
                                  src={related.mainImage}
                                  alt={related.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="p-4">
                                <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate">
                                  {related.title}
                                </h4>
                                <p className="text-lg font-black text-[#16503b] dark:text-green-500 mt-1">
                                  ${Number(related.price).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No related products found.</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* -------- COMMENTS SECTION -------- */}
          <div className="mt-16">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <MessageCircle size={22} className="text-[#16503b]" />
              Comments ({comments.length})
            </h3>

            {/* Add comment box */}
            <div className="bg-white dark:bg-[#0b1120] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 mb-6">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-[#16503b] flex items-center justify-center text-white font-black text-sm shrink-0">
                  {currentUser?.name?.charAt(0) || '?'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        disabled={!currentUser}
                        onClick={() => setCommentRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="disabled:cursor-not-allowed"
                      >
                        <Star
                          size={18}
                          className={
                            star <= (hoverRating || commentRating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }
                        />
                      </button>
                    ))}
                    {currentUser && (
                      <span className="text-xs text-gray-400 ml-1">
                        {commentRating}/5
                      </span>
                    )}
                  </div>
                  <textarea
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    placeholder={
                      currentUser
                        ? 'Ei product niye tomar mot likho...'
                        : 'Comment korte age login koro'
                    }
                    disabled={!currentUser}
                    rows={2}
                    className="w-full p-3 rounded-xl bg-gray-50 dark:bg-[#1e293b] dark:text-white border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-[#16503b]/30 text-sm resize-none disabled:opacity-60"
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={handleAddComment}
                      disabled={
                        !currentUser ||
                        !commentText.trim() ||
                        addCommentMutation.isPending
                      }
                      className="px-5 py-2 bg-[#16503b] text-white rounded-xl text-xs font-black uppercase tracking-wide hover:bg-[#1a6b4f] transition-all disabled:opacity-40 flex items-center gap-2"
                    >
                      {addCommentMutation.isPending ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Send size={14} />
                      )}
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Comment list */}
            {commentsLoading ? (
              <div className="text-center py-8">
                <Loader2
                  className="animate-spin text-[#16503b] mx-auto"
                  size={28}
                />
              </div>
            ) : comments.length > 0 ? (
              <div className="space-y-4">
                {comments.map(c => (
                  <div
                    key={c._id}
                    className="flex gap-3 p-4 bg-white dark:bg-[#0b1120] rounded-2xl border border-gray-100 dark:border-gray-800"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-white font-black text-sm shrink-0 overflow-hidden">
                      {c.userImage ? (
                        <img
                          src={c.userImage}
                          alt={c.userName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        c.userName?.charAt(0)
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-gray-900 dark:text-white">
                            {c.userName}
                          </span>
                          {!!c.rating && (
                            <div className="flex items-center">
                              {renderStars(c.rating)}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-400">
                            {new Date(c.createdAt).toLocaleDateString()}
                          </span>
                          {currentUser?.id === c.userId && (
                            <button
                              onClick={() =>
                                deleteCommentMutation.mutate(c._id)
                              }
                              className="text-gray-300 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {c.comment}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-white dark:bg-[#0b1120] rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
                <p className="text-gray-400 font-bold text-sm">
                  Kono comment nai, প্রথম comment তুমিই করো!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default ProductDetailsPage;
