import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#FFF4DD] flex items-center justify-center pt-16 px-4">
        <div className="text-center max-w-md">
          <div className="text-8xl mb-6">🥚</div>
          <h1 className="text-4xl font-black text-[#063D20] mb-3">Page Not Found</h1>
          <p className="text-[#3A1C10]/60 mb-8">
            Oops! This page has cracked open and disappeared. Let&apos;s get you back to the sweet stuff.
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-4 bg-[#E95012] text-white rounded-2xl font-bold text-lg hover:bg-[#c7400d] transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
