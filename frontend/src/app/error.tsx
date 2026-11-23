'use client';
import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error('Page error:', error); }, [error]);

  const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;

  return (
    <div className="min-h-screen bg-[#FFF4DD] flex items-center justify-center px-4">
      <div className="text-center max-w-md w-full">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          {isOffline ? (
            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636a9 9 0 010 12.728M15.536 8.464a5 5 0 010 7.072M12 12h.01M8.464 15.536a5 5 0 010-7.072M5.636 18.364a9 9 0 010-12.728" />
            </svg>
          ) : (
            <svg className="w-8 h-8 text-[#C42F2C]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" />
            </svg>
          )}
        </div>
        <h1 className="text-2xl font-black text-[#582A00] mb-2">
          {isOffline ? 'No internet connection' : 'Something went wrong'}
        </h1>
        <p className="text-sm text-[#582A00]/70 mb-1">
          {isOffline
            ? 'Please check your Wi-Fi or mobile data and try again.'
            : (error.message || 'An unexpected error occurred on this page.')}
        </p>
        <p className="text-xs text-[#582A00]/50 mb-6">
          {isOffline
            ? "Your order progress is saved — just come back once you're connected."
            : 'Try refreshing the page. If the problem continues, reach us on WhatsApp.'}
        </p>
        <div className="flex flex-col gap-2.5">
          <button
            onClick={reset}
            className="py-3 bg-[#C42F2C] text-white rounded-xl font-bold text-sm hover:bg-[#a82421] transition-colors"
          >
            {isOffline ? 'Retry' : 'Try Again'}
          </button>
          <Link href="/" className="py-3 border border-[#582A00]/20 text-[#582A00] rounded-xl font-bold text-sm hover:bg-[#582A00]/5 transition-colors">
            ← Back to Home
          </Link>
          <a
            href="https://wa.me/917871949015"
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 bg-[#25D366] text-white rounded-xl font-bold text-sm hover:bg-[#20bb5a] transition-colors"
          >
            Get Help on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
