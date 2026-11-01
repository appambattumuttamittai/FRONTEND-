'use client';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { t, lang, setLang } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#063D20] text-[#FFF4DD]/70 pt-12 pb-6" role="contentinfo">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-3xl">🥚</span>
              <div>
                <div className="text-[#FFF4DD] font-black text-lg">Appambattu Mutta Mittai</div>
                <div className="text-[#F5B51B] text-sm" style={{ fontFamily: "'Noto Sans Tamil', sans-serif" }}>
                  அப்பம்பட்டு முட்டை மிட்டாய்
                </div>
              </div>
            </div>
            <p className="text-sm text-[#FFF4DD]/60 leading-relaxed">
              {t('footer.tagline')}<br />
              Traditional Tamil Nadu egg sweet made with milk, egg, cashew nut paste & sugar.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[#F5B51B] font-bold text-base mb-3">Contact & Pickup</h3>
            <div className="space-y-2 text-sm">
              <p>📍 Meenambur, Appambattu, Villupuram</p>
              <p className="text-xs text-[#FFF4DD]/50" style={{ fontFamily: "'Noto Sans Tamil', sans-serif" }}>
                மீனம்பூர், அப்பம்பட்டு, விழுப்புரம்
              </p>
              <a
                href="https://wa.me/917871949015"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[#25D366] hover:text-[#20bb5a] transition-colors"
              >
                💬 +91 78719 49015 (WhatsApp)
              </a>
              <p className="text-xs text-[#FFF4DD]/50">
                🚚 Pickup in Store Only — No Courier Service
              </p>
            </div>
          </div>

          {/* Language + Links */}
          <div>
            <h3 className="text-[#F5B51B] font-bold text-base mb-3">Language / மொழி</h3>
            <div className="flex gap-2 mb-5">
              <button
                onClick={() => setLang('en')}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  lang === 'en' ? 'bg-[#F5B51B] text-[#063D20]' : 'border border-[#FFF4DD]/20 hover:border-[#F5B51B]'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLang('ta')}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  lang === 'ta' ? 'bg-[#F5B51B] text-[#063D20]' : 'border border-[#FFF4DD]/20 hover:border-[#F5B51B]'
                }`}
              >
                தமிழ்
              </button>
            </div>
            <div className="flex flex-wrap gap-3 text-xs">
              <Link href="/privacy" className="hover:text-[#F5B51B] transition-colors">{t('footer.privacy')}</Link>
              <span>·</span>
              <Link href="/terms" className="hover:text-[#F5B51B] transition-colors">{t('footer.terms')}</Link>
              <span>·</span>
              <Link href="/refund" className="hover:text-[#F5B51B] transition-colors">{t('footer.refund')}</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-[#FFF4DD]/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-[#FFF4DD]/40">
          <p>© {year} Appambattu Mutta Mittai. {t('footer.rights')}</p>
          <p>Made with ❤️ in Villupuram, Tamil Nadu</p>
        </div>
      </div>
    </footer>
  );
}
