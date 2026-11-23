'use client';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html>
      <body>
        <div style={{
          minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', fontFamily: 'sans-serif', background: '#FFF4DD',
          gap: '0.75rem', padding: '2rem', textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem' }}>🥚</div>
          <h2 style={{ color: '#063D20', fontWeight: 900, fontSize: '1.4rem', margin: 0 }}>
            Something went wrong
          </h2>
          <p style={{ color: '#3A1C10', opacity: 0.65, margin: 0, fontSize: '0.9rem' }}>
            {error.message || 'An unexpected error occurred.'}
          </p>
          <p style={{ color: '#3A1C10', opacity: 0.45, margin: 0, fontSize: '0.8rem' }}>
            Try refreshing — or tap WhatsApp below for help.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', width: '100%', maxWidth: '300px', marginTop: '0.5rem' }}>
            <button
              onClick={reset}
              style={{ padding: '0.75rem', background: '#C42F2C', color: 'white', border: 'none', borderRadius: '0.75rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem' }}
            >
              Try Again
            </button>
            <a
              href="/"
              style={{ padding: '0.75rem', background: 'transparent', color: '#582A00', border: '1.5px solid rgba(88,42,0,0.2)', borderRadius: '0.75rem', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none' }}
            >
              ← Back to Home
            </a>
            <a
              href="https://wa.me/917871949015"
              style={{ padding: '0.75rem', background: '#25D366', color: 'white', border: 'none', borderRadius: '0.75rem', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none' }}
            >
              WhatsApp Support
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
