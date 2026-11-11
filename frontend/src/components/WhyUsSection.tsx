'use client';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

const reasons = [
  {
    key: 'fresh',
    color: '#063D20',
    icon: (
      <svg className="w-10 h-10 mx-auto text-[#F5B51B]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m8.66-9h-1M4.34 12h-1m15.07-6.07l-.71.71M5.64 18.36l-.71.71m12.73 0l-.71-.71M5.64 5.64l-.71-.71M12 7a5 5 0 100 10A5 5 0 0012 7z" />
      </svg>
    ),
  },
  {
    key: 'traditional',
    color: '#0A512B',
    icon: (
      <svg className="w-10 h-10 mx-auto text-[#F5B51B]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    key: 'hygienic',
    color: '#E95012',
    icon: (
      <svg className="w-10 h-10 mx-auto text-[#F5B51B]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    key: 'rich',
    color: '#F5B51B',
    icon: (
      <svg className="w-10 h-10 mx-auto text-[#F5B51B]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
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
              <div className="mb-4">{r.icon}</div>
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
