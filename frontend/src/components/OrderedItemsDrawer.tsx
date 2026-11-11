'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getSavedOrders, SavedOrder, sanitizeItemWeight } from '@/lib/ordersStorage';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function OrderedItemsDrawer({ open, onClose }: Props) {
  const [orders, setOrders] = useState<SavedOrder[]>([]);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend-oi9e.onrender.com';

  const reloadOrders = () => {
    setOrders(getSavedOrders());
  };

  useEffect(() => {
    reloadOrders();
    const handler = () => reloadOrders();
    window.addEventListener('mm_orders_updated', handler);
    return () => window.removeEventListener('mm_orders_updated', handler);
  }, []);

  useEffect(() => {
    if (open) {
      reloadOrders();
    }
  }, [open]);

  return (
    <>
      {/* ── Backdrop ── */}
      <div
        aria-hidden="true"
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 8500,
          background: 'rgba(24, 15, 10, 0.45)',
          backdropFilter: 'blur(4px)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      />

      {/* ── Slide-over Drawer Panel ── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="My Orders"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          zIndex: 8501,
          width: '100%',
          maxWidth: 440,
          background: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-12px 0 48px rgba(0, 0, 0, 0.15)',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '18px 20px',
            borderBottom: '1px solid #ECE7E1',
            background: '#FAF7F2',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: '#F0EBE1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#582A00',
              }}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontWeight: 800, fontSize: 17, color: '#2B1704', letterSpacing: '-0.01em' }}>
                  My Orders
                </span>
                {orders.length > 0 && (
                  <span
                    style={{
                      background: '#C42F2C',
                      color: '#ffffff',
                      borderRadius: 999,
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '1px 8px',
                    }}
                  >
                    {orders.length}
                  </span>
                )}
              </div>
              <p style={{ margin: 0, fontSize: 12, color: '#7C6F62', fontWeight: 500 }}>
                Receipts and invoices for this device
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close orders"
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              border: 'none',
              background: 'rgba(88,42,0,0.06)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#582A00',
              transition: 'background 0.2s',
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content list */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            background: '#FDFCFB',
          }}
        >
          {orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '64px 20px', color: '#582A00' }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: '#F0EBE1',
                  margin: '0 auto 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#8A7B6D',
                }}
              >
                <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 style={{ fontWeight: 800, fontSize: 17, color: '#2B1704', marginBottom: 6 }}>
                No Orders Placed Yet
              </h3>
              <p style={{ fontSize: 13, color: '#7C6F62', lineHeight: 1.5, maxWidth: 300, margin: '0 auto 20px' }}>
                When you complete an order, your official tax invoice and order summary will appear here.
              </p>
              <Link
                href="/#products"
                onClick={onClose}
                style={{
                  display: 'inline-block',
                  background: '#C42F2C',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: 13,
                  padding: '11px 24px',
                  borderRadius: 10,
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(196,47,44,0.25)',
                }}
              >
                Browse Menu
              </Link>
            </div>
          ) : (
            orders.map((ord) => {
              const dateStr = ord.date
                ? new Date(ord.date).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'Recent Order';

              const isPickup =
                ord.deliveryMethod === 'pickup' ||
                Boolean(ord.streetAddress?.toLowerCase().includes('pick up')) ||
                Boolean(ord.streetAddress?.toLowerCase().includes('railway')) ||
                Boolean(ord.city?.toLowerCase().includes('pickup')) ||
                Boolean(ord.city?.toLowerCase().includes('store'));

              return (
                <div
                  key={ord.id}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #E8E2D9',
                    borderRadius: 16,
                    padding: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  }}
                >
                  {/* Top: Order ID + Status */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span
                        style={{
                          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                          fontWeight: 800,
                          fontSize: 13,
                          color: '#2B1704',
                          background: '#F5F1EA',
                          padding: '3px 8px',
                          borderRadius: 6,
                          letterSpacing: '0.02em',
                        }}
                      >
                        #{ord.id.slice(-8).toUpperCase()}
                      </span>
                      <div style={{ fontSize: 11, color: '#8A7B6D', marginTop: 4 }}>
                        {dateStr}
                      </div>
                    </div>

                    <span
                      style={{
                        background: '#ECFDF5',
                        color: '#065F46',
                        fontWeight: 700,
                        fontSize: 11,
                        padding: '3px 10px',
                        borderRadius: 999,
                        border: '1px solid #A7F3D0',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Paid
                    </span>
                  </div>

                  {/* Delivery Mode Badge */}
                  <div
                    style={{
                      background: isPickup ? '#FEF3C7' : '#EFF6FF',
                      border: `1px solid ${isPickup ? '#FDE68A' : '#BFDBFE'}`,
                      borderRadius: 10,
                      padding: '8px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      fontSize: 12,
                      fontWeight: 600,
                      color: isPickup ? '#92400E' : '#1E40AF',
                    }}
                  >
                    {isPickup ? (
                      <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    ) : (
                      <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                      </svg>
                    )}
                    <span>
                      {isPickup
                        ? 'Store Pickup · Villupuram Railway Station (1st Platform)'
                        : `Home Delivery · ${ord.city ? ord.city.replace(/\(Store Pickup\)/gi, '').trim() : 'Villupuram City'}`}
                    </span>
                  </div>

                  {/* Items list */}
                  <div
                    style={{
                      borderTop: '1px solid #F0ECE6',
                      borderBottom: '1px solid #F0ECE6',
                      padding: '10px 0',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                    }}
                  >
                    {ord.items && ord.items.length > 0 ? (
                      ord.items.map((it, idx) => {
                        const cleanLabel = sanitizeItemWeight(it.weight);
                        return (
                          <div
                            key={idx}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              fontSize: 13,
                              color: '#2B1704',
                            }}
                          >
                            <div>
                              <div style={{ fontWeight: 600 }}>
                                Appampattu Mutta Mittai
                              </div>
                              <div style={{ fontSize: 11, color: '#7C6F62', marginTop: 1 }}>
                                {cleanLabel} · Qty: {it.quantity || 1}
                              </div>
                            </div>
                            <span style={{ fontWeight: 700, color: '#2B1704' }}>
                              ₹{it.price * (it.quantity || 1)}
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <div style={{ fontSize: 13, color: '#2B1704', fontWeight: 600 }}>
                        Appampattu Mutta Mittai Pack
                      </div>
                    )}
                  </div>

                  {/* Total Amount */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#7C6F62' }}>
                      Total Paid
                    </span>
                    <span style={{ fontSize: 17, fontWeight: 900, color: '#C42F2C' }}>
                      ₹{ord.totalAmount}
                    </span>
                  </div>

                  {/* Action Button: Download Invoice Full Width */}
                  <div style={{ paddingTop: 4 }}>
                    <a
                      href={`${apiUrl}/api/orders/${ord.id}/invoice.pdf`}
                      download={`Invoice-${ord.id.slice(-8).toUpperCase()}.pdf`}
                      style={{
                        width: '100%',
                        background: '#C42F2C',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: 13,
                        padding: '10px 16px',
                        borderRadius: 10,
                        textDecoration: 'none',
                        textAlign: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        boxShadow: '0 2px 6px rgba(196,47,44,0.2)',
                      }}
                    >
                      <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download Invoice
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
