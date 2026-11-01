'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { api, Product } from '@/lib/api';

function ProductCard({ product, index }: { product: Product; index: number }) {
  const { t } = useLanguage();
  const [hovered, setHovered] = useState(false);

  const weightLabels: Record<string, { en: string; ta: string }> = {
    '250gm': { en: '250 gm – Small Pack', ta: '250 கிராம் – சிறிய பேக்' },
    '500gm': { en: '500 gm – Medium Pack', ta: '500 கிராம் – நடுத்தர பேக்' },
    '750gm': { en: '750 gm – Large Pack', ta: '750 கிராம் – பெரிய பேக்' },
    '1kg': { en: '1 kg – Family Pack', ta: '1 கிலோ – குடும்ப பேக்' },
  };
  const icons = ['🍬', '🎁', '🧁', '👑'];
  const label = weightLabels[product.weight];

  return (
    <motion.div
      className="product-card relative bg-white rounded-3xl overflow-hidden shadow-lg border border-[#E95012]/10 cursor-pointer"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      {/* Top color band */}
      <div className="h-2 bg-gradient-to-r from-[#063D20] via-[#F5B51B] to-[#E95012]" />

      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <Image
          src="/images/brochure-price.jpeg"
          alt={`Appambattu Mutta Mittai ${product.weight}`}
          fill
          className={`object-cover transition-transform duration-500 ${hovered ? 'scale-110' : 'scale-100'}`}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute top-3 right-3 bg-[#E95012] text-white text-xs font-bold px-2 py-1 rounded-full">
          {t('products.pickup_badge')}
        </div>
        <div className="absolute bottom-3 left-3 text-3xl">{icons[index]}</div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-[#063D20] text-lg mb-1">
          {label?.en || product.weight}
        </h3>
        <p className="text-[#3A1C10]/60 text-sm mb-4">
          {label?.ta || ''}
        </p>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-3xl font-black text-[#E95012]">₹{product.price}</span>
          </div>
          {!product.inStock && (
            <span className="text-xs bg-red-100 text-red-600 font-semibold px-2 py-1 rounded-full">
              {t('products.out_of_stock')}
            </span>
          )}
        </div>

        {/* CTA */}
        {product.inStock ? (
          <Link
            href={`/order?product=${product.id}`}
            className="block text-center py-3 bg-gradient-to-r from-[#063D20] to-[#0A512B] text-[#FFF4DD] rounded-xl font-bold hover:from-[#E95012] hover:to-[#c7400d] transition-all duration-300"
          >
            {t('products.order')} →
          </Link>
        ) : (
          <div className="block text-center py-3 bg-gray-100 text-gray-400 rounded-xl font-bold cursor-not-allowed">
            {t('products.out_of_stock')}
          </div>
        )}
      </div>

      {/* Hover sweet slice animation */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl opacity-20 select-none">
          🍰
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ProductsSection() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fallback products (shown if backend unreachable)
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
    <section id="products" className="py-20 bg-[#FFF4DD]" aria-labelledby="products-heading">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-block bg-[#063D20]/10 text-[#063D20] font-bold text-sm px-4 py-1.5 rounded-full mb-3">
            📦 {t('products.pickup_badge')}
          </span>
          <h2 id="products-heading" className="text-4xl md:text-5xl font-black text-[#063D20] mb-3">
            {t('products.title')}
          </h2>
          <p className="text-[#3A1C10]/60 text-lg max-w-xl mx-auto">
            {t('products.subtitle')}
          </p>
        </motion.div>

        {/* Brochure banner */}
        <motion.div
          className="mb-12 rounded-3xl overflow-hidden shadow-2xl"
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div className="relative h-64 md:h-80">
            <Image
              src="/images/brochure-main.jpeg"
              alt="Appambattu Mutta Mittai brochure showing all products and prices"
              fill
              className="object-cover object-top"
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#063D20]/60 via-transparent to-[#063D20]/40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-[#F5B51B] font-black text-3xl md:text-5xl drop-shadow-lg" style={{ fontFamily: "'Noto Sans Tamil', sans-serif" }}>
                  அப்பம்பட்டு முட்டை மிட்டாய்
                </p>
                <p className="text-white font-bold text-xl mt-2 drop-shadow">Soft • Fresh • Delicious</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Product grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-3xl overflow-hidden shadow-lg">
                <div className="h-2 bg-gray-200" />
                <div className="h-44 shimmer" />
                <div className="p-5">
                  <div className="h-5 w-3/4 shimmer rounded mb-2" />
                  <div className="h-4 w-1/2 shimmer rounded mb-4" />
                  <div className="h-8 w-1/3 shimmer rounded mb-4" />
                  <div className="h-10 shimmer rounded-xl" />
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
          <p className="text-center text-sm text-[#E95012] mt-4">
            Showing default prices. Live prices from server unavailable.
          </p>
        )}

        {/* Pickup-only notice */}
        <motion.div
          className="mt-12 bg-gradient-to-r from-[#063D20] to-[#0A512B] rounded-3xl p-6 md:p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-4xl mb-3">📍</div>
          <h3 className="text-[#F5B51B] font-black text-xl md:text-2xl mb-2">
            Pickup in Store Only
          </h3>
          <p className="text-[#FFF4DD]/80 text-base">
            Courier service is currently unavailable. Collect from{' '}
            <strong className="text-[#F5B51B]">Meenambur, Appambattu, Villupuram</strong>.
          </p>
          <p className="text-[#FFF4DD]/60 mt-1 text-sm" style={{ fontFamily: "'Noto Sans Tamil', sans-serif" }}>
            குரியர் சேவை இல்லை — மீனம்பூர், அப்பம்பட்டு, விழுப்புரம் இல் மட்டும் பிக்கப்
          </p>
        </motion.div>
      </div>
    </section>
  );
}
