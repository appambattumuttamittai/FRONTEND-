'use client';
import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();
  const waLink = 'https://wa.me/917871949015?text=Hi%2C%20I%20want%20to%20order%20Mutta%20Mittai!';

  return (
    <footer id="contact" style={{ background: '#582A00', color: 'rgba(255,248,240,0.7)' }} className="pt-14 pb-24 md:pb-10" role="contentinfo">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#C42F2C] flex items-center justify-center shadow-lg shrink-0">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" aria-hidden="true">
                  <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 3a3 3 0 110 6 3 3 0 010-6zm0 14.2a7.2 7.2 0 01-6-3.22c.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08a7.2 7.2 0 01-6 3.22z"/>
                </svg>
              </div>
              <div>
                <div className="font-black text-lg" style={{ color: '#FFF8F0' }}>Appambattu Mutta Mittai</div>
                <div className="text-sm" style={{ color: '#D97706', fontFamily: "'Noto Sans Tamil', sans-serif" }}>
                  அப்பம்பட்டு முட்டை மிட்டாய்
                </div>
              </div>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,248,240,0.55)' }}>
              Traditional Tamil Nadu egg sweet made with milk, egg, cashew nut paste &amp; pure sugar.
              One station, one product. Authentic since generations.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold"
              style={{ borderColor: 'rgba(217,119,6,0.4)', color: '#D97706' }}>
              Villupuram Railway Station
            </div>
          </div>

          {/* Contact & Pickup */}
          <div>
            <h3 className="font-bold text-base mb-4" style={{ color: '#D97706' }}>Location &amp; Delivery</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#D97706' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p style={{ color: 'rgba(255,248,240,0.85)' }}>Villupuram Railway Station, 1st Platform</p>
                  <p className="text-xs" style={{ color: 'rgba(255,248,240,0.65)' }}>Villupuram, Tamil Nadu</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(255,248,240,0.4)', fontFamily: "'Noto Sans Tamil', sans-serif" }}>
                    வில்லுபுரம் ரயில் நிலையம், முதல் தளம்
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#D97706' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <div>
                  <p style={{ color: 'rgba(255,248,240,0.75)' }}>Home Delivery</p>
                  <p className="text-xs" style={{ color: 'rgba(255,248,240,0.45)' }}>Within Villupuram area only</p>
                </div>
              </div>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                style={{ color: '#25D366' }}
              >
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.126.554 4.126 1.523 5.862L0 24l6.344-1.493A11.948 11.948 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.87 0-3.63-.48-5.17-1.33l-.37-.21-3.77.89.9-3.68-.23-.38A9.952 9.952 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                </svg>
                +91 78719 49015 (WhatsApp)
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-bold text-base mb-4" style={{ color: '#D97706' }}>Quick Links</h3>
            <div className="flex flex-col gap-2 text-sm mb-6">
              {[
                { label: 'Home', href: '/' },
                { label: 'Order Now', href: '/order' },
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms & Conditions', href: '/terms' },
                { label: 'Refund Policy', href: '/refund' },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="hover:text-[#D97706] transition-colors"
                  style={{ color: 'rgba(255,248,240,0.6)' }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C42F2C] text-white rounded-full text-sm font-bold hover:bg-[#a82624] transition-colors shadow"
            >
              Order on WhatsApp
            </a>
          </div>
        </div>

        <div
          className="pt-6 flex flex-col md:flex-row justify-between items-center gap-2 text-xs"
          style={{ borderTop: '1px solid rgba(255,248,240,0.1)', color: 'rgba(255,248,240,0.35)' }}
        >
          <p>&copy; {year} Appambattu Mutta Mittai. All rights reserved.</p>
          <p>Made with care in Villupuram, Tamil Nadu</p>
        </div>
      </div>
    </footer>
  );
}
