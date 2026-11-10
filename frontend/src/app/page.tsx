import Header from '@/components/Header';
import HeroSlider from '@/components/HeroSlider';
import ProductsSection from '@/components/ProductsSection';
import FeedbackSection from '@/components/FeedbackSection';
import PickupSection from '@/components/PickupSection';
import WhatsAppCTA from '@/components/WhatsAppCTA';
import Footer from '@/components/Footer';
import { LocalBusinessSchema } from '@/components/JsonLd';
import LogoIntro from '@/components/LogoIntro';

export default function HomePage() {
  return (
    <>
      <LogoIntro />
      <LocalBusinessSchema />
      <Header />
      <main>
        <HeroSlider />
        <ProductsSection />
        <FeedbackSection />
        <PickupSection />
        <WhatsAppCTA />
      </main>
      <Footer />
    </>
  );
}
