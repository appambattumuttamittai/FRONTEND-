'use client';
import { useEffect, useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { api, OrderDetail } from '@/lib/api';
import { saveOrderToStorage, sanitizeItemWeight } from '@/lib/ordersStorage';

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

        const cleanW = sanitizeItemWeight(ord.product?.weight || '');
        const isStorePickup =
          Boolean(ord.streetAddress?.toLowerCase().includes('pick up')) ||
          Boolean(ord.streetAddress?.toLowerCase().includes('railway')) ||
          Boolean(ord.city?.toLowerCase().includes('pickup')) ||
          Boolean(ord.city?.toLowerCase().includes('store'));

        // Save cleanly to localStorage & sessionStorage
        saveOrderToStorage({
          id: ord.id,
          customerName: ord.customerName,
          phone: ord.phone,
          totalAmount: ord.totalAmount,
          items: [{
            id: ord.product?.id || ord.id,
            weight: cleanW,
            price: ord.totalAmount,
            quantity: 1,
          }],
          deliveryMethod: isStorePickup ? 'pickup' : 'delivery',
          streetAddress: ord.streetAddress || undefined,
          city: isStorePickup ? 'Villupuram Railway Station' : (ord.city ? ord.city.replace(/\(Store Pickup\)/gi, '').trim() : 'Villupuram City'),
          pincode: ord.pincode || undefined,
          status: ord.status,
          date: ord.createdAt,
        });

        // Trigger automatic PDF download once
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

  const isPickup =
    Boolean(order?.streetAddress?.toLowerCase().includes('pick up')) ||
    Boolean(order?.streetAddress?.toLowerCase().includes('railway')) ||
    Boolean(order?.city?.toLowerCase().includes('pickup')) ||
    Boolean(order?.city?.toLowerCase().includes('store'));

  const cleanProductWeight = sanitizeItemWeight(order?.product?.weight || '');
  const transactionId =
    (order as any)?.transactionId ||
    (order?.product?.weight?.match(/Razorpay:\s*([A-Za-z0-9_]+)/i)?.[1]);

  return (
    <div className="min-h-screen bg-[#FFF4DD] pt-16">
      <Header />
      <main className="py-10 px-4">
        <div className="max-w-md mx-auto text-center">
          {/* Elegant Animated Success Icon */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 14, stiffness: 220 }}
            className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-600/25 text-white"
          >
            <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.45, delay: 0.15 }}
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </motion.div>

          <motion.h1
            className="text-2xl sm:text-3xl font-black text-[#582A00] mb-2 tracking-tight"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Order Placed Successfully
          </motion.h1>

          <motion.p
            className="text-xs sm:text-sm text-[#582A00]/70 mb-6 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Thank you for ordering authentic Appampattu Mutta Mittai
          </motion.p>

          {/* Receipt Card */}
          <motion.div
            className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-5 sm:p-6 mb-6 text-left border border-stone-200/60"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            {/* Payment Status Pill */}
            <div
              className={`py-2 px-3.5 rounded-xl text-center text-xs font-bold tracking-wide mb-4 ${
                order?.status === 'PAID'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80'
                  : 'bg-amber-50 text-amber-800 border border-amber-200/80'
              }`}
            >
              {order?.status === 'PAID' ? '✓ Payment Verified · Order Confirmed' : 'Payment Verification in Progress'}
            </div>

            {loading ? (
              <div className="space-y-3 py-4">
                {[1, 2, 3, 4].map((i) => <div key={i} className="h-5 shimmer rounded" />)}
              </div>
            ) : order ? (
              <div className="space-y-2.5 text-xs sm:text-sm">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-stone-500 font-medium">Order ID</span>
                  <span className="font-bold font-mono text-stone-900 bg-stone-100 px-2 py-0.5 rounded">
                    #{order.id.slice(-8).toUpperCase()}
                  </span>
                </div>

                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-stone-500 font-medium">Customer</span>
                  <span className="font-bold text-stone-900">{order.customerName}</span>
                </div>

                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-stone-500 font-medium">Product</span>
                  <span className="font-semibold text-stone-900 text-right">
                    Appampattu Mutta Mittai ({cleanProductWeight})
                  </span>
                </div>

                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-stone-500 font-medium">Fulfillment</span>
                  <span className="font-semibold text-stone-800 text-right text-xs">
                    {isPickup
                      ? 'Store Pickup · Villupuram Railway Station (1st Platform)'
                      : `Home Delivery · ${order.city ? order.city.replace(/\(Store Pickup\)/gi, '').trim() : 'Villupuram City'}`}
                  </span>
                </div>

                {transactionId && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-stone-500 font-medium">Payment ID</span>
                    <span className="font-mono text-xs text-stone-600">{transactionId}</span>
                  </div>
                )}

                <div className="flex justify-between py-2.5">
                  <span className="text-stone-700 font-semibold">Total Amount</span>
                  <span className="font-black text-[#C42F2C] text-base">₹{order.totalAmount}</span>
                </div>
              </div>
            ) : (
              <p className="text-center text-stone-500 py-4 text-sm">Order details not found</p>
            )}

            <div className="mt-4 p-3.5 bg-stone-50 border border-stone-200/70 rounded-xl text-xs text-stone-600 text-center leading-relaxed">
              We have received your order. Our team will prepare your fresh sweets and dispatch updates via WhatsApp.
            </div>

            {/* Direct Invoice PDF download button */}
            {orderId && (
              <a
                href={`${apiUrl}/api/orders/${orderId}/invoice.pdf`}
                download={`Invoice-${orderId.slice(-8).toUpperCase()}.pdf`}
                className="mt-4 w-full flex items-center justify-center gap-2 py-3 bg-[#C42F2C] text-white rounded-xl font-bold text-xs sm:text-sm hover:bg-[#a82421] transition-all shadow-md active:scale-[0.99]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Official Tax Invoice (PDF)
              </a>
            )}
          </motion.div>

          {/* Action links */}
          <motion.div
            className="flex flex-col gap-2.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <a
              href={`https://wa.me/917871949015?text=Hi%2C%20my%20order%20ID%20is%20${orderId?.slice(-8).toUpperCase()}%20and%20I%20have%20paid.%20Please%20confirm.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 bg-[#25D366] text-white rounded-xl font-bold text-sm hover:bg-[#20bb5a] transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.126.554 4.126 1.523 5.862L0 24l6.344-1.493A11.948 11.948 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.87 0-3.63-.48-5.17-1.33l-.37-.21-3.77.89.9-3.68-.23-.38A9.952 9.952 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              </svg>
              Order Support on WhatsApp
            </a>

            <Link
              href="/"
              className="py-3 border border-[#582A00]/20 text-[#582A00] rounded-xl font-bold text-xs sm:text-sm hover:bg-[#582A00]/5 transition-colors"
            >
              Return to Home
            </Link>
          </motion.div>

          {/* Delivery & Pickup Info Card */}
          <motion.div
            className="mt-6 bg-[#582A00] text-[#FFF4DD] rounded-2xl p-4 sm:p-5 text-xs text-left shadow-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-1.5 font-bold text-[#F5B51B]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Pickup & Delivery Details</span>
            </div>
            <p className="leading-relaxed">
              Store pickup is located at <strong>Villupuram Railway Station (1st Platform)</strong>. Door delivery available across Villupuram City.
            </p>
            <p className="text-[#FFF4DD]/60 mt-1.5" style={{ fontFamily: "'Noto Sans Tamil', sans-serif" }}>
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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[#C42F2C] font-bold">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
