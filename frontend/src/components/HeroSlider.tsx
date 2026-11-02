'use client';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const slides = [
  {
    image: '/images/slider-1.jpg',
    title: 'அப்பம்பட்டு முட்டை மிட்டாய்',
    subtitle: 'Appambattu Mutta Mittai',
    desc: "India's authentic traditional egg sweet — made fresh daily in Villupuram",
    cta: 'Order Now',
    ctaHref: '/order',
  },
  {
    image: '/images/slider-2.jpg',
    title: 'தூய பொருட்கள்',
    subtitle: 'Pure & Natural Ingredients',
    desc: 'Crafted with milk, egg, cashew nut paste and pure sugar — no preservatives',
    cta: 'View Products',
    ctaHref: '#products',
  },
  {
    image: '/images/slider-3.jpg',
    title: 'பாரம்பரிய செய்முறை',
    subtitle: 'Traditional Tamil Recipe',
    desc: 'Pickup from Meenambur, Appambattu, Villupuram, Tamil Nadu',
    cta: 'Get Directions',
    ctaHref: '#contact',
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const goTo = useCallback((idx: number) => {
    if (transitioning) return;
    setTransitioning(true);
    setTimeout(() => {
      setCurrent(idx);
      setTransitioning(false);
    }, 350);
  }, [transitioning]);

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
      style={{ height: 'clamp(440px, 60vw, 580px)' }}
      aria-label="Featured promotions slider"
    >
      {/* Image */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{ opacity: transitioning ? 0 : 1 }}
      >
        <Image
          src={slide.image}
          alt={slide.subtitle}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#582A00]/85 via-[#582A00]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#582A00]/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div
        className="relative z-10 h-full flex items-center"
        style={{ opacity: transitioning ? 0 : 1, transition: 'opacity 0.4s ease' }}
      >
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="max-w-xl">
            <p className="text-[#D97706] font-bold text-sm tracking-widest uppercase mb-3">
              {slide.subtitle}
            </p>
            <h1
              className="text-white font-black leading-tight mb-4"
              style={{ fontFamily: "'Noto Sans Tamil', 'Exo 2', sans-serif", fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
            >
              {slide.title}
            </h1>
            <p className="text-white/80 text-base md:text-lg mb-8 leading-relaxed">
              {slide.desc}
            </p>
            <Link
              href={slide.ctaHref}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#C42F2C] text-white rounded-full font-bold text-base hover:bg-[#a82624] transition-all shadow-xl hover:-translate-y-0.5 hover:shadow-2xl"
            >
              {slide.cta}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Prev / Next arrows */}
      <button
        onClick={prev}
        className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur flex items-center justify-center transition-all"
        aria-label="Previous slide"
      >
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
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
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-500 ${
              i === current
                ? 'bg-[#D97706] w-8'
                : 'bg-white/50 hover:bg-white/80 w-2'
            }`}
          />
        ))}
      </div>

      {/* Wave SVG bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg viewBox="0 0 1440 80" className="wave-bottom" aria-hidden="true" preserveAspectRatio="none">
          <path d="M0,50 C200,90 440,10 720,55 C980,90 1240,15 1440,50 L1440,80 L0,80 Z" fill="#FFF8F0"/>
        </svg>
      </div>
    </section>
  );
}
