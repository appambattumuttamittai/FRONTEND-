'use client';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

export default function WhatsAppCTA() {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-gradient-to-br from-[#063D20] via-[#0A512B] to-[#063D20]" aria-label="WhatsApp order CTA">
      <div className="container mx-auto px-4 max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="w-24 h-24 bg-[#25D366] rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.126.554 4.126 1.523 5.862L0 24l6.344-1.493A11.948 11.948 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.87 0-3.63-.48-5.17-1.33l-.37-.21-3.77.89.9-3.68-.23-.38A9.952 9.952 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
            </svg>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-black text-[#FFF4DD] mb-3">
            {t('wa.title')}
          </h2>
          <p className="text-[#FFF4DD]/70 text-lg mb-2">
            {t('wa.subtitle')}
          </p>
          <p className="text-[#F5B51B] font-bold text-xl mb-8">
            {t('wa.number')}
          </p>

          <a
            href="https://wa.me/917871949015?text=Hi%2C%20I%20want%20to%20order%20Mutta%20Mittai!%20Please%20let%20me%20know%20the%20availability%20and%20pickup%20details."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-5 bg-[#25D366] text-white rounded-3xl font-black text-xl hover:bg-[#20bb5a] transition-all shadow-2xl hover:shadow-green-500/30 hover:-translate-y-1 wp-pulse"
          >
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.126.554 4.126 1.523 5.862L0 24l6.344-1.493A11.948 11.948 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.87 0-3.63-.48-5.17-1.33l-.37-.21-3.77.89.9-3.68-.23-.38A9.952 9.952 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
            </svg>
            {t('wa.button')}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
