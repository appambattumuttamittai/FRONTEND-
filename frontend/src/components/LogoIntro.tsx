'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

/*
  Intro animation sequence:
  'in'   → logo scales up from 0 with spring bounce (0 → 400ms)
  'hold' → logo sits centered, fully visible (400ms → 1800ms)
  'out'  → cream overlay slides up like a curtain lift (1800ms → 2600ms)
  'done' → component unmounts; header logo takes over
*/
type Phase = 'in' | 'hold' | 'out' | 'done';

export default function LogoIntro() {
  const [phase, setPhase] = useState<Phase>('in');

  useEffect(() => {
    // Skip if already played this session
    try {
      if (sessionStorage.getItem('mm_intro_seen')) {
        setPhase('done');
        return;
      }
    } catch {
      // sessionStorage blocked (private mode edge case) — just play it
    }

    const t1 = setTimeout(() => setPhase('hold'), 400);
    const t2 = setTimeout(() => setPhase('out'), 1900);
    const t3 = setTimeout(() => {
      setPhase('done');
      try { sessionStorage.setItem('mm_intro_seen', '1'); } catch { /* ignore */ }
    }, 2750);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  if (phase === 'done') return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#FFF8F0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        // Curtain lifts upward on exit
        transform: phase === 'out' ? 'translateY(-100%)' : 'translateY(0)',
        transition: phase === 'out'
          ? 'transform 0.72s cubic-bezier(0.76, 0, 0.24, 1)'
          : 'none',
        pointerEvents: 'none',
        willChange: 'transform',
      }}
    >
      {/* Logo — springs in from small */}
      <div
        style={{
          transform: phase === 'in' ? 'scale(0.2)' : 'scale(1)',
          opacity: phase === 'in' ? 0 : 1,
          transition:
            'transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.35s ease',
          willChange: 'transform, opacity',
        }}
      >
        <Image
          src="/images/logo.jpg"
          alt="Appambattu Mutta Mittai"
          width={210}
          height={210}
          priority
          style={{ borderRadius: '50%', display: 'block' }}
        />
      </div>

      {/* Brand name fades in under logo */}
      <div
        style={{
          marginTop: 20,
          opacity: phase === 'hold' ? 1 : 0,
          transform: phase === 'hold' ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 0.4s ease 0.1s, transform 0.4s ease 0.1s',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontFamily: "'Exo 2', sans-serif",
            fontWeight: 900,
            fontSize: '1.1rem',
            color: '#582A00',
            letterSpacing: '0.04em',
            margin: 0,
          }}
        >
          Appambattu Mutta Mittai
        </p>
        <p
          style={{
            fontFamily: "'Noto Sans Tamil', sans-serif",
            fontSize: '0.85rem',
            color: '#C42F2C',
            fontWeight: 700,
            marginTop: 4,
          }}
        >
          அப்பம்பட்டு முட்டை மிட்டாய்
        </p>
      </div>
    </div>
  );
}
