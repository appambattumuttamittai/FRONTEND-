import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import ClientProviders from '@/components/ClientProviders';

export const metadata: Metadata = {
  metadataBase: new URL('https://appambattumuttamittai.com'),
  title: {
    default: 'Appampattu Mutta Mittai | முட்டை மிட்டாய் | Best Egg Sweet in Villupuram',
    template: '%s | Appampattu Mutta Mittai',
  },
  description:
    'Appampattu Mutta Mittai — the original traditional egg sweet (முட்டை மிட்டாய்) from Meenambur, Appampattu, Villupuram, Tamil Nadu. Made fresh daily with milk, egg, cashew and sugar. Order online or find us on Swiggy. Home delivery within Villupuram city.',
  keywords: [
    'appampattu', 'appambattu', 'mutta mittai', 'egg sweet', 'egg sweet villupuram',
    'villupuram sweet', 'sweet villupuram', 'traditional egg sweet', 'tamil egg sweet',
    'முட்டை மிட்டாய்', 'அப்பம்பட்டு முட்டை மிட்டாய்', 'egg sweet near me',
    'muttai mittai', 'appampattu egg sweet', 'appambattu egg sweet',
    'villupuram traditional sweet', 'meenambur sweet', 'swiggy egg sweet villupuram',
  ],
  authors: [{ name: 'Appampattu Mutta Mittai', url: 'https://appambattumuttamittai.com' }],
  creator: 'Appampattu Mutta Mittai',
  publisher: 'Appampattu Mutta Mittai',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large', 'max-video-preview': -1 },
  },
  icons: {
    icon: '/images/logo.jpg',
    apple: '/images/logo.jpg',
    shortcut: '/images/logo.jpg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://appambattumuttamittai.com',
    siteName: 'Appampattu Mutta Mittai',
    title: 'Appampattu Mutta Mittai — Original Egg Sweet from Villupuram',
    description: 'Order the authentic Appampattu Mutta Mittai (முட்டை மிட்டாய்) — traditional Tamil Nadu egg sweet made fresh daily in Villupuram. Available online and on Swiggy.',
    images: [{ url: '/images/logo.jpg', width: 512, height: 512, alt: 'Appampattu Mutta Mittai — Traditional Egg Sweet Villupuram' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Appampattu Mutta Mittai | Traditional Egg Sweet Villupuram',
    description: 'Order authentic Mutta Mittai (முட்டை மிட்டாய்) from Villupuram. Made fresh daily. Available on Swiggy and online delivery.',
    images: ['/images/logo.jpg'],
  },
  alternates: {
    canonical: 'https://appambattumuttamittai.com',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Google Tag Manager */}
        <script async src="https://www.googletagmanager.com/gtm.js?id=GTM-M5MGXMZH" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date());`,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+Tamil:wght@400;600;700;900&family=Exo+2:wght@700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <LanguageProvider>
          <ClientProviders>{children}</ClientProviders>
        </LanguageProvider>
      </body>
    </html>
  );
}
