import Link from 'next/link';
import Image from 'next/image';

export default function PickupSection() {
  return (
    <section className="py-20" style={{ background: '#FFF8F0' }} aria-labelledby="pickup-heading">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Image */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl" style={{ minHeight: 300 }}>
            <Image
              src="/images/pickup-store.jpg"
              alt="Pickup location — Meenambur, Appambattu, Villupuram"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(88,42,0,0.7) 0%, transparent 60%)' }} />
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-white font-black text-lg">Meenambur, Appambattu</p>
              <p className="text-[#D97706] text-sm font-semibold">Villupuram, Tamil Nadu</p>
            </div>
          </div>

          {/* Content */}
          <div>
            <span className="text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full inline-block mb-4"
              style={{ background: 'rgba(196,47,44,0.08)', color: '#C42F2C' }}>
              Pickup Only
            </span>
            <h2 id="pickup-heading" className="font-black text-4xl mb-4" style={{ color: '#582A00', fontFamily: "'Exo 2', sans-serif" }}>
              How to Order
            </h2>
            <div className="space-y-4 mb-8">
              {[
                { step: '1', title: 'Choose Your Pack', desc: 'Select from 250 gm, 500 gm, 750 gm or 1 kg pack sizes.' },
                { step: '2', title: 'Place Your Order', desc: 'Order online or WhatsApp us at +91 78719 49015.' },
                { step: '3', title: 'Pickup at Store', desc: 'Collect from Meenambur, Appambattu, Villupuram — no delivery.' },
              ].map((item) => (
                <div key={item.step} className="flex gap-4 items-start">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-black text-white text-sm shadow"
                    style={{ background: '#C42F2C' }}>
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-bold mb-0.5" style={{ color: '#582A00' }}>{item.title}</h3>
                    <p className="text-sm" style={{ color: 'rgba(61,30,8,0.6)' }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/order"
                className="px-6 py-3 rounded-full font-bold text-sm text-white shadow"
                style={{ background: '#C42F2C' }}
              >
                Order Now
              </Link>
              <a
                href="https://wa.me/917871949015"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full font-bold text-sm text-white shadow"
                style={{ background: '#25D366' }}
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
