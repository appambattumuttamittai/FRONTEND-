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
              <p>Payment is processed securely through Razorpay gateway supporting UPI, Debit/Credit Cards, and Net Banking. Orders are confirmed immediately upon successful transaction verification.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-[#063D20] mb-2">3. Product</h2>
              <p>Mutta Mittai contains egg, milk, and cashew nuts. Not suitable for persons with allergies to these ingredients. All prices are in Indian Rupees (₹). Prices may change without prior notice — current prices shown at checkout are final.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-[#063D20] mb-2">4. Availability</h2>
              <p>Products are subject to availability. We reserve the right to cancel orders if fresh stock is unavailable, with an immediate full refund to the original payment method.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-[#063D20] mb-2">5. Contact & Support</h2>
              <p>
                Email: <a href="mailto:appampattueggsweets@gmail.com" className="text-[#063D20] font-bold underline">appampattueggsweets@gmail.com</a><br />
                WhatsApp: <a href="https://wa.me/917871949015" className="text-[#25D366] font-bold">+91 78719 49015</a><br />
                Address: Villupuram Railway Station, 1st Platform, Villupuram, Tamil Nadu - 605602
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
