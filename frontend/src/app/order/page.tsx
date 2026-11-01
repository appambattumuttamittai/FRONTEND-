'use client';
import { useState, useEffect, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { api, Product } from '@/lib/api';

// Steps
type Step = 'name' | 'phone' | 'quantity' | 'pickup' | 'payment';
const STEPS: Step[] = ['name', 'phone', 'quantity', 'pickup', 'payment'];

interface OrderState {
  name: string;
  phone: string;
  otpSessionId: string;
  phoneVerified: boolean;
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
  const labels = ['order.step.name', 'order.step.phone', 'order.step.quantity', 'order.step.pickup', 'order.step.payment'];
  return (
    <div className="flex items-center justify-center gap-1 mb-8 overflow-x-auto pb-2">
      {steps.map((_, i) => (
        <div key={i} className="flex items-center">
          <div className={`flex flex-col items-center min-w-[60px]`}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                i < current ? 'step-done' : i === current ? 'step-active' : 'step-pending'
              }`}
            >
              {i < current ? '✓' : i + 1}
            </div>
            <span className={`text-xs mt-1 text-center w-16 leading-tight hidden sm:block ${
              i === current ? 'text-[#063D20] font-semibold' : 'text-[#3A1C10]/50'
            }`}>
              {t(labels[i])}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`h-0.5 w-8 md:w-12 mx-1 rounded transition-all ${i < current ? 'bg-[#F5B51B]' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
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
    <div className="space-y-4">
      <h2 className="text-2xl font-black text-[#063D20]">{t('order.step.name')}</h2>
      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-[#3A1C10] mb-1.5">
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
          className="w-full px-4 py-3 rounded-xl border-2 border-[#063D20]/20 focus:border-[#063D20] outline-none text-base transition-colors"
        />
        {err && <p className="text-[#E95012] text-sm mt-1">{err}</p>}
      </div>
      <button
        onClick={submit}
        className="w-full py-4 bg-[#063D20] text-[#FFF4DD] rounded-xl font-bold text-lg hover:bg-[#0A512B] transition-colors"
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

  const verifyOtp = async () => {
    if (otp.length !== 6) { setOtpErr('Enter the 6-digit OTP'); return; }
    setLoading(true);
    try {
      await api.verifyOtp(phone.replace(/\D/g, ''), otp, sessionId);
      onVerified();
      toast.success(t('order.phone.verified'));
    } catch (err: any) {
      setOtpErr(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (verified) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-black text-[#063D20]">{t('order.step.phone')}</h2>
        <div className="flex items-center gap-3 p-4 bg-green-50 border-2 border-green-400 rounded-xl">
          <span className="text-2xl">✅</span>
          <div>
            <p className="font-bold text-green-700">{t('order.phone.verified')}</p>
            <p className="text-green-600 text-sm">+91 {phone.replace(/\D/g, '')}</p>
          </div>
        </div>
        <button
          onClick={onNext}
          className="w-full py-4 bg-[#063D20] text-[#FFF4DD] rounded-xl font-bold text-lg hover:bg-[#0A512B] transition-colors"
        >
          {t('order.next')} →
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-black text-[#063D20]">{t('order.step.phone')}</h2>
      <div>
        <label htmlFor="phone" className="block text-sm font-semibold text-[#3A1C10] mb-1.5">
          {t('order.phone.label')} *
        </label>
        <div className="flex gap-2">
          <div className="flex items-center px-3 py-3 bg-gray-100 border-2 border-gray-200 rounded-xl text-sm font-bold text-gray-600">
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
            className="flex-1 px-4 py-3 rounded-xl border-2 border-[#063D20]/20 focus:border-[#063D20] outline-none text-base transition-colors disabled:bg-gray-50"
            autoComplete="tel"
          />
        </div>
        {phoneErr && <p className="text-[#E95012] text-sm mt-1">{phoneErr}</p>}
      </div>

      {!otpSent ? (
        <button
          onClick={sendOtp}
          disabled={loading}
          className="w-full py-4 bg-[#063D20] text-[#FFF4DD] rounded-xl font-bold text-lg hover:bg-[#0A512B] transition-colors disabled:opacity-50"
        >
          {loading ? t('common.loading') : t('order.phone.send_otp')}
        </button>
      ) : (
        <div className="space-y-3">
          <div className="p-3 bg-[#F5B51B]/10 border border-[#F5B51B] rounded-xl text-sm text-center text-[#3A1C10]">
            📱 {t('order.phone.otp_sent')} +91 {phone}
          </div>
          <div>
            <label htmlFor="otp" className="block text-sm font-semibold text-[#3A1C10] mb-1.5">
              {t('order.phone.enter_otp')} *
            </label>
            <input
              id="otp"
              ref={otpRef}
              type="text"
              inputMode="numeric"
              value={otp}
              onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '').slice(0, 6)); setOtpErr(''); }}
              onKeyDown={(e) => e.key === 'Enter' && verifyOtp()}
              placeholder="_ _ _ _ _ _"
              maxLength={6}
              autoComplete="one-time-code"
              className="w-full px-4 py-4 rounded-xl border-2 border-[#063D20]/20 focus:border-[#063D20] outline-none text-center text-2xl font-black tracking-widest transition-colors"
            />
            {otpErr && <p className="text-[#E95012] text-sm mt-1 text-center">{otpErr}</p>}
          </div>
          <button
            onClick={verifyOtp}
            disabled={loading || otp.length !== 6}
            className="w-full py-4 bg-[#E95012] text-white rounded-xl font-bold text-lg hover:bg-[#c7400d] transition-colors disabled:opacity-50"
          >
            {loading ? t('common.loading') : t('order.phone.verify')}
          </button>
          <div className="text-center">
            {resendTimer > 0 ? (
              <p className="text-sm text-[#3A1C10]/50">Resend OTP in {resendTimer}s</p>
            ) : (
              <button onClick={sendOtp} className="text-sm text-[#063D20] font-semibold underline hover:no-underline">
                {t('order.phone.resend')}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Step 3: Quantity
function QuantityStep({ products, selected, onSelect, onNext, onBack }: {
  products: Product[]; selected: Product | null;
  onSelect: (p: Product) => void; onNext: () => void; onBack: () => void;
}) {
  const { t } = useLanguage();
  const icons = ['🍬', '🎁', '🧁', '👑'];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-black text-[#063D20]">{t('order.step.quantity')}</h2>
      <div className="grid grid-cols-2 gap-3">
        {products.map((p, i) => (
          <button
            key={p.id}
            onClick={() => p.inStock && onSelect(p)}
            disabled={!p.inStock}
            className={`p-4 rounded-2xl border-2 text-left transition-all ${
              selected?.id === p.id
                ? 'border-[#063D20] bg-[#063D20] text-[#FFF4DD] shadow-lg scale-[1.02]'
                : p.inStock
                ? 'border-gray-200 hover:border-[#063D20] hover:shadow-md'
                : 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
            }`}
          >
            <div className="text-2xl mb-1">{icons[i]}</div>
            <div className="font-bold text-base">{p.weight}</div>
            <div className={`font-black text-2xl ${selected?.id === p.id ? 'text-[#F5B51B]' : 'text-[#E95012]'}`}>
              ₹{p.price}
            </div>
            {!p.inStock && <div className="text-xs text-red-500 mt-1">{t('products.out_of_stock')}</div>}
          </button>
        ))}
      </div>
      <div className="flex gap-2 pt-2">
        <button onClick={onBack} className="flex-1 py-4 border-2 border-[#063D20] text-[#063D20] rounded-xl font-bold hover:bg-[#063D20] hover:text-[#FFF4DD] transition-colors">
          {t('order.back')}
        </button>
        <button
          onClick={onNext}
          disabled={!selected}
          className="flex-[2] py-4 bg-[#063D20] text-[#FFF4DD] rounded-xl font-bold text-lg hover:bg-[#0A512B] transition-colors disabled:opacity-40"
        >
          {t('order.next')} →
        </button>
      </div>
    </div>
  );
}

// Step 4: Pickup details
function PickupStep({ street, city, pincode, onStreet, onCity, onPincode, onNext, onBack }: {
  street: string; city: string; pincode: string;
  onStreet: (v: string) => void; onCity: (v: string) => void; onPincode: (v: string) => void;
  onNext: () => void; onBack: () => void;
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

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-black text-[#063D20]">{t('order.step.pickup')}</h2>

      <div className="bg-[#063D20]/5 border border-[#063D20]/20 rounded-xl p-3 text-sm text-[#063D20]">
        📍 {t('order.pickup.info')}
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#3A1C10] mb-1.5">{t('order.street.label')} *</label>
        <input
          type="text"
          value={street}
          onChange={(e) => { onStreet(e.target.value); setErrors((prev) => ({ ...prev, street: '' })); }}
          placeholder={t('order.street.placeholder')}
          className="w-full px-4 py-3 rounded-xl border-2 border-[#063D20]/20 focus:border-[#063D20] outline-none text-base transition-colors"
        />
        {errors.street && <p className="text-[#E95012] text-sm mt-1">{errors.street}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-semibold text-[#3A1C10] mb-1.5">{t('order.city.label')} *</label>
          <input
            type="text"
            value={city}
            onChange={(e) => { onCity(e.target.value); setErrors((prev) => ({ ...prev, city: '' })); }}
            className="w-full px-4 py-3 rounded-xl border-2 border-[#063D20]/20 focus:border-[#063D20] outline-none text-base transition-colors"
          />
          {errors.city && <p className="text-[#E95012] text-sm mt-1">{errors.city}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#3A1C10] mb-1.5">{t('order.pincode.label')}</label>
          <input
            type="text"
            inputMode="numeric"
            value={pincode}
            onChange={(e) => onPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="w-full px-4 py-3 rounded-xl border-2 border-[#063D20]/20 focus:border-[#063D20] outline-none text-base transition-colors"
          />
        </div>
      </div>

      <div className="bg-[#E95012]/10 border border-[#E95012]/30 rounded-xl p-3 text-sm">
        🚫 No delivery — Pickup only from Meenambur, Appambattu, Villupuram
      </div>

      <div className="flex gap-2 pt-2">
        <button onClick={onBack} className="flex-1 py-4 border-2 border-[#063D20] text-[#063D20] rounded-xl font-bold hover:bg-[#063D20] hover:text-[#FFF4DD] transition-colors">
          {t('order.back')}
        </button>
        <button onClick={submit} className="flex-[2] py-4 bg-[#063D20] text-[#FFF4DD] rounded-xl font-bold text-lg hover:bg-[#0A512B] transition-colors">
          {t('order.next')} →
        </button>
      </div>
    </div>
  );
}

// Step 5: Payment
function PaymentStep({ orderState, onBack, onSuccess }: {
  orderState: OrderState; onBack: () => void;
  onSuccess: (orderId: string) => void;
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
        const result = await api.createOrder({
          customerName: orderState.name,
          phone: orderState.phone.replace(/\D/g, ''),
          productId: orderState.selectedProduct!.id,
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
      router.push(`/order/success?orderId=${currentOrderId}`);
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

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-black text-[#063D20]">{t('order.step.payment')}</h2>

      {/* Order summary */}
      <div className="bg-[#063D20] text-[#FFF4DD] rounded-2xl p-5">
        <h3 className="text-[#F5B51B] font-bold text-sm mb-3">{t('order.summary')}</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span>Name</span><span className="font-semibold">{orderState.name}</span></div>
          <div className="flex justify-between"><span>Product</span><span className="font-semibold">{orderState.selectedProduct?.weight}</span></div>
          <div className="flex justify-between"><span>Pickup</span><span className="font-semibold">{orderState.city}</span></div>
          <div className="border-t border-[#FFF4DD]/20 my-2" />
          <div className="flex justify-between text-lg font-black">
            <span>{t('order.total')}</span>
            <span className="text-[#F5B51B]">₹{orderState.selectedProduct?.price}</span>
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
            className="w-full py-5 bg-[#25D366] text-white rounded-2xl font-black text-xl hover:bg-[#20bb5a] transition-all disabled:opacity-50 shadow-xl"
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
  const searchParams = useSearchParams();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [state, setState] = useState<OrderState>({
    name: '',
    phone: '',
    otpSessionId: '',
    phoneVerified: false,
    selectedProduct: null,
    street: '',
    city: '',
    pincode: '',
    orderId: '',
    totalAmount: 0,
    paymentExpiry: '',
  });

  useEffect(() => {
    api.getProducts().then((prods) => {
      setProducts(prods);
      const preselect = searchParams.get('product');
      if (preselect) {
        const found = prods.find((p) => p.id === preselect);
        if (found && found.inStock) setState((s) => ({ ...s, selectedProduct: found }));
      }
    }).catch(() => {});
  }, [searchParams]);

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
      <main className="py-8 px-4">
        <div className="max-w-lg mx-auto">
          {/* Page title */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-black text-[#063D20]">{t('order.title')}</h1>
            <p className="text-[#3A1C10]/60 text-sm mt-1">
              📍 Pickup from Meenambur, Villupuram only
            </p>
          </div>

          <StepIndicator current={step} steps={STEPS} />

          {/* Card */}
          <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 overflow-hidden">
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
                  <QuantityStep
                    products={products}
                    selected={state.selectedProduct}
                    onSelect={(p) => update('selectedProduct', p)}
                    onNext={nextStep}
                    onBack={prevStep}
                  />
                )}
                {step === 3 && (
                  <PickupStep
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
                {step === 4 && (
                  <PaymentStep
                    orderState={state}
                    onBack={prevStep}
                    onSuccess={(id) => router.push(`/order/success?orderId=${id}`)}
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
