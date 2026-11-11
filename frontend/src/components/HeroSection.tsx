'use client';
import { motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import Image from 'next/image';
import Link from 'next/link';

function FloatingElement({ emoji, className, delay }: { emoji: string; className: string; delay: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={`absolute text-2xl md:text-3xl select-none pointer-events-none ${className}`}
      animate={reduce ? {} : {
        y: [0, -14, 0],
        rotate: [-3, 3, -3],
      }}
      transition={{ duration: 4 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      {emoji}
    </motion.div>
  );
}

function EggSweetAnimation() {
  const reduce = useReducedMotion();
  return (
    <div className="relative w-72 h-72 md:w-96 md:h-96 mx-auto">
      {/* Outer glow */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-br from-[#F5B51B]/30 to-[#E95012]/20 blur-3xl"
        animate={reduce ? {} : { scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Egg shell */}
      <motion.div
        className="absolute inset-8 rounded-[50%] border-4 border-[#F5B51B]/60"
        style={{ borderRadius: '50% 50% 55% 55%' }}
        initial={{ scaleY: 1 }}
        animate={reduce ? {} : {
          scaleY: [1, 1.02, 0.95, 1],
          rotate: [-1, 1, -1],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Crack lines */}
        <motion.div
          className="absolute top-1/3 left-1/4 w-12 h-0.5 bg-[#F5B51B]/80 origin-left"
          initial={{ scaleX: 0, rotate: -20 }}
          animate={{ scaleX: 1, rotate: -20 }}
          transition={{ delay: 1, duration: 0.5 }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-8 h-0.5 bg-[#F5B51B]/80 origin-right"
          initial={{ scaleX: 0, rotate: 25 }}
          animate={{ scaleX: 1, rotate: 25 }}
          transition={{ delay: 1.2, duration: 0.4 }}
        />
      </motion.div>

      {/* Product image revealed from egg */}
      <motion.div
        className="absolute inset-12 rounded-2xl overflow-hidden shadow-2xl"
        initial={{ opacity: 0, scale: 0.6, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8, type: 'spring', bounce: 0.3 }}
      >
        <Image
          src="/images/brochure-price.jpeg"
          alt="Appambattu Mutta Mittai – traditional egg sweet slices on a plate"
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 200px, 280px"
        />
        {/* Orange shimmer overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#E95012]/20 via-transparent to-[#F5B51B]/10" />
      </motion.div>

      {/* Sparkles */}
      {[
        { top: '5%', left: '60%', delay: 0.5 },
        { top: '15%', left: '20%', delay: 1.2 },
        { top: '70%', left: '75%', delay: 0.8 },
        { top: '80%', left: '15%', delay: 1.5 },
      ].map((pos, i) => (
        <motion.div
          key={i}
          className="absolute text-[#F5B51B] text-lg select-none"
          style={{ top: pos.top, left: pos.left }}
          animate={reduce ? {} : {
            opacity: [0, 1, 0],
            scale: [0, 1.2, 0],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 2, repeat: Infinity, delay: pos.delay, ease: 'easeInOut' }}
        >
          ✨
        </motion.div>
      ))}
    </div>
  );
}

export default function HeroSection() {
  const { t } = useLanguage();
  const reduce = useReducedMotion();

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden pt-16"
      style={{
        background: 'linear-gradient(135deg, #063D20 0%, #0A512B 40%, #0d6b38 70%, #063D20 100%)',
      }}
      aria-label="Hero section"
    >
      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23F5B51B' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />



      <div className="container mx-auto px-4 max-w-6xl py-12">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">

          {/* Text Content */}
          <motion.div
            className="text-center md:text-left order-2 md:order-1"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-[#F5B51B]/20 border border-[#F5B51B]/40 text-[#F5B51B] rounded-full px-4 py-1.5 text-sm font-semibold mb-4"
            >
              <span>🏆</span>
              <span>{t('hero.badge')}</span>
            </motion.div>

            {/* Tamil headline */}
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="text-[#F5B51B] block" style={{ fontFamily: "'Noto Sans Tamil', sans-serif" }}>
                அப்பம்பட்டு
              </span>
              <span className="text-[#FFF4DD] block" style={{ fontFamily: "'Noto Sans Tamil', sans-serif" }}>
                முட்டை மிட்டாய்
              </span>
            </motion.h1>

            {/* English tagline */}
            <motion.p
              className="text-[#E95012] font-bold text-lg md:text-xl mb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Appambattu Mutta Mittai
            </motion.p>

            <motion.p
              className="text-[#FFF4DD]/80 text-base md:text-lg mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {t('hero.tagline')}
            </motion.p>

            <motion.p
              className="text-[#F5B51B] font-semibold text-xl mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {t('hero.sub')}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Link
                href="/order"
                className="group inline-flex items-center justify-center gap-2 px-7 py-4 bg-[#E95012] text-white rounded-2xl font-bold text-lg hover:bg-[#c7400d] transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {t('hero.cta')}
                <motion.span
                  animate={reduce ? {} : { x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </Link>

              <a
                href="https://wa.me/917871949015?text=Hi%2C%20I%20want%20to%20order%20Mutta%20Mittai!%20Please%20let%20me%20know%20the%20availability."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-[#25D366] text-white rounded-2xl font-bold text-lg hover:bg-[#20bb5a] transition-all shadow-xl wp-pulse"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.126.554 4.126 1.523 5.862L0 24l6.344-1.493A11.948 11.948 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.87 0-3.63-.48-5.17-1.33l-.37-.21-3.77.89.9-3.68-.23-.38A9.952 9.952 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                </svg>
                {t('hero.whatsapp')}
              </a>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              className="mt-8 flex flex-wrap gap-3 justify-center md:justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              {[
                { label: 'Pure Ingredients', ta: 'தூய பொருட்கள்' },
                { label: 'Traditional Recipe', ta: 'பாரம்பரிய செய்முறை' },
                { label: 'FSSAI Certified', ta: 'FSSAI சான்றிதழ்' },
              ].map((badge) => (
                <div
                  key={badge.label}
                  className="flex items-center gap-1.5 bg-[#0A512B] rounded-full px-3.5 py-1.5 text-xs text-[#FFF4DD]/90"
                >
                  <svg className="w-3.5 h-3.5 text-[#F5B51B]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{badge.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Egg Animation - Right side */}
          <motion.div
            className="order-1 md:order-2 flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <EggSweetAnimation />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[#FFF4DD]/50 text-sm flex flex-col items-center gap-1"
          initial={{ opacity: 0 }}
          animate={reduce ? { opacity: 1 } : { opacity: [0, 1, 0], y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 2 }}
        >
          <span>Scroll to explore</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
