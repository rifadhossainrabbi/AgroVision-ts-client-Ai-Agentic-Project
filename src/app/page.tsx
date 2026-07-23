import Banner from "@/components/home/Banner";
import Features from "@/components/home/Features";
import Newsletter from "@/components/home/Newsletter";
import Testimonials from "@/components/home/Testimonials";

export default function Home() {
  return (
    <div>
      <Banner/>
      <Features />
      <Testimonials />
      <Newsletter/>
    </div>
  );
}
