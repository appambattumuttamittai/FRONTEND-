'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

type Lang = 'en' | 'ta';

interface LanguageContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Lang, string>> = {
  // Navigation
  'nav.order': { en: 'Order Now', ta: 'இப்போது ஆர்டர் செய்யுங்கள்' },
  'nav.whatsapp': { en: 'WhatsApp Order', ta: 'வாட்ஸ்அப் ஆர்டர்' },
  'nav.home': { en: 'Home', ta: 'முகப்பு' },

  // Hero
  'hero.tagline': { en: 'Traditional Tamil Nadu Egg Sweet', ta: 'பாரம்பரிய தமிழ்நாடு முட்டை மிட்டாய்' },
  'hero.headline': { en: 'Appambattu Mutta Mittai', ta: 'அப்பம்பட்டு முட்டை மிட்டாய்' },
  'hero.sub': { en: 'Soft • Fresh • Delicious', ta: 'மிருதுவான • புதிய • சுவையான' },
  'hero.cta': { en: 'Order for Pickup', ta: 'பிக்கப்பிற்கு ஆர்டர் செய்யுங்கள்' },
  'hero.whatsapp': { en: 'Chat on WhatsApp', ta: 'வாட்ஸ்அப்பில் பேசுங்கள்' },
  'hero.badge': { en: '100% Pure & Hygienic', ta: '100% தூய்மையான & சுகாதாரமான' },

  // Products
  'products.title': { en: 'Choose Your Pack', ta: 'உங்கள் பேக்கை தேர்வு செய்யுங்கள்' },
  'products.subtitle': { en: 'Fresh made daily — Pickup in Store only', ta: 'தினமும் புதிதாக தயாரிக்கப்படுகிறது — கடையில் மட்டும் பிக்கப்' },
  'products.pickup_badge': { en: 'Pickup Only', ta: 'பிக்கப் மட்டும்' },
  'products.order': { en: 'Order This', ta: 'இதை ஆர்டர் செய்' },
  'products.out_of_stock': { en: 'Out of Stock', ta: 'இருப்பு இல்லை' },

  // Why us
  'why.title': { en: 'Why Appambattu Mutta Mittai?', ta: 'ஏன் அப்பம்பட்டு முட்டை மிட்டாய்?' },
  'why.fresh.title': { en: 'Always Fresh', ta: 'எப்போதும் புதிது' },
  'why.fresh.desc': { en: 'Made fresh daily with no preservatives', ta: 'ஒவ்வொரு நாளும் பாதுகாப்பிகள் இல்லாமல் புதிதாக தயாரிக்கப்படுகிறது' },
  'why.traditional.title': { en: 'Traditional Recipe', ta: 'பாரம்பரிய செய்முறை' },
  'why.traditional.desc': { en: 'Authentic age-old Tamil Nadu recipe', ta: 'நூற்றாண்டு பழமையான தமிழ்நாடு செய்முறை' },
  'why.hygienic.title': { en: 'Hygienic Preparation', ta: 'சுகாதாரமான தயாரிப்பு' },
  'why.hygienic.desc': { en: 'Prepared in a clean, hygienic kitchen', ta: 'சுத்தமான, சுகாதாரமான சமையலறையில் தயாரிக்கப்படுகிறது' },
  'why.rich.title': { en: 'Rich in Taste', ta: 'சுவையில் செழிப்பு' },
  'why.rich.desc': { en: 'Premium cashew nut paste gives a royal richness', ta: 'பீமியம் முந்திரி பேஸ்ட் அரச செழிப்பு தருகிறது' },

  // Ingredients
  'ingredients.title': { en: 'Pure Ingredients', ta: 'தூய பொருட்கள்' },
  'ingredients.subtitle': { en: 'Simple. Pure. Delicious.', ta: 'எளிமையான. தூய்மையான. சுவையான.' },
  'ingredients.milk': { en: 'Fresh Milk', ta: 'புதிய பால்' },
  'ingredients.egg': { en: 'Farm Eggs', ta: 'பண்ணை முட்டைகள்' },
  'ingredients.cashew': { en: 'Cashew Nut Paste', ta: 'முந்திரி விழுது' },
  'ingredients.sugar': { en: 'Pure Sugar', ta: 'தூய சர்க்கரை' },
  'ingredients.allergen': { en: '⚠️ Allergen Notice: Contains Egg, Milk and Cashew Nuts', ta: '⚠️ ஒவ்வாமை அறிவிப்பு: முட்டை, பால் மற்றும் முந்திரி கொட்டைகள் உள்ளடங்கியது' },

