import Banner from '@/components/home/Banner';
import Features from '@/components/home/Features';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import ImpactSection from '@/components/home/ImpactSection';
import Newsletter from '@/components/home/Newsletter';
import Testimonials from '@/components/home/Testimonials';

export default function Home() {
  return (
    <div>
      <Banner />
      <Features />
      <FeaturedProducts />
      <ImpactSection />
      <Testimonials />
      <Newsletter />
    </div>
  );
}
