import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, RefreshCw, AlertTriangle, CheckCircle2, Clock, XCircle, ExternalLink } from 'lucide-react';
import { useOrders } from '../context/OrderContext';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatters';
import { PaymentService, UpiPaymentSession } from '../services/paymentService';
import { PaymentLifecycleState } from '../types';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const { createOrder } = useOrders();
  const { clearCart } = useCart();

  const [checkoutData, setCheckoutData] = useState<any>(null);
  const [upiSession, setUpiSession] = useState<UpiPaymentSession | null>(null);
  const [lifecycleState, setLifecycleState] = useState<PaymentLifecycleState>('creating');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(600); // 10 minutes
  const [selectedApp, setSelectedApp] = useState<string | null>(null);

  // Load pending checkout data from sessionStorage
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('aurevya_pending_checkout');
      if (stored) {
        const parsed = JSON.parse(stored);
        setCheckoutData(parsed);
      } else {
        // Fallback for direct testing
        setCheckoutData({
          customer: {
            fullName: 'Ananya Sharma',
            email: 'ananya.sharma@example.com',
            phone: '9876543210',
          },
          address: {
            addressLine: 'Flat 402, Royal Palms Residences',
            addressLine2: 'Golf Course Road, Phase 5',
            city: 'Gurugram',
            state: 'Haryana',
            pincode: '122002',
          },
          pricing: {
            subtotal: 38500,
            discount: 3850,
            couponCode: 'AUREVYA10',
            shipping: 0,
            taxableAmount: 33641,
            gstAmount: 1009,
            total: 34650,
          },
          cartItems: [],
        });
      }
    } catch {
      navigate('/cart');
    }
  }, [navigate]);

  // Initialize UPI Session once checkoutData is available
  useEffect(() => {
    if (!checkoutData) return;

    let isMounted = true;
    const initSession = async () => {
      setLifecycleState('creating');
      const orderRef = `AUR-${Math.floor(100000 + Math.random() * 900000)}`;
      try {
        const session = await PaymentService.createUpiSession(orderRef, checkoutData.pricing.total);
        if (isMounted) {
          setUpiSession(session);
          setLifecycleState('awaiting_payment');
          setTimeLeftSeconds(session.expiresInSeconds);
        }
      } catch {
        if (isMounted) {
          setLifecycleState('failed');
          setErrorMessage('Could not initialize payment session with payment service.');
        }
      }
    };

    initSession();

    return () => {
      isMounted = false;
    };
  }, [checkoutData]);

  // Session expiry countdown
  useEffect(() => {
    if (lifecycleState !== 'awaiting_payment') return;
    if (timeLeftSeconds <= 0) {
      setLifecycleState('failed');
      setErrorMessage('Payment session timed out. Please restart the checkout process.');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [lifecycleState, timeLeftSeconds]);

  // Handle server-side payment verification simulation
  const handleVerifyOutcome = async (outcome: 'success' | 'failure' | 'timeout') => {
    if (!upiSession) return;

    setLifecycleState('verifying');
    setErrorMessage(null);

    try {
      const verification = await PaymentService.verifyPayment(upiSession.transactionId, outcome);

      if (verification.success && verification.state === 'successful') {
        setLifecycleState('successful');

        // Create finalized order in OrderContext
        const newOrder = createOrder({
          customer: checkoutData.customer,
          deliveryAddress: checkoutData.address,
          items:
            checkoutData.cartItems && checkoutData.cartItems.length > 0
              ? checkoutData.cartItems.map((item: any) => ({
                  productId: item.productId,
                  productName: item.product.name,
                  slug: item.product.slug,
                  image: item.product.images[0],
                  unitPrice: item.unitPrice,
                  quantity: item.quantity,
                  selectedVariant: item.selectedVariant,
                }))
              : [
                  {
                    productId: 'aur-001',
                    productName: 'Padmavati Kundan Choker Suite',
                    slug: 'padmavati-kundan-choker-suite',
                    image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=800&q=80',
                    unitPrice: checkoutData.pricing.total,
                    quantity: 1,
                  },
                ],
          pricing: checkoutData.pricing,
          payment: {
            method: 'upi',
            status: 'completed',
            transactionId: verification.transactionId,
            isDemo: true,
            paidAt: verification.paidAt || new Date().toISOString(),
            upiAppUsed: selectedApp || 'GPay (Simulated)',
            lifecycleState: 'successful',
          },
          estimatedDeliveryDate: 'Within 3-4 Business Days',
          notifications: {
            sms: 'simulated_sent',
            email: 'simulated_sent',
            whatsapp: 'simulated_sent',
          },
        });

        sessionStorage.removeItem('aurevya_pending_checkout');
        clearCart();

        // Brief delay for user to absorb success state before navigation
        setTimeout(() => {
          navigate(`/order-success?orderId=${newOrder.id}`);
        }, 1200);
      } else if (verification.state === 'verification_pending') {
        setLifecycleState('verification_pending');
        setErrorMessage(verification.message);
      } else {
        setLifecycleState('failed');
        setErrorMessage(verification.message || 'Payment was declined by simulated banking partner.');
      }
    } catch {
      setLifecycleState('failed');
      setErrorMessage('Communication error while verifying bank gateway response.');
    }
  };

  // Handle user cancellation
  const handleCancelPayment = async () => {
    if (!upiSession) return;
    try {
      const res = await PaymentService.cancelSession(upiSession.transactionId);
      setLifecycleState(res.state);
      setErrorMessage('Payment session was safely cancelled by patron.');
    } catch {
      setLifecycleState('cancelled');
    }
  };

  // Handle retry
  const handleRetryPayment = async () => {
    if (!checkoutData) return;
    setLifecycleState('creating');
    setErrorMessage(null);
    try {
      const orderRef = `AUR-${Math.floor(100000 + Math.random() * 900000)}`;
      const session = await PaymentService.createUpiSession(orderRef, checkoutData.pricing.total);
      setUpiSession(session);
      setLifecycleState('awaiting_payment');
      setTimeLeftSeconds(session.expiresInSeconds);
    } catch {
      setLifecycleState('failed');
      setErrorMessage('Could not restart payment session.');
    }
  };

  // Format countdown minutes & seconds
  const minutes = Math.floor(timeLeftSeconds / 60);
  const seconds = timeLeftSeconds % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const breadcrumbs = [
    { label: 'Shopping Bag', to: '/cart' },
    { label: 'Checkout', to: '/checkout' },
    { label: 'UPI Payment Gateway' },
  ];

  const upiApps = [
    { name: 'Google Pay', icon: '🔵', scheme: 'gpay' },
    { name: 'PhonePe', icon: '🟣', scheme: 'phonepe' },
    { name: 'Paytm UPI', icon: '🔷', scheme: 'paytm' },
    { name: 'BHIM UPI', icon: '🇮🇳', scheme: 'bhim' },
    { name: 'Cred UPI', icon: '⚪', scheme: 'cred' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={breadcrumbs} />

      {/* Top Brand & Safety Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E8E2D9] mb-8 gap-3">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#A88955] font-semibold block">
            AUREVYA ATELIER UPI GATEWAY
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#292722] font-light">
            UPI Payment Portal
          </h1>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#3D6847] bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-[#3D6847]" />
          <span>Server Verified • Zero Sensitive Credential Storage</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column: UPI Payment Terminal (7 cols) */}
        <div className="md:col-span-7 bg-white border border-[#E8E2D9] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          {/* Header Status */}
          <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D9]">
            <div>
              <p className="text-[11px] uppercase tracking-wider font-bold text-stone-500">
                Payment Status
              </p>
              <div className="flex items-center gap-2 mt-1">
                {lifecycleState === 'creating' && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600">
                    <span className="w-2 h-2 rounded-full bg-stone-400 animate-ping"></span>
                    Initializing Gateway Session...
                  </span>
                )}
                {lifecycleState === 'awaiting_payment' && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                    Awaiting UPI Payment
                  </span>
                )}
                {lifecycleState === 'verifying' && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Verifying with Banking Network...
                  </span>
                )}
                {lifecycleState === 'successful' && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Payment Settled Successfully
                  </span>
                )}
                {lifecycleState === 'failed' && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-700">
                    <XCircle className="w-4 h-4 text-red-600" />
                    Payment Failed
                  </span>
                )}
                {lifecycleState === 'cancelled' && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600">
                    <AlertTriangle className="w-4 h-4 text-stone-500" />
                    Payment Cancelled
                  </span>
                )}
                {lifecycleState === 'verification_pending' && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800">
                    <Clock className="w-4 h-4 text-amber-600" />
                    Bank Verification Pending
                  </span>
                )}
              </div>
            </div>

            {lifecycleState === 'awaiting_payment' && (
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Session Expires In</span>
                <span className="font-mono text-sm font-bold text-[#A88955] flex items-center justify-end gap-1">
                  <Clock className="w-3.5 h-3.5" /> {timeFormatted}
                </span>
              </div>
            )}
          </div>

          {/* STATE: CREATING */}
          {lifecycleState === 'creating' && (
            <div className="py-12 text-center space-y-3">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#A88955]" />
              <p className="text-xs text-stone-600 font-medium">Generating encrypted payment request & dynamic QR...</p>
            </div>
          )}

          {/* STATE: AWAITING PAYMENT (QR & Deep Links) */}
          {(lifecycleState === 'awaiting_payment' || lifecycleState === 'verification_pending') && (
            <div className="space-y-6">
              {/* Dynamic QR Display Area */}
              <div className="bg-[#FAF8F5] border border-[#E8E2D9] rounded-2xl p-6 text-center space-y-3">
                <div className="relative inline-block p-4 bg-white rounded-xl shadow-xs border border-[#E8E2D9]">
                  {/* Visual simulated QR code representation */}
                  <svg className="w-44 h-44 mx-auto" viewBox="0 0 160 160" fill="none">
                    <rect width="160" height="160" fill="white" />
                    {/* Top-left corner box */}
                    <rect x="12" y="12" width="40" height="40" fill="#292722" />
                    <rect x="18" y="18" width="28" height="28" fill="white" />
                    <rect x="24" y="24" width="16" height="16" fill="#A88955" />
                    {/* Top-right corner box */}
                    <rect x="108" y="12" width="40" height="40" fill="#292722" />
                    <rect x="114" y="18" width="28" height="28" fill="white" />
                    <rect x="120" y="24" width="16" height="16" fill="#A88955" />
                    {/* Bottom-left corner box */}
                    <rect x="12" y="108" width="40" height="40" fill="#292722" />
                    <rect x="18" y="114" width="28" height="28" fill="white" />
                    <rect x="24" y="120" width="16" height="16" fill="#A88955" />
                    {/* Inner QR patterns */}
                    <rect x="60" y="16" width="12" height="12" fill="#292722" />
                    <rect x="76" y="20" width="16" height="8" fill="#292722" />
                    <rect x="64" y="36" width="16" height="16" fill="#292722" />
                    <rect x="84" y="44" width="12" height="12" fill="#292722" />
                    <rect x="20" y="64" width="16" height="12" fill="#292722" />
                    <rect x="44" y="60" width="12" height="24" fill="#292722" />
                    <rect x="64" y="64" width="32" height="32" fill="#292722" rx="4" />
                    <circle cx="80" cy="80" r="10" fill="#F8F6F1" />
                    <text x="80" y="84" textAnchor="middle" fill="#A88955" fontSize="11" fontWeight="bold">AUR</text>
                    <rect x="104" y="64" width="16" height="12" fill="#292722" />
                    <rect x="128" y="68" width="16" height="16" fill="#292722" />
                    <rect x="60" y="104" width="16" height="16" fill="#292722" />
                    <rect x="84" y="112" width="20" height="12" fill="#292722" />
                    <rect x="112" y="108" width="12" height="24" fill="#292722" />
                    <rect x="132" y="116" width="16" height="16" fill="#292722" />
                  </svg>

                  {/* Sandbox Banner Overlay */}
                  <div className="mt-2 inline-block px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-950 text-[10px] font-bold uppercase tracking-wider">
                    Sandbox Demo QR • Do Not Pay Real Money
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-stone-900 font-semibold">
                    Scan with any UPI app on your phone
                  </p>
                  <p className="text-[11px] text-stone-500 font-mono">
                    Merchant VPA: <span className="text-stone-800 font-bold">{upiSession?.upiVpa}</span>
                  </p>
                  <p className="text-[11px] text-stone-500">
                    Payee: <strong>AUREVYA Fine Jewellery Atelier</strong> • Ref: <strong>{upiSession?.orderReference}</strong>
                  </p>
                </div>
              </div>

              {/* Supported UPI Apps Direct Intent */}
              <div>
                <p className="text-xs uppercase tracking-wider font-semibold text-stone-700 mb-2">
                  Or Pay Directly Using Supported UPI App:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {upiApps.map((app) => (
                    <button
                      key={app.name}
                      type="button"
                      onClick={() => {
                        setSelectedApp(app.name);
                        // Trigger simulation flow
                        handleVerifyOutcome('success');
                      }}
                      className="p-2.5 rounded-xl border border-[#E8E2D9] bg-white hover:border-[#A88955] hover:bg-[#FAF8F5] transition-all text-xs font-medium text-stone-800 flex items-center gap-2 text-left"
                    >
                      <span className="text-base">{app.icon}</span>
                      <span className="truncate">{app.name}</span>
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-stone-400 mt-1.5 text-center">
                  * Clicking a UPI app option initiates server-side payment verification in demo mode.
                </p>
              </div>

              {/* Instructions */}
              <div className="p-4 bg-[#FAF5EB] rounded-xl border border-[#E8E2D9] text-xs text-stone-600 space-y-2">
                <p className="font-semibold text-stone-900 text-xs">Steps to Complete Payment:</p>
                <ol className="list-decimal pl-4 space-y-1 text-[11px] leading-relaxed">
                  <li>Open your preferred UPI app (Google Pay, PhonePe, Paytm, or BHIM).</li>
                  <li>Scan the dynamic QR code displayed on screen.</li>
                  <li>Review the merchant name (<strong>AUREVYA Fine Jewellery</strong>) and exact payable total.</li>
                  <li>In this demo environment, test the gateway simulation buttons below.</li>
                </ol>
              </div>

              {/* Simulated Gateway Testing Controls (Explicit Sandbox Actions) */}
              <div className="pt-4 border-t border-[#E8E2D9] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider font-semibold text-stone-800">
                    Simulate Bank Webhook Outcomes:
                  </span>
                  <span className="text-[10px] font-bold text-amber-700 uppercase bg-amber-50 px-2 py-0.5 rounded">
                    Demo Mode
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    onClick={() => handleVerifyOutcome('success')}
                    className="py-3 px-3 rounded-xl bg-[#3D6847] hover:bg-[#2F5237] text-white text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Simulate Success</span>
                  </button>

                  <button
                    onClick={() => handleVerifyOutcome('failure')}
                    className="py-3 px-3 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Simulate Failure</span>
                  </button>

                  <button
                    onClick={() => handleVerifyOutcome('timeout')}
                    className="py-3 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 border border-stone-300"
                  >
                    <Clock className="w-4 h-4" />
                    <span>Simulate Pending</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STATE: VERIFYING */}
          {lifecycleState === 'verifying' && (
            <div className="py-12 text-center space-y-4">
              <RefreshCw className="w-10 h-10 animate-spin mx-auto text-[#A88955]" />
              <div>
                <h3 className="font-serif text-lg font-semibold text-stone-900">
                  Verifying Payment with Banking Partner
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Awaiting asynchronous webhook settlement confirmation. Please do not refresh.
                </p>
              </div>
            </div>
          )}

          {/* STATE: SUCCESSFUL */}
          {lifecycleState === 'successful' && (
            <div className="py-12 text-center space-y-4 animate-fade-in">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-2xl font-bold">
                ✓
              </div>
              <div>
                <h3 className="font-serif text-xl font-semibold text-stone-900">
                  Payment Verified Successfully!
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Order registered in atelier system. Redirecting to your confirmation & tax invoice...
                </p>
              </div>
            </div>
          )}

          {/* STATE: FAILED */}
          {lifecycleState === 'failed' && (
            <div className="space-y-5 animate-fade-in">
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-900 space-y-2">
                <div className="flex items-center gap-2 font-bold text-red-800 text-sm">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <span>Payment Could Not Be Verified</span>
                </div>
                <p className="text-xs leading-relaxed text-red-800">
                  {errorMessage || 'The payment gateway reported a timeout or bank decline.'}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleRetryPayment}
                  className="flex-1 py-3.5 px-4 rounded-xl bg-[#292722] hover:bg-[#A88955] text-white text-xs uppercase font-semibold tracking-wider transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Retry Payment</span>
                </button>
                <button
                  onClick={() => navigate('/checkout')}
                  className="py-3.5 px-4 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50 transition-colors"
                >
                  Change Payment Method
                </button>
              </div>
            </div>
          )}

          {/* STATE: CANCELLED */}
          {lifecycleState === 'cancelled' && (
            <div className="space-y-5 animate-fade-in">
              <div className="p-4 rounded-xl bg-stone-100 border border-stone-200 text-xs text-stone-700 space-y-1">
                <p className="font-bold text-stone-900">Payment Cancelled</p>
                <p>This transaction has been terminated safely. No funds were captured.</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleRetryPayment}
                  className="flex-1 py-3.5 px-4 rounded-xl bg-[#292722] text-white text-xs uppercase font-semibold tracking-wider hover:bg-[#A88955]"
                >
                  Restart Payment
                </button>
                <button
                  onClick={() => navigate('/checkout')}
                  className="py-3.5 px-4 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50"
                >
                  Back to Checkout
                </button>
              </div>
            </div>
          )}

          {/* Action Footer for cancel / return */}
          {lifecycleState === 'awaiting_payment' && (
            <div className="pt-4 border-t border-[#E8E2D9] flex items-center justify-between text-xs">
              <button
                onClick={handleCancelPayment}
                className="text-stone-500 hover:text-red-700 font-medium transition-colors"
              >
                Cancel Payment Session
              </button>
              <Link
                to="/checkout"
                className="text-stone-500 hover:text-stone-900 font-medium flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Checkout
              </Link>
            </div>
          )}
        </div>

        {/* Right Column: Order Summary & Customer Details (5 cols) */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-white border border-[#E8E2D9] rounded-2xl p-6 shadow-xs space-y-5">
            <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-stone-900 pb-3 border-b border-[#E8E2D9]">
              Transaction Details
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Unique Order Ref</span>
                <span className="font-mono font-bold text-stone-900">
                  {upiSession?.orderReference || 'Generating...'}
                </span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Transaction Ref</span>
                <span className="font-mono text-stone-700">
                  {upiSession?.transactionId || 'Pending'}
                </span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Recipient Name</span>
                <span className="font-medium text-stone-900">{checkoutData?.customer?.fullName}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Shipping City</span>
                <span className="text-stone-900">{checkoutData?.address?.city}, {checkoutData?.address?.pincode}</span>
              </div>

              {/* Price Calculation */}
              <div className="pt-3 border-t border-stone-200 space-y-1.5">
                <div className="flex justify-between text-stone-600">
                  <span>Gross Subtotal</span>
                  <span>{formatCurrency(checkoutData?.pricing?.subtotal || 0)}</span>
                </div>
                {checkoutData?.pricing?.discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount</span>
                    <span>- {formatCurrency(checkoutData.pricing.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-600">
                  <span>Insured Shipping</span>
                  <span>Complimentary</span>
                </div>
                <div className="flex justify-between text-[11px] text-stone-500">
                  <span>Applicable GST (3%)</span>
                  <span>{formatCurrency(checkoutData?.pricing?.gstAmount || 0)}</span>
                </div>
                <div className="pt-2 border-t border-stone-300 flex justify-between text-base font-bold text-stone-900">
                  <span>Payable Total</span>
                  <span className="font-serif text-lg text-[#A88955]">
                    {formatCurrency(checkoutData?.pricing?.total || 0)}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 text-[11px] text-stone-500 space-y-1">
              <p className="flex items-center gap-1.5 text-stone-700 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-[#A88955]" />
                Bank-Grade 256-Bit Encryption
              </p>
              <p>UPI PIN is entered only in your official bank app, never on this website.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
