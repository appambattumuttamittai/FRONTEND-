'use client';
import { useState, useEffect, useRef, Suspense, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { useApp } from '@/context/AppContext';
import { api, Product } from '@/lib/api';

// Steps (4 steps: Name -> Phone -> Pickup -> Payment)
type Step = 'name' | 'phone' | 'pickup' | 'payment';
const STEPS: Step[] = ['name', 'phone', 'pickup', 'payment'];

export interface OrderItem {
  id: string;
  weight: string;
  price: number;
  quantity: number;
}

interface OrderState {
  name: string;
  phone: string;
  otpSessionId: string;
  phoneVerified: boolean;
  items: OrderItem[];
  orderSource: 'cart' | 'direct';
  selectedProduct: Product | null;
  street: string;
  city: string;
  pincode: string;
  orderId: string;
  totalAmount: number;
  paymentExpiry: string;
}

// Step indicator
function StepIndicator({ current, steps }: { current: number; steps: string[] }) {
  const { t } = useLanguage();
  const labels = ['order.step.name', 'order.step.phone', 'order.step.pickup', 'order.step.payment'];
  return (
    <div className="w-full max-w-md mx-auto mb-6 px-1 sm:px-2">
      {/* Stepper row: all 5 steps distributed across full width without overflow */}
      <div className="flex items-start justify-between w-full">
        {steps.map((_, i) => (
          <Fragment key={i}>
            {/* Step node */}
            <div className="flex flex-col items-center shrink-0">
              <motion.div
                initial={false}
                animate={{
                  scale: i === current ? [1, 1.15, 1.08] : 1,
                }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-black text-xs sm:text-sm select-none transition-all duration-300 ${
                  i < current
                    ? 'bg-[#D97706] text-white shadow-sm'
                    : i === current
                    ? 'bg-[#C42F2C] text-white ring-4 ring-[#C42F2C]/25 shadow-lg'
                    : 'bg-[#EAE0D2] text-[#582A00]/40 border border-[#582A00]/10'
                }`}
              >
                {i < current ? '✓' : i + 1}
              </motion.div>
              <span
                className={`text-[11px] sm:text-xs mt-1.5 text-center leading-tight transition-colors duration-300 hidden sm:block max-w-[70px] ${
                  i === current
                    ? 'text-[#582A00] font-black'
                    : i < current
                    ? 'text-[#D97706] font-semibold'
                    : 'text-[#582A00]/40 font-medium'
                }`}
              >
                {t(labels[i])}
              </span>
            </div>

            {/* Connecting progress line */}
            {i < steps.length - 1 && (
              <div className="flex-1 h-1 mx-1 sm:mx-2.5 bg-[#E5D7C3] rounded-full relative overflow-hidden mt-3.5 sm:mt-4.5">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#D97706] to-[#C42F2C] rounded-full"
                  initial={false}
                  animate={{ width: i < current ? '100%' : '0%' }}
                  transition={{ duration: 0.45, ease: 'easeInOut' }}
                />
              </div>
            )}
          </Fragment>
        ))}
      </div>

      {/* Mobile-only current step label badge */}
      <div className="sm:hidden text-center mt-3">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#582A00] bg-white/80 px-3.5 py-1 rounded-full border border-[#582A00]/10 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#C42F2C] animate-pulse" />
          Step {current + 1} of {steps.length}: <span className="text-[#C42F2C]">{t(labels[current])}</span>
        </span>
      </div>
    </div>
  );
}

// Step 1: Name
function NameStep({ value, onChange, onNext }: { value: string; onChange: (v: string) => void; onNext: () => void }) {
  const { t } = useLanguage();
  const [err, setErr] = useState('');

  const submit = () => {
    if (!value.trim()) { setErr(t('common.required')); return; }
    if (value.trim().length < 2) { setErr('Name must be at least 2 characters'); return; }
    setErr('');
    onNext();
  };

  return (
    <div className="space-y-3.5">
      <h2 className="text-xl sm:text-2xl font-black text-[#063D20]">{t('order.step.name')}</h2>
      <div>
        <label htmlFor="name" className="block text-xs sm:text-sm font-semibold text-[#3A1C10] mb-1">
          {t('order.name.label')} *
        </label>
        <input
          id="name"
          type="text"
          value={value}
          onChange={(e) => { onChange(e.target.value); setErr(''); }}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder={t('order.name.placeholder')}
          autoFocus
          className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#063D20]/20 focus:border-[#063D20] outline-none text-sm sm:text-base transition-colors"
        />
        {err && <p className="text-[#E95012] text-xs sm:text-sm mt-1">{err}</p>}
      </div>
      <button
        onClick={submit}
        className="w-full py-2.5 sm:py-3 bg-[#063D20] text-[#FFF4DD] rounded-xl font-bold text-sm sm:text-base hover:bg-[#0A512B] transition-colors"
      >
        {t('order.next')} →
      </button>
    </div>
  );
}

// Step 2: Phone OTP
function PhoneStep({
  phone, onPhoneChange, sessionId, onSessionChange, verified, onVerified, onNext
}: {
  phone: string; onPhoneChange: (v: string) => void;
  sessionId: string; onSessionChange: (v: string) => void;
  verified: boolean; onVerified: () => void; onNext: () => void;
}) {
  const { t } = useLanguage();
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [phoneErr, setPhoneErr] = useState('');
  const [otpErr, setOtpErr] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const otpRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer((r) => r - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  // WebOTP API
  useEffect(() => {
    if (!otpSent) return;
    if (!('OTPCredential' in window)) return;
    const controller = new AbortController();
    (navigator as any).credentials
      .get({ otp: { transport: ['sms'] }, signal: controller.signal })
      .then((cred: any) => { if (cred?.code) setOtp(cred.code); })
      .catch(() => {});
    return () => controller.abort();
  }, [otpSent]);

  const sendOtp = async () => {
    const clean = phone.replace(/\D/g, '');
    if (!/^[6-9]\d{9}$/.test(clean)) {
      setPhoneErr('Please enter a valid 10-digit Indian mobile number');
      return;
    }
    setPhoneErr('');
    setLoading(true);
    try {
      const res = await api.sendOtp(clean);
      onSessionChange(res.sessionId);
      setOtpSent(true);
      setResendTimer(60);
      toast.success(t('order.phone.otp_sent'));
      setTimeout(() => otpRef.current?.focus(), 300);
    } catch (err: any) {
      toast.error(err.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (codeToVerify?: string) => {
    const code = codeToVerify || otp;
    if (code.length !== 6) { setOtpErr('Enter the 6-digit OTP'); return; }
    setLoading(true);
    try {
      await api.verifyOtp(phone.replace(/\D/g, ''), code, sessionId);
      onVerified();
      toast.success(t('order.phone.verified'));
      onNext();
    } catch (err: any) {
      setOtpErr(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3.5">
      <h2 className="text-xl sm:text-2xl font-black text-[#063D20]">{t('order.step.phone')}</h2>
      <div>
        <label htmlFor="phone" className="block text-xs sm:text-sm font-semibold text-[#3A1C10] mb-1">
          {t('order.phone.label')} *
        </label>
        <div className="flex gap-2">
          <div className="flex items-center px-3 py-2.5 bg-gray-100 border-2 border-gray-200 rounded-xl text-xs sm:text-sm font-bold text-gray-600">
            🇮🇳 +91
          </div>
          <input
            id="phone"
            type="tel"
            inputMode="numeric"
            value={phone}
            onChange={(e) => { onPhoneChange(e.target.value.replace(/\D/g, '').slice(0, 10)); setPhoneErr(''); }}
            placeholder={t('order.phone.placeholder')}
            disabled={otpSent}
            className="flex-1 px-3.5 py-2.5 rounded-xl border-2 border-[#063D20]/20 focus:border-[#063D20] outline-none text-sm sm:text-base transition-colors disabled:bg-gray-50"
            autoComplete="tel"
          />
        </div>
        {phoneErr && <p className="text-[#E95012] text-xs sm:text-sm mt-1">{phoneErr}</p>}
      </div>

      {!otpSent ? (
        <button
          onClick={sendOtp}
          disabled={loading}
          className="w-full py-2.5 sm:py-3 bg-[#063D20] text-[#FFF4DD] rounded-xl font-bold text-sm sm:text-base hover:bg-[#0A512B] transition-colors disabled:opacity-50"
        >
          {loading ? t('common.loading') : t('order.phone.send_otp')}
        </button>
      ) : (
        <div className="space-y-3">
          <div className="py-2 px-3 bg-[#F5B51B]/10 border border-[#F5B51B] rounded-xl text-xs sm:text-sm text-center text-[#3A1C10]">
            📱 {t('order.phone.otp_sent')} +91 {phone}
          </div>
          <div>
            <label htmlFor="otp" className="block text-xs sm:text-sm font-semibold text-[#3A1C10] mb-1">
              {t('order.phone.enter_otp')} *
            </label>
            <input
              id="otp"
              ref={otpRef}
              type="text"
              inputMode="numeric"
              value={otp}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, '').slice(0, 6);
                setOtp(v);
                setOtpErr('');
                if (v.length === 6) {
                  verifyOtp(v);
                }
              }}
              onKeyDown={(e) => e.key === 'Enter' && verifyOtp()}
              placeholder="_ _ _ _ _ _"
              maxLength={6}
              autoComplete="one-time-code"
              className="w-full px-3 py-2.5 rounded-xl border-2 border-[#063D20]/20 focus:border-[#063D20] outline-none text-center text-lg sm:text-xl font-black tracking-widest transition-colors"
            />
            {otpErr && <p className="text-[#E95012] text-xs sm:text-sm mt-1 text-center">{otpErr}</p>}
          </div>
          <button
            onClick={() => verifyOtp()}
            disabled={loading || otp.length !== 6}
            className="w-full py-2.5 sm:py-3 bg-[#E95012] text-white rounded-xl font-bold text-sm sm:text-base hover:bg-[#c7400d] transition-colors disabled:opacity-50"
          >
            {loading ? t('common.loading') : t('order.phone.verify')}
          </button>
          <div className="text-center">
            {resendTimer > 0 ? (
              <p className="text-xs sm:text-sm text-[#3A1C10]/50">Resend OTP in {resendTimer}s</p>
            ) : (
              <button onClick={sendOtp} className="text-xs sm:text-sm text-[#063D20] font-semibold underline hover:no-underline">
                {t('order.phone.resend')}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Step 3: Pickup details
function PickupStep({
  items,
  orderSource,
  product,
  street,
  city,
  pincode,
  onStreet,
  onCity,
  onPincode,
  onNext,
  onBack,
}: {
  items: OrderItem[];
  orderSource: 'cart' | 'direct';
  product?: Product | null;
  street: string;
  city: string;
  pincode: string;
  onStreet: (v: string) => void;
  onCity: (v: string) => void;
  onPincode: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const { t } = useLanguage();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!street.trim()) errs.street = t('common.required');
    if (!city.trim()) errs.city = t('common.required');
    return errs;
  };

  const submit = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onNext();
  };

  const grandTotal = items.reduce((s, it) => s + it.price * it.quantity, 0);

  return (
    <div className="space-y-3.5">
      <h2 className="text-xl sm:text-2xl font-black text-[#063D20]">{t('order.step.pickup')}</h2>

      {items && items.length > 0 ? (
        <div className="bg-[#FFF4DD] border border-[#582A00]/15 rounded-xl p-3 text-xs sm:text-sm">
          <div className="flex items-center justify-between font-bold text-[#582A00] mb-2 pb-1.5 border-b border-[#582A00]/10">
            <span>{orderSource === 'cart' ? '🛒 Cart Items' : '📦 Selected Order'}</span>
            <span className="text-[#C42F2C] font-black text-sm">
              Total: ₹{grandTotal}
            </span>
          </div>
          <div className="space-y-1.5">
            {items.map((it) => (
              <div key={it.id} className="flex justify-between items-center text-[#582A00]">
                <span>
                  <strong className="text-[#C42F2C]">{it.weight}</strong>
                  <span className="text-[#3A1C10]/60 ml-1.5 font-medium">× {it.quantity}</span>
                </span>
                <span className="font-bold">₹{it.price * it.quantity}</span>
              </div>
            ))}
          </div>
        </div>
      ) : product ? (
        <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#FFF4DD] border border-[#582A00]/15 rounded-xl text-xs sm:text-sm">
          <span className="font-semibold text-[#582A00]">
            Selected Pack: <strong className="text-[#C42F2C]">{product.weight}</strong>
          </span>
          <span className="font-black text-[#582A00]">₹{product.price}</span>
        </div>
      ) : null}

      <div>
        <label className="block text-xs sm:text-sm font-semibold text-[#3A1C10] mb-1">{t('order.street.label')} *</label>
        <input
          type="text"
          value={street}
          onChange={(e) => { onStreet(e.target.value); setErrors((prev) => ({ ...prev, street: '' })); }}
          placeholder={t('order.street.placeholder')}
          className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#063D20]/20 focus:border-[#063D20] outline-none text-sm sm:text-base transition-colors"
        />
        {errors.street && <p className="text-[#E95012] text-xs sm:text-sm mt-1">{errors.street}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-[#3A1C10] mb-1">{t('order.city.label')} *</label>
          <input
            type="text"
            value={city}
            onChange={(e) => { onCity(e.target.value); setErrors((prev) => ({ ...prev, city: '' })); }}
            className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#063D20]/20 focus:border-[#063D20] outline-none text-sm sm:text-base transition-colors"
          />
          {errors.city && <p className="text-[#E95012] text-xs sm:text-sm mt-1">{errors.city}</p>}
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-[#3A1C10] mb-1">{t('order.pincode.label')}</label>
          <input
            type="text"
            inputMode="numeric"
            value={pincode}
            onChange={(e) => onPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#063D20]/20 focus:border-[#063D20] outline-none text-sm sm:text-base transition-colors"
          />
        </div>
      </div>

      <div className="bg-[#D97706]/10 border border-[#D97706]/30 rounded-xl p-2.5 text-xs sm:text-sm text-[#7a4800]">
        Home delivery is currently available only within Villupuram City limits. Customers from other locations can place orders online and pick them up from our store at Villupuram Railway Station, 1st Platform.
      </div>

      <div className="flex gap-2 pt-2">
        <button onClick={onBack} className="flex-1 py-2.5 sm:py-3 border-2 border-[#063D20] text-[#063D20] rounded-xl font-bold text-sm sm:text-base hover:bg-[#063D20] hover:text-[#FFF4DD] transition-colors">
          {t('order.back')}
        </button>
        <button onClick={submit} className="flex-[2] py-2.5 sm:py-3 bg-[#063D20] text-[#FFF4DD] rounded-xl font-bold text-sm sm:text-base hover:bg-[#0A512B] transition-colors">
          {t('order.next')} →
        </button>
      </div>
    </div>
  );
}

// Step 4: Payment
function PaymentStep({ orderState, onBack, onSuccess, onClearCart }: {
  orderState: OrderState; onBack: () => void;
  onSuccess: (orderId: string) => void;
  onClearCart?: () => void;
}) {
  const { t } = useLanguage();
  const router = useRouter();
  const [qrUrl, setQrUrl] = useState('/gpayQR.png');
  const [timeLeft, setTimeLeft] = useState(90);
  const [expired, setExpired] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [creating, setCreating] = useState(true);
  const [currentOrderId, setCurrentOrderId] = useState('');
  const [createError, setCreateError] = useState('');

  // Create order on mount
  useEffect(() => {
    const create = async () => {
      try {
        const prodId = orderState.items[0]?.id || orderState.selectedProduct?.id || '500gm';
        const totalQty = orderState.items.reduce((s, it) => s + it.quantity, 0) || 1;
        const result = await api.createOrder({
          customerName: orderState.name,
          phone: orderState.phone.replace(/\D/g, ''),
          productId: prodId,
          quantity: totalQty,
          items: orderState.items.map((it) => ({ productId: it.id, quantity: it.quantity })),
          otpSessionId: orderState.otpSessionId,
          streetAddress: orderState.street,
          city: orderState.city,
          pincode: orderState.pincode || undefined,
        });
        setCurrentOrderId(result.orderId);

        // Calculate time left from server expiry
        if (result.paymentExpiry) {
          const expiryMs = new Date(result.paymentExpiry).getTime() - Date.now();
          setTimeLeft(Math.max(0, Math.floor(expiryMs / 1000)));
        }
      } catch (err: any) {
        setCreateError(err.message || t('common.error'));
      } finally {
        setCreating(false);
      }
    };
    create();
  }, []);

  // Load QR URL
  useEffect(() => {
    api.getQrUrl().then((r) => setQrUrl(r.url || '/gpayQR.png')).catch(() => {});
  }, []);

  // Countdown timer
  useEffect(() => {
    if (creating || expired || timeLeft <= 0) return;
    if (timeLeft === 0) { setExpired(true); return; }
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { setExpired(true); clearInterval(interval); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [creating, expired]);

  const handlePaid = async () => {
    if (!currentOrderId) return;
    setSubmitting(true);
    try {
      await api.iHavePaid(currentOrderId);
      if (orderState.orderSource === 'cart' && onClearCart) {
        onClearCart();
      }
      onSuccess(currentOrderId);
    } catch (err: any) {
      toast.error(err.message || t('common.error'));
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const urgent = timeLeft <= 30;

  if (creating) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 border-4 border-[#063D20] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[#3A1C10]/60">{t('common.loading')}</p>
      </div>
    );
  }

  if (createError) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-4">⚠️</div>
        <p className="text-[#E95012] font-bold mb-4">{createError}</p>
        <button onClick={onBack} className="px-6 py-3 bg-[#063D20] text-[#FFF4DD] rounded-xl font-bold">
          {t('order.back')}
        </button>
      </div>
    );
  }

  const grandTotal = orderState.totalAmount || orderState.items.reduce((s, it) => s + it.price * it.quantity, 0);

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-black text-[#063D20]">{t('order.step.payment')}</h2>

      {/* Order summary */}
      <div className="bg-[#063D20] text-[#FFF4DD] rounded-2xl p-4 sm:p-5">
        <h3 className="text-[#F5B51B] font-bold text-xs sm:text-sm mb-3">
          {orderState.orderSource === 'cart' ? '🛒 Cart Order Summary' : '📦 Order Summary'}
        </h3>
        <div className="space-y-2 text-xs sm:text-sm">
          <div className="flex justify-between">
            <span className="text-[#FFF4DD]/80">Name</span>
            <span className="font-semibold">{orderState.name}</span>
          </div>

          <div className="border-t border-[#FFF4DD]/15 pt-2 space-y-1.5">
            {orderState.items && orderState.items.length > 0 ? (
              orderState.items.map((it) => (
                <div key={it.id} className="flex justify-between items-center">
                  <span>
                    {it.weight} <span className="text-[#F5B51B] font-semibold">× {it.quantity}</span>
                  </span>
                  <span className="font-semibold">₹{it.price * it.quantity}</span>
                </div>
              ))
            ) : (
              <div className="flex justify-between">
                <span>{orderState.selectedProduct?.weight}</span>
                <span className="font-semibold">₹{orderState.selectedProduct?.price}</span>
              </div>
            )}
          </div>

          <div className="flex justify-between border-t border-[#FFF4DD]/15 pt-2">
            <span className="text-[#FFF4DD]/80">Delivery / Pickup</span>
            <span className="font-semibold">{orderState.city}</span>
          </div>
          <div className="border-t border-[#FFF4DD]/20 my-2" />
          <div className="flex justify-between text-base sm:text-lg font-black">
            <span>{t('order.total')}</span>
            <span className="text-[#F5B51B]">₹{grandTotal}</span>
          </div>
        </div>
      </div>

      {expired ? (
        <div className="text-center py-6">
          <div className="text-4xl mb-3">⏰</div>
          <p className="text-[#E95012] font-bold text-lg">{t('order.payment.expired')}</p>
          <button onClick={onBack} className="mt-4 px-6 py-3 bg-[#063D20] text-[#FFF4DD] rounded-xl font-bold">
            Place New Order
          </button>
        </div>
      ) : (
        <>
          {/* Timer */}
          <div className="text-center">
            <p className="text-sm text-[#3A1C10]/60 mb-1">{t('order.payment.timer')}</p>
            <div className={`text-4xl font-black tabular-nums ${urgent ? 'timer-urgent' : 'text-[#063D20]'}`}>
              {formatTime(timeLeft)}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className={`h-2 rounded-full transition-all ${urgent ? 'bg-[#E95012]' : 'bg-[#063D20]'}`}
                style={{ width: `${(timeLeft / 90) * 100}%` }}
              />
            </div>
          </div>

          {/* QR Code */}
          <div className="text-center">
            <p className="font-bold text-[#063D20] mb-3">{t('order.payment.scan')}</p>
            <div className="inline-block p-3 bg-white rounded-3xl shadow-xl border-2 border-[#F5B51B]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrUrl}
                alt="GPay QR code for payment – scan to pay for Mutta Mittai"
                className="w-52 h-52 object-contain"
                onError={(e) => { (e.target as HTMLImageElement).src = '/gpayQR.png'; }}
              />
            </div>
            <p className="text-sm text-[#3A1C10]/60 mt-2">{t('order.payment.title')}</p>
          </div>

          {/* Warning */}
          <div className="bg-[#F5B51B]/15 border border-[#F5B51B] rounded-xl p-4 text-sm">
            <p className="text-[#3A1C10]">{t('order.payment.note')}</p>
          </div>

          {/* Paid button */}
          <button
            onClick={handlePaid}
            disabled={submitting}
            className="w-full py-3.5 sm:py-4 bg-[#25D366] text-white rounded-xl font-bold text-base sm:text-lg hover:bg-[#20bb5a] transition-all disabled:opacity-50 shadow-lg"
          >
            {submitting ? t('common.loading') : `✅ ${t('order.payment.paid')}`}
          </button>

          <p className="text-center text-xs text-[#3A1C10]/50">
            Order ID: {currentOrderId.slice(-8).toUpperCase()}
          </p>
        </>
      )}
    </div>
  );
}

// Main order page
function OrderPageContent() {
  const { t } = useLanguage();
  const { cart, clearCart } = useApp();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [state, setState] = useState<OrderState>({
    name: '',
    phone: '',
    otpSessionId: '',
    phoneVerified: false,
    items: [],
    orderSource: 'direct',
    selectedProduct: null,
    street: '',
    city: '',
    pincode: '',
    orderId: '',
    totalAmount: 0,
    paymentExpiry: '',
  });

  useEffect(() => {
    const fallbackList: Product[] = [
      { id: '250gm', weight: '250gm', weightGrams: 250, price: 150, inStock: true },
      { id: '500gm', weight: '500gm', weightGrams: 500, price: 300, inStock: true },
      { id: '750gm', weight: '750gm', weightGrams: 750, price: 450, inStock: true },
      { id: '1kg',   weight: '1kg',   weightGrams: 1000, price: 600, inStock: true },
    ];

    const matchProduct = (list: Product[], query: string | null) => {
      if (!query) return null;
      const clean = query.trim().toLowerCase().replace(/\s+/g, '');
      return list.find((p) => p.id === query || p.weight.toLowerCase().replace(/\s+/g, '') === clean) || null;
    };

    api.getProducts().then((data) => {
      const prods = (data && data.length > 0) ? data : fallbackList;
      setProducts(prods);

      const preselect = searchParams.get('product');
      const qtyParam = parseInt(searchParams.get('qty') || '1', 10);
      const quantity = isNaN(qtyParam) || qtyParam < 1 ? 1 : qtyParam;
      const fromParam = searchParams.get('from');

      // Check if user came from cart or if no direct product was requested but cart has items
      const isFromCart = fromParam === 'cart' || (!preselect && cart && cart.length > 0);

      if (isFromCart && cart && cart.length > 0) {
        const orderItems: OrderItem[] = cart.map((c) => ({
          id: c.id,
          weight: c.weight,
          price: c.price,
          quantity: c.quantity,
        }));
        const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        setState((s) => ({
          ...s,
          items: orderItems,
          orderSource: 'cart',
          totalAmount: total,
          selectedProduct: prods.find((p) => p.id === orderItems[0]?.id) || prods[0],
        }));
      } else if (preselect) {
        const matched = matchProduct(prods, preselect) || fallbackList[1];
        const orderItems: OrderItem[] = [{
          id: matched.id,
          weight: matched.weight,
          price: matched.price,
          quantity,
        }];
        setState((s) => ({
          ...s,
          items: orderItems,
          orderSource: 'direct',
          totalAmount: matched.price * quantity,
          selectedProduct: matched,
        }));
      } else {
        const defaultProd = prods.find((p) => p.inStock) || prods[0];
        const orderItems: OrderItem[] = [{
          id: defaultProd.id,
          weight: defaultProd.weight,
          price: defaultProd.price,
          quantity: 1,
        }];
        setState((s) => ({
          ...s,
          items: orderItems,
          orderSource: 'direct',
          totalAmount: defaultProd.price,
          selectedProduct: defaultProd,
        }));
      }
    }).catch(() => {
      setProducts(fallbackList);
      const preselect = searchParams.get('product');
      const qtyParam = parseInt(searchParams.get('qty') || '1', 10);
      const quantity = isNaN(qtyParam) || qtyParam < 1 ? 1 : qtyParam;
      const fromParam = searchParams.get('from');
      const isFromCart = fromParam === 'cart' || (!preselect && cart && cart.length > 0);

      if (isFromCart && cart && cart.length > 0) {
        const orderItems: OrderItem[] = cart.map((c) => ({
          id: c.id,
          weight: c.weight,
          price: c.price,
          quantity: c.quantity,
        }));
        const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        setState((s) => ({
          ...s,
          items: orderItems,
          orderSource: 'cart',
          totalAmount: total,
          selectedProduct: fallbackList[0],
        }));
      } else {
        const matched = matchProduct(fallbackList, preselect) || fallbackList[1];
        setState((s) => ({
          ...s,
          items: [{ id: matched.id, weight: matched.weight, price: matched.price, quantity }],
          orderSource: 'direct',
          totalAmount: matched.price * quantity,
          selectedProduct: matched,
        }));
      }
    });
  }, [searchParams, cart]);

  const update = (key: keyof OrderState, value: unknown) =>
    setState((s) => ({ ...s, [key]: value }));

  const nextStep = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const slideVariants = {
    enter: { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  return (
    <div className="min-h-screen bg-[#FFF4DD] pt-16">
      <Header />
      <main className="py-6 px-4">
        <div className="max-w-md mx-auto">
          {/* Page title */}
          <div className="text-center mb-5">
            <h1 className="text-2xl sm:text-3xl font-black text-[#063D20]">{t('order.title')}</h1>
            <p className="text-[#3A1C10]/60 text-xs sm:text-sm mt-1">
              Home delivery within Villupuram City · Pickup at Villupuram Railway Station
            </p>
          </div>

          <StepIndicator current={step} steps={STEPS} />

          {/* Card */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-4 sm:p-6 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: 'easeInOut' }}
              >
                {step === 0 && (
                  <NameStep
                    value={state.name}
                    onChange={(v) => update('name', v)}
                    onNext={nextStep}
                  />
                )}
                {step === 1 && (
                  <PhoneStep
                    phone={state.phone}
                    onPhoneChange={(v) => update('phone', v)}
                    sessionId={state.otpSessionId}
                    onSessionChange={(v) => update('otpSessionId', v)}
                    verified={state.phoneVerified}
                    onVerified={() => update('phoneVerified', true)}
                    onNext={nextStep}
                  />
                )}
                {step === 2 && (
                  <PickupStep
                    items={state.items}
                    orderSource={state.orderSource}
                    product={state.selectedProduct}
                    street={state.street}
                    city={state.city}
                    pincode={state.pincode}
                    onStreet={(v) => update('street', v)}
                    onCity={(v) => update('city', v)}
                    onPincode={(v) => update('pincode', v)}
                    onNext={nextStep}
                    onBack={prevStep}
                  />
                )}
                {step === 3 && (
                  <PaymentStep
                    orderState={state}
                    onBack={prevStep}
                    onSuccess={(id) => router.push(`/order/success?orderId=${id}`)}
                    onClearCart={clearCart}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function OrderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[#063D20]">Loading...</div>}>
      <OrderPageContent />
    </Suspense>
  );
}
