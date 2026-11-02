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
    overlayFrom: 'rgba(88,42,0,0.72)',
    overlayTo: 'rgba(88,42,0,0.20)',
  },
  {
    image: '/images/slider-2.png',
    title: 'தூய பொருட்கள்',
    subtitle: 'Pure & Natural Ingredients',
    desc: 'Crafted with milk, egg, cashew nut paste and pure sugar — no preservatives',
    cta: 'View Products',
    ctaHref: '#products',
    overlayFrom: 'rgba(196,47,44,0.68)',
    overlayTo: 'rgba(88,42,0,0.18)',
  },
  {
    image: '/images/slider-3.png',
    title: 'பாரம்பரிய செய்முறை',
    subtitle: 'Traditional Tamil Recipe',
    desc: 'Pickup from Meenambur, Appambattu, Villupuram, Tamil Nadu',
    cta: 'Get Directions',
    ctaHref: '#contact',
    overlayFrom: 'rgba(61,24,0,0.70)',
    overlayTo: 'rgba(196,47,44,0.22)',
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
      }, 400);
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
      className="relative overflow-hidden bg-[#582A00]"
      style={{ height: 'clamp(500px, 70vw, 680px)' }}
      aria-label="Featured promotions slider"
    >
      {/* ── Full-bleed background image ── */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{ opacity: transitioning ? 0 : 1 }}
      >
        <Image
          src={slide.image}
          alt={slide.subtitle}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      {/* ── Gradient overlay (left-heavy so text is readable) ── */}
      <div
        className="absolute inset-0 transition-all duration-700"
        style={{
          background: `linear-gradient(100deg, ${slide.overlayFrom} 0%, ${slide.overlayTo} 55%, transparent 100%)`,
        }}
      />
      {/* Bottom fade for wave transition */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(88,42,0,0.55) 0%, transparent 50%)' }} />

      {/* ── Text content ── */}
      <div
        className="relative z-10 h-full flex items-center"
        style={{ opacity: transitioning ? 0 : 1, transition: 'opacity 0.45s ease' }}
      >
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="max-w-lg">
            {/* Tag */}
            <div
              className="inline-block px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase mb-5"
              style={{ background: 'rgba(245,181,27,0.22)', border: '1px solid rgba(245,181,27,0.5)', color: '#F5B51B' }}
            >
              {slide.subtitle}
            </div>

            {/* Title */}
            <h1
              className="font-black text-white leading-tight mb-4 drop-shadow-lg"
              style={{
                fontFamily: "'Noto Sans Tamil', 'Exo 2', sans-serif",
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                textShadow: '0 2px 20px rgba(0,0,0,0.4)',
              }}
            >
              {slide.title}
            </h1>

            {/* Desc */}
            <p
              className="text-white/85 leading-relaxed mb-8"
              style={{ fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', textShadow: '0 1px 8px rgba(0,0,0,0.3)' }}
            >
              {slide.desc}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Link
                href={slide.ctaHref}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-black text-sm transition-all hover:-translate-y-0.5"
                style={{ background: '#C42F2C', color: 'white', boxShadow: '0 8px 24px rgba(196,47,44,0.5)' }}
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
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm text-white transition-all hover:-translate-y-0.5"
                style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.35)' }}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.126.554 4.126 1.523 5.862L0 24l6.344-1.493A11.948 11.948 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.87 0-3.63-.48-5.17-1.33l-.37-.21-3.77.89.9-3.68-.23-.38A9.952 9.952 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                </svg>
                WhatsApp Order
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Prev arrow ── */}
      <button
        onClick={prev}
        className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-110"
        style={{ background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)' }}
        aria-label="Previous slide"
      >
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* ── Next arrow ── */}
      <button
        onClick={next}
        className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-110"
        style={{ background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)' }}
        aria-label="Next slide"
      >
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* ── Slide counter (syedsweets style) ── */}
      <div className="absolute bottom-14 right-6 z-20 flex items-center gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="rounded-full transition-all duration-500"
            style={{
              height: 8,
              width: i === current ? 32 : 8,
              background: i === current ? '#F5B51B' : 'rgba(255,255,255,0.45)',
            }}
          />
        ))}
      </div>

      {/* ── Wave SVG bottom ── */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg viewBox="0 0 1440 80" className="wave-bottom" aria-hidden="true" preserveAspectRatio="none">
          <path d="M0,50 C200,90 440,10 720,55 C980,90 1240,15 1440,50 L1440,80 L0,80 Z" fill="#FFF8F0" />
        </svg>
      </div>
    </section>
  );
}
