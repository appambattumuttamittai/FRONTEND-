'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { api, DashboardStats, AdminOrder, Product, OrdersResponse, ArchiveRecord } from '@/lib/api';
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
        className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-md"
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
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm space-y-1">
              <p className="font-bold">Login failed</p>
              <p className="text-xs">{error}</p>
              <p className="text-xs text-red-600 mt-1">Make sure you are using the correct admin username and password.</p>
            </div>
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
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-4 mb-6 sm:mb-8">
      {cards.map((c, i) => (
        <motion.div
          key={i}
          className="bg-white rounded-2xl shadow-xs p-3 sm:p-4 text-center border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <div className="mb-1.5 sm:mb-2">{c.icon}</div>
          <div className={`text-xl sm:text-2xl font-black ${c.color}`}>{c.value}</div>
          <div className="text-[11px] sm:text-xs text-gray-500 font-medium mt-0.5 sm:mt-1 truncate">{c.label}</div>
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
      <div className="p-3 sm:p-4 border-b flex flex-col sm:flex-row gap-2.5 sm:gap-3 items-stretch sm:items-center justify-between">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, ID, phone, city..."
          className="flex-1 w-full px-3 py-2 border border-gray-200 rounded-xl text-xs sm:text-sm outline-none focus:border-[#063D20]"
        />
        <div className="flex items-center gap-2">
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="flex-1 sm:flex-initial px-3 py-2 border border-gray-200 rounded-xl text-xs sm:text-sm bg-white outline-none focus:border-[#063D20]"
          >
            {statuses.map((s) => <option key={s} value={s}>{s ? s.replace(/_/g, ' ') : 'All Statuses'}</option>)}
          </select>
          <a
            href={api.adminExportCsv(status ? { status } : {})}
            className="shrink-0 px-3.5 py-2 bg-[#063D20] text-white rounded-xl text-xs font-bold hover:bg-[#0A512B] flex items-center gap-1.5 shadow-xs"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Export CSV</span>
          </a>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="p-4 space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="space-y-1.5">
                <div className="h-4 bg-gray-200 rounded w-24" />
                <div className="h-3 bg-gray-200 rounded w-36" />
              </div>
              <div className="h-7 bg-gray-200 rounded-lg w-16" />
            </div>
          ))}
        </div>
      ) : !loading && data?.orders.length === 0 && (search || status) ? (
        <div className="text-center py-16 px-4">
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="font-black text-gray-500 text-sm">No orders match your search</p>
            <p className="text-xs text-gray-400 max-w-xs">Try searching by a different name, phone number, or order ID.</p>
            <button onClick={() => { setSearch(''); setStatus(''); }} className="mt-1 text-xs text-[#063D20] font-bold underline">
              Clear filters
            </button>
          </div>
        </div>
      ) : !loading && data?.orders.length === 0 ? (
        <div className="text-center py-16 px-4">
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="font-black text-gray-500 text-sm">No orders yet</p>
            <p className="text-xs text-gray-400">Orders will appear here once customers start placing them.</p>
          </div>
        </div>
      ) : (
        <>
          {/* Mobile Card View (md:hidden) */}
          <div className="md:hidden divide-y divide-gray-100">
            {data?.orders.map((order) => {
              const isPickup =
                order.streetAddress?.toLowerCase().includes('pick up') ||
                order.streetAddress?.toLowerCase().includes('store') ||
                order.adminNotes?.includes('[STORE PICKUP]');
              const itemsText = order.adminNotes?.split('|')[0]?.replace(/\[.*?\]/g, '').trim() || order.product.weight;

              return (
                <div key={order.id} className="p-3.5 bg-white hover:bg-gray-50/80 transition-colors space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-black text-[#C42F2C]">#{order.id.slice(-8).toUpperCase()}</span>
                      <StatusBadge status={order.status} />
                    </div>
                    <button
                      onClick={() => onSelectOrder(order)}
                      className="px-3 py-1 bg-[#C42F2C] text-white rounded-lg text-xs font-bold hover:bg-[#a82421] transition-colors shadow-xs"
                    >
                      Manage
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-gray-900 text-sm block">{order.customerName}</span>
                      <span className="text-gray-500 font-medium">{order.phone}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-[#C42F2C] text-sm block">₹{order.totalAmount}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                        isPickup ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-blue-50 text-blue-800 border border-blue-200'
                      }`}>
                        {isPickup ? 'Store Pickup' : 'Home Delivery'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                    <span className="font-semibold text-[#582A00] truncate max-w-[190px]">{itemsText}</span>
                    <span className="shrink-0">{new Date(order.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Table View (hidden md:block) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {['Order ID', 'Customer', 'Phone', 'Items / Packs', 'Amount', 'Delivery', 'Status', 'Date', 'Action'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {data?.orders.map((order) => {
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
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Pagination */}
      {data && data.pages > 1 && (
        <div className="p-3 sm:p-4 border-t flex flex-col sm:flex-row gap-3 items-center justify-between text-xs sm:text-sm">
          <span className="text-gray-500 font-medium">{data.total} orders total</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 border rounded-lg disabled:opacity-40 font-bold hover:bg-gray-50"
            >
              ← Prev
            </button>
            <span className="px-3 py-1.5 bg-[#063D20] text-white rounded-lg font-bold">{page} / {data.pages}</span>
            <button
              onClick={() => setPage((p) => Math.min(data.pages, p + 1))}
              disabled={page === data.pages}
              className="px-3 py-1.5 border rounded-lg disabled:opacity-40 font-bold hover:bg-gray-50"
            >
              Next →
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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-3 sm:p-4" onClick={onClose}>
      <motion.div
        className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 w-full max-w-lg max-h-[92vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
          <div>
            <span className="text-[11px] text-gray-400 font-mono">ID: {order.id}</span>
            <h2 className="text-lg sm:text-xl font-black text-[#582A00]">Order #{order.id.slice(-8).toUpperCase()}</h2>
            <div className="mt-1"><StatusBadge status={order.status} /></div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-700 text-lg font-bold">✕</button>
        </div>

        {/* Database Record Details */}
        <div className="space-y-3 text-xs sm:text-sm mb-5 bg-gray-50 rounded-2xl p-3.5 sm:p-4 border border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            <div>
              <span className="text-gray-400 text-[10px] sm:text-xs font-semibold uppercase">Customer</span>
              <p className="font-bold text-[#582A00]">{order.customerName}</p>
            </div>
            <div>
              <span className="text-gray-400 text-[10px] sm:text-xs font-semibold uppercase">Phone</span>
              <div className="flex items-center gap-2">
                <p className="font-bold text-[#582A00]">{order.phone}</p>
                <a href={`https://wa.me/91${order.phone}`} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-600 font-bold hover:underline">
                  WhatsApp
                </a>
              </div>
            </div>
            <div>
              <span className="text-gray-400 text-[10px] sm:text-xs font-semibold uppercase">Ordered Items / Weight</span>
              <p className="font-bold text-[#C42F2C]">{itemsText}</p>
            </div>
            <div>
              <span className="text-gray-400 text-[10px] sm:text-xs font-semibold uppercase">Total Amount</span>
              <p className="font-black text-[#C42F2C] text-base">₹{order.totalAmount}</p>
            </div>
          </div>

          {/* Delivery Method */}
          <div className="pt-2 border-t border-gray-200">
            <span className="text-gray-400 text-[10px] sm:text-xs font-semibold uppercase">Delivery Choice</span>
            <p className="font-bold text-[#582A00]">
              {isPickup ? 'Pick Up In-Store (Villupuram Railway Station, 1st Platform)' : 'Home Delivery (Within Villupuram City)'}
            </p>
          </div>

          {order.streetAddress && (
            <div>
              <span className="text-gray-400 text-[10px] sm:text-xs font-semibold uppercase">Delivery / Store Address</span>
              <p className="font-medium text-gray-700">{order.streetAddress}</p>
            </div>
          )}

          <div>
            <span className="text-gray-400 text-[10px] sm:text-xs font-semibold uppercase">City</span>
            <p className="font-medium text-gray-700">{order.city || 'Villupuram'}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 pt-2 border-t border-gray-200 text-xs">
            <div><span className="text-gray-400 uppercase text-[10px]">Created Time</span><p className="font-medium">{new Date(order.createdAt).toLocaleString('en-IN')}</p></div>
            <div><span className="text-gray-400 uppercase text-[10px]">Payment Time</span><p className="font-medium">{order.paidAt ? new Date(order.paidAt).toLocaleString('en-IN') : 'Pending'}</p></div>
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

  useEffect(() => {
    api.adminProducts().then((prods) => {
      setProducts(prods);
      const init: Record<string, { price: string; inStock: boolean }> = {};
      prods.forEach((p) => { init[p.id] = { price: String(p.price), inStock: p.inStock }; });
      setEditing(init);
    }).catch(() => {}).finally(() => setLoading(false));
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

  if (loading) return (
    <div className="bg-white rounded-2xl shadow p-6 space-y-3 animate-pulse">
      <div className="h-5 bg-gray-200 rounded w-40 mb-4" />
      {[1,2,3,4].map((i) => (
        <div key={i} className="flex items-center gap-3 p-3 border rounded-xl">
          <div className="h-4 bg-gray-200 rounded w-14" />
          <div className="h-8 bg-gray-200 rounded w-24" />
          <div className="h-4 bg-gray-200 rounded w-20" />
          <div className="h-7 bg-gray-200 rounded w-14 ml-auto" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow p-4 sm:p-6">
        <h3 className="font-black text-[#063D20] text-base sm:text-lg mb-4">Product Prices & Stock</h3>
        <div className="space-y-3">
          {products.map((p) => (
            <div key={p.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 border border-gray-200 rounded-xl bg-white shadow-2xs">
              <div className="flex items-center justify-between sm:justify-start gap-4">
                <span className="font-bold text-sm text-[#063D20] w-20">{p.weight}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-500 text-sm font-semibold">₹</span>
                  <input
                    type="number"
                    value={editing[p.id]?.price || ''}
                    onChange={(e) => setEditing((prev) => ({ ...prev, [p.id]: { ...prev[p.id], price: e.target.value } }))}
                    className="w-24 px-2.5 py-1.5 border border-gray-300 rounded-lg text-sm font-semibold outline-none focus:border-[#063D20]"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editing[p.id]?.inStock ?? true}
                    onChange={(e) => setEditing((prev) => ({ ...prev, [p.id]: { ...prev[p.id], inStock: e.target.checked } }))}
                    className="w-4 h-4 accent-[#063D20] rounded"
                  />
                  In Stock
                </label>
                <button
                  onClick={() => saveProduct(p.id)}
                  className="px-4 py-1.5 bg-[#063D20] text-white rounded-lg text-xs font-bold hover:bg-[#0A512B] transition-colors shadow-xs"
                >
                  Save
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────
const tabs = [
  { key: 'orders', label: 'Orders' },
  { key: 'products', label: 'Products' },
  { key: 'analytics', label: 'Analytics' },
  { key: 'feedback', label: 'Feedback' },
  { key: 'archives', label: '🗂 Archives' },
] as const;

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<'orders' | 'products' | 'analytics' | 'feedback' | 'archives'>('orders');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [sheetsUrl, setSheetsUrl] = useState<string | null>(null);

  const refresh = () => setRefreshKey((k) => k + 1);

  useEffect(() => {
    const load = () => {
      api.adminStats().then(setStats).catch((err: any) => {
        if (err.message?.includes('401') || err.message?.toLowerCase().includes('unauthorized')) {
          toast.error('Session expired — please log in again', { duration: 4000 });
          setTimeout(() => onLogout(), 2000);
        }
      });
      api.adminSheetsUrl().then((r) => setSheetsUrl(r.url)).catch(() => {});
    };
    load();
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, [refreshKey]);

  const handleLogout = async () => {
    await api.adminLogout().catch(() => {});
    onLogout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#063D20] text-white px-4 md:px-6 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#F5B51B] rounded-xl flex items-center justify-center font-black text-[#063D20] text-sm">AM</div>
          <div>
            <div className="font-black text-sm leading-tight">Mutta Mittai Admin</div>
            <div className="text-xs text-emerald-300 leading-tight">Appambattu, Villupuram</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {sheetsUrl && (
            <a
              href={sheetsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 rounded-lg text-xs font-bold transition-colors"
            >
              Google Sheets
            </a>
          )}
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-lg text-xs font-bold transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="p-3 sm:p-4 md:p-6 max-w-7xl mx-auto">
        {/* Stats */}
        {stats && <StatsGrid stats={stats} />}

        {/* Tabs */}
        <div className="flex gap-1.5 sm:gap-2 mb-4 sm:mb-6 border-b border-gray-200 overflow-x-auto pb-0 scrollbar-none">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as typeof tab)}
              className={`px-3 sm:px-4 py-2 font-bold text-xs sm:text-sm rounded-t-xl -mb-px shrink-0 transition-all ${
                tab === t.key
                  ? 'bg-white text-[#063D20] border-t border-l border-r border-b-2 border-b-white border-gray-200 shadow-xs'
                  : 'text-gray-500 hover:text-[#063D20] hover:bg-gray-100/60'
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
        {tab === 'archives' && <ArchivesTab />}
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
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newMessage, setNewMessage] = useState('');
  const [newApproved, setNewApproved] = useState(true);
  const [adding, setAdding] = useState(false);

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

  const addReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newMessage.trim()) return;
    setAdding(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://backend-oi9e.onrender.com'}/api/admin/feedback`, {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim(), rating: newRating, message: newMessage.trim(), isApproved: newApproved }),
      });
      if (!res.ok) throw new Error('Failed');
      toast.success('Review added' + (newApproved ? ' & shown on site!' : ' (pending)'));
      setNewName(''); setNewRating(5); setNewMessage(''); setNewApproved(true);
      setShowAddForm(false);
      load();
    } catch { toast.error('Failed to add review'); }
    finally { setAdding(false); }
  };

  return (
    <div className="space-y-4">
      {/* Filter tabs + Add button */}
      <div className="bg-white rounded-2xl shadow p-4 flex flex-col sm:flex-row gap-3 sm:gap-2 items-start sm:items-center justify-between">
        <h3 className="font-black text-[#582A00] text-base sm:text-lg">Customer Feedback</h3>
        <div className="flex gap-1.5 sm:gap-2 flex-wrap w-full sm:w-auto">
          {(['all', 'approved', 'pending'] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${filter === f ? 'bg-[#C42F2C] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {f === 'all' ? 'All' : f === 'approved' ? 'Shown on Site' : 'Pending Approval'}
            </button>
          ))}
          <button onClick={() => setShowAddForm((v) => !v)}
            className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#063D20] text-white hover:bg-[#0a5929] transition-all ml-auto sm:ml-0">
            {showAddForm ? '✕ Cancel' : '+ Add Review'}
          </button>
        </div>
      </div>

      {/* Add Review Form */}
      {showAddForm && (
        <div className="bg-white rounded-2xl shadow p-5">
          <h4 className="font-black text-[#582A00] mb-4">Add New Review</h4>
          <form onSubmit={addReview} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Customer Name *</label>
                <input
                  type="text" required value={newName} onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-3 py-2 rounded-xl border-2 border-gray-200 focus:border-[#063D20] outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Rating *</label>
                <div className="flex gap-2 items-center mt-1">
                  {[1,2,3,4,5].map((s) => (
                    <button key={s} type="button" onClick={() => setNewRating(s)}>
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill={s <= newRating ? '#FFAA2B' : '#E5E7EB'}>
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </button>
                  ))}
                  <span className="text-sm font-bold text-gray-500 ml-1">{newRating}/5</span>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Review Text *</label>
              <textarea
                required value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Write the customer review here..."
                rows={3}
                className="w-full px-3 py-2 rounded-xl border-2 border-gray-200 focus:border-[#063D20] outline-none text-sm resize-none"
              />
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={newApproved} onChange={(e) => setNewApproved(e.target.checked)}
                  className="w-4 h-4 accent-[#063D20]" />
                <span className="text-sm font-semibold text-gray-700">Show on site immediately</span>
              </label>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={adding}
                className="px-5 py-2 bg-[#063D20] text-white rounded-xl font-bold text-sm disabled:opacity-50 hover:bg-[#0a5929] transition-all">
                {adding ? 'Adding...' : 'Add Review'}
              </button>
              <button type="button" onClick={() => setShowAddForm(false)}
                className="px-5 py-2 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-4 animate-pulse flex gap-4 items-center">
              <div className="w-3 h-3 rounded-full bg-gray-200 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-28" />
                <div className="h-3 bg-gray-100 rounded w-56" />
              </div>
              <div className="flex gap-2">
                <div className="h-7 bg-gray-200 rounded-lg w-16" />
                <div className="h-7 bg-gray-200 rounded-lg w-16" />
              </div>
            </div>
          ))}
        </div>
      ) : feedbacks.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-10 text-center space-y-3">
          <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p className="font-black text-gray-500">No reviews yet</p>
          <p className="text-xs text-gray-400">Customer reviews will appear here. You can also add one manually using the button above.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {feedbacks.map((fb) => (
            <div key={fb.id} className="bg-white rounded-xl shadow-xs p-3.5 sm:p-4 flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center">
              {/* Status dot */}
              <div className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1 sm:mt-0 ${fb.isApproved ? 'bg-green-500' : 'bg-yellow-400'}`} title={fb.isApproved ? 'Shown on site' : 'Pending'} />

              {/* Content */}
              <div className="flex-1 min-w-0 w-full">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-bold text-sm text-[#582A00]">{fb.name}</span>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map((i) => (
                      <svg key={i} className="w-3 h-3" viewBox="0 0 24 24" fill={i <= fb.rating ? '#FFAA2B' : '#E5E7EB'} aria-hidden="true">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                  </div>
                  <span className="text-[11px] text-gray-400">{new Date(fb.createdAt).toLocaleDateString('en-IN')}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${fb.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {fb.isApproved ? 'Shown on site' : 'Pending'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{fb.message}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100 shrink-0">
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

// ── Archives Tab ───────────────────────────────────────────────
function ArchivesTab() {
  const [archives, setArchives] = useState<ArchiveRecord[]>([]);
  const [status, setStatus] = useState<{ lastArchiveDate: string | null; daysSince: number | null; isDue: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [loadError, setLoadError] = useState('');

  const load = async () => {
    setLoading(true);
    setLoadError('');
    try {
      const [a, s] = await Promise.all([api.adminArchives(), api.adminArchiveStatus()]);
      setArchives(a);
      setStatus(s);
    } catch (err: any) {
      setLoadError(err.message || 'Failed to load archives');
      toast.error('Failed to load archives');
    }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const runNow = async () => {
    if (!confirm('This will export ALL orders to CSV, send to Telegram, and DELETE all orders from the database. Continue?')) return;
    setRunning(true);
    try {
      const res = await api.adminRunArchive();
      toast.success(res.message);
      load();
    } catch { toast.error('Archive failed. Check Telegram credentials.'); }
    finally { setRunning(false); }
  };

  const daysUntilNext = status?.daysSince !== null && status?.daysSince !== undefined
    ? Math.max(0, 30 - status.daysSince)
    : null;

  return (
    <div className="space-y-4">
      {/* Status card */}
      <div className="bg-white rounded-2xl shadow p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <h3 className="font-black text-[#582A00] text-base sm:text-lg mb-1">🗂 Auto-Archive (Every 30 Days)</h3>
            <p className="text-xs sm:text-sm text-gray-500">
              Every 30 days at midnight IST — exports all orders to CSV, sends to Telegram, clears the database automatically.
            </p>
            {status && (
              <div className="mt-3 flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm">
                <span className="text-gray-600">
                  Last archive:{' '}
                  <strong className="text-[#582A00]">
                    {status.lastArchiveDate
                      ? new Date(status.lastArchiveDate).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric' })
                      : 'Never'}
                  </strong>
                </span>
                {daysUntilNext !== null && (
                  <span className={`font-bold ${daysUntilNext <= 3 ? 'text-red-500' : 'text-green-700'}`}>
                    Next in: {daysUntilNext} days
                  </span>
                )}
                {status.isDue && (
                  <span className="bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full text-xs">⚠ Archive Overdue!</span>
                )}
              </div>
            )}
          </div>
          <button
            onClick={runNow}
            disabled={running}
            className="w-full sm:w-auto shrink-0 px-4 py-2.5 bg-[#C42F2C] hover:bg-[#a02623] text-white rounded-xl font-bold text-xs sm:text-sm disabled:opacity-50 transition-all text-center"
          >
            {running ? 'Running…' : '▶ Run Archive Now'}
          </button>
        </div>
      </div>

      {/* Archives list */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-4 animate-pulse flex gap-4 items-center">
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32" />
                <div className="h-3 bg-gray-100 rounded w-48" />
              </div>
              <div className="h-8 bg-gray-200 rounded-xl w-28 shrink-0" />
            </div>
          ))}
        </div>
      ) : loadError ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center space-y-3">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="font-bold text-red-800">Failed to load archives</p>
          <p className="text-sm text-red-600">{loadError}</p>
          <p className="text-xs text-red-500">Check your internet connection or server status.</p>
          <button onClick={load} className="px-4 py-2 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-colors">
            Retry
          </button>
        </div>
      ) : archives.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-10 text-center space-y-3">
          <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <p className="font-black text-gray-500">No archives yet</p>
          <p className="text-xs text-gray-400 max-w-xs mx-auto">The first archive will run automatically after 30 days, or you can trigger it manually above.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {archives.map((arc) => (
            <div key={arc.id} className="bg-white rounded-xl shadow-xs p-3.5 sm:p-4 flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center">
              <div className="flex-1 w-full">
                <div className="flex flex-wrap gap-2 sm:gap-3 items-center mb-1">
                  <span className="font-black text-[#582A00] text-sm">
                    {new Date(arc.createdAt).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                  <span className="bg-blue-100 text-blue-700 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full">
                    {arc.orderCount} orders
                  </span>
                  <span className="bg-green-100 text-green-700 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full">
                    {arc.paidCount} paid
                  </span>
                  {arc.telegramMsgId && (
                    <span className="bg-purple-100 text-purple-700 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full">
                      📱 Sent to Telegram
                    </span>
                  )}
                </div>
                <p className="text-[11px] sm:text-xs text-gray-400">
                  Period: {new Date(arc.fromDate).toLocaleDateString('en-IN')} → {new Date(arc.toDate).toLocaleDateString('en-IN')}
                </p>
              </div>
              <a
                href={api.adminArchiveCsvUrl(arc.id)}
                download
                className="w-full sm:w-auto text-center shrink-0 px-4 py-2 bg-[#063D20] text-white rounded-xl font-bold text-xs hover:bg-[#0a5929] transition-all shadow-xs"
              >
                ⬇ Download CSV
              </a>
            </div>
          ))}
        </div>
      )}
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
      <div className="bg-white rounded-2xl shadow p-4 sm:p-6">
        <h3 className="font-black text-[#063D20] text-base sm:text-lg mb-4">Orders & Revenue (Last 7 Days)</h3>
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
