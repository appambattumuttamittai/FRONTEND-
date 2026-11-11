'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

/*
  Animation sequence:
  'in'   → logo pops in at center with spring bounce       (0 → 400ms)
  'hold' → logo + brand name sit centered, fully visible  (400ms → 1900ms)
  'fly'  → logo flies to its exact header position,
           shrinking from 180px → 40px. Cream overlay
           fades out as the logo travels.                  (1900ms → 2650ms)
  'done' → everything unmounts; real header logo visible
*/

type Phase = 'in' | 'hold' | 'fly' | 'done';

const INTRO_SIZE = 180; // px — big centered logo
const HEADER_SIZE = 40; // px — final size in header

export default function LogoIntro() {
  const [phase, setPhase] = useState<Phase>('in');
  const [flyTransform, setFlyTransform] = useState('translate(-50%, -50%) scale(1)');

  useEffect(() => {
    try {
      if (sessionStorage.getItem('mm_intro_seen')) {
        setPhase('done');
        return;
      }
    } catch { /* ignore */ }

    // 1. Pop in
    const t1 = setTimeout(() => setPhase('hold'), 400);

    // 2. Fly — measure where the header logo actually is on screen
    const t2 = setTimeout(() => {
      const headerLogo = document.getElementById('header-logo-img');
      if (headerLogo) {
        const rect = headerLogo.getBoundingClientRect();
        // Center of target in viewport
        const tx = rect.left + rect.width / 2 - window.innerWidth / 2;
        const ty = rect.top + rect.height / 2 - window.innerHeight / 2;
        const scale = HEADER_SIZE / INTRO_SIZE;
        // Build the final transform: translate to target center, then scale down
        setFlyTransform(
          `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(${scale})`
        );
      }
      setPhase('fly');
    }, 1900);

    // 3. Done
    const t3 = setTimeout(() => {
      setPhase('done');
      try { sessionStorage.setItem('mm_intro_seen', '1'); } catch { /* ignore */ }
    }, 2750);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  if (phase === 'done') return null;

  const isFlying = phase === 'fly';

  return (
    <>
      {/* ── Cream background overlay — fades out as logo flies ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9998,
          background: '#FFFFFF',
          opacity: isFlying ? 0 : 1,
          transition: isFlying ? 'opacity 0.5s ease 0.1s' : 'none',
          pointerEvents: 'none',
        }}
      />

      {/* ── The flying logo ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: '50%',
          top: '50%',
          zIndex: 9999,
          pointerEvents: 'none',
          willChange: 'transform, opacity',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: 'max-content',
          transform: isFlying
            ? flyTransform
            : phase === 'in'
            ? 'translate(-50%, -50%) scale(0.15)'
            : 'translate(-50%, -50%) scale(1)',
          opacity: isFlying ? 0 : phase === 'in' ? 0 : 1,
          transition: isFlying
            ? 'transform 0.65s cubic-bezier(0.76, 0, 0.24, 1), opacity 0.25s ease 0.55s'
            : 'transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.35s ease',
        }}
      >
        <div
          style={{
            width: INTRO_SIZE,
            height: INTRO_SIZE,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
          }}
        >
          <Image
            src="/images/logo.jpg"
            alt="APPAMPATTU Egg Sweet"
            width={INTRO_SIZE}
            height={INTRO_SIZE}
            priority
            style={{ borderRadius: '50%', display: 'block', margin: '0 auto' }}
          />
        </div>

        {/* Brand text — visible only during 'hold', hidden before flying */}
        <div
          style={{
            marginTop: 18,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: phase === 'hold' ? 1 : 0,
            transform: phase === 'hold' ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.4s ease 0.1s, transform 0.4s ease 0.1s',
            whiteSpace: 'nowrap',
          }}
        >
          <p
            style={{
              fontFamily: "'Exo 2', sans-serif",
              fontWeight: 900,
              fontSize: '1.1rem',
              color: '#582A00',
              margin: 0,
              letterSpacing: '0.03em',
            }}
          >
            APPAMPATTU Mutta Mittai
          </p>
          <p
            style={{
              fontFamily: "'Noto Sans Tamil', sans-serif",
              fontSize: '0.85rem',
              color: '#C42F2C',
              fontWeight: 700,
              marginTop: 5,
            }}
          >
            அப்பம்பட்டு முட்டை மிட்டாய்
          </p>
        </div>
      </div>
    </>
  );
}
