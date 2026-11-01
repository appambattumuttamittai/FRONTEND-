'use client';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

const ingredients = [
  { icon: '🥛', key: 'milk', color: '#fff8ee', border: '#F5B51B' },
  { icon: '🥚', key: 'egg', color: '#fff0e0', border: '#E95012' },
  { icon: '🌰', key: 'cashew', color: '#f0f9f0', border: '#063D20' },
  { icon: '🍬', key: 'sugar', color: '#fff8ee', border: '#F5B51B' },
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
              <div className="text-5xl md:text-6xl mb-3">{ing.icon}</div>
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
