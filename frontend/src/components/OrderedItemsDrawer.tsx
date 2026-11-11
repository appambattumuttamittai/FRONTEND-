'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getSavedOrders, SavedOrder } from '@/lib/ordersStorage';

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
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(3px)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.35s cubic-bezier(0.4,0,0.2,1)',
        }}
      />

      {/* ── Drawer Panel ── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Ordered Items"
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
          boxShadow: '-8px 0 40px rgba(88,42,0,0.2)',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 20px 16px',
            borderBottom: '1px solid rgba(196,47,44,0.12)',
            background: '#FAF7F2',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 24 }}>📦</span>
            <div>
              <div style={{ fontWeight: 900, fontSize: 18, color: '#582A00' }}>
                Ordered Items
              </div>
              <div style={{ fontSize: 11, color: 'rgba(88,42,0,0.6)', fontWeight: 600 }}>
                Saved locally on this device
              </div>
            </div>
            {orders.length > 0 && (
              <span
                style={{
                  background: '#C42F2C',
                  color: '#fff',
                  borderRadius: 999,
                  fontSize: 11,
                  fontWeight: 800,
                  padding: '1px 8px',
                  marginLeft: 4,
                }}
              >
                {orders.length}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close ordered items"
            style={{
              width: 36,
              height: 36,
              borderRadius: 999,
              border: 'none',
              background: 'rgba(88,42,0,0.06)',
              color: '#582A00',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
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
            gap: 14,
          }}
        >
          {orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#582A00' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🍬</div>
              <h3 style={{ fontWeight: 900, fontSize: 18, marginBottom: 6 }}>
                No ordered items yet
              </h3>
              <p style={{ fontSize: 13, color: 'rgba(88,42,0,0.65)', marginBottom: 20 }}>
                When you place orders for our authentic village-made Appampattu Mutta Mittai, your receipts and order details will appear here.
              </p>
              <Link
                href="/#products"
                onClick={onClose}
                style={{
                  display: 'inline-block',
                  background: '#C42F2C',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: 14,
                  padding: '10px 24px',
                  borderRadius: 999,
                  textDecoration: 'none',
                  boxShadow: '0 4px 12px rgba(196,47,44,0.3)',
                }}
              >
                Order Fresh Sweets →
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
                ord.streetAddress?.toLowerCase().includes('pick up') ||
                ord.streetAddress?.toLowerCase().includes('store');

              return (
                <div
                  key={ord.id}
                  style={{
                    background: '#FAF7F2',
                    border: '1px solid rgba(88,42,0,0.12)',
                    borderRadius: 16,
                    padding: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                  }}
                >
                  {/* Top Bar: Order ID + Status */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span
                        style={{
                          fontFamily: 'monospace',
                          fontWeight: 900,
                          fontSize: 13,
                          color: '#582A00',
                          background: '#fff',
                          border: '1px solid rgba(88,42,0,0.12)',
                          padding: '2px 8px',
                          borderRadius: 6,
                        }}
                      >
                        #{ord.id.slice(-8).toUpperCase()}
                      </span>
                      <span style={{ fontSize: 11, color: 'rgba(88,42,0,0.5)', marginLeft: 8 }}>
                        {dateStr}
                      </span>
                    </div>
                    <span
                      style={{
                        background: '#DCFCE7',
                        color: '#166534',
                        fontWeight: 800,
                        fontSize: 11,
                        padding: '2px 8px',
                        borderRadius: 999,
                        border: '1px solid #BBF7D0',
                      }}
                    >
                      PAID ✓
                    </span>
                  </div>

                  {/* Delivery Mode Badge */}
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#C42F2C' }}>
                    {isPickup
                      ? '🏬 Store Pickup: Villupuram Railway Station (1st Platform)'
                      : `🚚 Home Delivery: ${ord.city || 'Villupuram City'}`}
                  </div>

                  {/* Items list */}
                  <div
                    style={{
                      borderTop: '1px solid rgba(88,42,0,0.08)',
                      borderBottom: '1px solid rgba(88,42,0,0.08)',
                      padding: '8px 0',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 6,
                    }}
                  >
                    {ord.items && ord.items.length > 0 ? (
                      ord.items.map((it, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: 12,
                            color: '#582A00',
                          }}
                        >
                          <span>
                            🍬 <strong>{it.weight}</strong>{' '}
                            <span style={{ color: 'rgba(88,42,0,0.6)' }}>× {it.quantity}</span>
                          </span>
                          <span style={{ fontWeight: 700 }}>₹{it.price * it.quantity}</span>
                        </div>
                      ))
                    ) : (
                      <div style={{ fontSize: 12, color: '#582A00' }}>
                        🍬 Appampattu Mutta Mittai Pack
                      </div>
                    )}
                  </div>

                  {/* Total Amount */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(88,42,0,0.7)' }}>
                      Total Amount
                    </span>
                    <span style={{ fontSize: 16, fontWeight: 900, color: '#C42F2C' }}>
                      ₹{ord.totalAmount}
                    </span>
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                    <a
                      href={`${apiUrl}/api/orders/${ord.id}/invoice.pdf`}
                      download={`Invoice-${ord.id.slice(-8).toUpperCase()}.pdf`}
                      style={{
                        flex: 1,
                        background: '#C42F2C',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: 12,
                        padding: '8px 12px',
                        borderRadius: 10,
                        textDecoration: 'none',
                        textAlign: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 4,
                      }}
                    >
                      📄 Download Invoice
                    </a>
                    <a
                      href={`https://wa.me/917871949015?text=Hi%2C%20regarding%20my%20order%20%23${ord.id.slice(-8).toUpperCase()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        background: '#25D366',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: 12,
                        padding: '8px 12px',
                        borderRadius: 10,
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      title="Contact on WhatsApp"
                    >
                      💬
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
