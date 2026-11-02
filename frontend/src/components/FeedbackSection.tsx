'use client';
import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://backend-oi9e.onrender.com';

interface Feedback {
  id: string;
  name: string;
  rating: number;
  message: string;
  createdAt: string;
}

const dummyFeedbacks: Feedback[] = [
  { id: '1', name: 'Ramesh Kumar', rating: 5, message: 'Best mutta mittai I have ever tasted! The texture is perfect and the sweetness is just right. My whole family loved it.', createdAt: '' },
  { id: '2', name: 'Priya Lakshmi', rating: 5, message: 'அருமையான முட்டை மிட்டாய்! பாரம்பரிய சுவை அப்படியே இருக்கிறது. மிகவும் திருப்தி.', createdAt: '' },
  { id: '3', name: 'Suresh Babu', rating: 4, message: 'Very authentic taste. Reminds me of traditional sweets from childhood. The cashew nut flavour is excellent.', createdAt: '' },
  { id: '4', name: 'Kavitha Devi', rating: 5, message: 'Ordered 1kg pack for our family function. Everyone was asking where we got it from! Pure ingredients, highly recommended.', createdAt: '' },
];

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true"
          fill={i <= rating ? '#FFAA2B' : 'none'}
          stroke={i <= rating ? '#FFAA2B' : '#D1C4A8'}
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
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
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

function FeedbackCard({ fb, index }: { fb: Feedback; index: number }) {
  const initials = fb.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
  const colors = ['#C42F2C', '#582A00', '#D97706', '#8B3A00'];
  const bg = colors[index % colors.length];

  return (
    <div
      className="bg-white rounded-2xl p-6 flex flex-col gap-3 shadow-sm border hover:shadow-md transition-shadow"
      style={{ borderColor: 'rgba(196,47,44,0.1)' }}
    >
      {/* Stars */}
      <StarDisplay rating={fb.rating} />

      {/* Message */}
      <p className="text-sm leading-relaxed flex-1" style={{ color: 'rgba(61,30,8,0.75)' }}>
        &ldquo;{fb.message}&rdquo;
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 pt-2 border-t" style={{ borderColor: 'rgba(196,47,44,0.08)' }}>
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-sm shrink-0"
          style={{ background: bg }}
          aria-hidden="true"
        >
          {initials}
        </div>
        <div>
          <p className="font-bold text-sm" style={{ color: '#582A00' }}>{fb.name}</p>
          <p className="text-[11px]" style={{ color: 'rgba(61,30,8,0.4)' }}>Verified Customer</p>
        </div>
        {/* Quote decoration */}
        <svg className="w-6 h-6 ml-auto opacity-10" viewBox="0 0 24 24" fill="#C42F2C" aria-hidden="true">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
        </svg>
      </div>
    </div>
  );
}

export default function FeedbackSection() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(dummyFeedbacks);
  const [form, setForm] = useState({ name: '', rating: 0, message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API}/api/feedback`)
      .then((r) => r.json())
      .then((data: Feedback[]) => { if (Array.isArray(data) && data.length > 0) setFeedbacks(data); })
      .catch(() => {}); // silently use dummy on error
  }, []);

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

  return (
    <section className="py-20" style={{ background: '#FFF8F0' }} aria-labelledby="feedback-heading">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4"
            style={{ background: 'rgba(196,47,44,0.08)', color: '#C42F2C' }}>
            What Our Customers Say
          </span>
          <h2
            id="feedback-heading"
            className="text-4xl md:text-5xl font-black mb-4 section-title-line"
            style={{ color: '#582A00', fontFamily: "'Exo 2', sans-serif" }}
          >
            Customer Reviews
          </h2>
          <p className="text-base max-w-md mx-auto" style={{ color: 'rgba(61,30,8,0.55)' }}>
            Real words from our happy customers across Tamil Nadu
          </p>
        </div>

        {/* Feedback cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {feedbacks.slice(0, 4).map((fb, i) => (
            <FeedbackCard key={fb.id} fb={fb} index={i} />
          ))}
        </div>

        {/* Leave a Feedback form */}
        <div className="max-w-2xl mx-auto">
          <div
            className="rounded-3xl p-8 md:p-10"
            style={{ background: 'white', border: '1px solid rgba(196,47,44,0.1)', boxShadow: '0 8px 40px rgba(196,47,44,0.06)' }}
          >
            <h3 className="text-2xl font-black mb-1" style={{ color: '#582A00', fontFamily: "'Exo 2', sans-serif" }}>
              Leave Your Feedback
            </h3>
            <p className="text-sm mb-6" style={{ color: 'rgba(61,30,8,0.5)' }}>
              Your review will appear after approval. Thank you for sharing!
            </p>

            {submitted ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: 'rgba(196,47,44,0.1)' }}>
                  <svg className="w-7 h-7" style={{ color: '#C42F2C' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="font-black text-lg mb-1" style={{ color: '#582A00' }}>Thank you for your feedback!</p>
                <p className="text-sm" style={{ color: 'rgba(61,30,8,0.5)' }}>Your review is pending approval and will appear soon.</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 text-sm font-semibold underline"
                  style={{ color: '#C42F2C' }}
                >
                  Submit another review
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
                {/* Name */}
                <div>
                  <label className="block text-sm font-bold mb-1.5" style={{ color: '#582A00' }}>
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Ramesh Kumar"
                    maxLength={60}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{
                      border: '1.5px solid rgba(196,47,44,0.2)',
                      color: '#3D1E08',
                      background: '#FFF8F0',
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#C42F2C'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(196,47,44,0.2)'}
                  />
                </div>

                {/* Star rating */}
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: '#582A00' }}>
                    Rating *
                  </label>
                  <StarInput value={form.rating} onChange={(v) => setForm({ ...form, rating: v })} />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-bold mb-1.5" style={{ color: '#582A00' }}>
                    Your Review *
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell others about your experience with Appambattu Mutta Mittai..."
                    rows={4}
                    maxLength={500}
                    className="w-full px-4 py-3 rounded-xl text-sm resize-none outline-none transition-all"
                    style={{
                      border: '1.5px solid rgba(196,47,44,0.2)',
                      color: '#3D1E08',
                      background: '#FFF8F0',
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#C42F2C'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(196,47,44,0.2)'}
                  />
                  <p className="text-xs mt-1 text-right" style={{ color: 'rgba(61,30,8,0.35)' }}>
                    {form.message.length}/500
                  </p>
                </div>

                {/* Error */}
                {error && (
                  <p className="text-sm font-semibold" style={{ color: '#C42F2C' }}>{error}</p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-full font-black text-white text-sm transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ background: '#C42F2C', boxShadow: '0 6px 20px rgba(196,47,44,0.35)' }}
                >
                  {submitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
