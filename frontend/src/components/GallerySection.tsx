'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

const images = [
  { src: '/images/brochure-main.jpeg', alt: 'Appambattu Mutta Mittai official brochure – traditional egg sweet from Villupuram', span: 'col-span-2 row-span-2' },
  { src: '/images/product-box.jpeg', alt: 'Mutta Mittai in branded gold tin box – product packaging', span: '' },
  { src: '/images/shop-counter.jpeg', alt: 'Appambattu Mutta Mittai shop counter at station – One Station One Product', span: '' },
  { src: '/images/shop-display.jpeg', alt: 'Mutta Mittai shop display with colorful traditional fabric', span: 'col-span-2' },
];

export default function GallerySection() {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-gradient-to-br from-[#3A1C10] to-[#063D20]" aria-labelledby="gallery-heading">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 id="gallery-heading" className="text-4xl md:text-5xl font-black text-[#FFF4DD] mb-2">
            {t('gallery.title')}
          </h2>
          <div className="w-24 h-1 bg-[#F5B51B] mx-auto rounded-full" />
        </motion.div>

        {/* Mobile: vertical stack */}
        <div className="md:hidden flex flex-col gap-4">
          {images.map((img, i) => (
            <motion.div
              key={i}
              className="relative rounded-3xl overflow-hidden shadow-2xl"
              style={{ height: i === 0 ? '280px' : '200px' }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="100vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </motion.div>
          ))}
        </div>

        {/* Desktop: grid */}
        <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-4 h-[500px]">
          {images.map((img, i) => (
            <motion.div
              key={i}
              className={`relative rounded-3xl overflow-hidden shadow-2xl group ${img.span}`}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 1200px) 50vw, 600px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </motion.div>
          ))}
        </div>

        {/* Caption */}
        <motion.p
          className="text-center text-[#FFF4DD]/60 text-sm mt-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          ✨ Proudly selected for &quot;One Station One Product&quot; — A Tamil Nadu Railway Initiative
        </motion.p>
      </div>
    </section>
  );
}
