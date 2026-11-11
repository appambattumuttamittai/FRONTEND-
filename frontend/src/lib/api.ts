const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
    ...options,
  });

  const data = await res.json().catch(() => ({ error: 'Invalid server response' }));

  if (!res.ok) {
    throw new Error(data.error || `HTTP ${res.status}`);
  }
  return data as T;
}

export const api = {
  // Products
  getProducts: () => request<Product[]>('/api/products'),

  // OTP
  sendOtp: (phone: string) =>
    request<{ success: boolean; sessionId: string }>('/api/otp/send', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    }),
  verifyOtp: (phone: string, code: string, sessionId?: string) =>
    request<{ success: boolean; verified: boolean; sessionId: string }>('/api/otp/verify', {
      method: 'POST',
      body: JSON.stringify({ phone, code, sessionId }),
    }),

  // Orders
  createOrder: (data: CreateOrderInput) =>
    request<{ orderId: string; totalAmount: number; paymentExpiry: string; status: string; product: { weight: string; price: number } }>('/api/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getOrder: (id: string) => request<OrderDetail>(`/api/orders/${id}`),

  // Payment
  iHavePaid: (orderId: string) =>
    request<{ success: boolean; status: string; message: string }>('/api/payments/i-have-paid', {
      method: 'POST',
      body: JSON.stringify({ orderId }),
    }),
  getRazorpayConfig: () =>
    request<{ enabled: boolean; keyId: string }>('/api/payments/razorpay/config'),
  createRazorpayOrder: (orderId: string) =>
    request<{
      success: boolean;
      keyId: string;
      razorpayOrderId: string;
      amount: number;
      currency: string;
      orderId: string;
      customerName: string;
      phone: string;
    }>('/api/payments/razorpay/create-order', {
      method: 'POST',
      body: JSON.stringify({ orderId }),
    }),
  verifyRazorpayPayment: (payload: {
    orderId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) =>
    request<{ success: boolean; orderId: string; status: string; message: string }>(
      '/api/payments/razorpay/verify',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    ),

  // Config
  getQrUrl: () => request<{ url: string }>('/api/config/qr-url'),

  // Admin
  adminLogin: (username: string, password: string) =>
    request<{ success: boolean }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  adminLogout: () => request<{ success: boolean }>('/api/auth/logout', { method: 'POST' }),
  adminMe: () => request<{ authenticated: boolean }>('/api/auth/me'),
  adminStats: () => request<DashboardStats>('/api/admin/stats'),
  adminOrders: (params: Record<string, string>) =>
    request<OrdersResponse>(`/api/admin/orders?${new URLSearchParams(params)}`),
  adminOrderDetail: (id: string) => request<AdminOrder>(`/api/admin/orders/${id}`),
  adminUpdateStatus: (id: string, status: string, adminNotes?: string) =>
    request<AdminOrder>(`/api/admin/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, adminNotes }),
    }),
  adminProducts: () => request<Product[]>('/api/admin/products'),
  adminUpdateProduct: (id: string, data: { price?: number; inStock?: boolean }) =>
    request<Product>(`/api/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  adminSetQrUrl: (url: string) =>
    request<{ success: boolean; url: string }>('/api/config/qr-url', {
      method: 'POST',
      body: JSON.stringify({ url }),
    }),
  adminCharts: () => request<unknown[]>('/api/admin/charts'),
  adminSheetsUrl: () => request<{ url: string | null }>('/api/admin/sheets-url'),
  adminExportCsv: (params: Record<string, string>) =>
    `${API_URL}/api/admin/export/csv?${new URLSearchParams(params)}`,
};

// Types
export interface Product {
  id: string;
  weight: string;
  weightGrams: number;
  price: number;
  inStock: boolean;
}

export interface CreateOrderInput {
  customerName: string;
  phone: string;
  productId: string;
  quantity?: number;
  items?: Array<{ productId: string; quantity: number }>;
  otpSessionId: string;
  streetAddress: string;
  city: string;
  pincode?: string;
}

export interface OrderDetail {
  id: string;
  customerName: string;
  phone: string;
  product: { id?: string; weight: string; price: number };
  totalAmount: number;
  status: string;
  paymentExpiry: string | null;
  streetAddress?: string | null;
  city: string | null;
  pincode?: string | null;
  createdAt: string;
}

export interface DashboardStats {
  ordersToday: number;
  revenueToday: number;
  pendingReview: number;
  paidOrders: number;
  failedOrders: number;
  outOfStock: number;
  totalOrders: number;
}

export interface AdminOrder {
  id: string;
  customerName: string;
  phone: string;
  product: Product;
  totalAmount: number;
  status: string;
  streetAddress: string | null;
  city: string | null;
  pincode: string | null;
  adminNotes: string | null;
  paymentExpiry: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrdersResponse {
  orders: AdminOrder[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}
