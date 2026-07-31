import Banner from '@/components/home/Banner';
import Features from '@/components/home/Features';
import HowItWorks from '@/components/home/HowItWorks';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import ImpactSection from '@/components/home/ImpactSection';
import TrustedPartners from '@/components/home/TrustedPartners';
import Testimonials from '@/components/home/Testimonials';
import Newsletter from '@/components/home/Newsletter';

export default function Home() {
  return (
    <div>
      <Banner />
      <Features />
      <HowItWorks />
      <FeaturedProducts />
      <ImpactSection />
      <TrustedPartners />
      <Testimonials />
      <Newsletter />
    </div>
  );
}
