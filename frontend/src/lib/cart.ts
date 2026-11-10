/* ── Cart storage — persists in BOTH localStorage (long-term) and sessionStorage (session) ── */
export interface CartItem {
  id: string;          // product id e.g. "250gm"
  weight: string;      // e.g. "250gm"
  weightLabel: string; // e.g. "250 gm — Small Pack"
  price: number;
  quantity: number;
  addedAt: string;     // ISO timestamp
}

const KEY = 'mm_cart';

export function readCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const ls = localStorage.getItem(KEY);
    if (ls) return JSON.parse(ls) as CartItem[];
    const ss = sessionStorage.getItem(KEY);
    if (ss) return JSON.parse(ss) as CartItem[];
  } catch { /* corrupted — start fresh */ }
  return [];
}

export function writeCart(items: CartItem[]): void {
  if (typeof window === 'undefined') return;
  const json = JSON.stringify(items);
  try { localStorage.setItem(KEY, json); } catch { /* quota */ }
  try { sessionStorage.setItem(KEY, json); } catch { /* quota */ }
}

/** Add or increment quantity of an item. Returns new cart. */
export function upsertCartItem(incoming: Omit<CartItem, 'addedAt'>): CartItem[] {
  const cart = readCart();
  const idx = cart.findIndex((c) => c.id === incoming.id);
  if (idx >= 0) {
    cart[idx] = { ...cart[idx], quantity: cart[idx].quantity + incoming.quantity };
  } else {
    cart.push({ ...incoming, addedAt: new Date().toISOString() });
  }
  writeCart(cart);
  return cart;
}

export function removeCartItem(id: string): CartItem[] {
  const cart = readCart().filter((c) => c.id !== id);
  writeCart(cart);
  return cart;
}

export function clearCart(): CartItem[] {
  writeCart([]);
  return [];
}

export function cartTotalCount(items: CartItem[]): number {
  return items.reduce((s, i) => s + i.quantity, 0);
}

export function cartTotalPrice(items: CartItem[]): number {
  return items.reduce((s, i) => s + i.price * i.quantity, 0);
}
