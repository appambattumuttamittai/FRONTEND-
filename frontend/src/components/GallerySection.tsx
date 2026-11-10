import Image from 'next/image';
import Link from 'next/link';

const galleryImages = [
  { src: '/images/gallery-1.jpg', alt: 'Appambattu Mutta Mittai — close-up texture', span: 'md:col-span-2 md:row-span-2' },
  { src: '/images/gallery-2.jpg', alt: 'Fresh batch of Mutta Mittai sweet', span: '' },
  { src: '/images/gallery-3.jpg', alt: 'Traditional preparation process', span: '' },
  { src: '/images/gallery-4.jpg', alt: 'Sweet packaging — gift ready', span: '' },
  { src: '/images/gallery-5.jpg', alt: 'Mutta Mittai served on a plate', span: '' },
];

export default function GallerySection() {
  return (
    <section className="py-20" style={{ background: '#FFFFFF' }} aria-labelledby="gallery-heading">
      {/* Story banner with background image */}
      <div className="relative overflow-hidden mb-16" style={{ minHeight: 320 }}>
        <Image
          src="/images/story-bg.jpg"
          alt="Appambattu Mutta Mittai — our story"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(88,42,0,0.88) 0%, rgba(196,47,44,0.65) 60%, rgba(88,42,0,0.5) 100%)' }} />
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[320px] text-center px-4 py-16">
          <span className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#D97706' }}>Our Story</span>
          <h2
            id="gallery-heading"
            className="font-black text-white mb-4"
            style={{ fontFamily: "'Exo 2', sans-serif", fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
          >
            Crafted with Tradition
          </h2>
          <p className="text-white/75 max-w-lg text-base leading-relaxed mb-6">
            Appambattu Mutta Mittai is an authentic egg sweet made from a generations-old recipe —
            using pure milk, farm-fresh eggs and unrefined sugar. Every bite tells a story.
          </p>
          <Link
            href="/order"
            className="inline-flex items-center gap-2 px-7 py-3 bg-[#C42F2C] text-white rounded-full font-bold hover:bg-[#a82624] transition-all shadow-xl"
          >
            Order Now
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Gallery grid */}
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-10">
          <h3 className="text-3xl md:text-4xl font-black section-title-line" style={{ color: '#582A00', fontFamily: "'Exo 2', sans-serif" }}>
            Our Gallery
          </h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 md:grid-rows-2 gap-3 md:gap-4" style={{ minHeight: 380 }}>
          {galleryImages.map((img, i) => (
            <div
              key={i}
              className={`relative overflow-hidden rounded-2xl ${img.span}`}
              style={{ minHeight: i === 0 ? 280 : 180 }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
