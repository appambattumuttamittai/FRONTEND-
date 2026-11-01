'use client';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

const reasons = [
  { icon: '🌿', key: 'fresh', color: '#063D20' },
  { icon: '📜', key: 'traditional', color: '#0A512B' },
  { icon: '✅', key: 'hygienic', color: '#E95012' },
  { icon: '💛', key: 'rich', color: '#F5B51B' },
];

export default function WhyUsSection() {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-gradient-to-br from-[#063D20] to-[#0A512B]" aria-labelledby="why-heading">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 id="why-heading" className="text-4xl md:text-5xl font-black text-[#FFF4DD] mb-3">
            {t('why.title')}
          </h2>
          <div className="w-24 h-1 bg-[#F5B51B] mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((r, i) => (
            <motion.div
              key={r.key}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 text-center hover:bg-white/20 transition-all duration-300 hover:-translate-y-2"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="text-5xl mb-4">{r.icon}</div>
              <h3 className="text-[#F5B51B] font-bold text-xl mb-2">
                {t(`why.${r.key}.title`)}
              </h3>
              <p className="text-[#FFF4DD]/75 text-sm leading-relaxed">
                {t(`why.${r.key}.desc`)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
