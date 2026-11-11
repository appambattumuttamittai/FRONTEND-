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

export function sanitizeItemWeight(raw: string): string {
  if (!raw) return 'Mutta Mittai Pack';
  return raw
    .split(/\||\s*Razorpay:/i)[0]
    .replace(/\[STORE PICKUP\]|\[HOME DELIVERY\]/gi, '')
    .trim() || 'Mutta Mittai Pack';
}

function normalizeOrder(order: SavedOrder): SavedOrder {
  const isPickup =
    order.deliveryMethod === 'pickup' ||
    Boolean(order.streetAddress?.toLowerCase().includes('pick up')) ||
    Boolean(order.streetAddress?.toLowerCase().includes('railway')) ||
    Boolean(order.city?.toLowerCase().includes('pickup')) ||
    Boolean(order.city?.toLowerCase().includes('store'));

  const sanitizedItems = (order.items || []).map((it) => ({
    ...it,
    weight: sanitizeItemWeight(it.weight),
  }));

  return {
    ...order,
    deliveryMethod: isPickup ? 'pickup' : 'delivery',
    city: isPickup ? 'Villupuram Railway Station' : (order.city ? order.city.replace(/\(Store Pickup\)/gi, '').trim() : 'Villupuram City'),
    items: sanitizedItems,
  };
}

export function getSavedOrders(): SavedOrder[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map(normalizeOrder);
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
    const normalized = normalizeOrder(order);
    const filtered = existing.filter((o) => o.id !== normalized.id);
    const updated = [normalized, ...filtered].slice(0, 50);

    const json = JSON.stringify(updated);
    localStorage.setItem(STORAGE_KEY, json);
    sessionStorage.setItem(STORAGE_KEY, json);

    window.dispatchEvent(new CustomEvent('mm_orders_updated'));
  } catch (err) {
    console.error('Failed to save order to storage:', err);
  }
}
