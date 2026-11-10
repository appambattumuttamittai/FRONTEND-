'use client';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: Props) {
  const { cart, cartCount, removeItem } = useApp();

  const grandTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      {/* ── Backdrop ── */}
      <div
        aria-hidden="true"
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 8000,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(2px)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.35s cubic-bezier(0.4,0,0.2,1)',
        }}
      />

      {/* ── Drawer panel ── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Cart (${cartCount} items)`}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          zIndex: 8001,
          width: '100%',
          maxWidth: 420,
          background: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-8px 0 40px rgba(88,42,0,0.18)',
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
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg
              style={{ width: 22, height: 22, color: '#582A00' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <span style={{ fontWeight: 900, fontSize: 18, color: '#582A00' }}>Your Cart</span>
            {cartCount > 0 && (
              <span
                style={{
                  background: '#C42F2C',
                  color: '#fff',
                  borderRadius: 999,
                  fontSize: 11,
                  fontWeight: 800,
                  padding: '1px 8px',
                }}
              >
                {cartCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close cart"
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

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {cart.length === 0 ? (
            /* ── Empty state ── */
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 16,
                padding: '60px 0',
              }}
            >
              <svg
                style={{ width: 64, height: 64, color: 'rgba(88,42,0,0.18)' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <p style={{ color: 'rgba(88,42,0,0.45)', fontWeight: 700, fontSize: 15 }}>
                Your cart is empty
              </p>
              <p style={{ color: 'rgba(88,42,0,0.3)', fontSize: 13, textAlign: 'center', maxWidth: 220 }}>
                Add some Mutta Mittai to get started
              </p>
            </div>
          ) : (
            /* ── Cart items ── */
            cart.map((item) => (
              <div
                key={item.id}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid rgba(196,47,44,0.12)',
                  borderRadius: 16,
                  padding: '12px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                {/* Top row: image + label + remove */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {/* Product thumbnail */}
                  <div
                    style={{
                      width: 70,
                      height: 70,
                      borderRadius: 12,
                      overflow: 'hidden',
                      flexShrink: 0,
                      border: '1.5px solid rgba(196,47,44,0.12)',
                      background: '#F5F5F5',
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/product-main.jpg"
                      alt={item.weightLabel}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </div>

                  {/* Name + brand */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 800, fontSize: 14, color: '#582A00', margin: 0, lineHeight: 1.3 }}>
                      {item.weightLabel}
                    </p>
                    <p style={{ fontSize: 11, color: 'rgba(88,42,0,0.45)', margin: 0, marginTop: 3 }}>
                      APPAMPATTU Mutta Mittai
                    </p>
                    {/* Unit price shown under name */}
                    <p style={{ fontSize: 12, color: '#C42F2C', margin: 0, marginTop: 4, fontWeight: 700 }}>
                      &#x20B9;{item.price} / piece
                    </p>
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    aria-label={`Remove ${item.weightLabel} from cart`}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: '50%',
                      border: 'none',
                      background: 'rgba(196,47,44,0.08)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#C42F2C',
                      flexShrink: 0,
                      alignSelf: 'flex-start',
                      transition: 'background 0.2s',
                    }}
                  >
                    <svg style={{ width: 14, height: 14 }} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Bottom row: qty badge + item total */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: 10,
                    borderTop: '1px solid rgba(196,47,44,0.07)',
                  }}
                >
                  <span
                    style={{
                      background: 'rgba(88,42,0,0.06)',
                      borderRadius: 8,
                      padding: '4px 12px',
                      fontSize: 13,
                      fontWeight: 700,
                      color: '#582A00',
                    }}
                  >
                    Qty: {item.quantity}
                  </span>
                  <span style={{ fontWeight: 900, fontSize: 17, color: '#C42F2C' }}>
                    &#x20B9;{item.price * item.quantity}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer — only visible when cart has items */}
        {cart.length > 0 && (
          <div
            style={{
              padding: '16px 20px 24px',
              borderTop: '1px solid rgba(196,47,44,0.12)',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            {/* Grand total */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: 'rgba(196,47,44,0.04)',
                borderRadius: 14,
                border: '1px solid rgba(196,47,44,0.1)',
              }}
            >
              <span style={{ fontWeight: 700, fontSize: 14, color: '#582A00' }}>Grand Total</span>
              <span style={{ fontWeight: 900, fontSize: 20, color: '#C42F2C' }}>
                &#x20B9;{grandTotal}
              </span>
            </div>

            {/* Delivery note */}
            <div
              style={{
                background: 'rgba(217,119,6,0.07)',
                border: '1px solid rgba(217,119,6,0.22)',
                borderRadius: 12,
                padding: '10px 14px',
                fontSize: 12,
                color: '#7a4800',
                lineHeight: 1.5,
              }}
            >
              <span style={{ fontWeight: 700 }}>Delivery info:</span> Home delivery is available only within Villupuram City limits. For other locations, please pick up from our store at Villupuram Railway Station, 1st Platform.
            </div>

            {/* Place Order */}
            <Link
              href="/order?from=cart"
              onClick={onClose}
              style={{
                display: 'block',
                width: '100%',
                padding: '14px 0',
                background: '#C42F2C',
                color: '#FFFFFF',
                borderRadius: 14,
                fontWeight: 900,
                fontSize: 15,
                textAlign: 'center',
                textDecoration: 'none',
                boxShadow: '0 6px 20px rgba(196,47,44,0.35)',
                transition: 'background 0.2s',
              }}
            >
              Place Order
            </Link>

            {/* Continue Shopping */}
            <button
              onClick={onClose}
              style={{
                width: '100%',
                padding: '12px 0',
                background: 'transparent',
                border: '1.5px solid rgba(88,42,0,0.18)',
                borderRadius: 14,
                color: '#582A00',
                fontWeight: 700,
                fontSize: 14,
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
