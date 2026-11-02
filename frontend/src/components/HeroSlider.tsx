'use client';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const slides = [
  {
    image: '/images/slider-1.png',
    title: 'அப்பம்பட்டு முட்டை மிட்டாய்',
    subtitle: 'Appambattu Mutta Mittai',
    desc: "India's authentic traditional egg sweet — made fresh daily in Villupuram",
    cta: 'Order Now',
    ctaHref: '/order',
    bg: 'linear-gradient(135deg, #582A00 0%, #8B3A00 50%, #C47A2A 100%)',
  },
  {
    image: '/images/slider-2.png',
    title: 'தூய பொருட்கள்',
    subtitle: 'Pure & Natural Ingredients',
    desc: 'Crafted with milk, egg, cashew nut paste and pure sugar — no preservatives',
    cta: 'View Products',
    ctaHref: '#products',
    bg: 'linear-gradient(135deg, #7a2000 0%, #C42F2C 55%, #e05c3a 100%)',
  },
  {
    image: '/images/slider-3.png',
    title: 'பாரம்பரிய செய்முறை',
    subtitle: 'Traditional Tamil Recipe',
    desc: 'Pickup from Meenambur, Appambattu, Villupuram, Tamil Nadu',
    cta: 'Get Directions',
    ctaHref: '#contact',
    bg: 'linear-gradient(135deg, #3d1800 0%, #7a4000 50%, #D97706 100%)',
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const goTo = useCallback(
    (idx: number) => {
      if (transitioning) return;
      setTransitioning(true);
      setTimeout(() => {
        setCurrent(idx);
        setTransitioning(false);
      }, 350);
    },
    [transitioning]
  );

  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo]);
  const prev = useCallback(() => goTo((current - 1 + slides.length) % slides.length), [current, goTo]);

  useEffect(() => {
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next]);

  const slide = slides[current];

  return (
    <section
      className="relative overflow-hidden transition-colors duration-700"
      style={{ height: 'clamp(480px, 65vw, 620px)', background: slide.bg }}
      aria-label="Featured promotions slider"
    >
      {/* Subtle dot texture */}
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='1.5' fill='%23F5B51B'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Slide content */}
      <div
        className="relative z-10 h-full"
        style={{ opacity: transitioning ? 0 : 1, transition: 'opacity 0.4s ease' }}
      >
        <div className="container mx-auto px-4 max-w-6xl h-full">
          <div className="grid md:grid-cols-2 gap-4 h-full items-center">

            {/* Left — Text */}
            <div className="flex flex-col justify-center pt-8 pb-20 md:py-0 order-2 md:order-1 text-center md:text-left">
              <p className="text-[#F5B51B] font-bold text-xs tracking-widest uppercase mb-3">
                {slide.subtitle}
              </p>
              <h1
                className="text-white font-black leading-tight mb-4"
                style={{
                  fontFamily: "'Noto Sans Tamil', 'Exo 2', sans-serif",
                  fontSize: 'clamp(1.6rem, 3.5vw, 2.8rem)',
                }}
              >
                {slide.title}
              </h1>
              <p className="text-white/80 text-sm md:text-base mb-7 leading-relaxed">
                {slide.desc}
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <Link
                  href={slide.ctaHref}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#582A00] rounded-full font-black text-sm hover:bg-[#FFF8F0] transition-all shadow-xl hover:-translate-y-0.5"
                >
                  {slide.cta}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <a
                  href="https://wa.me/917871949015?text=Hi%2C%20I%20want%20to%20order%20Mutta%20Mittai!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-full font-bold text-sm hover:bg-[#20bb5a] transition-all shadow-lg"
                >
                  WhatsApp Order
                </a>
              </div>
              <div className="flex flex-wrap gap-2 mt-5 justify-center md:justify-start">
                {['FSSAI Certified', 'No Preservatives', 'Fresh Daily'].map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-semibold px-3 py-1 rounded-full border border-white/30 text-white/65"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right — Sweet product image (transparent PNG) */}
            <div className="order-1 md:order-2 flex items-center justify-center h-full py-6 md:py-0">
              <div
                className="relative w-full"
                style={{ maxWidth: 'clamp(220px, 40vw, 420px)', aspectRatio: '1 / 0.88' }}
              >
                <Image
                  src={slide.image}
                  alt={slide.subtitle}
                  fill
                  priority
                  className="object-contain"
                  sizes="(max-width: 768px) 75vw, 42vw"
                  style={{ filter: 'drop-shadow(0 24px 48px rgba(0,0,0,0.45))' }}
                />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Prev arrow */}
      <button
        onClick={prev}
        className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur flex items-center justify-center transition-all"
        aria-label="Previous slide"
      >
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Next arrow */}
      <button
        onClick={next}
        className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur flex items-center justify-center transition-all"
        aria-label="Next slide"
      >
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-500 ${
              i === current ? 'bg-[#F5B51B] w-8' : 'bg-white/40 hover:bg-white/70 w-2'
            }`}
          />
        ))}
      </div>

      {/* Wave SVG bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg viewBox="0 0 1440 80" className="wave-bottom" aria-hidden="true" preserveAspectRatio="none">
          <path d="M0,50 C200,90 440,10 720,55 C980,90 1240,15 1440,50 L1440,80 L0,80 Z" fill="#FFF8F0" />
        </svg>
      </div>
    </section>
  );
}
