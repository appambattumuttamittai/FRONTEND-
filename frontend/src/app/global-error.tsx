'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          fontFamily: 'sans-serif',
          background: '#FFF4DD',
          gap: '1rem',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '4rem' }}>🥚</div>
          <h2 style={{ color: '#063D20', fontWeight: 900, fontSize: '1.5rem' }}>
            Something went wrong!
          </h2>
          <p style={{ color: '#3A1C10', opacity: 0.6 }}>
            Please refresh or contact us on WhatsApp.
          </p>
          <button
            onClick={reset}
            style={{
              padding: '0.75rem 2rem',
              background: '#E95012',
              color: 'white',
              border: 'none',
              borderRadius: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
