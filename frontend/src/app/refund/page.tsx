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
              <p>We accept secure payments via Razorpay supporting UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, Net Banking, and Wallets. All transactions are in Indian Rupees (₹).</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-[#063D20] mb-2">Order Confirmation</h2>
              <p>Your order is confirmed immediately upon successful payment verification. You will receive an on-screen order summary with order tracking details, and notification via WhatsApp.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-[#063D20] mb-2">Refund Policy</h2>
              <p>Since Mutta Mittai is a freshly made perishable food product, we generally do not accept returns. However, if there is an issue with your order (wrong quantity, transit damage, or quality issue), please contact us within 2 hours of delivery/pickup with photographic proof. Verified claims are refunded to the original payment method within 5–7 business days via Razorpay.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-[#063D20] mb-2">Failed/Expired Transactions</h2>
              <p>In case of amount deducted but order not generated due to network timeout, the debited amount will be auto-refunded by Razorpay to your source bank account within 3–5 working days.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-[#063D20] mb-2">Contact for Disputes & Support</h2>
              <p>
                Email: <a href="mailto:appampattueggsweets@gmail.com" className="text-[#063D20] font-bold underline">appampattueggsweets@gmail.com</a><br />
                WhatsApp: <a href="https://wa.me/917871949015" className="text-[#25D366] font-bold">+91 78719 49015</a><br />
                Location: Villupuram Railway Station, 1st Platform, Villupuram, Tamil Nadu - 605602
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
