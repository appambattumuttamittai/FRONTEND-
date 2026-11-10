'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';

const weightLabels: Record<string, { en: string; ta: string }> = {
  '250gm': { en: '250 gm — Small Pack',  ta: '250 கிராம் — சிறிய பேக்' },
  '500gm': { en: '500 gm — Medium Pack', ta: '500 கிராம் — நடுத்தர பேக்' },
  '750gm': { en: '750 gm — Large Pack',  ta: '750 கிராம் — பெரிய பேக்' },
  '1kg':   { en: '1 kg — Family Pack',   ta: '1 கிலோ — குடும்ப பேக்' },
};

const badges = [
  {
    label: 'Fresh to Order',
    icon: (
      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 3v1m0 16v1m8.66-9h-1M4.34 12h-1m15.07-6.07l-.71.71M5.64 18.36l-.71.71m12.73 0l-.71-.71M5.64 5.64l-.71-.71M12 7a5 5 0 100 10A5 5 0 0012 7z" />
      </svg>
    ),
  },
  {
    label: 'No Preservatives',
    icon: (
      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: 'Hygienic Packing',
    icon: (
      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    label: 'Home Delivery',
    icon: (
      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414A1 1 0 0121 11.414V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
      </svg>
    ),
  },
];

export default function ProductModal() {
  const { modalProduct, closeModal, addItem, cart } = useApp();
  const [qty, setQty]     = useState(1);
  const [added, setAdded] = useState(false);

  /* reset state each time modal opens */
  useEffect(() => {
    if (modalProduct) {
      setQty(1);
      setAdded(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [modalProduct?.id]);

  /* close on Escape key */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeModal]);

  if (!modalProduct) return null;

  const label   = weightLabels[modalProduct.weight];
  const inCart  = cart.find((c) => c.id === modalProduct.id);

  const handleAdd = () => {
    addItem({
      id:          modalProduct.id,
      weight:      modalProduct.weight,
      weightLabel: label?.en || modalProduct.weight,
      price:       modalProduct.price,
      quantity:    qty,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  return (
    <>
      {/* ── Backdrop ── */}
      <div
        className="fixed inset-0 z-[9000]"
        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
        onClick={closeModal}
        aria-hidden="true"
      />

      {/* ── Panel ── */}
      <div
        className="fixed inset-0 z-[9001] flex items-center justify-center p-4 md:p-6"
        role="dialog"
        aria-modal="true"
        aria-label={label?.en || 'Product details'}
      >
        <div
          className="relative bg-white rounded-3xl shadow-2xl w-full max-h-[92vh] overflow-y-auto"
          style={{ maxWidth: 760 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-gray-100"
            style={{ color: '#582A00' }}
            aria-label="Close product detail"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex flex-col md:flex-row">

            {/* ── Left: image ── */}
            <div
              className="md:w-5/12 relative overflow-hidden rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none"
              style={{ minHeight: 260, background: '#F5F5F5' }}
            >
              <Image
                src="/images/product-main.jpg"
                alt={label?.en || 'Appambattu Mutta Mittai'}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
                priority
              />
            </div>

            {/* ── Right: details ── */}
            <div className="md:w-7/12 p-6 md:p-8 flex flex-col gap-4">

              {/* Brand + title */}
              <div>
                <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: '#D97706' }}>
                  Appambattu Mutta Mittai
                </p>
                <h2
                  className="text-xl md:text-2xl font-black leading-tight"
                  style={{ color: '#582A00', fontFamily: "'Exo 2', sans-serif" }}
                >
                  {label?.en || modalProduct.weight}
                </h2>
                {label?.ta && (
                  <p
                    className="text-sm mt-0.5"
                    style={{ color: 'rgba(88,42,0,0.5)', fontFamily: "'Noto Sans Tamil', sans-serif" }}
                  >
                    {label.ta}
                  </p>
                )}
              </div>

              {/* Stars + stock */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex gap-0.5" aria-label="5 out of 5 stars">
                  {[1,2,3,4,5].map((i) => (
                    <svg key={i} className="w-4 h-4" viewBox="0 0 24 24" fill="#FFAA2B" aria-hidden="true">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>
                <span
                  className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{
                    background: modalProduct.inStock ? 'rgba(22,163,74,0.08)' : 'rgba(196,47,44,0.08)',
                    color:      modalProduct.inStock ? '#16a34a' : '#C42F2C',
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: modalProduct.inStock ? '#16a34a' : '#C42F2C' }}
                  />
                  {modalProduct.inStock ? 'In Stock — Ready to ship' : 'Out of Stock'}
                </span>
              </div>

              {/* Price box */}
              <div
                className="rounded-2xl px-5 py-4"
                style={{ background: 'rgba(196,47,44,0.04)', border: '1px solid rgba(196,47,44,0.1)' }}
              >
                <p className="text-3xl font-black" style={{ color: '#C42F2C' }}>₹{modalProduct.price}</p>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(88,42,0,0.45)' }}>Inclusive of all taxes</p>
              </div>

              {/* Qty selector */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold" style={{ color: '#582A00' }}>Qty:</span>
                <div
                  className="flex items-center rounded-xl overflow-hidden border"
                  style={{ borderColor: 'rgba(196,47,44,0.22)' }}
                >
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center font-bold text-xl transition-colors hover:bg-red-50"
                    style={{ color: '#C42F2C' }}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span
                    className="w-10 h-10 flex items-center justify-center font-black text-base"
                    style={{ color: '#582A00', background: '#FFF8F0' }}
                  >
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="w-10 h-10 flex items-center justify-center font-bold text-xl transition-colors hover:bg-red-50"
                    style={{ color: '#C42F2C' }}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                {inCart && (
                  <span className="text-xs" style={{ color: 'rgba(88,42,0,0.5)' }}>
                    {inCart.quantity} already in cart
                  </span>
                )}
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleAdd}
                  disabled={!modalProduct.inStock}
                  className="w-full py-3.5 rounded-xl font-black text-sm text-white transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background:  added ? '#16a34a' : '#C42F2C',
                    boxShadow:   added ? '0 6px 20px rgba(22,163,74,0.3)' : '0 6px 20px rgba(196,47,44,0.35)',
                    transition:  'background 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease',
                  }}
                >
                  {added ? 'Added to Cart!' : 'Add to Cart'}
                </button>
                <Link
                  href={`/order?product=${modalProduct.id}`}
                  onClick={closeModal}
                  className="w-full py-3.5 rounded-xl font-bold text-sm text-center block transition-all hover:-translate-y-0.5"
                  style={{ border: '2px solid #C42F2C', color: '#C42F2C', background: 'transparent' }}
                >
                  Buy Now — Place Order
                </Link>
              </div>

              {/* Feature badges (SVG only, no emojis) */}
              <div className="grid grid-cols-2 gap-2.5">
                {badges.map((b) => (
                  <div
                    key={b.label}
                    className="flex items-center gap-2 rounded-xl px-3 py-2.5"
                    style={{ background: 'rgba(88,42,0,0.04)', border: '1px solid rgba(88,42,0,0.08)' }}
                  >
                    <span style={{ color: '#C42F2C' }}>{b.icon}</span>
                    <span className="text-xs font-semibold" style={{ color: 'rgba(88,42,0,0.7)' }}>
                      {b.label}
                    </span>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
