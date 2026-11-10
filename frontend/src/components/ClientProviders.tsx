'use client';
import { AppProvider } from '@/context/AppContext';
import ProductModal from '@/components/ProductModal';
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
    </AppProvider>
  );
}
