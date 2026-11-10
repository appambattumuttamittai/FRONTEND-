'use client';
import { useEffect, useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { api, OrderDetail } from '@/lib/api';

function SuccessContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloaded, setDownloaded] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend-oi9e.onrender.com';

  useEffect(() => {
    if (!orderId) { setLoading(false); return; }
    api.getOrder(orderId)
      .then((ord) => {
        setOrder(ord);
        // Automatically trigger PDF download once
        if (!downloaded) {
          setDownloaded(true);
          const link = document.createElement('a');
          link.href = `${apiUrl}/api/orders/${orderId}/invoice.pdf`;
          link.download = `Invoice-${orderId.slice(-8).toUpperCase()}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [orderId, downloaded, apiUrl]);

  const statusColors: Record<string, string> = {
    PAYMENT_REVIEW: 'text-[#F5B51B]',
    PAID: 'text-green-600',
    PAYMENT_FAILED: 'text-[#E95012]',
  };

  return (
    <div className="min-h-screen bg-[#FFF4DD] pt-16">
      <Header />
      <main className="py-12 px-4">
        <div className="max-w-lg mx-auto text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            className="text-8xl mb-6"
          >
            🎉
          </motion.div>

          <motion.h1
            className="text-4xl font-black text-[#063D20] mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {t('success.title')}
          </motion.h1>

          <motion.div
            className="bg-white rounded-3xl shadow-xl p-6 mb-6 text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className={`text-lg font-bold mb-4 text-center ${statusColors[order?.status || 'PAYMENT_REVIEW'] || 'text-[#F5B51B]'}`}>
              {t('success.review')}
            </h2>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => <div key={i} className="h-5 shimmer rounded" />)}
              </div>
            ) : order ? (
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-[#3A1C10]/60">Order ID</span>
                  <span className="font-bold font-mono">{order.id.slice(-8).toUpperCase()}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-[#3A1C10]/60">Name</span>
                  <span className="font-bold">{order.customerName}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-[#3A1C10]/60">Product</span>
                  <span className="font-bold">{order.product.weight} Mutta Mittai</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-[#3A1C10]/60">Amount</span>
                  <span className="font-black text-[#E95012]">₹{order.totalAmount}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-[#3A1C10]/60">Status</span>
                  <span className={`font-bold ${statusColors[order.status] || ''}`}>{order.status.replace(/_/g, ' ')}</span>
                </div>
              </div>
            ) : (
              <p className="text-center text-[#3A1C10]/60">Order details not found</p>
            )}

            <div className="mt-5 p-4 bg-[#F5B51B]/10 border border-[#F5B51B] rounded-xl text-sm text-center">
              {t('success.message')}
            </div>

            {/* Direct Invoice PDF download button */}
            {orderId && (
              <a
                href={`${apiUrl}/api/orders/${orderId}/invoice.pdf`}
                download={`Invoice-${orderId.slice(-8).toUpperCase()}.pdf`}
                className="mt-4 w-full flex items-center justify-center gap-2 py-3.5 bg-[#C42F2C] text-white rounded-xl font-black text-sm sm:text-base hover:bg-[#a82421] transition-all shadow-md"
              >
                📄 Download Invoice / Receipt (PDF)
              </a>
            )}
          </motion.div>

          <motion.div
            className="flex flex-col gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <a
              href={`https://wa.me/917871949015?text=Hi%2C%20my%20order%20ID%20is%20${orderId?.slice(-8).toUpperCase()}%20and%20I%20have%20paid.%20Please%20confirm.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-4 bg-[#25D366] text-white rounded-2xl font-bold text-lg hover:bg-[#20bb5a] transition-colors"
            >
              💬 {t('success.whatsapp')}
            </a>
            <Link
              href="/"
              className="py-4 border-2 border-[#063D20] text-[#063D20] rounded-2xl font-bold hover:bg-[#063D20] hover:text-[#FFF4DD] transition-colors"
            >
              ← {t('success.home')}
            </Link>
          </motion.div>

          {/* Pickup & Delivery reminder */}
          <motion.div
            className="mt-8 bg-[#063D20] text-[#FFF4DD] rounded-2xl p-5 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p className="font-bold text-[#F5B51B] mb-1">📍 Pickup & Home Delivery Information</p>
            <p>Store pickup available at <strong>Villupuram Railway Station (1st Platform)</strong>. Home delivery within Villupuram City.</p>
            <p className="text-[#FFF4DD]/60 mt-1" style={{ fontFamily: "'Noto Sans Tamil', sans-serif" }}>
              விழுப்புரம் ரயில் நிலையம் (1வது பிளாட்பாரம்) அல்லது விழுப்புரம் நகருக்குள் ஹோம் டெலிவரி.
            </p>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
