'use client';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ErrorPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#FFF4DD] flex items-center justify-center pt-16 px-4">
        <div className="text-center max-w-md">
          <div className="text-8xl mb-6">⚠️</div>
          <h2 className="text-3xl font-black text-[#063D20] mb-3">Something went wrong</h2>
          <p className="text-[#3A1C10]/60 mb-8">
            Please try again. If the problem continues, contact us on WhatsApp.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/" className="px-6 py-3 bg-[#063D20] text-white rounded-xl font-bold hover:bg-[#0A512B]">
              Home
            </Link>
            <a
              href="https://wa.me/917871949015"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-[#25D366] text-white rounded-xl font-bold hover:bg-[#20bb5a]"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
