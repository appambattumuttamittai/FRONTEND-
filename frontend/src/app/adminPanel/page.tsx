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
          <div className="w-14 h-14 bg-emerald-50 text-[#063D20] border border-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </div>
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
    {
      label: 'Orders Today',
      value: stats.ordersToday,
      color: 'text-[#063D20]',
      icon: (
        <svg className="w-5 h-5 mx-auto text-[#063D20]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
    },
    {
      label: 'Revenue Today',
      value: `₹${stats.revenueToday}`,
      color: 'text-emerald-700',
      icon: (
        <svg className="w-5 h-5 mx-auto text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'Pending Review',
      value: stats.pendingReview,
      color: 'text-amber-700',
      icon: (
        <svg className="w-5 h-5 mx-auto text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'Paid Orders',
      value: stats.paidOrders,
      color: 'text-emerald-700',
      icon: (
        <svg className="w-5 h-5 mx-auto text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'Failed/Expired',
      value: stats.failedOrders,
      color: 'text-rose-700',
      icon: (
        <svg className="w-5 h-5 mx-auto text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'Total Orders',
      value: stats.totalOrders,
      color: 'text-[#063D20]',
      icon: (
        <svg className="w-5 h-5 mx-auto text-[#063D20]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      {cards.map((c, i) => (
        <motion.div
          key={i}
          className="bg-white rounded-2xl shadow p-4 text-center border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <div className="mb-2">{c.icon}</div>
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, [page, status]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
          className="px-3.5 py-2 bg-[#063D20] text-white rounded-lg text-xs font-bold hover:bg-[#0A512B] flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span>Export CSV</span>
        </a>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              {['Order ID', 'Customer', 'Phone', 'Items / Packs', 'Amount', 'Delivery', 'Status', 'Date', 'Action'].map((h) => (
                <th key={h} className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              Array(5).fill(0).map((_, i) => (
                <tr key={i}>
                  {Array(9).fill(0).map((_, j) => (
                    <td key={j} className="px-4 py-3"><div className="h-4 shimmer rounded w-20" /></td>
                  ))}
                </tr>
              ))
            ) : data?.orders.length === 0 ? (
              <tr><td colSpan={9} className="px-4 py-8 text-center text-gray-400">No orders found</td></tr>
            ) : (
              data?.orders.map((order) => {
                const isPickup =
                  order.streetAddress?.toLowerCase().includes('pick up') ||
                  order.streetAddress?.toLowerCase().includes('store') ||
                  order.adminNotes?.includes('[STORE PICKUP]');
                const itemsText = order.adminNotes?.split('|')[0]?.replace(/\[.*?\]/g, '').trim() || order.product.weight;

                return (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs font-bold text-[#C42F2C]">#{order.id.slice(-8).toUpperCase()}</td>
                    <td className="px-4 py-3 font-semibold whitespace-nowrap">{order.customerName}</td>
                    <td className="px-4 py-3 text-gray-600">{order.phone}</td>
                    <td className="px-4 py-3 font-medium text-[#582A00] whitespace-nowrap">{itemsText}</td>
                    <td className="px-4 py-3 font-bold text-[#C42F2C]">₹{order.totalAmount}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                        isPickup ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-blue-50 text-blue-800 border border-blue-200'
                      }`}>
                        {isPickup ? 'Store Pickup' : 'Home Delivery'}
                      </span>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-xs">
                      {new Date(order.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => onSelectOrder(order)}
                        className="px-3 py-1 bg-[#C42F2C] text-white rounded-lg text-xs font-bold hover:bg-[#a82421] transition-colors shadow-xs"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                );
              })
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

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend-oi9e.onrender.com';

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

  const isPickup =
    order.streetAddress?.toLowerCase().includes('pick up') ||
    order.streetAddress?.toLowerCase().includes('store') ||
    order.adminNotes?.includes('[STORE PICKUP]');

  const itemsText = order.adminNotes?.split('|')[0]?.replace(/\[.*?\]/g, '').trim() || order.product.weight;
  const txRef = order.adminNotes?.includes('Razorpay:') ? order.adminNotes.split('Razorpay:')[1]?.trim() : null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <motion.div
        className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
          <div>
            <span className="text-xs text-gray-400 font-mono">ID: {order.id}</span>
            <h2 className="text-xl font-black text-[#582A00]">Order #{order.id.slice(-8).toUpperCase()}</h2>
            <div className="mt-1"><StatusBadge status={order.status} /></div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">✕</button>
        </div>

        {/* Database Record Details */}
        <div className="space-y-3.5 text-sm mb-6 bg-gray-50 rounded-2xl p-4 border border-gray-100">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-gray-400 text-xs font-semibold uppercase">Customer</span>
              <p className="font-bold text-[#582A00]">{order.customerName}</p>
            </div>
            <div>
              <span className="text-gray-400 text-xs font-semibold uppercase">Phone</span>
              <div className="flex items-center gap-2">
                <p className="font-bold text-[#582A00]">{order.phone}</p>
                <a href={`https://wa.me/91${order.phone}`} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-600 font-bold hover:underline">
                  WhatsApp
                </a>
              </div>
            </div>
            <div>
              <span className="text-gray-400 text-xs font-semibold uppercase">Ordered Items / Weight</span>
              <p className="font-bold text-[#C42F2C]">{itemsText}</p>
            </div>
            <div>
              <span className="text-gray-400 text-xs font-semibold uppercase">Total Amount</span>
              <p className="font-black text-[#C42F2C] text-base">₹{order.totalAmount}</p>
            </div>
          </div>

          {/* Delivery Method */}
          <div className="pt-2 border-t border-gray-200">
            <span className="text-gray-400 text-xs font-semibold uppercase">Delivery Choice</span>
            <p className="font-bold text-[#582A00]">
              {isPickup ? 'Pick Up In-Store (Villupuram Railway Station, 1st Platform)' : 'Home Delivery (Within Villupuram City)'}
            </p>
          </div>

          {order.streetAddress && (
            <div>
              <span className="text-gray-400 text-xs font-semibold uppercase">Delivery / Store Address</span>
              <p className="font-medium text-gray-700">{order.streetAddress}</p>
            </div>
          )}

          <div>
            <span className="text-gray-400 text-xs font-semibold uppercase">City</span>
            <p className="font-medium text-gray-700">{order.city || 'Villupuram'}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200 text-xs">
            <div><span className="text-gray-400 uppercase">Created Time</span><p className="font-medium">{new Date(order.createdAt).toLocaleString('en-IN')}</p></div>
            <div><span className="text-gray-400 uppercase">Payment Time</span><p className="font-medium">{order.paidAt ? new Date(order.paidAt).toLocaleString('en-IN') : 'Pending'}</p></div>
          </div>

          {txRef && (
            <div className="text-xs">
              <span className="text-gray-400 uppercase">Razorpay Payment ID</span>
              <p className="font-mono font-bold text-gray-700">{txRef}</p>
            </div>
          )}

          {/* Direct Invoice PDF download link */}
          <a
            href={`${apiUrl}/api/orders/${order.id}/invoice.pdf`}
            download={`Invoice-${order.id.slice(-8).toUpperCase()}.pdf`}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-white border border-[#C42F2C] text-[#C42F2C] rounded-xl font-bold text-xs hover:bg-[#C42F2C] hover:text-white transition-all shadow-xs"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Download Official Tax Invoice (PDF)</span>
          </a>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-semibold mb-1.5 text-[#582A00]">Update Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:border-[#C42F2C] outline-none text-sm"
            >
              {statuses.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5 text-[#582A00]">Admin / Order Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:border-[#C42F2C] outline-none resize-none text-sm"
              rows={2}
              placeholder="Internal tracking notes..."
            />
          </div>
          <div className="flex gap-2">
            <button onClick={onClose} className="flex-1 py-3 border-2 border-gray-200 rounded-xl font-bold hover:bg-gray-50 text-sm">Cancel</button>
            <button
              onClick={save}
              disabled={saving}
              className="flex-[2] py-3 bg-[#C42F2C] text-white rounded-xl font-bold hover:bg-[#a82421] disabled:opacity-50 text-sm transition-colors shadow"
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
  const [tab, setTab] = useState<'orders' | 'products' | 'analytics' | 'feedback' | 'content'>('orders');
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
    { key: 'orders', label: 'Orders' },
    { key: 'products', label: 'Products' },
    { key: 'analytics', label: 'Analytics' },
    { key: 'feedback', label: 'Feedback' },
    { key: 'content', label: 'Site Content' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#063D20] text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#F5B51B] flex items-center justify-center font-black text-[#582A00] text-xs shadow-xs">
            AM
          </div>
          <div>
            <div className="font-black text-sm">Mutta Mittai Admin</div>
            <div className="text-[#F5B51B] text-xs">Appambattu, Villupuram</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {sheetsUrl && (
            <a href={sheetsUrl} target="_blank" rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-green-700 hover:bg-green-800 text-white rounded-lg text-xs font-bold transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Google Sheets</span>
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
        {tab === 'feedback' && <FeedbackTab />}
        {tab === 'content' && <SiteContentTab />}
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

// ── Feedback Management Tab ────────────────────────────────────
interface AdminFeedback {
  id: string; name: string; rating: number; message: string; isApproved: boolean; createdAt: string;
}

function FeedbackTab() {
  const [feedbacks, setFeedbacks] = useState<AdminFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending'>('all');

  const load = async () => {
    setLoading(true);
    try {
      const q = filter === 'all' ? '' : filter === 'approved' ? '?approved=true' : '?approved=false';
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://backend-oi9e.onrender.com'}/api/admin/feedback${q}`, { credentials: 'include' });
      const data = await res.json();
      setFeedbacks(Array.isArray(data) ? data : []);
    } catch { toast.error('Failed to load feedbacks'); }
    finally { setLoading(false); }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, [filter]);

  const toggle = async (id: string, current: boolean) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://backend-oi9e.onrender.com'}/api/admin/feedback/${id}`, {
        method: 'PATCH', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isApproved: !current }),
      });
      toast.success(current ? 'Feedback hidden' : 'Feedback approved & shown!');
      load();
    } catch { toast.error('Failed to update'); }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this feedback permanently?')) return;
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://backend-oi9e.onrender.com'}/api/admin/feedback/${id}`, { method: 'DELETE', credentials: 'include' });
      toast.success('Feedback deleted');
      load();
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div className="space-y-4">
      {/* Filter tabs */}
      <div className="bg-white rounded-2xl shadow p-4 flex gap-2 flex-wrap items-center justify-between">
        <h3 className="font-black text-[#582A00] text-lg">Customer Feedback</h3>
        <div className="flex gap-2">
          {(['all', 'approved', 'pending'] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${filter === f ? 'bg-[#C42F2C] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {f === 'all' ? 'All' : f === 'approved' ? 'Shown on Site' : 'Pending Approval'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading feedbacks...</div>
      ) : feedbacks.length === 0 ? (
        <div className="text-center py-12 text-gray-400">No feedbacks found.</div>
      ) : (
        <div className="grid gap-3">
          {feedbacks.map((fb) => (
            <div key={fb.id} className="bg-white rounded-xl shadow-sm p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              {/* Status dot */}
              <div className={`w-3 h-3 rounded-full shrink-0 mt-1 sm:mt-0 ${fb.isApproved ? 'bg-green-500' : 'bg-yellow-400'}`} title={fb.isApproved ? 'Shown on site' : 'Pending'} />

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-bold text-sm text-[#582A00]">{fb.name}</span>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map((i) => (
                      <svg key={i} className="w-3 h-3" viewBox="0 0 24 24" fill={i <= fb.rating ? '#FFAA2B' : '#E5E7EB'} aria-hidden="true">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs text-gray-400">{new Date(fb.createdAt).toLocaleDateString('en-IN')}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${fb.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {fb.isApproved ? 'Shown on site' : 'Pending'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{fb.message}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 shrink-0">
                <button onClick={() => toggle(fb.id, fb.isApproved)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${fb.isApproved ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
                  {fb.isApproved ? 'Hide' : 'Approve'}
                </button>
                <button onClick={() => remove(fb.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-100 text-red-600 hover:bg-red-200 transition-all">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Site Content Tab
function SiteContentTab() {
  const productSlots = [
    { label: '250 gm', file: 'product-p1.png' },
    { label: '500 gm', file: 'product-p2.png' },
    { label: '750 gm', file: 'product-p3.jpg' },
    { label: '1 kg', file: 'product-p4.jpg' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-black" style={{ color: '#582A00' }}>Site Content Management</h2>

      {/* Hero Video */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-100">
        <h3 className="font-bold text-lg mb-2" style={{ color: '#582A00' }}>Hero Background Video</h3>
        <p className="text-sm text-gray-500 mb-3">
          Current hero video: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">public/videos/hero-bg-main.mp4</code>.
          Replace this file on the server to change the homepage background video.
        </p>
        <div className="rounded-xl overflow-hidden bg-gray-900 relative" style={{ aspectRatio: '16/7', maxHeight: 240 }}>
          <video
            src="/videos/hero-bg-main.mp4"
            className="w-full h-full object-cover opacity-80"
            muted
            loop
            autoPlay
            playsInline
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-black/50 text-white text-xs font-bold px-3 py-1.5 rounded-full">Live Preview</span>
          </div>
        </div>
      </div>

      {/* Product Images */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-100">
        <h3 className="font-bold text-lg mb-2" style={{ color: '#582A00' }}>Product Card Images</h3>
        <p className="text-sm text-gray-500 mb-4">
          Each product card uses a dedicated image file in <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">public/images/</code>.
          Replace the file on the server to update the image for that pack size.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {productSlots.map((slot) => (
            <div key={slot.file} className="rounded-xl overflow-hidden border border-amber-100 bg-amber-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/images/${slot.file}`}
                alt={slot.label}
                className="w-full aspect-square object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <div className="p-2 text-center">
                <div className="font-black text-xs" style={{ color: '#582A00' }}>{slot.label}</div>
                <div className="text-[10px] text-gray-400 mt-0.5 break-all">{slot.file}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Store Info */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-100">
        <h3 className="font-bold text-lg mb-4" style={{ color: '#582A00' }}>Store Information</h3>
        <div className="space-y-3 text-sm">
          {[
            { label: 'Location', value: 'Villupuram Railway Station, 1st Platform, Villupuram, Tamil Nadu' },
            { label: 'WhatsApp', value: '+91 78719 49015' },
            { label: 'Delivery', value: 'Home delivery within Villupuram only. Pickup at Railway Station for all others.' },
          ].map((row) => (
            <div key={row.label} className="flex items-start gap-3">
              <span className="font-semibold w-28 shrink-0 text-gray-500">{row.label}:</span>
              <span className="text-gray-800">{row.value}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-amber-700 mt-4 bg-amber-50 rounded-xl p-3 border border-amber-100">
          To change store information, update Footer.tsx, PickupSection.tsx and Header.tsx in the frontend source code and redeploy.
        </p>
      </div>

      {/* Slider Images */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-100">
        <h3 className="font-bold text-lg mb-2" style={{ color: '#582A00' }}>Hero Slider Images (Fallback)</h3>
        <p className="text-sm text-gray-500 mb-4">
          These images are used as a poster/fallback when the video cannot play. Files: <code className="bg-gray-100 px-1 rounded text-xs">slider-1.png</code>, <code className="bg-gray-100 px-1 rounded text-xs">slider-2.png</code>, <code className="bg-gray-100 px-1 rounded text-xs">slider-3.png</code>
        </p>
        <div className="grid grid-cols-3 gap-3">
          {['slider-1.png', 'slider-2.png', 'slider-3.png'].map((f) => (
            <div key={f} className="rounded-xl overflow-hidden border border-amber-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/images/${f}`} alt={f} className="w-full aspect-video object-cover" />
              <div className="p-1.5 text-center text-[10px] text-gray-400">{f}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Analytics
function AnalyticsTab() {  const [chartData, setChartData] = useState<unknown[]>([]);

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
