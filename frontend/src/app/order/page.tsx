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
import { saveOrderToStorage } from '@/lib/ordersStorage';

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if ((window as any).Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

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
  deliveryMethod: 'pickup' | 'delivery';
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
      <h2 className="text-xl sm:text-2xl font-black text-[#582A00]">{t('order.step.name')}</h2>
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
          className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#582A00]/20 focus:border-[#C42F2C] outline-none text-sm sm:text-base transition-colors"
        />
        {err && <p className="text-[#C42F2C] text-xs sm:text-sm mt-1">{err}</p>}
      </div>
      <button
        onClick={submit}
        className="w-full py-2.5 sm:py-3 bg-[#C42F2C] text-white rounded-xl font-bold text-sm sm:text-base hover:bg-[#a82421] transition-colors shadow"
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
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [phoneErr, setPhoneErr] = useState('');
  const [otpErr, setOtpErr] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

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
      .then((cred: any) => {
        if (cred?.code) {
          const digits = cred.code.replace(/\D/g, '').slice(0, 6).split('');
          const newD = ['', '', '', '', '', ''];
          digits.forEach((d: string, i: number) => { newD[i] = d; });
          setOtpDigits(newD);
          if (digits.length === 6) verifyOtp(newD.join(''));
        }
      })
      .catch(() => {});
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      setOtpDigits(['', '', '', '', '', '']);
      setResendTimer(60);
      toast.success(t('order.phone.otp_sent'));
      setTimeout(() => inputRefs.current[0]?.focus(), 300);
    } catch (err: any) {
      toast.error(err.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (codeToVerify?: string) => {
    const code = codeToVerify || otpDigits.join('');
    if (code.length !== 6) { setOtpErr('Please enter the complete 6-digit OTP'); return; }
    setLoading(true);
    try {
      await api.verifyOtp(phone.replace(/\D/g, ''), code, sessionId);
      onVerified();
      toast.success('Mobile verified successfully!');
      onNext();
    } catch (err: any) {
      setOtpErr(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDigitChange = (idx: number, val: string) => {
    const digit = val.replace(/\D/g, '').slice(-1);
    const newDigits = [...otpDigits];
    newDigits[idx] = digit;
    setOtpDigits(newDigits);
    setOtpErr('');

    if (digit && idx < 5) {
      inputRefs.current[idx + 1]?.focus();
    }

    const fullCode = newDigits.join('');
    // Automatically advance to the next step once 6 digits are entered
    if (fullCode.length === 6) {
      verifyOtp(fullCode);
    }
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const digits = pasted.split('');
    const newDigits = ['', '', '', '', '', ''];
    digits.forEach((d, i) => { newDigits[i] = d; });
    setOtpDigits(newDigits);
    const focusTarget = Math.min(digits.length, 5);
    inputRefs.current[focusTarget]?.focus();
    if (digits.length === 6) {
      verifyOtp(digits.join(''));
    }
  };

  const formatCountdown = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  return (
    <div>
      {!otpSent ? (
        <div className="space-y-3.5">
          <h2 className="text-xl sm:text-2xl font-black text-[#582A00]">{t('order.step.phone')}</h2>
          <div>
            <label htmlFor="phone" className="block text-xs sm:text-sm font-semibold text-[#3A1C10] mb-1">
              {t('order.phone.label')} *
            </label>
            <div className="flex gap-2">
              <div className="flex items-center px-3.5 py-2.5 bg-stone-100 border-2 border-stone-200 rounded-xl text-xs sm:text-sm font-bold text-stone-700">
                +91
              </div>
              <input
                id="phone"
                type="tel"
                inputMode="numeric"
                value={phone}
                onChange={(e) => { onPhoneChange(e.target.value.replace(/\D/g, '').slice(0, 10)); setPhoneErr(''); }}
                onKeyDown={(e) => e.key === 'Enter' && sendOtp()}
                placeholder={t('order.phone.placeholder')}
                className="flex-1 px-3.5 py-2.5 rounded-xl border-2 border-[#582A00]/20 focus:border-[#C42F2C] outline-none text-sm sm:text-base transition-colors"
                autoComplete="tel"
                autoFocus
              />
            </div>
            {phoneErr && <p className="text-[#C42F2C] text-xs sm:text-sm mt-1">{phoneErr}</p>}
          </div>

          <button
            onClick={sendOtp}
            disabled={loading}
            className="w-full py-2.5 sm:py-3 bg-[#C42F2C] text-white rounded-xl font-bold text-sm sm:text-base hover:bg-[#a82421] transition-colors disabled:opacity-50 shadow"
          >
            {loading ? t('common.loading') : t('order.phone.send_otp')}
          </button>
        </div>
      ) : (
        /* OTP Verification Card matching image specification */
        <div className="overflow-hidden rounded-2xl border border-[#582A00]/15 shadow-md bg-white">
          {/* Header with Red Gradient */}
          <div className="bg-gradient-to-r from-[#C42F2C] to-[#8F1D1A] text-white p-4 sm:p-5 relative">
            <div className="flex items-center justify-between mb-2">
              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="text-white/80 hover:text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                ← Back
              </button>
              <span className="text-[10px] font-black tracking-wider uppercase bg-white/20 px-2 py-0.5 rounded-full">
                Appampattu Mutta Mittai
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black">OTP Verification</h3>
            <p className="text-xs sm:text-sm text-white/90 mt-1">
              OTP has been sent to <strong>+91 {phone}</strong>
            </p>
          </div>

          {/* Body with 6 Segmented PIN boxes, countdown and auto-advance */}
          <div className="p-5 sm:p-6 space-y-5 text-center">
            {/* 6 Digit Input Boxes */}
            <div className="flex justify-center gap-2 sm:gap-2.5">
              {[0, 1, 2, 3, 4, 5].map((idx) => (
                <input
                  key={idx}
                  ref={(el) => { inputRefs.current[idx] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={otpDigits[idx] || ''}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  onPaste={handlePaste}
                  className={`w-10 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-black rounded-xl border-2 transition-all outline-none ${
                    otpDigits[idx]
                      ? 'border-[#C42F2C] bg-[#FFF8F6] text-[#582A00]'
                      : 'border-[#582A00]/25 bg-white text-[#582A00] focus:border-[#C42F2C] focus:ring-2 focus:ring-[#C42F2C]/20'
                  }`}
                />
              ))}
            </div>

            {/* Countdown Display e.g. 00:57 */}
            <div className="pt-1">
              <span className="text-2xl sm:text-3xl font-black tracking-wider text-[#1F242D] block">
                {formatCountdown(resendTimer)}
              </span>
              <p className="text-xs text-[#582A00]/65 mt-1">
                {resendTimer > 0 ? (
                  `Didn't get it? Wait ${resendTimer}s`
                ) : (
                  <span>
                    Didn&apos;t get it?{' '}
                    <button
                      type="button"
                      onClick={sendOtp}
                      className="text-[#C42F2C] font-bold underline hover:no-underline cursor-pointer"
                    >
                      Resend OTP
                    </button>
                  </span>
                )}
              </p>
            </div>

            {otpErr && <p className="text-[#C42F2C] text-xs font-semibold">{otpErr}</p>}

            {/* Primary Action Button */}
            <button
              type="button"
              onClick={() => verifyOtp(otpDigits.join(''))}
              disabled={loading || otpDigits.join('').length !== 6}
              className="w-full py-3 sm:py-3.5 bg-[#C42F2C] hover:bg-[#a82421] text-white rounded-xl font-bold text-sm sm:text-base transition-colors disabled:opacity-50 shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify OTP'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Step 3: Pickup / Delivery details
function PickupStep({
  items,
  orderSource,
  product,
  deliveryMethod,
  onDeliveryMethod,
  street,
  city,
  onStreet,
  onCity,
  onNext,
  onBack,
}: {
  items: OrderItem[];
  orderSource: 'cart' | 'direct';
  product?: Product | null;
  deliveryMethod: 'pickup' | 'delivery';
  onDeliveryMethod: (v: 'pickup' | 'delivery') => void;
  street: string;
  city: string;
  onStreet: (v: string) => void;
  onCity: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const { t } = useLanguage();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (deliveryMethod === 'delivery') {
      if (!street.trim()) errs.street = 'Please enter your street / door address for delivery';
      if (!city.trim()) errs.city = 'Please enter city';
    }
    return errs;
  };

  const submit = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onNext();
  };

  const grandTotal = items.reduce((s, it) => s + it.price * it.quantity, 0);

  return (
    <div className="space-y-4">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#D97706]">
          Step 3 of 4
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-[#582A00]">
          Shipping & Delivery Method
        </h2>
      </div>

      {/* Selected Items Summary Card */}
      {items && items.length > 0 ? (
        <div className="bg-[#FAF7F2] border border-[#582A00]/15 rounded-xl p-3 text-xs sm:text-sm">
          <div className="flex items-center justify-between font-bold text-[#582A00] mb-2 pb-1.5 border-b border-[#582A00]/10">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-[#C42F2C]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span>{orderSource === 'cart' ? 'Cart Items' : 'Selected Order'}</span>
            </span>
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
        <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#FAF7F2] border border-[#582A00]/15 rounded-xl text-xs sm:text-sm">
          <span className="font-semibold text-[#582A00]">
            Selected Pack: <strong className="text-[#C42F2C]">{product.weight}</strong>
          </span>
          <span className="font-black text-[#582A00]">₹{product.price}</span>
        </div>
      ) : null}

      {/* Shipping Method Options matching Image 2 */}
      <div>
        <label className="block text-xs sm:text-sm font-bold text-[#3A1C10] mb-2">
          Select Delivery Option *
        </label>
        <div className="space-y-2.5">
          {/* Option 1: HOME DELIVERY (Default) */}
          <div
            onClick={() => onDeliveryMethod('delivery')}
            className={`cursor-pointer rounded-xl border-2 p-3 sm:p-3.5 transition-all flex items-start gap-3 ${
              deliveryMethod === 'delivery'
                ? 'border-[#C42F2C] bg-[#FFF8F6] shadow-xs'
                : 'border-[#582A00]/15 bg-white hover:border-[#582A00]/30'
            }`}
          >
            <div className="pt-0.5">
              <input
                type="radio"
                name="shippingMethod"
                checked={deliveryMethod === 'delivery'}
                onChange={() => onDeliveryMethod('delivery')}
                className="w-4 h-4 text-[#C42F2C] accent-[#C42F2C] cursor-pointer"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm sm:text-base text-[#582A00]">
                  HOME DELIVERY <span className="text-xs font-semibold text-[#D97706]">(Within Villupuram City)</span>
                </span>
                <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  FREE
                </span>
              </div>
              <p className="text-xs text-[#582A00]/70 mt-0.5">
                Fresh daily batch delivered straight to your doorstep inside Villupuram City limits.
              </p>
            </div>
          </div>

          {/* Option 2: Pick up in-store */}
          <div
            onClick={() => onDeliveryMethod('pickup')}
            className={`cursor-pointer rounded-xl border-2 p-3 sm:p-3.5 transition-all flex items-start gap-3 ${
              deliveryMethod === 'pickup'
                ? 'border-[#C42F2C] bg-[#FFF8F6] shadow-xs'
                : 'border-[#582A00]/15 bg-white hover:border-[#582A00]/30'
            }`}
          >
            <div className="pt-0.5">
              <input
                type="radio"
                name="shippingMethod"
                checked={deliveryMethod === 'pickup'}
                onChange={() => onDeliveryMethod('pickup')}
                className="w-4 h-4 text-[#C42F2C] accent-[#C42F2C] cursor-pointer"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm sm:text-base text-[#582A00]">
                  Pick Up in Store <span className="text-xs font-semibold text-[#D97706]">(For outside Villupuram)</span>
                </span>
                <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  FREE
                </span>
              </div>
              <p className="text-xs text-[#582A00]/70 mt-0.5">
                Pickup directly from store at <strong>Villupuram Railway Station (1st Platform)</strong>. Recommended for customers outside Villupuram.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* If Pick up in store: Show confirmed station pickup banner */}
      {deliveryMethod === 'pickup' && (
        <div className="bg-[#FAF7F2] border border-[#582A00]/15 rounded-xl p-3.5 space-y-1 text-xs text-[#582A00]">
          <div className="font-bold text-[#C42F2C] flex items-center gap-1.5 text-xs sm:text-sm">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Confirmed Store Pickup Location</span>
          </div>
          <p className="font-semibold">
            Appampattu Mutta Mittai Outlet · Villupuram Railway Station (1st Platform)
          </p>
          <p className="text-[#582A00]/70">
            Helpline: +91 78719 49015. Your package will be prepared and reserved immediately upon online payment.
          </p>
        </div>
      )}

      {/* If Home Delivery: Show Street Address & City input fields */}
      {deliveryMethod === 'delivery' && (
        <div className="space-y-3 pt-1">
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-[#3A1C10] mb-1">
              Street / Door Address in Villupuram *
            </label>
            <input
              type="text"
              value={street}
              onChange={(e) => { onStreet(e.target.value); setErrors((prev) => ({ ...prev, street: '' })); }}
              placeholder="House/Door No, Street Name, Area Landmark"
              className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#582A00]/20 focus:border-[#C42F2C] outline-none text-sm sm:text-base transition-colors"
            />
            {errors.street && <p className="text-[#C42F2C] text-xs sm:text-sm mt-1">{errors.street}</p>}
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-[#3A1C10] mb-1">City / Town *</label>
            <input
              type="text"
              value={city || 'Villupuram'}
              onChange={(e) => { onCity(e.target.value); setErrors((prev) => ({ ...prev, city: '' })); }}
              className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#582A00]/20 focus:border-[#C42F2C] outline-none text-sm sm:text-base transition-colors"
            />
            {errors.city && <p className="text-[#C42F2C] text-xs sm:text-sm mt-1">{errors.city}</p>}
          </div>
        </div>
      )}

      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-2.5 sm:py-3 border-2 border-[#582A00]/20 text-[#582A00] rounded-xl font-bold text-sm sm:text-base hover:bg-[#582A00]/10 transition-colors cursor-pointer"
        >
          {t('order.back')}
        </button>
        <button
          type="button"
          onClick={submit}
          className="flex-[2] py-2.5 sm:py-3 bg-[#C42F2C] text-white rounded-xl font-bold text-sm sm:text-base hover:bg-[#a82421] transition-colors shadow cursor-pointer"
        >
          {t('order.next')} →
        </button>
      </div>
    </div>
  );
}

// Step 4: Payment
function PaymentStep({
  orderState,
  onBack,
  onSuccess,
  onClearCart,
}: {
  orderState: OrderState;
  onBack: () => void;
  onSuccess: (orderId: string) => void;
  onClearCart?: () => void;
}) {
  const { t } = useLanguage();
  const [submitting, setSubmitting] = useState(false);
  const [creating, setCreating] = useState(true);
  const [currentOrderId, setCurrentOrderId] = useState('');
  const [createError, setCreateError] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Create order on mount
  useEffect(() => {
    const create = async () => {
      try {
        const prodId = orderState.items[0]?.id || orderState.selectedProduct?.id || '500gm';
        const totalQty = orderState.items.reduce((s, it) => s + it.quantity, 0) || 1;
        const isPickup = orderState.deliveryMethod === 'pickup';
        const streetVal = isPickup
          ? 'Pick up in-store (Villupuram Railway Station, 1st Platform)'
          : (orderState.street || 'Villupuram City');
        const cityVal = isPickup
          ? 'Villupuram (Store Pickup)'
          : (orderState.city || 'Villupuram');

        const result = await api.createOrder({
          customerName: orderState.name,
          phone: orderState.phone.replace(/\D/g, ''),
          productId: prodId,
          quantity: totalQty,
          items: orderState.items.map((it) => ({ productId: it.id, quantity: it.quantity })),
          otpSessionId: orderState.otpSessionId,
          streetAddress: streetVal,
          city: cityVal,
          pincode: orderState.pincode || undefined,
        });
        setCurrentOrderId(result.orderId);
      } catch (err: any) {
        setCreateError(err.message || t('common.error'));
      } finally {
        setCreating(false);
      }
    };
    create();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Razorpay Pay Handler
  const handleRazorpayPay = async () => {
    if (!currentOrderId) return;
    setSubmitting(true);
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error('Failed to load Razorpay payment gateway. Please check your internet connection.');
        setSubmitting(false);
        return;
      }

      const rzOrder = await api.createRazorpayOrder(currentOrderId);

      const options = {
        key: rzOrder.keyId,
        amount: rzOrder.amount,
        currency: rzOrder.currency || 'INR',
        name: 'Appampattu Mutta Mittai',
        description: `Order #${currentOrderId.slice(-8).toUpperCase()}`,
        image: '/images/logo.jpg',
        order_id: rzOrder.razorpayOrderId,
        prefill: {
          name: orderState.name,
          contact: orderState.phone.replace(/\D/g, ''),
        },
        theme: {
          color: '#C42F2C',
        },
        handler: async (response: any) => {
          try {
            toast.loading('Confirming payment...', { id: 'rzp' });
            await api.verifyRazorpayPayment({
              orderId: currentOrderId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            toast.success('Payment successful!', { id: 'rzp' });

            // Save order to both localStorage & sessionStorage for "Ordered Items" in hamburger menu
            saveOrderToStorage({
              id: currentOrderId,
              customerName: orderState.name,
              phone: orderState.phone,
              totalAmount: grandTotal,
              items: orderState.items,
              deliveryMethod: orderState.deliveryMethod,
              streetAddress: orderState.deliveryMethod === 'pickup'
                ? 'Pick up in-store (Villupuram Railway Station, 1st Platform)'
                : orderState.street,
              city: orderState.deliveryMethod === 'pickup'
                ? 'Villupuram (Store Pickup)'
                : (orderState.city || 'Villupuram'),
              pincode: orderState.pincode,
              status: 'PAID',
              date: new Date().toISOString(),
              transactionId: response.razorpay_payment_id,
            });

            if (onClearCart) {
              onClearCart();
            }
            onSuccess(currentOrderId);
          } catch (err: any) {
            toast.error(err.message || 'Payment verification failed', { id: 'rzp' });
          } finally {
            setSubmitting(false);
          }
        },
        modal: {
          ondismiss: () => {
            setSubmitting(false);
            setShowCancelModal(true);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', () => {
        setSubmitting(false);
        setShowCancelModal(true);
      });
      rzp.open();
    } catch (err: any) {
      if (err.message === 'RAZORPAY_NOT_CONFIGURED' || err.message?.includes('not yet configured')) {
        toast.error('Razorpay keys are not yet configured in Render backend environment variables.');
      } else {
        toast.error(err.message || 'Could not initiate Razorpay payment.');
      }
      setSubmitting(false);
    }
  };

  const grandTotal =
    orderState.totalAmount ||
    orderState.items.reduce((s, it) => s + it.price * it.quantity, 0);

  if (creating) {
    return (
      <div className="text-center py-12">
        <div className="w-10 h-10 border-3 border-[#C42F2C] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm font-semibold text-[#582A00]/70">Preparing secure checkout...</p>
      </div>
    );
  }

  if (createError) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
          !
        </div>
        <p className="text-[#C42F2C] font-bold mb-4">{createError}</p>
        <button
          onClick={onBack}
          className="px-6 py-2.5 bg-[#582A00] text-white rounded-xl font-semibold text-sm hover:bg-[#3D1D00] transition-colors"
        >
          ← Go Back & Edit Details
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="pb-3 border-b border-[#582A00]/10">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#D97706]">
          Step 4 of 4 · Final Step
        </span>
        <h2 className="text-lg sm:text-xl font-black text-[#582A00] leading-tight">
          Review & Pay
        </h2>
      </div>

      {/* Professional Order Summary Card */}
      <div className="bg-[#FAF7F2] rounded-2xl border border-[#582A00]/10 p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#582A00]/10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#582A00]">
            {orderState.orderSource === 'cart' ? 'Cart Summary' : 'Order Summary'}
          </span>
          <span className="text-[11px] font-mono text-[#582A00]/60 bg-white px-2 py-0.5 rounded border border-[#582A00]/10">
            #{currentOrderId.slice(-8).toUpperCase()}
          </span>
        </div>

        {/* Itemized List */}
        <div className="space-y-2 mb-3">
          {orderState.items && orderState.items.length > 0 ? (
            orderState.items.map((it) => (
              <div key={it.id} className="flex items-center justify-between text-xs sm:text-sm">
                <span className="font-bold text-[#582A00]">
                  {it.weight} <span className="text-xs text-[#582A00]/60 font-normal ml-1">× {it.quantity}</span>
                </span>
                <span className="font-bold text-[#582A00]">₹{it.price * it.quantity}</span>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="font-bold text-[#582A00]">
                {orderState.selectedProduct?.weight || 'Mutta Mittai Pack'}
              </span>
              <span className="font-bold text-[#582A00]">
                ₹{orderState.selectedProduct?.price || grandTotal}
              </span>
            </div>
          )}
        </div>

            {/* Pricing breakdown & Delivery Selection */}
            <div className="pt-2 border-t border-[#582A00]/10 space-y-1.5 text-xs text-[#582A00]/70">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span>₹{grandTotal}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Shipping Method</span>
                <span className="text-[#C42F2C] font-bold">
                  {orderState.deliveryMethod === 'pickup'
                    ? 'Store Pickup (Free)'
                    : 'Home Delivery (Free)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Taxes & Packaging</span>
                <span className="text-[#582A00]/60">Included</span>
              </div>
            </div>

            {/* Total Row */}
            <div className="mt-3 pt-3 border-t-2 border-[#582A00]/15 flex items-baseline justify-between">
              <div>
                <span className="text-sm font-black text-[#582A00] block">Total Payable</span>
                <span className="text-[10px] text-[#582A00]/60">Inclusive of all taxes</span>
              </div>
              <span className="text-2xl sm:text-3xl font-black text-[#C42F2C]">
                ₹{grandTotal}
              </span>
            </div>

            {/* Customer & Location chip */}
            <div className="mt-3 pt-2.5 border-t border-[#582A00]/10 flex items-center justify-between text-[11px] text-[#582A00]/70 flex-wrap gap-1">
              <span>Customer: {orderState.name} ({orderState.phone})</span>
              <span>
                {orderState.deliveryMethod === 'pickup'
                  ? 'Fulfillment: Store Pickup (Railway Station)'
                  : `Fulfillment: Home Delivery (${orderState.city || 'Villupuram'})`}
              </span>
            </div>
          </div>

          {/* Primary CTA: Razorpay Payment Window */}
          <button
            onClick={handleRazorpayPay}
            disabled={submitting}
            className="w-full py-3.5 sm:py-4 bg-[#C42F2C] hover:bg-[#a82421] text-white rounded-xl font-black text-base sm:text-lg transition-all disabled:opacity-50 shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
          >
            {submitting ? (
              <span className="flex items-center gap-2 text-sm sm:text-base font-bold">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Connecting to Razorpay...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                <span>Pay ₹{grandTotal} with Razorpay</span>
              </span>
            )}
          </button>

          {/* Security & Accepted Payment Badges */}
          <div className="text-center space-y-1.5 pt-1">
            <p className="text-[11px] sm:text-xs text-[#582A00]/70 font-medium">
              Accepts <strong>Google Pay</strong>, <strong>PhonePe</strong>, <strong>Paytm</strong>, <strong>UPI</strong>, <strong>Cards</strong> & <strong>Netbanking</strong>
            </p>
            <div className="inline-flex items-center gap-1.5 text-[10px] text-[#582A00]/60 font-medium">
              <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>256-Bit SSL Encrypted · RBI Authorized Payment Gateway</span>
            </div>
          </div>

      {/* Payment Cancelled Modal matching Image 3 */}
      <AnimatePresence>
        {showCancelModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-7 max-w-sm sm:max-w-md w-full text-center space-y-4"
            >
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-500 border border-amber-200 flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#1F242D]">Payment Cancelled</h3>
              <p className="text-sm text-[#582A00]/75 leading-relaxed">
                Payment was cancelled. Your cart items have been restored — you can retry checkout.
              </p>
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="w-full py-3 bg-[#C42F2C] hover:bg-[#a82421] text-white rounded-xl font-bold text-base transition-colors shadow-md cursor-pointer active:scale-[0.99]"
              >
                OK
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
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
    deliveryMethod: 'delivery',
    street: '',
    city: 'Villupuram',
    pincode: '605602',
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
            <h1 className="text-2xl sm:text-3xl font-black text-[#582A00]">{t('order.title')}</h1>
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
                    deliveryMethod={state.deliveryMethod}
                    onDeliveryMethod={(m) => update('deliveryMethod', m)}
                    street={state.street}
                    city={state.city}
                    onStreet={(v) => update('street', v)}
                    onCity={(v) => update('city', v)}
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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[#C42F2C] font-bold">Loading...</div>}>
      <OrderPageContent />
    </Suspense>
  );
}
