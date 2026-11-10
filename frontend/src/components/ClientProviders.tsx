'use client';
import { AppProvider } from '@/context/AppContext';
import ProductModal from '@/components/ProductModal';
import { Toaster } from 'react-hot-toast';
import { ReactNode } from 'react';

/**
 * ClientProviders — wraps the entire app in AppProvider so every page
 * (including /privacy, /terms, /refund, /_not-found) can safely use
 * useApp() through the Footer's PackSizes component.
 * Rendered from layout.tsx (which stays a server component for metadata).
 */
export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <AppProvider>
      {children}
      {/* Global product modal — available on every page */}
      <ProductModal />
      {/* Global toast notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#582A00',
            color: '#FFFFFF',
            fontFamily: "'Exo 2', sans-serif",
            fontWeight: 700,
            fontSize: '14px',
            borderRadius: '999px',
            padding: '12px 20px',
            boxShadow: '0 8px 24px rgba(88,42,0,0.35)',
            maxWidth: '340px',
          },
        }}
      />
    </AppProvider>
  );
}
