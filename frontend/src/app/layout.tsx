import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { LanguageProvider } from '@/context/LanguageContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://appambattumuttamittai.com'),
  title: {
    default: 'Appambattu Mutta Mittai | அப்பம்பட்டு முட்டை மிட்டாய் | Traditional Egg Sweet Villupuram',
    template: '%s | Appambattu Mutta Mittai',
  },
  description:
    'Appambattu Mutta Mittai – the original traditional Tamil Nadu egg sweet from Meenambur, Villupuram. 100% pure ingredients: milk, egg, cashew nut paste, sugar. Soft • Fresh • Delicious. Order for pickup today.',
  keywords: [
    'mutta mittai', 'முட்டை மிட்டாய்', 'egg sweet', 'Villupuram sweets',
    'Appambattu Mutta Mittai', 'அப்பம்பட்டு முட்டை மிட்டாய்',
    'Tamil Nadu traditional sweet', 'Meenambur sweet', 'egg candy Tamil Nadu',
    'mutta candy', 'traditional egg sweet India',
  ],
  authors: [{ name: 'Appambattu Mutta Mittai' }],
  creator: 'Appambattu Mutta Mittai',
  openGraph: {
    type: 'website',
    locale: 'ta_IN',
    alternateLocale: 'en_IN',
    url: 'https://appambattumuttamittai.com',
    siteName: 'Appambattu Mutta Mittai',
    title: 'Appambattu Mutta Mittai | Traditional Egg Sweet | முட்டை மிட்டாய்',
    description:
      'Order traditional Mutta Mittai – made with milk, egg, cashew nut paste & sugar. Pickup from Meenambur, Appambattu, Villupuram.',
    images: [
      {
        url: '/images/brochure-main.jpeg',
        width: 1200,
        height: 630,
        alt: 'Appambattu Mutta Mittai – Traditional Egg Sweet',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Appambattu Mutta Mittai | முட்டை மிட்டாய்',
    description: 'Traditional Tamil Nadu egg sweet. Pickup from Meenambur, Villupuram.',
    images: ['/images/brochure-main.jpeg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: 'https://appambattumuttamittai.com',
    languages: {
      'en-IN': 'https://appambattumuttamittai.com',
      'ta-IN': 'https://appambattumuttamittai.com',
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LanguageProvider>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: '#063D20',
                color: '#FFF4DD',
                fontWeight: 600,
                borderRadius: '12px',
              },
              success: { iconTheme: { primary: '#F5B51B', secondary: '#063D20' } },
              error: { iconTheme: { primary: '#E95012', secondary: '#fff' } },
            }}
          />
        </LanguageProvider>
      </body>
    </html>
  );
}
