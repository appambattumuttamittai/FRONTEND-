'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import CartDrawer from '@/components/CartDrawer';

const promoMessages = [
  "India's Original Muttai Mittai",
  "100% Authentic Recipe",
  "Fresh Batch Daily",
  "Safe & Hygienic Packaging",
  "Home Delivery: Villupuram Only",
  "Villupuram Railway Station, 1st Platform",
];

function PromoBanner() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % promoMessages.length);
        setVisible(true);
      }, 350);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="promo-bar py-1 md:py-2.5 overflow-hidden"
      aria-label="Promotional announcements"
      aria-live="polite"
    >
      <div className="flex items-center justify-center gap-3 text-white text-[11px] md:text-xs font-semibold tracking-wide">
        {/* Left dots */}
        <span className="hidden sm:flex gap-1">
          {promoMessages.map((_, i) => (
            <span
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === index ? 16 : 5,
                height: 5,
                display: 'inline-block',
                background: i === index ? '#F5B51B' : 'rgba(255,255,255,0.3)',
              }}
            />
          ))}
        </span>

        {/* Diamond separator */}
        <span className="text-[#F5B51B] text-[10px]">◆</span>

        {/* Animated message */}
        <span
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(6px)',
            transition: 'opacity 0.35s ease, transform 0.35s ease',
            minWidth: 160,
            textAlign: 'center',
          }}
        >
          {promoMessages[index]}
        </span>

        {/* Diamond separator */}
        <span className="text-[#F5B51B] text-[10px]">◆</span>

        {/* Right dots mirror */}
        <span className="hidden sm:flex gap-1">
          {promoMessages.map((_, i) => (
            <span
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === index ? 16 : 5,
                height: 5,
                display: 'inline-block',
                background: i === index ? '#F5B51B' : 'rgba(255,255,255,0.3)',
              }}
            />
          ))}
        </span>
      </div>
    </div>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const { cartCount } = useApp();

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Order Now', href: '/#products' },
    { label: 'Contact', href: '#contact' },
  ];

  const waLink = 'https://wa.me/917871949015?text=Hi%2C%20I%20want%20to%20order%20Mutta%20Mittai!';

  return (
    <>
      <PromoBanner />

      {/* ── Single sticky navbar ── */}
      <nav
        className="sticky top-0 z-50 bg-white/96 backdrop-blur mx-2 mt-2 rounded-full shadow-lg"
        aria-label="Main navigation"
      >
        <div className="container mx-auto px-4 max-w-6xl flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5" aria-label="Appampattu Mutta Mittai - Home">
            <div
              id="header-logo-img"
              className="w-10 h-10 rounded-full overflow-hidden shadow shrink-0 border-2 border-[#C42F2C]/20"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo.jpg"
                alt="Appampattu Mutta Mittai Logo"
                width={40}
                height={40}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div className="leading-tight">
              <div className="font-black text-[#582A00] text-sm">Appampattu</div>
              <div className="font-black text-[#C42F2C] text-sm">Mutta Mittai</div>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-4 py-2 text-sm font-semibold text-[#582A00] hover:text-[#C42F2C] rounded-full hover:bg-[#C42F2C]/8 transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setCartDrawerOpen(true)}
              className="relative p-2 rounded-full hover:bg-[#C42F2C]/10 transition-colors"
              aria-label={`View cart (${cartCount} items)`}
              style={{ color: '#582A00' }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white"
                  style={{ background: '#C42F2C' }}
                >
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white rounded-full text-sm font-bold hover:bg-[#20bb5a] transition-colors wp-pulse"
              aria-label="Order on WhatsApp"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.126.554 4.126 1.523 5.862L0 24l6.344-1.493A11.948 11.948 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.87 0-3.63-.48-5.17-1.33l-.37-.21-3.77.89.9-3.68-.23-.38A9.952 9.952 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              </svg>
              WhatsApp
            </a>
            <Link
              href="/#products"
              className="px-5 py-2 bg-[#C42F2C] text-white rounded-full text-sm font-bold hover:bg-[#a82624] transition-colors shadow"
            >
              Order Now
            </Link>
          </div>

          {/* Mobile: Order button + Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setCartDrawerOpen(true)}
              className="relative p-2 rounded-full hover:bg-[#C42F2C]/10 transition-colors"
              aria-label={`View cart (${cartCount} items)`}
              style={{ color: '#582A00' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black text-white"
                  style={{ background: '#C42F2C' }}
                >
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>
            <Link href="/#products" className="px-4 py-1.5 bg-[#C42F2C] text-white rounded-full text-sm font-bold">
              Order
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-full hover:bg-[#C42F2C]/10 transition-colors"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              <svg className="w-5 h-5 text-[#582A00]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-[#C42F2C]/10 bg-white px-4 py-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="py-2.5 text-center text-sm font-semibold text-[#582A00] hover:text-[#C42F2C] rounded-xl hover:bg-[#C42F2C]/6 transition-all"
              >
                {link.label}
              </Link>
            ))}

            {/* My Cart */}
            <button
              onClick={() => { setMenuOpen(false); setCartDrawerOpen(true); }}
              className="py-2.5 text-center text-sm font-semibold text-[#582A00] hover:text-[#C42F2C] rounded-xl hover:bg-[#C42F2C]/6 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              My Cart
              {cartCount > 0 && (
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white"
                  style={{ background: '#C42F2C' }}
                >
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>

            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="py-2.5 text-center text-sm font-bold text-white bg-[#25D366] rounded-xl hover:bg-[#20bb5a] transition-colors"
            >
              WhatsApp Order
            </a>
          </div>
        )}
      </nav>
      <CartDrawer open={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />
    </>
  );
}
