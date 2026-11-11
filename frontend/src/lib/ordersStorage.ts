export interface SavedOrder {
  id: string;
  customerName: string;
  phone: string;
  totalAmount: number;
  items: Array<{
    id: string;
    weight: string;
    price: number;
    quantity: number;
  }>;
  deliveryMethod: 'pickup' | 'delivery' | string;
  streetAddress?: string;
  city?: string;
  pincode?: string;
  status: string;
  date: string;
  transactionId?: string;
}

const STORAGE_KEY = 'mm_ordered_items';

export function getSavedOrders(): SavedOrder[] {
  if (typeof window === 'undefined') return [];
  try {
    // Check localStorage first
    const local = localStorage.getItem(STORAGE_KEY);
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed)) return parsed;
    }

    // Fallback check sessionStorage
    const session = sessionStorage.getItem(STORAGE_KEY);
    if (session) {
      const parsed = JSON.parse(session);
      if (Array.isArray(parsed)) {
        // Sync to localStorage
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed)); } catch {}
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to read ordered items from storage:', err);
  }
  return [];
}

export function saveOrderToStorage(order: SavedOrder): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getSavedOrders();
    // Prepend or update existing order
    const filtered = existing.filter((o) => o.id !== order.id);
    const updated = [order, ...filtered].slice(0, 50); // Keep latest 50 orders

    const json = JSON.stringify(updated);
    localStorage.setItem(STORAGE_KEY, json);
    sessionStorage.setItem(STORAGE_KEY, json);

    // Dispatch custom event so Header or any active drawer updates in real-time
    window.dispatchEvent(new CustomEvent('mm_orders_updated'));
  } catch (err) {
    console.error('Failed to save order to storage:', err);
  }
}
