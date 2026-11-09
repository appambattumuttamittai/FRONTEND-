'use client';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const sliderImages = [
  { src: '/images/shop-photo.jpg', alt: 'Couple enjoying Appambattu Mutta Mittai' },
  { src: '/images/lifestyle-kids.jpg', alt: 'Children enjoying Appambattu Mutta Mittai' },
  { src: '/images/lifestyle-family.jpg', alt: 'Three generations enjoying Appambattu Mutta Mittai together' },
];

function ImageSlider() {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  const goTo = useCallback((idx: number) => {
    setFading(true);
    setTimeout(() => {
      setCurrent(idx);
      setFading(false);
    }, 400);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      goTo((current + 1) % sliderImages.length);
    }, 4000);
    return () => clearInterval(id);
  }, [current, goTo]);

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-2xl" style={{ minHeight: 340 }}>
      {/* Images */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{ opacity: fading ? 0 : 1 }}
      >
        <Image
          src={sliderImages[current].src}
          alt={sliderImages[current].alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={current === 0}
        />
      </div>

      {/* Light bottom gradient only — no text overlay */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, rgba(88,42,0,0.35) 0%, transparent 45%)' }}
      />

      {/* Dot indicators */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
        {sliderImages.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to image ${i + 1}`}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === current ? 28 : 8,
              height: 8,
              background: i === current ? '#F5B51B' : 'rgba(255,255,255,0.6)',
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function PickupSection() {
  return (
    <section className="py-20" style={{ background: '#FFF8F0' }} aria-labelledby="pickup-heading">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Tagline banner */}
        <div className="text-center mb-12">
          <p
            className="font-black italic leading-snug mx-auto"
            style={{
              color: '#582A00',
              fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
              maxWidth: 600,
              fontFamily: "'Exo 2', sans-serif",
            }}
          >
            &ldquo;A timeless sweetness from Appambattu that melts in the mouth of all three generations&rdquo;
          </p>
          <div className="mt-3 w-16 h-1 mx-auto rounded-full" style={{ background: '#D97706' }} />
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* 3-Image auto slider */}
          <ImageSlider />

          {/* Content */}
          <div>
            <span
              className="text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full inline-block mb-4"
              style={{ background: 'rgba(196,47,44,0.08)', color: '#C42F2C' }}
            >
              Pickup + Home Delivery
            </span>
            <h2
              id="pickup-heading"
              className="font-black text-4xl mb-4"
              style={{ color: '#582A00', fontFamily: "'Exo 2', sans-serif" }}
            >
              How to Order
            </h2>
            <div className="space-y-5 mb-6">
              {[
                {
                  step: '1',
                  title: 'Choose Your Pack',
                  desc: 'Select from 250 gm, 500 gm, 750 gm or 1 kg pack sizes.',
                },
                {
                  step: '2',
                  title: 'Place Your Order',
                  desc: 'Order online or WhatsApp us at +91 78719 49015.',
                },
                {
                  step: '3',
                  title: 'Pickup or Home Delivery',
                  desc: 'Collect from Villupuram Railway Station, 1st Platform — OR — get home delivery within Villupuram.',
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-4 items-start">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-black text-white text-sm shadow"
                    style={{ background: '#C42F2C' }}
                  >
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-bold mb-0.5" style={{ color: '#582A00' }}>{item.title}</h3>
                    <p className="text-sm" style={{ color: 'rgba(61,30,8,0.6)' }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery note */}
            <div
              className="rounded-2xl px-4 py-3 mb-6 text-sm font-semibold flex items-start gap-2"
              style={{
                background: 'rgba(217,119,6,0.09)',
                color: '#7a4800',
                border: '1px solid rgba(217,119,6,0.22)',
              }}
            >
              <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" />
              </svg>
              Home delivery available within Villupuram only. For other locations, please use pickup at Villupuram Railway Station.
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/order"
                className="px-6 py-3 rounded-full font-bold text-sm text-white shadow transition-all hover:-translate-y-0.5"
                style={{ background: '#C42F2C' }}
              >
                Order Now
              </Link>
              <a
                href="https://wa.me/917871949015"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full font-bold text-sm border-2 transition-all hover:-translate-y-0.5"
                style={{ borderColor: '#C42F2C', color: '#C42F2C' }}
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
