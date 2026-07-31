'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules';
import { ArrowRight } from 'lucide-react';

// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const bannerData = [
  {
    image: '/assets/slider1.png',
    title: 'AI-Powered Smart Farming',
    subtitle:
      'Experience the next generation of agriculture with intelligent automation and real-time monitoring.',
  },
  {
    image: '/assets/slider2.png',
    title: 'Precision Aerial Monitoring',
    subtitle:
      'Advanced drone technology delivering accurate crop health data from the skies.',
  },
  {
    image: '/assets/slider3.png',
    title: 'Smart Irrigation Systems',
    subtitle:
      'Optimize water usage with predictive AI that tracks weather patterns and soil moisture.',
  },
  {
    image: '/assets/slider4.png',
    title: 'Empowering Local Farmers',
    subtitle:
      'Bridging the gap between traditional wisdom and cutting-edge artificial intelligence.',
  },
  {
    image: '/assets/slider5.png',
    title: 'Real-time Field Analytics',
    subtitle:
      'Monitor growth rates and field conditions with instant data visualization.',
  },
  {
    image: '/assets/slider6.png',
    title: 'Autonomous Farm Operations',
    subtitle:
      'Maximize efficiency with robotic machinery and smart greenhouse integration.',
  },
  {
    image: '/assets/slider7.png',
    title: 'Sustainable Ecosystems',
    subtitle:
      'Protecting biodiversity while increasing yields through nature-friendly AI solutions.',
  },
];

const Banner = () => {
  const router = useRouter();

  return (
    <section className="w-full h-[60vh] md:h-[70vh] relative overflow-hidden">
      <Swiper
        modules={[Autoplay, Navigation, Pagination, EffectFade]}
        effect="fade"
        speed={1000}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={true}
        loop={true}
        className="mySwiper w-full h-full"
      >
        {bannerData.map((slide, index) => (
          <SwiperSlide key={index} className="relative w-full h-full">
            {/* Image Background */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[5000ms] scale-100 hover:scale-110"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              {/* Overlay for better text visibility */}
              <div className="absolute inset-0 bg-black/40 dark:bg-black/60" />
            </div>

            {/* Content Area */}
            <div className="relative h-full flex items-center justify-center text-center px-4">
              <div className="max-w-4xl space-y-6">
                <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg animate-in fade-in slide-in-from-bottom-8 duration-700">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-xl text-gray-100 dark:text-gray-200 max-w-2xl mx-auto drop-shadow animate-in fade-in slide-in-from-bottom-12 duration-1000">
                  {slide.subtitle}
                </p>

                <div className="pt-4 animate-in fade-in slide-in-from-bottom-16 duration-1000">
                  <button
                    onClick={() => router.push('/marketplace')}
                    className="group relative bg-[#16503b] hover:bg-[#12402f] text-white px-10 py-4 rounded-full font-bold text-lg flex items-center gap-2 mx-auto transition-all cursor-pointer active:scale-95 shadow-xl"
                  >
                    Explore
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Styles for Swiper dots/arrows are in globals.css already */}
    </section>
  );
};

export default Banner;
