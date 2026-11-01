import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function RefundPage() {
  return (
    <>
      <Header />
      <main className="pt-24 pb-16 bg-[#FFF4DD] min-h-screen">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-3xl font-black text-[#063D20] mb-6">Refund & Payment Policy</h1>
          <p className="text-[#3A1C10]/70 mb-6">Last updated: November 2026</p>

          <div className="space-y-6 text-[#3A1C10]/80">
            <section>
              <h2 className="text-xl font-bold text-[#063D20] mb-2">Payment Method</h2>
              <p>We accept payment via GPay / UPI only. All transactions are in Indian Rupees (₹). Payment must be completed within the 90-second window shown at checkout.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-[#063D20] mb-2">Order Confirmation</h2>
              <p>Your order is confirmed only after an admin manually verifies your GPay payment. Clicking "I have Paid" does not automatically confirm your order — it places it under review. You will be notified via WhatsApp once confirmed.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-[#063D20] mb-2">Refund Policy</h2>
              <p>Since Mutta Mittai is a perishable food product, we generally do not accept returns. However, if there is an issue with your order (wrong quantity, product quality), please contact us immediately on WhatsApp within 1 hour of pickup. We will review on a case-by-case basis.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-[#063D20] mb-2">Failed/Expired Payments</h2>
              <p>If your payment window expires before you complete payment, the order is automatically cancelled. If you paid but the window expired, contact us on WhatsApp with your payment screenshot and we will resolve it manually.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-[#063D20] mb-2">Contact for Disputes</h2>
              <p>WhatsApp: <a href="https://wa.me/917871949015" className="text-[#25D366] font-bold">+91 78719 49015</a><br />Location: Meenambur, Appambattu, Villupuram, Tamil Nadu</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