  // Gallery
  'gallery.title': { en: 'Our Sweet Story', ta: 'எங்கள் இனிப்பு கதை' },

  // Pickup
  'pickup.title': { en: 'Pickup Location', ta: 'பிக்கப் இடம்' },
  'pickup.address': { en: 'Meenambur, Appambattu, Villupuram', ta: 'மீனம்பூர், அப்பம்பட்டு, விழுப்புரம்' },
  'pickup.only': { en: 'Pickup in Store Only', ta: 'கடையில் மட்டும் பிக்கப்' },
  'pickup.no_delivery': { en: 'Courier service is currently unavailable. Please visit us to collect your order.', ta: 'குரியர் சேவை தற்போது இல்லை. உங்கள் ஆர்டரை எடுக்க எங்களை நேரில் வந்து சந்திக்கவும்.' },
  'pickup.maps': { en: 'Open in Google Maps', ta: 'Google Maps-ல் திற' },
  'pickup.whatsapp': { en: 'WhatsApp Us to Confirm', ta: 'உறுதிப்படுத்த வாட்ஸ்அப்பில் தொடர்பு கொள்ளுங்கள்' },

  // WhatsApp CTA
  'wa.title': { en: 'Order via WhatsApp', ta: 'வாட்ஸ்அப் வழியாக ஆர்டர் செய்யுங்கள்' },
  'wa.subtitle': { en: 'Quick, easy and direct. Chat with us now.', ta: 'விரைவான, எளிதான மற்றும் நேரடி. இப்போதே எங்களிடம் பேசுங்கள்.' },
  'wa.button': { en: 'Chat on WhatsApp', ta: 'வாட்ஸ்அப்பில் பேசுங்கள்' },
  'wa.number': { en: '+91 78719 49015', ta: '+91 78719 49015' },

