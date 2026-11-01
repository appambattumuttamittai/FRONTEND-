import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Place Your Order | Appambattu Mutta Mittai',
  description: 'Order Appambattu Mutta Mittai online. Pick your quantity (250gm–1kg), verify phone, and pay via GPay. Pickup only from Meenambur, Villupuram.',
  robots: { index: false, follow: false },
};

export default function OrderLayout({ children }: { children: React.ReactNode }) {
  return children;
}
