'use client';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

const MAPS_LINK = 'https://www.google.com/maps/search/Meenambur+Appambattu+Villupuram+Tamil+Nadu';

export default function PickupSection() {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-[#FFF4DD]" id="pickup" aria-labelledby="pickup-heading">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-5xl mb-4">📍</div>
          <h2 id="pickup-heading" className="text-4xl md:text-5xl font-black text-[#063D20] mb-3">
            {t('pickup.title')}
          </h2>
          <p className="text-[#3A1C10]/60 text-lg" style={{ fontFamily: "'Noto Sans Tamil', sans-serif" }}>
            {t('pickup.address')}
          </p>
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-[#063D20] to-[#0A512B] rounded-3xl p-6 md:p-10 text-center shadow-2xl"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          {/* Pickup badge */}
          <div className="inline-flex items-center gap-2 bg-[#F5B51B] text-[#063D20] font-black px-5 py-2 rounded-full text-lg mb-6">
            🏪 {t('pickup.only')}
          </div>

          {/* Address */}
          <div className="mb-6">
            <p className="text-[#FFF4DD] text-xl md:text-2xl font-bold">
              Meenambur, Appambattu, Villupuram
            </p>
            <p className="text-[#FFF4DD]/70 text-base mt-1" style={{ fontFamily: "'Noto Sans Tamil', sans-serif" }}>
              மீனம்பூர், அப்பம்பட்டு, விழுப்புரம்
            </p>
            <p className="text-[#FFF4DD]/60 text-sm mt-1">Tamil Nadu, India</p>
          </div>

          {/* Important notice */}
          <div className="bg-[#E95012]/20 border border-[#E95012]/40 rounded-2xl p-4 mb-6 text-left max-w-md mx-auto">
            <p className="text-[#FFF4DD] text-sm font-semibold text-center">
              🚚 {t('pickup.no_delivery')}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={MAPS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-[#063D20] rounded-2xl font-bold hover:bg-[#FFF4DD] transition-colors shadow-md"
            >
              🗺️ {t('pickup.maps')}
            </a>
            <a
              href="https://wa.me/917871949015?text=Hi%2C%20I%20want%20to%20order%20Mutta%20Mittai%20and%20pickup%20from%20your%20store."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-2xl font-bold hover:bg-[#20bb5a] transition-colors shadow-md"
            >
              💬 {t('pickup.whatsapp')}
            </a>
          </div>

          {/* Phone */}
          <p className="text-[#F5B51B] font-bold mt-6 text-xl">
            📱 +91 78719 49015
          </p>
        </motion.div>
      </div>
    </section>
  );
}