  // Footer
  'footer.tagline': { en: 'Traditional Taste. Always Fresh.', ta: 'பாரம்பரிய சுவை. எப்போதும் புதிது.' },
  'footer.privacy': { en: 'Privacy Policy', ta: 'தனியுரிமை கொள்கை' },
  'footer.terms': { en: 'Terms of Service', ta: 'சேவை விதிமுறைகள்' },
  'footer.refund': { en: 'Refund Policy', ta: 'திரும்பப் பெறும் கொள்கை' },
  'footer.rights': { en: 'All rights reserved.', ta: 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டுள்ளன.' },

  // Order flow
  'order.title': { en: 'Place Your Order', ta: 'உங்கள் ஆர்டரை வைக்கவும்' },
  'order.step.name': { en: 'Your Name', ta: 'உங்கள் பெயர்' },
  'order.step.phone': { en: 'Phone Verification', ta: 'தொலைபேசி சரிபார்ப்பு' },
  'order.step.quantity': { en: 'Select Quantity', ta: 'அளவை தேர்வு செய்யுங்கள்' },
  'order.step.pickup': { en: 'Pickup Details', ta: 'பிக்கப் விவரங்கள்' },
  'order.step.payment': { en: 'Payment', ta: 'கட்டணம்' },
  'order.name.label': { en: 'Full Name', ta: 'முழு பெயர்' },
  'order.name.placeholder': { en: 'Enter your full name', ta: 'உங்கள் முழு பெயரை உள்ளிடுங்கள்' },
  'order.phone.label': { en: 'Mobile Number', ta: 'மொபைல் எண்' },
  'order.phone.placeholder': { en: '10-digit mobile number', ta: '10-இலக்க மொபைல் எண்' },
  'order.phone.send_otp': { en: 'Send OTP', ta: 'OTP அனுப்பு' },
  'order.phone.otp_sent': { en: 'OTP sent to your number', ta: 'உங்கள் எண்ணுக்கு OTP அனுப்பப்பட்டது' },
  'order.phone.enter_otp': { en: 'Enter OTP', ta: 'OTP உள்ளிடுங்கள்' },
  'order.phone.verify': { en: 'Verify OTP', ta: 'OTP சரிபார்' },
  'order.phone.verified': { en: '✓ Phone Verified', ta: '✓ தொலைபேசி சரிபார்க்கப்பட்டது' },
  'order.phone.resend': { en: 'Resend OTP', ta: 'OTP மீண்டும் அனுப்பு' },
  'order.street.label': { en: 'Street Address', ta: 'தெரு முகவரி' },
  'order.street.placeholder': { en: 'Your street address (for records)', ta: 'உங்கள் தெரு முகவரி (பதிவுகளுக்காக)' },
  'order.city.label': { en: 'City / Town', ta: 'நகரம் / ஊர்' },
  'order.pincode.label': { en: 'Pincode (optional)', ta: 'பின்கோட் (விரும்பினால்)' },
  'order.pickup.info': { en: '📍 Pickup only from: Meenambur, Appambattu, Villupuram', ta: '📍 மட்டும் பிக்கப்: மீனம்பூர், அப்பம்பட்டு, விழுப்புரம்' },
  'order.payment.title': { en: 'Pay via GPay / UPI', ta: 'GPay / UPI மூலம் பணம் செலுத்துங்கள்' },
  'order.payment.scan': { en: 'Scan the QR code to pay', ta: 'பணம் செலுத்த QR குறியீட்டை ஸ்கேன் செய்யுங்கள்' },
  'order.payment.timer': { en: 'Complete payment within', ta: 'இந்த நேரத்தில் கட்டணத்தை முடிக்கவும்' },
  'order.payment.paid': { en: 'I have Paid', ta: 'நான் பணம் செலுத்தினேன்' },
  'order.payment.note': { en: '⚠️ Your order will be confirmed only after admin verifies your payment. This may take a few minutes.', ta: '⚠️ நிர்வாகி உங்கள் கட்டணத்தை சரிபார்த்த பிறகே உங்கள் ஆர்டர் உறுதிப்படுத்தப்படும். இதற்கு சில நிமிடங்கள் ஆகலாம்.' },
  'order.payment.expired': { en: 'Payment window expired. Please place a new order.', ta: 'கட்டண நேரம் முடிந்தது. புதிய ஆர்டர் வைக்கவும்.' },
  'order.next': { en: 'Continue', ta: 'தொடரவும்' },
  'order.back': { en: 'Back', ta: 'பின்னால்' },
  'order.summary': { en: 'Order Summary', ta: 'ஆர்டர் சுருக்கம்' },
  'order.total': { en: 'Total', ta: 'மொத்தம்' },

  // Success
  'success.title': { en: 'Order Placed! 🎉', ta: 'ஆர்டர் வைக்கப்பட்டது! 🎉' },
  'success.review': { en: 'Payment Under Review', ta: 'கட்டணம் சரிபார்ப்பில் உள்ளது' },
  'success.message': { en: 'We have received your order. Our team will confirm payment and notify you on WhatsApp.', ta: 'உங்கள் ஆர்டரை பெற்றோம். எங்கள் குழு கட்டணத்தை சரிபார்த்து வாட்ஸ்அப்பில் உங்களுக்கு தெரிவிக்கும்.' },
  'success.whatsapp': { en: 'Contact us on WhatsApp', ta: 'வாட்ஸ்அப்பில் தொடர்பு கொள்ளுங்கள்' },
  'success.home': { en: 'Back to Home', ta: 'முகப்பிற்கு திரும்பு' },

  // Common
  'common.loading': { en: 'Loading...', ta: 'ஏற்றுகிறது...' },
  'common.error': { en: 'Something went wrong. Please try again.', ta: 'ஏதோ தவறாகிவிட்டது. மீண்டும் முயற்சிக்கவும்.' },
  'common.required': { en: 'This field is required', ta: 'இந்த புலம் தேவை' },
};

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    const saved = Cookies.get('lang') as Lang | undefined;
    if (saved === 'en' || saved === 'ta') setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    Cookies.set('lang', l, { expires: 365, sameSite: 'lax' });
  };

  const t = (key: string): string => {
    return translations[key]?.[lang] ?? translations[key]?.en ?? key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
