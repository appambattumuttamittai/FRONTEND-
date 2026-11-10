'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { api, Product } from '@/lib/api';

const weightLabels: Record<string, { en: string; ta: string }> = {
  '250gm': { en: '250 gm — Small Pack', ta: '250 கிராம் — சிறிய பேக்' },
  '500gm': { en: '500 gm — Medium Pack', ta: '500 கிராம் — நடுத்தர பேக்' },
  '750gm': { en: '750 gm — Large Pack', ta: '750 கிராம் — பெரிய பேக்' },
  '1kg': { en: '1 kg — Family Pack', ta: '1 கிலோ — குடும்ப பேக்' },
};

const productImages = [
  '/images/product-main.jpg',
  '/images/product-main.jpg',
  '/images/product-main.jpg',
  '/images/product-main.jpg',
];

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
  const [hovered, setHovered] = useState(false);
  const label = weightLabels[product.weight];
  const imgSrc = productImages[index % productImages.length];

  return (
    <div
      className="product-card relative bg-white rounded-[22px] overflow-hidden border cursor-pointer group"
      style={{ borderColor: 'rgba(196,47,44,0.12)', boxShadow: '0 4px 24px rgba(196,47,44,0.06)' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-white">
        <Image
          src={imgSrc}
          alt={`Appambattu Mutta Mittai ${product.weight}`}
          fill
          className={`object-cover transition-transform duration-500 ${hovered ? 'scale-[1.09]' : 'scale-100'}`}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {/* Order badge */}
        <div className="absolute top-3 right-3 bg-[#C42F2C] text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow">
          Order Now
        </div>
        {/* Hover CTA overlay — desktop */}
        <div
          className="absolute bottom-0 left-0 right-0 p-3 transition-all duration-300 hidden md:block"
          style={{
            transform: hovered ? 'translateY(0)' : 'translateY(100%)',
            opacity: hovered ? 1 : 0,
          }}
        >
          {product.inStock ? (
            <Link
              href={`/order?product=${product.id}`}
              className="block text-center py-2.5 bg-[#C42F2C] text-white rounded-xl font-bold text-sm hover:bg-[#a82624] transition-colors shadow-lg"
            >
              Order Now
            </Link>
          ) : (
            <div className="block text-center py-2.5 bg-gray-200 text-gray-400 rounded-xl font-bold text-sm cursor-not-allowed">
              Out of Stock
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <StarRating />
        <h3 className="font-bold mt-1.5 mb-0.5" style={{ color: '#582A00', fontSize: '0.95rem' }}>
          {label?.en || product.weight}
        </h3>
        <p className="text-[11px] mb-3" style={{ color: 'rgba(61,30,8,0.5)', fontFamily: "'Noto Sans Tamil', sans-serif" }}>
          {label?.ta || ''}
        </p>
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
        {/* Mobile always-visible CTA */}
        {product.inStock ? (
          <Link
            href={`/order?product=${product.id}`}
            className="md:hidden mt-3 block text-center py-2.5 bg-[#C42F2C] text-white rounded-xl font-bold text-sm"
          >
            Order Now
          </Link>
        ) : (
          <div className="md:hidden mt-3 block text-center py-2.5 bg-gray-100 text-gray-400 rounded-xl font-bold text-sm cursor-not-allowed">
            Out of Stock
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fallback: Product[] = [
    { id: '250gm', weight: '250gm', weightGrams: 250, price: 150, inStock: true },
    { id: '500gm', weight: '500gm', weightGrams: 500, price: 300, inStock: true },
    { id: '750gm', weight: '750gm', weightGrams: 750, price: 450, inStock: true },
    { id: '1kg', weight: '1kg', weightGrams: 1000, price: 600, inStock: true },
  ];

  useEffect(() => {
    api.getProducts()
      .then(setProducts)
      .catch(() => { setError(true); setProducts(fallback); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="products" className="py-20" style={{ background: '#FFFFFF' }} aria-labelledby="products-heading">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4"
            style={{ background: 'rgba(196,47,44,0.08)', color: '#C42F2C' }}>
            Pickup & Home Delivery — Villupuram
          </span>
          <h2
            id="products-heading"
            className="text-4xl md:text-5xl font-black mb-4 section-title-line"
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
            {[1, 2, 3, 4].map((i) => (
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

        {/* Pickup-only notice */}
        <div
          className="mt-14 rounded-3xl p-6 md:p-8 text-center"
          style={{ background: 'linear-gradient(135deg, #582A00 0%, #7a3800 100%)' }}
        >
          <div className="w-12 h-12 rounded-full bg-[#C42F2C] flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-white font-black text-xl md:text-2xl mb-2">Pickup & Home Delivery</h3>
          <p className="text-white/70 text-base">
            Collect from{' '}
            <strong className="text-[#D97706]">Villupuram Railway Station, 1st Platform</strong>.
            {' '}Home delivery available within{' '}
            <strong className="text-[#D97706]">Villupuram</strong>.
          </p>
          <p className="text-white/50 mt-1 text-sm" style={{ fontFamily: "'Noto Sans Tamil', sans-serif" }}>
            குரியர் சேவை இல்லை — மீனம்பூர், அப்பம்பட்டு, விழுப்புரம் இல் மட்டும் பிக்கப்
          </p>
        </div>
      </div>
    </section>
  );
}
