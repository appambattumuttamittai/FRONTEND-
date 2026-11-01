'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { api, DashboardStats, AdminOrder, Product, OrdersResponse } from '@/lib/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

// Status badge colors
const statusColors: Record<string, { bg: string; text: string }> = {
  PAYMENT_PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  PAYMENT_REVIEW: { bg: 'bg-blue-100', text: 'text-blue-800' },
  PAID: { bg: 'bg-green-100', text: 'text-green-800' },
  PAYMENT_FAILED: { bg: 'bg-red-100', text: 'text-red-800' },
  READY_FOR_PICKUP: { bg: 'bg-purple-100', text: 'text-purple-800' },
  PICKED_UP: { bg: 'bg-gray-100', text: 'text-gray-700' },
  CANCELLED: { bg: 'bg-red-50', text: 'text-red-600' },
  OUT_OF_STOCK: { bg: 'bg-orange-100', text: 'text-orange-800' },
  OTP_PENDING: { bg: 'bg-gray-100', text: 'text-gray-600' },
  OTP_VERIFIED: { bg: 'bg-teal-100', text: 'text-teal-800' },
};

function StatusBadge({ status }: { status: string }) {
  const c = statusColors[status] || { bg: 'bg-gray-100', text: 'text-gray-700' };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${c.bg} ${c.text}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}

// Login Screen
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.adminLogin(username, password);
      onLogin();
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#063D20] to-[#0A512B] flex items-center justify-center px-4">
      <motion.div
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🔐</div>
          <h1 className="text-2xl font-black text-[#063D20]">Admin Panel</h1>
          <p className="text-[#3A1C10]/50 text-sm mt-1">Appambattu Mutta Mittai</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#3A1C10] mb-1.5">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#063D20] outline-none"
              placeholder="Admin username"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#3A1C10] mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#063D20] outline-none"
              placeholder="Admin password"
              required
            />
          </div>
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#063D20] text-[#FFF4DD] rounded-xl font-bold text-lg hover:bg-[#0A512B] transition-colors disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

// Stats cards
function StatsGrid({ stats }: { stats: DashboardStats }) {
  const cards = [
    { label: 'Orders Today', value: stats.ordersToday, icon: '📦', color: 'text-[#063D20]' },
    { label: 'Revenue Today', value: `₹${stats.revenueToday}`, icon: '💰', color: 'text-green-600' },
    { label: 'Pending Review', value: stats.pendingReview, icon: '🔍', color: 'text-blue-600' },
    { label: 'Paid Orders', value: stats.paidOrders, icon: '✅', color: 'text-green-600' },
    { label: 'Failed/Expired', value: stats.failedOrders, icon: '❌', color: 'text-red-600' },
    { label: 'Total Orders', value: stats.totalOrders, icon: '📊', color: 'text-[#063D20]' },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      {cards.map((c, i) => (
        <motion.div
          key={i}
          className="bg-white rounded-2xl shadow p-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <div className="text-2xl mb-1">{c.icon}</div>
          <div className={`text-2xl font-black ${c.color}`}>{c.value}</div>
          <div className="text-xs text-gray-500 font-medium mt-1">{c.label}</div>
        </motion.div>
      ))}
    </div>
  );
}

