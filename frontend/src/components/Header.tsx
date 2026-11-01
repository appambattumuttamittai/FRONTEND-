'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function Header() {
  const { lang, setLang, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#063D20]/95 backdrop-blur-md shadow-lg shadow-black/20'
          : 'bg-[#063D20]'
      }`}
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group" aria-label="Appambattu Mutta Mittai - Home">
            <div className="relative w-10 h-10 rounded-full bg-[#F5B51B] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <span className="text-xl">🥚</span>
            </div>
            <div className="hidden sm:block">
              <div className="text-[#FFF4DD] font-bold text-sm leading-tight">Appambattu</div>
              <div className="text-[#F5B51B] font-bold text-base leading-tight">Mutta Mittai</div>
            </div>
            <div className="block sm:hidden">
              <div className="text-[#F5B51B] font-bold text-base">முட்டை மிட்டாய்</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-4">
            {/* Language Switcher */}
            <div className="flex items-center bg-[#0A512B] rounded-full p-1 gap-1">
              <button
                onClick={() => setLang('en')}
                className={`px-3 py-1 rounded-full text-sm font-semibold transition-all ${
                  lang === 'en'
                    ? 'bg-[#F5B51B] text-[#063D20]'
                    : 'text-[#FFF4DD] hover:text-[#F5B51B]'
                }`}
                aria-label="Switch to English"
              >
                EN
              </button>
              <button
                onClick={() => setLang('ta')}
                className={`px-3 py-1 rounded-full text-sm font-semibold transition-all ${
                  lang === 'ta'
                    ? 'bg-[#F5B51B] text-[#063D20]'
                    : 'text-[#FFF4DD] hover:text-[#F5B51B]'
                }`}
                aria-label="Switch to Tamil"
              >
                தமிழ்
              </button>
            </div>

            <a
              href="https://wa.me/917871949015?text=Hi%2C%20I%20want%20to%20order%20Mutta%20Mittai!"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white rounded-full font-semibold text-sm hover:bg-[#20bb5a] transition-colors wp-pulse"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.554 4.126 1.523 5.862L0 24l6.344-1.493A11.948 11.948 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.87 0-3.63-.48-5.17-1.33l-.37-.21-3.77.89.9-3.68-.23-.38A9.952 9.952 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              </svg>
              {t('nav.whatsapp')}
            </a>

            <Link
              href="/order"
              className="px-5 py-2 bg-[#E95012] text-white rounded-full font-bold text-sm hover:bg-[#c7400d] transition-all shadow-md hover:shadow-lg"
            >
              {t('nav.order')}
            </Link>
          </nav>

          {/* Mobile: lang switcher + hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <div className="flex items-center bg-[#0A512B] rounded-full p-0.5 gap-0.5">
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-1 rounded-full text-xs font-bold transition-all ${
                  lang === 'en' ? 'bg-[#F5B51B] text-[#063D20]' : 'text-[#FFF4DD]'
                }`}
              >EN</button>
              <button
                onClick={() => setLang('ta')}
                className={`px-2 py-1 rounded-full text-xs font-bold transition-all ${
                  lang === 'ta' ? 'bg-[#F5B51B] text-[#063D20]' : 'text-[#FFF4DD]'
                }`}
              >தமிழ்</button>
            </div>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 text-[#FFF4DD] rounded-lg hover:bg-[#0A512B] transition-colors"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-[#0A512B] overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
              <a
                href="https://wa.me/917871949015?text=Hi%2C%20I%20want%20to%20order%20Mutta%20Mittai!"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 py-3 bg-[#25D366] text-white rounded-xl font-semibold"
              >
                <span>💬</span> {t('nav.whatsapp')}
              </a>
              <Link
                href="/order"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center py-3 bg-[#E95012] text-white rounded-xl font-bold"
              >
                {t('nav.order')}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
