import type { Metadata } from 'next';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ProductsSection from '@/components/ProductsSection';
import WhyUsSection from '@/components/WhyUsSection';
import IngredientsSection from '@/components/IngredientsSection';
import GallerySection from '@/components/GallerySection';
import PickupSection from '@/components/PickupSection';
import WhatsAppCTA from '@/components/WhatsAppCTA';
import Footer from '@/components/Footer';
import { LocalBusinessSchema } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Appambattu Mutta Mittai | அப்பம்பட்டு முட்டை மிட்டாய் | Traditional Egg Sweet Villupuram',
  description:
    'Appambattu Mutta Mittai – authentic traditional egg sweet from Meenambur, Villupuram, Tamil Nadu. Made with milk, egg, cashew nut paste and sugar. Pickup only. Order via WhatsApp: +91 7871949015',
  alternates: { canonical: 'https://appambattumuttamittai.com' },
};

export default function HomePage() {
  return (
    <>
      <LocalBusinessSchema />
      <Header />
      <main>
        <HeroSection />
        <ProductsSection />
        <WhyUsSection />
        <IngredientsSection />
        <GallerySection />
        <PickupSection />
        <WhatsAppCTA />
      </main>
      <Footer />
    </>
  );
}
