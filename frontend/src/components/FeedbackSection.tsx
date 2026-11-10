'use client';
import { useEffect, useRef, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://backend-oi9e.onrender.com';

interface Feedback {
  id: string;
  name: string;
  rating: number;
  message: string;
  createdAt: string;
}

const dummyFeedbacks: Feedback[] = [
  { id: '1', name: 'Ramesh Kumar',  rating: 5, message: 'Best mutta mittai I have ever tasted! The texture is perfect and the sweetness is just right. My whole family loved it.', createdAt: '' },
  { id: '2', name: 'Priya Lakshmi', rating: 5, message: 'அருமையான முட்டை மிட்டாய்! பாரம்பரிய சுவை அப்படியே இருக்கிறது. மிகவும் திருப்தி.', createdAt: '' },
  { id: '3', name: 'Suresh Babu',   rating: 4, message: 'Very authentic taste. Reminds me of traditional sweets from childhood. The cashew nut flavour is excellent.', createdAt: '' },
  { id: '4', name: 'Kavitha Devi',  rating: 5, message: 'Ordered 1 kg pack for our family function. Everyone was asking where we got it from! Pure ingredients, highly recommended.', createdAt: '' },
];

/* ── stars ───────────────────────────────────────────────── */
function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1,2,3,4,5].map((i) => (
        <svg key={i} className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true"
          fill={i <= rating ? '#FFAA2B' : 'none'}
          stroke={i <= rating ? '#FFAA2B' : 'rgba(255,255,255,0.3)'}
          strokeWidth={1.5}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function StarInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Rating">
      {[1,2,3,4,5].map((i) => (
        <button
          key={i} type="button"
          onClick={() => onChange(i)}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(0)}
          aria-label={`${i} star${i > 1 ? 's' : ''}`}
          className="transition-transform hover:scale-110"
        >
          <svg className="w-7 h-7" viewBox="0 0 24 24" aria-hidden="true"
            fill={(hovered || value) >= i ? '#FFAA2B' : 'none'}
            stroke={(hovered || value) >= i ? '#FFAA2B' : '#D1C4A8'}
            strokeWidth={1.5}>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

/* ── single glass card (shared between mobile & desktop) ─── */
function GlassCard({ fb, i, cardsVisible }: { fb: Feedback; i: number; cardsVisible: boolean }) {
  return (
    <div
      style={{
        transitionDelay: `${i * 120}ms`,
        transitionProperty: 'opacity, transform',
        transitionDuration: '580ms',
        transitionTimingFunction: cardsVisible
          ? 'cubic-bezier(0.34,1.56,0.64,1)'
          : 'ease-in',
        opacity: cardsVisible ? 1 : 0,
        transform: cardsVisible ? 'translateY(0) scale(1)' : 'translateY(52px) scale(0.86)',
      }}
    >
      <div
        className="rounded-2xl p-5 flex flex-col gap-3 h-full"
        style={{
          background: 'rgba(255,255,255,0.11)',
          border: '1px solid rgba(255,255,255,0.2)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
        }}
      >
        <StarDisplay rating={fb.rating} />
        <p className="text-sm leading-relaxed flex-1" style={{ color: 'rgba(255,248,240,0.88)' }}>
          &ldquo;{fb.message}&rdquo;
        </p>
        <div
          className="flex items-center gap-3 pt-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}
        >
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-sm shrink-0"
            style={{
              background: ['#C42F2C','#582A00','#D97706','#8B3A00'][i % 4],
              border: '2px solid rgba(255,255,255,0.25)',
            }}
          >
            {fb.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)}
          </div>
          <div>
            <p className="font-bold text-sm" style={{ color: '#FFFFFF' }}>{fb.name}</p>
            <p className="text-[11px]" style={{ color: 'rgba(255,248,240,0.45)' }}>Verified Customer</p>
          </div>
          <svg className="w-5 h-5 ml-auto opacity-15" viewBox="0 0 24 24" fill="white" aria-hidden="true">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ── main section ────────────────────────────────────────── */
export default function FeedbackSection() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(dummyFeedbacks);
  const [form, setForm] = useState({ name: '', rating: 0, message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  /* scroll-trigger */
  const sectionRef = useRef<HTMLElement>(null);
  const [cardsVisible, setCardsVisible] = useState(false);

  /* mobile carousel active dot */
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeDot, setActiveDot] = useState(0);

  /* fetch real reviews */
  useEffect(() => {
    fetch(`${API}/api/feedback`)
      .then((r) => r.json())
      .then((data: Feedback[]) => { if (Array.isArray(data) && data.length > 0) setFeedbacks(data); })
      .catch(() => {});
  }, []);

  /* Intersection Observer */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCardsVisible(true);
          observer.disconnect(); // fire once — never reset
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /* mobile carousel — track scroll position for dot indicator */
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    const onScroll = () => {
      const index = Math.round(el.scrollLeft / el.clientWidth);
      setActiveDot(index);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToCard = (index: number) => {
    const el = carouselRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.clientWidth, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) return setError('Please enter your name.');
    if (form.rating === 0) return setError('Please select a star rating.');
    if (form.message.trim().length < 5) return setError('Please write at least 5 characters.');

    setSubmitting(true);
    try {
      const res = await fetch(`${API}/api/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSubmitted(true);
        setForm({ name: '', rating: 0, message: '' });
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch {
      setError('Could not connect. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  const displayFeedbacks = feedbacks.slice(0, 4);

  return (
    <section
      ref={sectionRef}
      id="reviews"
      aria-labelledby="feedback-heading"
      className="relative overflow-hidden"
      style={{ minHeight: '100vh' }}
    >
      {/* ─────────────────────────────────────────────────────
          Responsive video styles injected here:
          Desktop (≥640px): object-fit cover  — cinematic fill
          Mobile  (<640px):  object-fit contain — full frame visible, zoomed out
      ───────────────────────────────────────────────────── */}
      <style>{`
        #reviews-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center;
          z-index: 0;
          background: #1a0a00;
        }
        @media (max-width: 639px) {
          #reviews-video {
            object-fit: contain;
            background: #1a0a00;
          }
        }
      `}</style>

      {/* ── Background video ─────────────────────────────── */}
      <video
        id="reviews-video"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      >
        <source src="/videos/reviews-bg.mp4" type="video/mp4" />
        <source src="/videos/hero-bg-main.mp4" type="video/mp4" />
        <source src="/videos/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: 1,
          background:
            'linear-gradient(to bottom, rgba(42,16,0,0.68) 0%, rgba(42,16,0,0.48) 50%, rgba(42,16,0,0.75) 100%)',
        }}
        aria-hidden="true"
      />

      {/* ── Content (above video) ────────────────────────── */}
      <div className="relative px-4 py-16 md:py-20" style={{ zIndex: 2 }}>
        <div className="container mx-auto max-w-6xl">

          {/* Section header */}
          <div className="text-center mb-10 md:mb-14">
            <span
              className="inline-block text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4"
              style={{ background: 'rgba(255,255,255,0.12)', color: '#FFAA2B', border: '1px solid rgba(255,170,43,0.3)' }}
            >
              What Our Customers Say
            </span>
            <h2
              id="feedback-heading"
              className="text-3xl md:text-5xl font-black mb-3"
              style={{ color: '#FFFFFF', fontFamily: "'Exo 2', sans-serif", textShadow: '0 2px 20px rgba(0,0,0,0.4)' }}
            >
              Customer Reviews
            </h2>
            <p className="text-sm md:text-base max-w-md mx-auto" style={{ color: 'rgba(255,248,240,0.6)' }}>
              Real words from our happy customers across Tamil Nadu
            </p>
          </div>

          {/* ═══════════════════════════════════════════════
              DESKTOP — 4-column grid (unchanged)
          ═══════════════════════════════════════════════ */}
          <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
            {displayFeedbacks.map((fb, i) => (
              <GlassCard key={fb.id} fb={fb} i={i} cardsVisible={cardsVisible} />
            ))}
          </div>

          {/* ═══════════════════════════════════════════════
              MOBILE — horizontal swipe carousel
              Full-width snap scroll, one card at a time
          ═══════════════════════════════════════════════ */}
          <div className="sm:hidden mb-6">
            {/* Carousel track */}
            <div
              ref={carouselRef}
              className="flex overflow-x-auto gap-4"
              style={{
                scrollSnapType: 'x mandatory',
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                /* hide webkit scrollbar */
              }}
            >
              <style>{`
                #reviews-carousel::-webkit-scrollbar { display: none; }
              `}</style>
              {displayFeedbacks.map((fb, i) => (
                <div
                  key={fb.id}
                  style={{
                    scrollSnapAlign: 'center',
                    flex: '0 0 88%',
                    /* pop-in animation */
                    transitionDelay: `${i * 80}ms`,
                    transitionProperty: 'opacity, transform',
                    transitionDuration: '500ms',
                    transitionTimingFunction: cardsVisible
                      ? 'cubic-bezier(0.34,1.56,0.64,1)'
                      : 'ease-in',
                    opacity: cardsVisible ? 1 : 0,
                    transform: cardsVisible ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.88)',
                  }}
                >
                  <div
                    className="rounded-2xl p-5 flex flex-col gap-3"
                    style={{
                      background: 'rgba(255,255,255,0.13)',
                      border: '1px solid rgba(255,255,255,0.22)',
                      backdropFilter: 'blur(18px)',
                      WebkitBackdropFilter: 'blur(18px)',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                      minHeight: 200,
                    }}
                  >
                    <StarDisplay rating={fb.rating} />
                    <p className="text-sm leading-relaxed flex-1" style={{ color: 'rgba(255,248,240,0.9)' }}>
                      &ldquo;{fb.message}&rdquo;
                    </p>
                    <div
                      className="flex items-center gap-3 pt-3"
                      style={{ borderTop: '1px solid rgba(255,255,255,0.14)' }}
                    >
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-sm shrink-0"
                        style={{
                          background: ['#C42F2C','#582A00','#D97706','#8B3A00'][i % 4],
                          border: '2px solid rgba(255,255,255,0.3)',
                        }}
                      >
                        {fb.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-white">{fb.name}</p>
                        <p className="text-[11px]" style={{ color: 'rgba(255,248,240,0.45)' }}>Verified Customer</p>
                      </div>
                      {/* card number badge */}
                      <span
                        className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.5)' }}
                      >
                        {i + 1}/{displayFeedbacks.length}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Dot navigation */}
            <div className="flex justify-center gap-2 mt-5">
              {displayFeedbacks.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollToCard(i)}
                  aria-label={`Go to review ${i + 1}`}
                  style={{
                    width: activeDot === i ? 24 : 8,
                    height: 8,
                    borderRadius: 4,
                    background: activeDot === i ? '#FFAA2B' : 'rgba(255,255,255,0.3)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    padding: 0,
                  }}
                />
              ))}
            </div>
          </div>

          {/* ── Leave a review form ───────────────────────── */}
          <div className="max-w-2xl mx-auto">
            <div
              className="rounded-2xl p-4 md:p-10"
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.18)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              }}
            >
              <h3
                className="text-lg md:text-2xl font-black mb-0.5"
                style={{ color: '#FFFFFF', fontFamily: "'Exo 2', sans-serif" }}
              >
                Leave Your Feedback
              </h3>
              <p className="text-xs md:text-sm mb-4" style={{ color: 'rgba(255,248,240,0.5)' }}>
                Your review will appear after approval. Thank you for sharing!
              </p>

              {submitted ? (
                <div className="text-center py-6">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                    style={{ background: 'rgba(255,255,255,0.15)' }}
                  >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="font-black text-base mb-1" style={{ color: '#FFFFFF' }}>Thank you for your feedback!</p>
                  <p className="text-xs" style={{ color: 'rgba(255,248,240,0.5)' }}>Your review is pending approval and will appear soon.</p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-3 text-sm font-semibold underline"
                    style={{ color: '#FFAA2B' }}
                  >
                    Submit another review
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-3 md:gap-5" noValidate>

                  <div>
                    <label className="block text-xs md:text-sm font-bold mb-1" style={{ color: 'rgba(255,248,240,0.8)' }}>
                      Your Name *
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Ramesh Kumar"
                      maxLength={60}
                      className="w-full px-3 py-2 md:px-4 md:py-3 rounded-xl text-sm outline-none transition-all"
                      style={{
                        background: 'rgba(255,255,255,0.1)',
                        border: '1.5px solid rgba(255,255,255,0.2)',
                        color: '#FFFFFF',
                      }}
                      onFocus={(e) => (e.target.style.borderColor = '#FFAA2B')}
                      onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.2)')}
                    />
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-bold mb-1" style={{ color: 'rgba(255,248,240,0.8)' }}>
                      Rating *
                    </label>
                    <StarInput value={form.rating} onChange={(v) => setForm({ ...form, rating: v })} />
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-bold mb-1" style={{ color: 'rgba(255,248,240,0.8)' }}>
                      Your Review *
                    </label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Tell others about your experience with Appambattu Mutta Mittai..."
                      rows={3}
                      maxLength={500}
                      className="w-full px-3 py-2 md:px-4 md:py-3 rounded-xl text-sm resize-none outline-none transition-all"
                      style={{
                        background: 'rgba(255,255,255,0.1)',
                        border: '1.5px solid rgba(255,255,255,0.2)',
                        color: '#FFFFFF',
                      }}
                      onFocus={(e) => (e.target.style.borderColor = '#FFAA2B')}
                      onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.2)')}
                    />
                    <p className="text-xs mt-1 text-right" style={{ color: 'rgba(255,248,240,0.35)' }}>
                      {form.message.length}/500
                    </p>
                  </div>

                  {error && (
                    <p className="text-sm font-semibold" style={{ color: '#FFAA2B' }}>{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-2.5 md:py-3.5 rounded-full font-black text-white text-sm transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ background: '#C42F2C', boxShadow: '0 6px 20px rgba(196,47,44,0.45)' }}
                  >
                    {submitting ? 'Submitting...' : 'Submit Feedback'}
                  </button>

                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
