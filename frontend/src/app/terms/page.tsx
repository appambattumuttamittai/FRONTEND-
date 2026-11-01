import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="pt-24 pb-16 bg-[#FFF4DD] min-h-screen">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-3xl font-black text-[#063D20] mb-6">Terms of Service</h1>
          <p className="text-[#3A1C10]/70 mb-6">Last updated: November 2026</p>

          <div className="space-y-6 text-[#3A1C10]/80">
            <section>
              <h2 className="text-xl font-bold text-[#063D20] mb-2">1. Pickup Only</h2>
              <p>All orders must be collected from our store at Meenambur, Appambattu, Villupuram. No courier or delivery service is available. We are not responsible for orders not collected within a reasonable time.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-[#063D20] mb-2">2. Payment</h2>
              <p>Payment is via GPay/UPI. Orders are confirmed only after admin verification of payment. The 90-second payment window is strictly enforced by the system.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-[#063D20] mb-2">3. Product</h2>
              <p>Mutta Mittai contains egg, milk, and cashew nuts. Not suitable for persons with allergies to these ingredients. All prices are in Indian Rupees (₹). Prices may change without prior notice — current prices shown at checkout are final.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-[#063D20] mb-2">4. Availability</h2>
              <p>Products are subject to availability. We reserve the right to cancel orders if stock is unavailable, with a full refund where applicable.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-[#063D20] mb-2">5. Contact</h2>
              <p>For any queries: <a href="https://wa.me/917871949015" className="text-[#25D366] font-bold">WhatsApp +91 78719 49015</a></p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
