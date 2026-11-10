'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { api, Product } from '@/lib/api';
import { useApp } from '@/context/AppContext';

const weightLabels: Record<string, { en: string; ta: string }> = {
  '250gm': { en: '250 gm — Small Pack',  ta: '250 கிராம் — சிறிய பேக்' },
  '500gm': { en: '500 gm — Medium Pack', ta: '500 கிராம் — நடுத்தர பேக்' },
  '750gm': { en: '750 gm — Large Pack',  ta: '750 கிராம் — பெரிய பேக்' },
  '1kg':   { en: '1 kg — Family Pack',   ta: '1 கிலோ — குடும்ப பேக்' },
};

function StarRating() {
  return (
    <div className="flex gap-0.5" aria-label="5 out of 5 stars">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="#FFAA2B" aria-hidden="true">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </div>
  );
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const { openModal } = useApp();
  const [hovered, setHovered] = useState(false);
  const label = weightLabels[product.weight];

  const handleOpen = () => openModal({
    id: product.id,
    weight: product.weight,
    weightGrams: product.weightGrams,
    price: product.price,
    inStock: product.inStock,
  });

  return (
    <div
      className="product-card relative bg-white rounded-[22px] overflow-hidden border cursor-pointer group"
      style={{ borderColor: 'rgba(196,47,44,0.12)', boxShadow: '0 4px 24px rgba(196,47,44,0.06)' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleOpen(); }}
      aria-label={`View details for ${label?.en || product.weight}`}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-white">
        <Image
          src="/images/product-main.jpg"
          alt={`Appambattu Mutta Mittai ${product.weight}`}
          fill
          className={`object-cover transition-transform duration-500 ${hovered ? 'scale-[1.09]' : 'scale-100'}`}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {/* Quick view overlay on hover — desktop */}
        <div
          className="absolute inset-0 items-center justify-center hidden md:flex"
          style={{
            background: 'rgba(88,42,0,0.45)',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        >
          <span
            className="px-5 py-2.5 rounded-full font-black text-xs text-white"
            style={{ background: '#C42F2C', boxShadow: '0 4px 16px rgba(196,47,44,0.4)' }}
          >
            Add to Cart
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <StarRating />
        <h3 className="font-bold mt-1.5 mb-0.5" style={{ color: '#582A00', fontSize: '0.95rem' }}>
          {label?.en || product.weight}
        </h3>
        <div className="flex items-center justify-between">
          <span className="font-black text-2xl" style={{ color: '#C42F2C' }}>
            ₹{product.price}
          </span>
          {!product.inStock && (
            <span className="text-xs bg-red-50 text-red-500 font-semibold px-2 py-1 rounded-full border border-red-100">
              Out of Stock
            </span>
          )}
        </div>
        {/* Mobile tap hint */}
        <div
          className="md:hidden mt-3 w-full py-2.5 rounded-xl text-center font-bold text-sm text-white"
          style={{ background: '#C42F2C' }}
        >
          Add to Cart
        </div>
      </div>
    </div>
  );
}

export default function ProductsSection() {
  const { setProducts } = useApp();
  const [products, setLocalProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fallback: Product[] = [
    { id: '250gm', weight: '250gm', weightGrams: 250,  price: 150, inStock: true },
    { id: '500gm', weight: '500gm', weightGrams: 500,  price: 300, inStock: true },
    { id: '750gm', weight: '750gm', weightGrams: 750,  price: 450, inStock: true },
    { id: '1kg',   weight: '1kg',   weightGrams: 1000, price: 600, inStock: true },
  ];

  useEffect(() => {
    api.getProducts()
      .then((data) => {
        setLocalProducts(data);
        /* store in context so Footer can open modals with correct prices */
        setProducts(data.map((p) => ({
          id: p.id, weight: p.weight,
          weightGrams: p.weightGrams, price: p.price, inStock: p.inStock,
        })));
      })
      .catch(() => {
        setError(true);
        setLocalProducts(fallback);
        setProducts(fallback.map((p) => ({
          id: p.id, weight: p.weight,
          weightGrams: p.weightGrams, price: p.price, inStock: p.inStock,
        })));
      })
      .finally(() => setLoading(false));
  }, [setProducts]);

  return (
    <section id="products" className="py-20" style={{ background: '#FFFFFF' }} aria-labelledby="products-heading">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-14">
          <h2
            id="products-heading"
            className="text-4xl md:text-5xl font-black mb-4 section-title-line text-center"
            style={{ color: '#582A00', fontFamily: "'Exo 2', sans-serif" }}
          >
            Our Sweet Collection
          </h2>
          <p className="text-base max-w-lg mx-auto" style={{ color: 'rgba(61,30,8,0.6)' }}>
            Choose your pack size — all prices fetched live from our store
          </p>
        </div>

        {/* Product grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map((i) => (
              <div key={i} className="rounded-[22px] overflow-hidden" style={{ border: '1px solid rgba(196,47,44,0.1)' }}>
                <div className="aspect-square shimmer" />
                <div className="p-4">
                  <div className="h-3 w-24 shimmer rounded mb-2" />
                  <div className="h-5 w-3/4 shimmer rounded mb-1" />
                  <div className="h-4 w-1/2 shimmer rounded mb-3" />
                  <div className="h-7 w-1/3 shimmer rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}

        {error && (
          <p className="text-center text-sm mt-4" style={{ color: '#C42F2C' }}>
            Showing default prices. Live prices from server unavailable.
          </p>
        )}

        {/* Pickup notice */}
        <div
          className="mt-14 rounded-3xl p-6 md:p-8 text-center"
          style={{ background: 'linear-gradient(135deg, #582A00 0%, #7a3800 100%)' }}
        >
          <div className="w-12 h-12 rounded-full bg-[#C42F2C] flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-white font-black text-xl md:text-2xl mb-2">Pickup &amp; Home Delivery</h3>
          <p className="text-white/70 text-base">
            Collect from{' '}
            <strong className="text-[#D97706]">Villupuram Railway Station, 1st Platform</strong>.
            {' '}Home delivery available within{' '}
            <strong className="text-[#D97706]">Villupuram</strong>.
          </p>
        </div>
      </div>
    </section>
  );
}
