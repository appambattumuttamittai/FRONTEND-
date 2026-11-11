'use client';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

const ingredients = [
  {
    key: 'milk',
    color: '#fff8ee',
    border: '#F5B51B',
    icon: (
      <svg className="w-12 h-12 mx-auto text-[#D97706]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
  {
    key: 'egg',
    color: '#fff0e0',
    border: '#E95012',
    icon: (
      <svg className="w-12 h-12 mx-auto text-[#E95012]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-4.418 0-8 5.373-8 12 0 4.418 3.582 6 8 6s8-1.582 8-6c0-6.627-3.582-12-8-12z" />
      </svg>
    ),
  },
  {
    key: 'cashew',
    color: '#f0f9f0',
    border: '#063D20',
    icon: (
      <svg className="w-12 h-12 mx-auto text-[#063D20]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-3.866 0-7 2.239-7 5 0 3.866 3.134 7 7 7s7-3.134 7-7c0-1.657-.895-3-2-3-2.209 0-3-2-3-2z" />
      </svg>
    ),
  },
  {
    key: 'sugar',
    color: '#fff8ee',
    border: '#F5B51B',
    icon: (
      <svg className="w-12 h-12 mx-auto text-[#F5B51B]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
];

export default function IngredientsSection() {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-[#FFF4DD]" aria-labelledby="ingredients-heading">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 id="ingredients-heading" className="text-4xl md:text-5xl font-black text-[#063D20] mb-2">
            {t('ingredients.title')}
          </h2>
          <p className="text-[#3A1C10]/60 text-lg">{t('ingredients.subtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
          {ingredients.map((ing, i) => (
            <motion.div
              key={ing.key}
              className="rounded-3xl p-6 text-center border-2 hover:-translate-y-3 transition-transform duration-300 cursor-default"
              style={{ background: ing.color, borderColor: ing.border }}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, type: 'spring', bounce: 0.4 }}
            >
              <div className="mb-3">{ing.icon}</div>
              <p className="font-bold text-[#063D20] text-base md:text-lg">{t(`ingredients.${ing.key}`)}</p>
            </motion.div>
          ))}
        </div>

        {/* Allergen notice */}
        <motion.div
          className="bg-[#E95012]/10 border-2 border-[#E95012] rounded-2xl p-5 text-center max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-[#E95012] font-bold text-base md:text-lg">
            {t('ingredients.allergen')}
          </p>
          <p className="text-[#3A1C10]/70 text-sm mt-1" style={{ fontFamily: "'Noto Sans Tamil', sans-serif" }}>
            {t('ingredients.allergen')}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
