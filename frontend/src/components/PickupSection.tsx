import Link from 'next/link';
import Image from 'next/image';

export default function PickupSection() {
  return (
    <section className="py-20" style={{ background: '#FFF8F0' }} aria-labelledby="pickup-heading">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Image */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl" style={{ minHeight: 320 }}>
            <Image
              src="/images/shop-photo.jpg"
              alt="Villupuram Railway Station — Appambattu Mutta Mittai pickup location"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, rgba(88,42,0,0.75) 0%, transparent 55%)' }}
            />
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-white font-black text-lg">Villupuram Railway Station</p>
              <p className="text-[#D97706] text-sm font-semibold">1st Platform, Villupuram, Tamil Nadu</p>
            </div>
          </div>

          {/* Content */}
          <div>
            <span
              className="text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full inline-block mb-4"
              style={{ background: 'rgba(196,47,44,0.08)', color: '#C42F2C' }}
            >
              Pickup + Home Delivery
            </span>
            <h2
              id="pickup-heading"
              className="font-black text-4xl mb-4"
              style={{ color: '#582A00', fontFamily: "'Exo 2', sans-serif" }}
            >
              How to Order
            </h2>
            <div className="space-y-5 mb-6">
              {[
                {
                  step: '1',
                  title: 'Choose Your Pack',
                  desc: 'Select from 250 gm, 500 gm, 750 gm or 1 kg pack sizes.',
                },
                {
                  step: '2',
                  title: 'Place Your Order',
                  desc: 'Order online or WhatsApp us at +91 78719 49015.',
                },
                {
                  step: '3',
                  title: 'Pickup or Home Delivery',
                  desc: 'Collect from Villupuram Railway Station, 1st Platform — OR — get home delivery within Villupuram.',
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-4 items-start">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-black text-white text-sm shadow"
                    style={{ background: '#C42F2C' }}
                  >
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-bold mb-0.5" style={{ color: '#582A00' }}>{item.title}</h3>
                    <p className="text-sm" style={{ color: 'rgba(61,30,8,0.6)' }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery note */}
            <div
              className="rounded-2xl px-4 py-3 mb-6 text-sm font-semibold flex items-start gap-2"
              style={{
                background: 'rgba(217,119,6,0.09)',
                color: '#7a4800',
                border: '1px solid rgba(217,119,6,0.22)',
              }}
            >
              <svg
                className="w-4 h-4 mt-0.5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z"
                />
              </svg>
              Home delivery available within Villupuram only. For other locations, please use pickup at Villupuram Railway Station.
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/order"
                className="px-6 py-3 rounded-full font-bold text-sm text-white shadow transition-all hover:-translate-y-0.5"
                style={{ background: '#C42F2C' }}
              >
                Order Now
              </Link>
              <a
                href="https://wa.me/917871949015"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full font-bold text-sm border-2 transition-all hover:-translate-y-0.5"
                style={{ borderColor: '#C42F2C', color: '#C42F2C' }}
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
