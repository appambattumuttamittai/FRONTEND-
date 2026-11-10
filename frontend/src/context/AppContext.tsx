'use client';
import React, {
  createContext, useContext, useState, useEffect,
  useCallback, ReactNode,
} from 'react';
import { CartItem, readCart, upsertCartItem, removeCartItem, cartTotalCount } from '@/lib/cart';

export interface ProductForModal {
  id: string;
  weight: string;
  weightGrams: number;
  price: number;
  inStock: boolean;
}

interface AppCtx {
  /* ── cart ── */
  cart: CartItem[];
  cartCount: number;
  addItem: (item: Omit<CartItem, 'addedAt'>) => void;
  removeItem: (id: string) => void;
  /* ── modal ── */
  modalProduct: ProductForModal | null;
  openModal: (p: ProductForModal) => void;
  closeModal: () => void;
  /* ── products cache (for footer pack-size links) ── */
  products: ProductForModal[];
  setProducts: (p: ProductForModal[]) => void;
}

const Ctx = createContext<AppCtx | null>(null);

const API = process.env.NEXT_PUBLIC_API_URL || 'https://backend-oi9e.onrender.com';

export function AppProvider({ children }: { children: ReactNode }) {
  const [cart, setCart]               = useState<CartItem[]>([]);
  const [cartCount, setCartCount]     = useState(0);
  const [modalProduct, setModal]      = useState<ProductForModal | null>(null);
  const [products, setProductsState]  = useState<ProductForModal[]>([]);

  /* hydrate cart from storage on mount */
  useEffect(() => {
    const c = readCart();
    setCart(c);
    setCartCount(cartTotalCount(c));
  }, []);

  const addItem = useCallback((item: Omit<CartItem, 'addedAt'>) => {
    const updated = upsertCartItem(item);
    setCart(updated);
    setCartCount(cartTotalCount(updated));
    /* notify backend — fire-and-forget, silent on error */
    fetch(`${API}/api/cart-notify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId:   item.id,
        weight:      item.weight,
        weightLabel: item.weightLabel,
        quantity:    item.quantity,
        price:       item.price,
        total:       item.price * item.quantity,
        addedAt:     new Date().toISOString(),
      }),
    }).catch(() => {});
  }, []);

  const removeItem = useCallback((id: string) => {
    const updated = removeCartItem(id);
    setCart(updated);
    setCartCount(cartTotalCount(updated));
  }, []);

  const openModal  = useCallback((p: ProductForModal) => setModal(p), []);
  const closeModal = useCallback(() => setModal(null), []);
  const setProducts = useCallback((p: ProductForModal[]) => setProductsState(p), []);

  return (
    <Ctx.Provider value={{
      cart, cartCount, addItem, removeItem,
      modalProduct, openModal, closeModal,
      products, setProducts,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function useApp(): AppCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}
