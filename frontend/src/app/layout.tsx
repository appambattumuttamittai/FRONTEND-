import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';

export const metadata: Metadata = {
  metadataBase: new URL('https://appambattumuttamittai.com'),
  title: {
    default: 'Appambattu Mutta Mittai | அப்பம்பட்டு முட்டை மிட்டாய் | Traditional Egg Sweet Villupuram',
    template: '%s | Appambattu Mutta Mittai',
  },
  description:
    'Appambattu Mutta Mittai – authentic traditional egg sweet from Meenambur, Villupuram, Tamil Nadu. Made with milk, egg, cashew nut paste and sugar. Pickup only.',
  keywords: ['mutta mittai', 'egg sweet', 'tamil sweet', 'villupuram', 'appambattu', 'traditional sweet'],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://appambattumuttamittai.com',
    siteName: 'Appambattu Mutta Mittai',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+Tamil:wght@400;600;700;900&family=Exo+2:wght@700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
