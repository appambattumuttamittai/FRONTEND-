'use client';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';

function PackSizes() {
  const { openModal, products } = useApp();

  const fallbackProducts = [
    { id: '250gm', weight: '250gm', weightGrams: 250,  price: 150, inStock: true },
    { id: '500gm', weight: '500gm', weightGrams: 500,  price: 300, inStock: true },
    { id: '750gm', weight: '750gm', weightGrams: 750,  price: 450, inStock: true },
    { id: '1kg',   weight: '1kg',   weightGrams: 1000, price: 600, inStock: true },
  ];

  const items = [
    { label: '250 gm — Small',  id: '250gm' },
    { label: '500 gm — Medium', id: '500gm' },
    { label: '750 gm — Large',  id: '750gm' },
    { label: '1 kg — Family',   id: '1kg'   },
  ];

  const handleClick = (id: string) => {
    const found = products.find((p) => p.id === id)
      || fallbackProducts.find((p) => p.id === id);
    if (found) openModal(found);
  };

  return (
    <div>
      <h3 className="font-black text-[11px] tracking-widest uppercase mb-4" style={{ color: '#582A00' }}>
        Pack Sizes
      </h3>
      <div className="flex flex-col gap-2.5">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => handleClick(item.id)}
            className="text-sm transition-colors hover:text-[#C42F2C] text-left"
            style={{ color: 'rgba(88,42,0,0.6)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();
  const waLink = 'https://wa.me/917871949015?text=Hi%2C%20I%20want%20to%20order%20Mutta%20Mittai!';

  return (
    <footer id="contact" role="contentinfo">

      {/* ═══════════════════════════════════════════════
          TOP — cream panel: big tagline CTA  (Elevate-style)
      ═══════════════════════════════════════════════ */}
      <div
        style={{ background: '#FFFFFF', borderTop: '1px solid rgba(88,42,0,0.08)' }}
        className="hidden md:block pt-10 pb-16 px-4 text-center"
      >
        <p
          className="font-black leading-tight mx-auto mb-8"
          style={{
            color: '#582A00',
            fontSize: 'clamp(1.4rem, 3.5vw, 2.4rem)',
            maxWidth: 680,
            fontFamily: "'Exo 2', sans-serif",
            lineHeight: 1.3,
          }}
        >
          Order fresh APPAMPATTU Mutta Mittai today — made with milk &amp; egg.
          Pickup at Villupuram Railway Station or home delivery within Villupuram.
        </p>

        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/order"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-black text-sm text-white transition-all hover:-translate-y-0.5"
            style={{ background: '#C42F2C', boxShadow: '0 8px 24px rgba(196,47,44,0.35)' }}
          >
            Order Now
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm border-2 transition-all hover:-translate-y-0.5"
            style={{ borderColor: '#C42F2C', color: '#C42F2C' }}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.126.554 4.126 1.523 5.862L0 24l6.344-1.493A11.948 11.948 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.87 0-3.63-.48-5.17-1.33l-.37-.21-3.77.89.9-3.68-.23-.38A9.952 9.952 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
            </svg>
            WhatsApp Order
          </a>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          MAIN — white panel: logo top-left + columns  (Pension.de-style)
      ═══════════════════════════════════════════════ */}
      <div style={{ background: '#FFFFFF', borderTop: '1px solid rgba(88,42,0,0.07)' }} className="pt-8 md:pt-12 pb-4 md:pb-10 px-4">
        <div className="container mx-auto max-w-6xl">

          {/* Logo row */}
          <div className="mb-6 md:mb-10 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo.jpg"
              alt="APPAMPATTU Egg Sweet Logo"
              width={52}
              height={52}
              style={{ borderRadius: '50%', border: '2px solid rgba(88,42,0,0.15)', display: 'block', flexShrink: 0 }}
            />
            {/* Mobile: show big brand name beside logo; Desktop: show small name */}
            <div className="hidden md:block">
              <p className="font-black text-sm leading-tight" style={{ color: '#582A00', fontFamily: "'Exo 2', sans-serif" }}>
                APPAMPATTU
              </p>
              <p className="font-bold text-xs" style={{ color: '#D97706' }}>
                Mutta Mittai
              </p>
            </div>
            <h2
              className="md:hidden font-black leading-none"
              style={{
                color: '#2A1000',
                fontSize: 'clamp(1.4rem, 7vw, 2rem)',
                fontFamily: "'Exo 2', sans-serif",
                letterSpacing: '-0.02em',
              }}
            >
              APPAMPATTU<br />
              <span style={{ color: '#D97706' }}>MUTTA</span><br />
              MITTAI
            </h2>
          </div>

          {/* Columns grid — 2-col on mobile, 4-col on desktop */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 pb-6 md:pb-10" style={{ borderBottom: '1px solid rgba(88,42,0,0.08)' }}>

            {/* Brand blurb — hidden on mobile (name shown in logo row), 1 col on desktop */}
            <div className="hidden md:block md:col-span-1">
              {/* Giant stacked brand name à la Elevate — desktop only (mobile shows it in logo row) */}
              <h2
                className="hidden md:block font-black leading-none mb-4"
                style={{
                  color: '#2A1000',
                  fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)',
                  fontFamily: "'Exo 2', sans-serif",
                  letterSpacing: '-0.02em',
                }}
              >
                APPAMPATTU<br />
                <span style={{ color: '#D97706' }}>MUTTA</span><br />
                MITTAI
              </h2>
              <p
                className="text-xs leading-relaxed hidden md:block"
                style={{ color: 'rgba(88,42,0,0.5)', maxWidth: 220 }}
              >
                Traditional Tamil Nadu egg sweet — made fresh daily.
                One product. One station. Authentic since generations.
              </p>
            </div>

            {/* Pack Sizes */}
              <PackSizes />

            {/* Quick Links */}
            <div>
              <h3 className="font-black text-[11px] tracking-widest uppercase mb-4" style={{ color: '#582A00' }}>
                Quick Links
              </h3>
              <div className="flex flex-col gap-2.5">
                {[
                  { label: 'Home', href: '/' },
                  { label: 'Order Now', href: '/order' },
                  { label: 'Privacy Policy', href: '/privacy' },
                  { label: 'Terms & Conditions', href: '/terms' },
                  { label: 'Refund Policy', href: '/refund' },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-sm transition-colors hover:text-[#C42F2C]"
                    style={{ color: 'rgba(88,42,0,0.6)' }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact — full width on mobile, 1 col on desktop */}
            <div className="col-span-2 md:col-span-1">
              {/* Mobile: heading + number on same line. Desktop: stacked */}
              <div className="flex items-center gap-4 md:block">
                <h3 className="font-black text-[11px] tracking-widest uppercase md:mb-4 shrink-0" style={{ color: '#582A00' }}>
                  Contact
                </h3>
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-bold transition-colors hover:text-[#C42F2C] md:mt-0 md:block"
                  style={{ color: 'rgba(88,42,0,0.8)' }}
                >
                  +91 78719 49015
                </a>
              </div>
              <a
                href="mailto:appambattumuttamittai@gmail.com"
                className="text-sm transition-colors hover:text-[#C42F2C] mt-1 md:mt-2 block break-all"
                style={{ color: 'rgba(88,42,0,0.6)' }}
              >
                appambattumuttamittai@gmail.com
              </a>
            </div>

          </div>

          {/* Copyright row */}
          <div className="flex flex-col md:flex-row justify-between items-center pt-4 pb-1 gap-1 text-xs" style={{ color: 'rgba(88,42,0,0.35)' }}>
            <p>&copy; {year} APPAMPATTU Mutta Mittai. All rights reserved.</p>
            <p>Made with care in Villupuram, Tamil Nadu</p>
          </div>

        </div>
      </div>

    </footer>
  );
}