// Orders table
function OrdersTable({ onSelectOrder }: { onSelectOrder: (order: AdminOrder) => void }) {
  const [data, setData] = useState<OrdersResponse | null>(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { page: String(page), limit: '15' };
      if (search) params.search = search;
      if (status) params.status = status;
      const result = await api.adminOrders(params);
      setData(result);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [page, status]);
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); load(); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const statuses = ['', 'PAYMENT_PENDING', 'PAYMENT_REVIEW', 'PAID', 'PAYMENT_FAILED', 'READY_FOR_PICKUP', 'PICKED_UP', 'CANCELLED'];

  return (
    <div className="bg-white rounded-2xl shadow overflow-hidden">
      {/* Filters */}
      <div className="p-4 border-b flex flex-wrap gap-3 items-center">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, ID, city..."
          className="flex-1 min-w-48 px-3 py-2 border rounded-lg text-sm"
        />
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="px-3 py-2 border rounded-lg text-sm"
        >
          {statuses.map((s) => <option key={s} value={s}>{s || 'All Statuses'}</option>)}
        </select>
        <a
          href={api.adminExportCsv(status ? { status } : {})}
          className="px-3 py-2 bg-[#063D20] text-white rounded-lg text-sm font-bold hover:bg-[#0A512B]"
        >
          ⬇ CSV
        </a>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              {['Order ID', 'Customer', 'Phone', 'Product', 'Amount', 'Status', 'Date', 'Action'].map((h) => (
                <th key={h} className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              Array(5).fill(0).map((_, i) => (
                <tr key={i}>
                  {Array(8).fill(0).map((_, j) => (
                    <td key={j} className="px-4 py-3"><div className="h-4 shimmer rounded w-20" /></td>
                  ))}
                </tr>
              ))
            ) : data?.orders.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400">No orders found</td></tr>
            ) : (
              data?.orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs font-bold text-[#063D20]">{order.id.slice(-8).toUpperCase()}</td>
                  <td className="px-4 py-3 font-semibold whitespace-nowrap">{order.customerName}</td>
                  <td className="px-4 py-3 text-gray-600">{order.phone}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{order.product.weight}</td>
                  <td className="px-4 py-3 font-bold text-[#E95012]">₹{order.totalAmount}</td>
                  <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-xs">
                    {new Date(order.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onSelectOrder(order)}
                      className="px-3 py-1 bg-[#063D20] text-white rounded-lg text-xs font-bold hover:bg-[#0A512B]"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data && data.pages > 1 && (
        <div className="p-4 border-t flex items-center justify-between text-sm">
          <span className="text-gray-500">{data.total} orders total</span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 border rounded-lg disabled:opacity-40"
            >
              ←
            </button>
            <span className="px-3 py-1 bg-[#063D20] text-white rounded-lg">{page} / {data.pages}</span>
            <button
              onClick={() => setPage((p) => Math.min(data.pages, p + 1))}
              disabled={page === data.pages}
              className="px-3 py-1 border rounded-lg disabled:opacity-40"
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Order detail modal
function OrderModal({ order, onClose, onRefresh }: { order: AdminOrder; onClose: () => void; onRefresh: () => void }) {
  const [selectedStatus, setSelectedStatus] = useState(order.status);
  const [notes, setNotes] = useState(order.adminNotes || '');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await api.adminUpdateStatus(order.id, selectedStatus, notes);
      toast.success('Order updated!');
      onRefresh();
      onClose();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const statuses = [
    'OTP_PENDING', 'OTP_VERIFIED', 'PAYMENT_PENDING', 'PAYMENT_REVIEW',
    'PAID', 'PAYMENT_FAILED', 'OUT_OF_STOCK', 'READY_FOR_PICKUP', 'PICKED_UP', 'CANCELLED'
  ];

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <motion.div
        className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-black text-[#063D20]">Order #{order.id.slice(-8).toUpperCase()}</h2>
            <StatusBadge status={order.status} />
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
        </div>

        <div className="space-y-4 text-sm mb-6">
          <div className="grid grid-cols-2 gap-3">
            <div><span className="text-gray-500">Customer</span><p className="font-bold">{order.customerName}</p></div>
            <div><span className="text-gray-500">Phone</span><p className="font-bold">{order.phone}</p></div>
            <div><span className="text-gray-500">Product</span><p className="font-bold">{order.product.weight}</p></div>
            <div><span className="text-gray-500">Amount</span><p className="font-black text-[#E95012]">₹{order.totalAmount}</p></div>
            <div><span className="text-gray-500">City</span><p className="font-bold">{order.city || '-'}</p></div>
            <div><span className="text-gray-500">Pincode</span><p className="font-bold">{order.pincode || '-'}</p></div>
          </div>
          {order.streetAddress && (
            <div><span className="text-gray-500">Address</span><p className="font-bold">{order.streetAddress}</p></div>
          )}
          <div><span className="text-gray-500">Created</span><p>{new Date(order.createdAt).toLocaleString('en-IN')}</p></div>
          {order.paidAt && <div><span className="text-gray-500">Paid At</span><p>{new Date(order.paidAt).toLocaleString('en-IN')}</p></div>}
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-semibold mb-1.5">Update Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:border-[#063D20] outline-none"
            >
              {statuses.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5">Admin Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:border-[#063D20] outline-none resize-none"
              rows={2}
              placeholder="Optional internal notes..."
            />
          </div>
          <div className="flex gap-2">
            <button onClick={onClose} className="flex-1 py-3 border-2 border-gray-200 rounded-xl font-bold hover:bg-gray-50">Cancel</button>
            <button
              onClick={save}
              disabled={saving}
              className="flex-[2] py-3 bg-[#063D20] text-white rounded-xl font-bold hover:bg-[#0A512B] disabled:opacity-50"
            >
              {saving ? 'Saving...' : '✓ Update Order'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Product management
function ProductConfig({ onRefresh }: { onRefresh: () => void }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Record<string, { price: string; inStock: boolean }>>({});
  const [qrUrl, setQrUrl] = useState('');
  const [qrSaving, setQrSaving] = useState(false);

  useEffect(() => {
    api.adminProducts().then((prods) => {
      setProducts(prods);
      const init: Record<string, { price: string; inStock: boolean }> = {};
      prods.forEach((p) => { init[p.id] = { price: String(p.price), inStock: p.inStock }; });
      setEditing(init);
    }).catch(() => {}).finally(() => setLoading(false));
    api.getQrUrl().then((r) => setQrUrl(r.url)).catch(() => {});
  }, []);

  const saveProduct = async (id: string) => {
    const data = editing[id];
    try {
      await api.adminUpdateProduct(id, { price: Number(data.price), inStock: data.inStock });
      toast.success('Product updated!');
      onRefresh();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const saveQr = async () => {
    setQrSaving(true);
    try {
      await api.adminSetQrUrl(qrUrl);
      toast.success('QR URL updated!');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setQrSaving(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow p-6">
        <h3 className="font-black text-[#063D20] text-lg mb-4">Product Prices & Stock</h3>
        <div className="space-y-3">
          {products.map((p) => (
            <div key={p.id} className="flex flex-wrap items-center gap-3 p-3 border rounded-xl">
              <span className="font-bold w-16">{p.weight}</span>
              <div className="flex items-center gap-1">
                <span className="text-gray-500 text-sm">₹</span>
                <input
                  type="number"
                  value={editing[p.id]?.price || ''}
                  onChange={(e) => setEditing((prev) => ({ ...prev, [p.id]: { ...prev[p.id], price: e.target.value } }))}
                  className="w-20 px-2 py-1 border rounded-lg text-sm"
                />
              </div>
              <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={editing[p.id]?.inStock ?? true}
                  onChange={(e) => setEditing((prev) => ({ ...prev, [p.id]: { ...prev[p.id], inStock: e.target.checked } }))}
                  className="w-4 h-4"
                />
                In Stock
              </label>
              <button
                onClick={() => saveProduct(p.id)}
                className="px-3 py-1 bg-[#063D20] text-white rounded-lg text-xs font-bold hover:bg-[#0A512B]"
              >
                Save
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-6">
        <h3 className="font-black text-[#063D20] text-lg mb-4">GPay QR Image URL</h3>
        <div className="flex gap-2">
          <input
            type="url"
            value={qrUrl}
            onChange={(e) => setQrUrl(e.target.value)}
            placeholder="https://... (leave empty to use /gpayQR.png)"
            className="flex-1 px-3 py-2 border-2 rounded-xl focus:border-[#063D20] outline-none text-sm"
          />
          <button
            onClick={saveQr}
            disabled={qrSaving}
            className="px-4 py-2 bg-[#063D20] text-white rounded-xl font-bold text-sm disabled:opacity-50"
          >
            {qrSaving ? '...' : 'Save'}
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          If empty, frontend uses <code>/gpayQR.png</code> (replace that file before launch).
        </p>
      </div>
    </div>
  );
}

// Main admin dashboard
function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [tab, setTab] = useState<'orders' | 'products' | 'analytics'>('orders');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [sheetsUrl, setSheetsUrl] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = () => setRefreshKey((k) => k + 1);

  useEffect(() => {
    api.adminStats().then(setStats).catch(() => {});
    api.adminSheetsUrl().then((r) => setSheetsUrl(r.url)).catch(() => {});
  }, [refreshKey]);

  const handleLogout = async () => {
    await api.adminLogout().catch(() => {});
    onLogout();
  };

  const tabs = [
    { key: 'orders', label: '📦 Orders' },
    { key: 'products', label: '⚙️ Products' },
    { key: 'analytics', label: '📊 Analytics' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#063D20] text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🥚</span>
          <div>
            <div className="font-black text-sm">Mutta Mittai Admin</div>
            <div className="text-[#F5B51B] text-xs">Appambattu, Villupuram</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {sheetsUrl && (
            <a href={sheetsUrl} target="_blank" rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold">
              📊 Google Sheets
            </a>
          )}
          <button onClick={handleLogout} className="px-3 py-1.5 bg-[#E95012] hover:bg-[#c7400d] rounded-lg text-sm font-bold">
            Logout
          </button>
        </div>
      </div>

      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        {/* Stats */}
        {stats && <StatsGrid stats={stats} />}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b pb-0">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as typeof tab)}
              className={`px-4 py-2 font-bold text-sm rounded-t-xl -mb-px transition-all ${
                tab === t.key
                  ? 'bg-white text-[#063D20] border border-b-white border-gray-200'
                  : 'text-gray-500 hover:text-[#063D20]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'orders' && <OrdersTable key={refreshKey} onSelectOrder={setSelectedOrder} />}
        {tab === 'products' && <ProductConfig onRefresh={refresh} />}
        {tab === 'analytics' && <AnalyticsTab />}
      </div>

      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onRefresh={refresh}
        />
      )}
    </div>
  );
}

// Analytics
function AnalyticsTab() {
  const [chartData, setChartData] = useState<unknown[]>([]);

  useEffect(() => {
    api.adminCharts().then((raw) => {
      // Aggregate by date
      const map = new Map<string, { orders: number; revenue: number }>();
      (raw as Array<{ createdAt: string; totalAmount: number; status: string }>).forEach((o) => {
        const day = new Date(o.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
        const prev = map.get(day) || { orders: 0, revenue: 0 };
        map.set(day, {
          orders: prev.orders + 1,
          revenue: prev.revenue + (o.status === 'PAID' ? o.totalAmount : 0),
        });
      });
      setChartData(Array.from(map.entries()).map(([date, val]) => ({ date, ...val })));
    }).catch(() => {});
  }, []);

  const PIE_COLORS = ['#063D20', '#F5B51B', '#E95012', '#25D366', '#6366f1', '#ef4444'];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow p-6">
        <h3 className="font-black text-[#063D20] text-lg mb-4">Orders & Revenue (Last 7 Days)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData as any[]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: number, name: string) => [name === 'revenue' ? `₹${value}` : value, name === 'revenue' ? 'Revenue' : 'Orders']} />
              <Bar dataKey="orders" fill="#063D20" radius={[4, 4, 0, 0]} />
              <Bar dataKey="revenue" fill="#F5B51B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// Main page
export default function AdminPanel() {
  const [authState, setAuthState] = useState<'loading' | 'login' | 'dashboard'>('loading');
  const router = useRouter();

  useEffect(() => {
    api.adminMe()
      .then(() => setAuthState('dashboard'))
      .catch(() => setAuthState('login'));
  }, []);

  if (authState === 'loading') {
    return (
      <div className="min-h-screen bg-[#063D20] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#F5B51B] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (authState === 'login') {
    return <LoginScreen onLogin={() => setAuthState('dashboard')} />;
  }

  return <AdminDashboard onLogout={() => setAuthState('login')} />;
}
