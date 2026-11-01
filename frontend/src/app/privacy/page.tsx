import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="pt-24 pb-16 bg-[#FFF4DD] min-h-screen">
        <div className="container mx-auto px-4 max-w-3xl prose prose-green">
          <h1 className="text-3xl font-black text-[#063D20] mb-6">Privacy Policy</h1>
          <p className="text-[#3A1C10]/70 mb-4">Last updated: November 2026</p>

          <h2 className="text-xl font-bold text-[#063D20] mt-8 mb-3">Information We Collect</h2>
          <p className="text-[#3A1C10]/80 mb-4">
            When you place an order on Appambattu Mutta Mittai, we collect:
          </p>
          <ul className="list-disc pl-6 text-[#3A1C10]/80 space-y-2 mb-4">
            <li>Your full name</li>
            <li>Your mobile phone number (verified via OTP)</li>
            <li>Your pickup address (street, city, pincode)</li>
          </ul>

          <h2 className="text-xl font-bold text-[#063D20] mt-8 mb-3">How We Use Your Information</h2>
          <ul className="list-disc pl-6 text-[#3A1C10]/80 space-y-2 mb-4">
            <li>To process and confirm your order</li>
            <li>To contact you on WhatsApp for order confirmation</li>
            <li>To manage pickup scheduling</li>
            <li>Internal business analytics and record keeping</li>
          </ul>

          <h2 className="text-xl font-bold text-[#063D20] mt-8 mb-3">Data Storage</h2>
          <p className="text-[#3A1C10]/80 mb-4">
            Your data is stored securely in a PostgreSQL database hosted on Neon. Phone numbers are masked in
            admin displays. We do not sell or share your personal data with third parties.
          </p>

          <h2 className="text-xl font-bold text-[#063D20] mt-8 mb-3">Contact</h2>
          <p className="text-[#3A1C10]/80">
            For any privacy concerns, contact us on WhatsApp:{' '}
            <a href="https://wa.me/917871949015" className="text-[#25D366] font-bold">+91 78719 49015</a>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
