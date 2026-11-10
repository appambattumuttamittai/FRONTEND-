'use client';
import Header from '@/components/Header';
import HeroSlider from '@/components/HeroSlider';
import ProductsSection from '@/components/ProductsSection';
import FeedbackSection from '@/components/FeedbackSection';
import PickupSection from '@/components/PickupSection';
import WhatsAppCTA from '@/components/WhatsAppCTA';
import Footer from '@/components/Footer';
import { LocalBusinessSchema } from '@/components/JsonLd';
import LogoIntro from '@/components/LogoIntro';
import { AppProvider } from '@/context/AppContext';
import ProductModal from '@/components/ProductModal';

export default function HomePage() {
  return (
    <AppProvider>
      <LogoIntro />
      <LocalBusinessSchema />
      <Header />
      <main className="mobile-nav-spacer">
        <HeroSlider />
        <ProductsSection />
        <FeedbackSection />
        <PickupSection />
        <WhatsAppCTA />
      </main>
      <Footer />
      {/* Global product modal — rendered at root so any component can open it */}
      <ProductModal />
    </AppProvider>
  );
}
