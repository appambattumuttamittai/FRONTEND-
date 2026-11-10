'use client';
import { useRef, useEffect } from 'react';
import Link from 'next/link';

export default function HeroSlider() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <section
      className="relative overflow-hidden bg-[#582A00]"
      style={{ height: '100vh', minHeight: 560 }}
      aria-label="Welcome to Appambattu Mutta Mittai"
    >
      {/* Background video — muted, autoplay, loop */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        poster="/images/slider-1.png"
        className="absolute inset-0 w-full h-full object-cover"
        aria-hidden="true"
      >
        <source src="/videos/hero-bg-main.mp4" type="video/mp4" />
        <source src="/videos/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* Dark gradient overlay — mobile: lighter so video shows through more */}
      <div
        className="absolute inset-0 md:hidden"
        style={{
          background:
            'linear-gradient(100deg, rgba(88,42,0,0.52) 0%, rgba(88,42,0,0.28) 55%, rgba(88,42,0,0.10) 100%)',
        }}
      />
      {/* Dark gradient overlay — desktop: original opacity */}
      <div
        className="absolute inset-0 hidden md:block"
        style={{
          background:
            'linear-gradient(100deg, rgba(88,42,0,0.84) 0%, rgba(88,42,0,0.48) 55%, rgba(88,42,0,0.22) 100%)',
        }}
      />
      {/* Bottom fade — mobile: lighter */}
      <div
        className="absolute inset-0 md:hidden"
        style={{ background: 'linear-gradient(to top, rgba(88,42,0,0.35) 0%, transparent 50%)' }}
      />
      {/* Bottom fade — desktop: original */}
      <div
        className="absolute inset-0 hidden md:block"
        style={{ background: 'linear-gradient(to top, rgba(88,42,0,0.65) 0%, transparent 50%)' }}
      />

      {/* Text content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="max-w-xl">
            {/* Badge removed per user request */}

            {/* Tamil title */}
            <h1
              className="font-black text-white leading-tight mb-3 drop-shadow-lg"
              style={{
                fontFamily: "'Noto Sans Tamil', 'Exo 2', sans-serif",
                fontSize: 'clamp(2.2rem, 5.5vw, 3.8rem)',
                textShadow: '0 2px 20px rgba(0,0,0,0.5)',
              }}
            >
              அப்பம்பட்டு முட்டை மிட்டாய்
            </h1>

            {/* Subtitle */}
            <p
              className="font-bold text-white/90 mb-2"
              style={{ fontSize: 'clamp(1rem, 2.5vw, 1.3rem)', textShadow: '0 1px 8px rgba(0,0,0,0.3)' }}
            >
              Appambattu Mutta Mittai
            </p>

            {/* Description */}
            <p
              className="text-white/80 leading-relaxed mb-8"
              style={{ fontSize: 'clamp(0.9rem, 2vw, 1.05rem)', textShadow: '0 1px 8px rgba(0,0,0,0.3)' }}
            >
              India&apos;s authentic traditional egg sweet — made fresh daily at
              Villupuram Railway Station, 1st Platform. Home delivery available within Villupuram.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Link
                href="/order"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-black text-sm transition-all hover:-translate-y-0.5"
                style={{ background: '#C42F2C', color: 'white', boxShadow: '0 8px 24px rgba(196,47,44,0.5)' }}
              >
                Order Now
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <a
                href="https://wa.me/917871949015?text=Hi%2C%20I%20want%20to%20order%20Mutta%20Mittai!"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm text-white transition-all hover:-translate-y-0.5"
                style={{
                  background: 'rgba(255,255,255,0.18)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.35)',
                }}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.126.554 4.126 1.523 5.862L0 24l6.344-1.493A11.948 11.948 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.87 0-3.63-.48-5.17-1.33l-.37-.21-3.77.89.9-3.68-.23-.38A9.952 9.952 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                </svg>
                WhatsApp Order
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Wave SVG bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg viewBox="0 0 1440 80" className="wave-bottom" aria-hidden="true" preserveAspectRatio="none">
          <path d="M0,50 C200,90 440,10 720,55 C980,90 1240,15 1440,50 L1440,80 L0,80 Z" fill="#FFFFFF" />
        </svg>
      </div>
    </section>
  );
}
