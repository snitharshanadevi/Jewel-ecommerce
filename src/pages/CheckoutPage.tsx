import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Lock, Check, ChevronLeft, Plus, MapPin, Edit3, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatters';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { checkPincodeDelivery } from '../utils/pincodeChecker';
import { DeliveryAddress, SavedAddress, PaymentMethod } from '../types';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems, pricing, clearCart } = useCart();
  const { createOrder } = useOrders();
  const { user, isAuthenticated, openAuthModal, saveAddress } = useAuth();

  // Redirect if cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <h2 className="font-serif-luxury text-2xl text-[#292722]">Your Shopping Bag is Empty</h2>
        <p className="text-xs text-[#77736B] mt-2 mb-6">
          Please add fine jewellery pieces to your bag before proceeding to checkout.
        </p>
        <Link
          to="/collections"
          className="px-6 py-3 bg-[#A88955] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#8F7241] transition-colors"
        >
          Return to Collections
        </Link>
      </div>
    );
  }

  // Stepper: 1: Delivery Address, 2: Review Order, 3: Payment Choice
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Address selection state
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [isAddingNewAddress, setIsAddingNewAddress] = useState<boolean>(false);
  const [isEditingAddress, setIsEditingAddress] = useState<boolean>(false);
  const [saveToAccountConsent, setSaveToAccountConsent] = useState(true);

  // Customer Contact State
  const [customer, setCustomer] = useState({
    fullName: user?.fullName || 'Ananya Sharma',
    email: user?.email || 'ananya.sharma@example.com',
    phone: user?.phone || '9876543210',
  });

  // Current active delivery address form
  const [addressForm, setAddressForm] = useState<DeliveryAddress & { label?: 'Home' | 'Work' | 'Other' }>({
    addressLine: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    deliveryInstructions: '',
    label: 'Home',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync user details on login or mount
  useEffect(() => {
    if (user) {
      setCustomer({
        fullName: user.fullName || 'Ananya Sharma',
        email: user.email || 'ananya.sharma@example.com',
        phone: user.phone || '9876543210',
      });

      if (user.savedAddresses && user.savedAddresses.length > 0) {
        const defaultAddr = user.savedAddresses.find((a) => a.isDefault) || user.savedAddresses[0];
        setSelectedAddressId(defaultAddr.id);
        setAddressForm({
          addressLine: defaultAddr.addressLine,
          addressLine2: defaultAddr.addressLine2 || '',
          city: defaultAddr.city,
          state: defaultAddr.state,
          pincode: defaultAddr.pincode,
          landmark: defaultAddr.landmark || '',
          deliveryInstructions: defaultAddr.deliveryInstructions || '',
          label: defaultAddr.label || 'Home',
        });
        setIsAddingNewAddress(false);
      } else {
        setIsAddingNewAddress(true);
      }
    } else {
      setIsAddingNewAddress(true);
    }
  }, [user]);

  // When selected address changes from saved addresses list
  const handleSelectSavedAddress = (saved: SavedAddress) => {
    setSelectedAddressId(saved.id);
    setIsAddingNewAddress(false);
    setIsEditingAddress(false);
    setAddressForm({
      addressLine: saved.addressLine,
      addressLine2: saved.addressLine2 || '',
      city: saved.city,
      state: saved.state,
      pincode: saved.pincode,
      landmark: saved.landmark || '',
      deliveryInstructions: saved.deliveryInstructions || '',
      label: saved.label || 'Home',
    });
    setErrors({});
  };

  const handlePincodeChange = (pincode: string) => {
    const clean = pincode.replace(/\D/g, '').slice(0, 6);
    setAddressForm((prev) => ({ ...prev, pincode: clean }));
    if (clean.length === 6) {
      const res = checkPincodeDelivery(clean);
      if (res.isValid && res.city && res.state) {
        setAddressForm((prev) => ({
          ...prev,
          city: res.city || prev.city,
          state: res.state || prev.state,
        }));
      }
    }
  };

  // Validation
  const validateAddress = () => {
    const errs: Record<string, string> = {};
    if (!customer.fullName.trim()) errs.fullName = 'Full name is required';
    if (!customer.email.trim() || !/^\S+@\S+\.\S+$/.test(customer.email)) {
      errs.email = 'Valid email is required for tracking and invoice';
    }
    if (!customer.phone.trim() || customer.phone.replace(/\D/g, '').length !== 10) {
      errs.phone = 'Valid 10-digit mobile number required for OTP verification';
    }

    if (!addressForm.addressLine.trim()) errs.addressLine = 'Flat / House number and street is required';
    if (!addressForm.city.trim()) errs.city = 'City is required';
    if (!addressForm.state.trim()) errs.state = 'State is required';
    if (!addressForm.pincode.trim() || addressForm.pincode.length !== 6) {
      errs.pincode = 'Valid 6-digit Indian PIN code is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveAndContinueToReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAddress()) return;

    // If customer consented to save address
    if (saveToAccountConsent && isAuthenticated) {
      const newSavedAddr: SavedAddress = {
        id: isEditingAddress && selectedAddressId ? selectedAddressId : `addr-${Date.now()}`,
        label: addressForm.label || 'Home',
        recipientName: customer.fullName,
        recipientPhone: customer.phone,
        addressLine: addressForm.addressLine,
        addressLine2: addressForm.addressLine2,
        city: addressForm.city,
        state: addressForm.state,
        pincode: addressForm.pincode,
        landmark: addressForm.landmark,
        deliveryInstructions: addressForm.deliveryInstructions,
        isDefault: user?.savedAddresses.length === 0,
      };
      saveAddress(newSavedAddr);
      setSelectedAddressId(newSavedAddr.id);
      setIsAddingNewAddress(false);
      setIsEditingAddress(false);
    }

    setCurrentStep(2);
  };

  // 3% GST Breakdown calculation
  const gstAmount = Math.round((pricing.total * 3) / 103);
  const taxableAmount = pricing.total - gstAmount;
  const cgst = Math.round(gstAmount / 2);
  const sgst = gstAmount - cgst;

  const handleProceedToPayment = () => {
    if (paymentMethod === 'cod') {
      setIsSubmitting(true);
      const newOrder = createOrder({
        customer,
        deliveryAddress: addressForm,
        items: cartItems.map((item) => ({
          productId: item.productId,
          productName: item.product.name,
          slug: item.product.slug,
          image: item.product.images[0],
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          selectedVariant: item.selectedVariant,
        })),
        pricing: {
          ...pricing,
          taxableAmount,
          gstAmount,
        },
        payment: {
          method: 'cod',
          status: 'pending',
          transactionId: `DEMO-COD-${Math.floor(10000000 + Math.random() * 90000000)}`,
          isDemo: true,
        },
        estimatedDeliveryDate: 'Within 3-4 Business Days',
        notifications: {
          sms: 'simulated_sent',
          email: 'simulated_sent',
          whatsapp: 'simulated_sent',
        },
      });

      clearCart();
      setIsSubmitting(false);
      navigate(`/order-success?orderId=${newOrder.id}`);
    } else {
      // UPI Payment route
      const pendingPayload = {
        customer,
        address: addressForm,
        paymentMethod: 'upi',
        cartItems,
        pricing: {
          ...pricing,
          taxableAmount,
          gstAmount,
        },
      };
      sessionStorage.setItem('aurevya_pending_checkout', JSON.stringify(pendingPayload));
      navigate('/payment');
    }
  };

  const breadcrumbs = [
    { label: 'Shopping Bag', to: '/cart' },
    { label: 'Atelier Checkout' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={breadcrumbs} />

      {/* Header with Luxury Brand Touch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E8E2D9] mb-8 gap-3">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#A88955] font-semibold block">
            AUREVYA ATELIER SECURE CHECKOUT
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#292722] font-light">
            Customer Checkout & Shipping
          </h1>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#3D6847] bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 self-start sm:self-auto">
          <Lock className="w-3.5 h-3.5" />
          <span className="font-medium">Insured Delivery & Sandbox Payment</span>
        </div>
      </div>

      {/* Guest Authentication Banner if not signed in */}
      {!isAuthenticated && (
        <div className="mb-8 p-5 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="text-xl">📱</span>
            <div>
              <h2 className="text-sm font-semibold text-amber-950 font-serif">
                Mobile OTP Verification Recommended
              </h2>
              <p className="text-xs text-amber-800 mt-0.5">
                Sign in with your 10-digit mobile number to access saved addresses and synchronized jewellery orders.
              </p>
            </div>
          </div>
          <button
            onClick={() => openAuthModal()}
            className="px-5 py-2.5 rounded-xl bg-[#292722] text-[#F8F6F1] text-xs uppercase font-semibold tracking-wider hover:bg-[#A88955] transition-colors shrink-0 shadow-sm"
          >
            Verify Mobile (+91)
          </button>
        </div>
      )}

      {/* Checkout Progress Stepper */}
      <div className="mb-10 max-w-2xl mx-auto">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-[#E8E2D9] w-full z-0" />
          {[
            { num: 1, label: '1. Shipping Address' },
            { num: 2, label: '2. Order Review' },
            { num: 3, label: '3. Payment Mode' },
          ].map((s) => {
            const isCompleted = currentStep > s.num;
            const isCurrent = currentStep === s.num;
            return (
              <div key={s.num} className="relative z-10 flex flex-col items-center">
                <button
                  type="button"
                  disabled={s.num > currentStep}
                  onClick={() => setCurrentStep(s.num as any)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                    isCompleted
                      ? 'bg-[#3D6847] text-white'
                      : isCurrent
                      ? 'bg-[#A88955] text-white ring-4 ring-[#EDE4D8]'
                      : 'bg-[#FAF5EB] border border-[#E8E2D9] text-stone-500'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : s.num}
                </button>
                <span className="text-[11px] uppercase tracking-wider text-stone-600 mt-1.5 font-medium">
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Column (7 cols on lg) */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-[#E8E2D9] rounded-2xl p-6 sm:p-8 shadow-xs">
            {/* STEP 1: Address Selection & Details Form */}
            {currentStep === 1 && (
              <form onSubmit={handleSaveAndContinueToReview} className="space-y-6">
                <div className="pb-4 border-b border-[#E8E2D9]">
                  <h2 className="font-serif text-lg font-semibold text-[#292722]">
                    Customer & Shipping Destination
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Jewels are delivered in tamper-evident sealed packaging requiring signature or delivery OTP.
                  </p>
                </div>

                {/* Recipient Details */}
                <div className="space-y-4">
                  <h3 className="text-xs uppercase tracking-wider font-semibold text-stone-700">
                    Recipient Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={customer.fullName}
                        onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                        placeholder="e.g. Ananya Sharma"
                        className="w-full bg-[#FAF8F5] border border-[#E8E2D9] px-3.5 py-2.5 text-xs text-[#292722] rounded-xl focus:outline-none focus:border-[#A88955]"
                        required
                      />
                      {errors.fullName && <p className="text-[11px] text-red-600 mt-1">{errors.fullName}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Mobile Number * (10 Digits)
                      </label>
                      <div className="flex rounded-xl border border-[#E8E2D9] bg-[#FAF8F5] overflow-hidden focus-within:border-[#A88955]">
                        <span className="px-3 py-2.5 text-xs bg-[#EDE4D8]/30 text-stone-600 border-r border-[#E8E2D9]">
                          +91
                        </span>
                        <input
                          type="tel"
                          value={customer.phone}
                          onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                          placeholder="9876543210"
                          maxLength={10}
                          className="flex-1 bg-transparent px-3 py-2.5 text-xs text-[#292722] focus:outline-none"
                          required
                        />
                      </div>
                      {errors.phone && <p className="text-[11px] text-red-600 mt-1">{errors.phone}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Email Address * (For Tax Invoice & BlueDart Tracking)
                    </label>
                    <input
                      type="email"
                      value={customer.email}
                      onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                      placeholder="ananya.sharma@example.com"
                      className="w-full bg-[#FAF8F5] border border-[#E8E2D9] px-3.5 py-2.5 text-xs text-[#292722] rounded-xl focus:outline-none focus:border-[#A88955]"
                      required
                    />
                    {errors.email && <p className="text-[11px] text-red-600 mt-1">{errors.email}</p>}
                  </div>
                </div>

                {/* Saved Address Cards (if available) */}
                {user?.savedAddresses && user.savedAddresses.length > 0 && !isAddingNewAddress && (
                  <div className="pt-4 border-t border-[#E8E2D9] space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs uppercase tracking-wider font-semibold text-stone-700">
                        Select a Saved Address
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingNewAddress(true);
                          setAddressForm({
                            addressLine: '',
                            addressLine2: '',
                            city: '',
                            state: '',
                            pincode: '',
                            landmark: '',
                            deliveryInstructions: '',
                            label: 'Home',
                          });
                        }}
                        className="text-xs text-[#A88955] hover:underline font-semibold flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add New Address
                      </button>
                    </div>

                    <div className="space-y-3">
                      {user.savedAddresses.map((addr) => {
                        const isSelected = selectedAddressId === addr.id;
                        return (
                          <div
                            key={addr.id}
                            onClick={() => handleSelectSavedAddress(addr)}
                            className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                              isSelected
                                ? 'border-[#A88955] bg-[#FAF8F5] ring-2 ring-[#A88955]/30'
                                : 'border-[#E8E2D9] hover:border-stone-400 bg-white'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <input
                                type="radio"
                                name="savedAddressRadio"
                                checked={isSelected}
                                onChange={() => handleSelectSavedAddress(addr)}
                                className="mt-1 text-[#A88955] focus:ring-[#A88955]"
                              />
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-stone-900">
                                    {addr.recipientName || customer.fullName}
                                  </span>
                                  {addr.label && (
                                    <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-[#EDE4D8]/50 text-stone-700">
                                      {addr.label}
                                    </span>
                                  )}
                                  {addr.isDefault && (
                                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                                      Default
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                                  {addr.addressLine}
                                  {addr.addressLine2 ? `, ${addr.addressLine2}` : ''}
                                  <br />
                                  {addr.city}, {addr.state} — {addr.pincode}
                                </p>
                                {addr.landmark && (
                                  <p className="text-[11px] text-stone-500 mt-0.5">
                                    Landmark: {addr.landmark}
                                  </p>
                                )}
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectSavedAddress(addr);
                                setIsEditingAddress(true);
                                setIsAddingNewAddress(true);
                              }}
                              className="text-stone-400 hover:text-stone-800 p-1 rounded-md"
                              title="Edit address"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Form fields for Address (shown when adding new, editing, or no saved addresses) */}
                {(isAddingNewAddress || !user?.savedAddresses || user.savedAddresses.length === 0) && (
                  <div className="pt-4 border-t border-[#E8E2D9] space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs uppercase tracking-wider font-semibold text-stone-700">
                        {isEditingAddress ? 'Edit Address' : 'New Delivery Address Details'}
                      </h3>
                      {user?.savedAddresses && user.savedAddresses.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingNewAddress(false);
                            setIsEditingAddress(false);
                          }}
                          className="text-xs text-stone-500 hover:underline"
                        >
                          Cancel & Select Saved Address
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-stone-700 mb-1">
                          PIN Code * (6 Digits)
                        </label>
                        <input
                          type="text"
                          value={addressForm.pincode}
                          onChange={(e) => handlePincodeChange(e.target.value)}
                          placeholder="e.g. 110001, 600018, 400051"
                          maxLength={6}
                          className="w-full bg-[#FAF8F5] border border-[#E8E2D9] px-3.5 py-2.5 text-xs text-[#292722] rounded-xl focus:outline-none focus:border-[#A88955]"
                          required
                        />
                        {errors.pincode && <p className="text-[11px] text-red-600 mt-1">{errors.pincode}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-stone-700 mb-1">
                          Address Type
                        </label>
                        <select
                          value={addressForm.label}
                          onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value as any })}
                          className="w-full bg-[#FAF8F5] border border-[#E8E2D9] px-3.5 py-2.5 text-xs text-[#292722] rounded-xl focus:outline-none focus:border-[#A88955]"
                        >
                          <option value="Home">Home (Personal Residence)</option>
                          <option value="Work">Work (Office / Studio)</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Flat, House No., Building, Apartment *
                      </label>
                      <input
                        type="text"
                        value={addressForm.addressLine}
                        onChange={(e) => setAddressForm({ ...addressForm, addressLine: e.target.value })}
                        placeholder="e.g. Flat 402, Royal Palms Residences"
                        className="w-full bg-[#FAF8F5] border border-[#E8E2D9] px-3.5 py-2.5 text-xs text-[#292722] rounded-xl focus:outline-none focus:border-[#A88955]"
                        required
                      />
                      {errors.addressLine && <p className="text-[11px] text-red-600 mt-1">{errors.addressLine}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Street Address, Sector, Area
                      </label>
                      <input
                        type="text"
                        value={addressForm.addressLine2}
                        onChange={(e) => setAddressForm({ ...addressForm, addressLine2: e.target.value })}
                        placeholder="e.g. Golf Course Road, Phase 5"
                        className="w-full bg-[#FAF8F5] border border-[#E8E2D9] px-3.5 py-2.5 text-xs text-[#292722] rounded-xl focus:outline-none focus:border-[#A88955]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-stone-700 mb-1">
                          City *
                        </label>
                        <input
                          type="text"
                          value={addressForm.city}
                          onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                          placeholder="e.g. Gurugram / Chennai"
                          className="w-full bg-[#FAF8F5] border border-[#E8E2D9] px-3.5 py-2.5 text-xs text-[#292722] rounded-xl focus:outline-none focus:border-[#A88955]"
                          required
                        />
                        {errors.city && <p className="text-[11px] text-red-600 mt-1">{errors.city}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-stone-700 mb-1">
                          State *
                        </label>
                        <input
                          type="text"
                          value={addressForm.state}
                          onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                          placeholder="e.g. Haryana / Tamil Nadu"
                          className="w-full bg-[#FAF8F5] border border-[#E8E2D9] px-3.5 py-2.5 text-xs text-[#292722] rounded-xl focus:outline-none focus:border-[#A88955]"
                          required
                        />
                        {errors.state && <p className="text-[11px] text-red-600 mt-1">{errors.state}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Prominent Landmark (Optional)
                      </label>
                      <input
                        type="text"
                        value={addressForm.landmark}
                        onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })}
                        placeholder="e.g. Opposite Cyber City Tower C"
                        className="w-full bg-[#FAF8F5] border border-[#E8E2D9] px-3.5 py-2.5 text-xs text-[#292722] rounded-xl focus:outline-none focus:border-[#A88955]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Special Delivery Instructions (Optional)
                      </label>
                      <input
                        type="text"
                        value={addressForm.deliveryInstructions}
                        onChange={(e) => setAddressForm({ ...addressForm, deliveryInstructions: e.target.value })}
                        placeholder="e.g. Call before arrival. Leave with security desk if unavailable."
                        className="w-full bg-[#FAF8F5] border border-[#E8E2D9] px-3.5 py-2.5 text-xs text-[#292722] rounded-xl focus:outline-none focus:border-[#A88955]"
                      />
                    </div>

                    {isAuthenticated && (
                      <label className="flex items-center gap-2 pt-2 cursor-pointer text-xs text-stone-700">
                        <input
                          type="checkbox"
                          checked={saveToAccountConsent}
                          onChange={(e) => setSaveToAccountConsent(e.target.checked)}
                          className="rounded text-[#A88955] focus:ring-[#A88955]"
                        />
                        <span>Save this shipping address to my patron account for future orders</span>
                      </label>
                    )}
                  </div>
                )}

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-4 bg-[#292722] text-[#F8F6F1] text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#A88955] active:scale-[0.99] transition-all flex items-center justify-center gap-2 rounded-xl shadow-md"
                  >
                    <span>Proceed to Order Review</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: Order Review & Pricing Breakdown */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D9]">
                  <div>
                    <h2 className="font-serif text-lg font-semibold text-[#292722]">
                      Order Review & Verification
                    </h2>
                    <p className="text-xs text-stone-500">
                      Please verify item quantities, shipping destination, and tax calculations.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="text-xs text-[#A88955] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Change Address
                  </button>
                </div>

                {/* Selected Shipping Destination Summary */}
                <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#E8E2D9] text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-stone-900 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#A88955]" />
                      Delivering To:
                    </span>
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="text-[11px] text-[#A88955] hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="font-medium text-stone-800">
                    {customer.fullName} • +91 {customer.phone}
                  </p>
                  <p className="text-stone-600">
                    {addressForm.addressLine}
                    {addressForm.addressLine2 ? `, ${addressForm.addressLine2}` : ''},{' '}
                    {addressForm.city}, {addressForm.state} — {addressForm.pincode}
                  </p>
                  {addressForm.landmark && (
                    <p className="text-[11px] text-stone-500">
                      Landmark: {addressForm.landmark}
                    </p>
                  )}
                  {addressForm.deliveryInstructions && (
                    <p className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200">
                      Instructions: {addressForm.deliveryInstructions}
                    </p>
                  )}
                </div>

                {/* Itemized List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs uppercase tracking-wider font-semibold text-stone-700">
                      Order Items ({cartItems.length}):
                    </h3>
                    <Link to="/cart" className="text-xs text-[#A88955] hover:underline">
                      Edit Shopping Bag
                    </Link>
                  </div>

                  <div className="divide-y divide-stone-100 border border-[#E8E2D9] rounded-xl overflow-hidden bg-white">
                    {cartItems.map((item) => (
                      <div key={item.id} className="p-3.5 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-14 h-14 object-cover rounded-lg border border-stone-200"
                          />
                          <div>
                            <p className="font-serif font-semibold text-stone-900 text-sm">
                              {item.product.name}
                            </p>
                            <p className="text-[11px] text-stone-500">
                              SKU: AUR-{item.productId.toUpperCase()}
                              {item.selectedVariant ? ` • Variant: ${item.selectedVariant}` : ''}
                            </p>
                            <p className="text-[11px] text-stone-600 mt-0.5">
                              Quantity: {item.quantity} × {formatCurrency(item.unitPrice)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-semibold text-stone-900 text-sm">
                            {formatCurrency(item.unitPrice * item.quantity)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="py-3.5 px-5 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="flex-1 py-3.5 px-6 rounded-xl bg-[#292722] text-[#F8F6F1] text-xs uppercase font-semibold tracking-widest hover:bg-[#A88955] transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <span>Confirm & Select Payment Mode</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Payment Method Selection */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D9]">
                  <div>
                    <h2 className="font-serif text-lg font-semibold text-[#292722]">
                      Select Payment Mode
                    </h2>
                    <p className="text-xs text-stone-500">
                      All online payments are verified server-side with zero storage of sensitive banking credentials.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="text-xs text-[#A88955] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Back to Review
                  </button>
                </div>

                <div className="space-y-3">
                  {/* UPI (Recommended) */}
                  <label
                    className={`block p-4.5 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'upi'
                        ? 'border-[#A88955] bg-[#FAF8F5] ring-2 ring-[#A88955]/30'
                        : 'border-[#E8E2D9] hover:border-stone-400 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === 'upi'}
                          onChange={() => setPaymentMethod('upi')}
                          className="text-[#A88955] focus:ring-[#A88955]"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-bold text-stone-900">
                              UPI / Dynamic QR & UPI Apps (Recommended)
                            </p>
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold uppercase px-2 py-0.5 rounded-full">
                              Instant Verification
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-500 mt-0.5">
                            Google Pay, PhonePe, Paytm, BHIM, Cred, and all UPI-enabled banks.
                          </p>
                        </div>
                      </div>
                      <span className="text-xl">⚡</span>
                    </div>
                  </label>

                  {/* Cash on Delivery */}
                  <label
                    className={`block p-4.5 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-[#A88955] bg-[#FAF8F5] ring-2 ring-[#A88955]/30'
                        : 'border-[#E8E2D9] hover:border-stone-400 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === 'cod'}
                          onChange={() => setPaymentMethod('cod')}
                          className="text-[#A88955] focus:ring-[#A88955]"
                        />
                        <div>
                          <p className="text-xs font-bold text-stone-900">
                            Cash on Delivery (Pay upon Receipt)
                          </p>
                          <p className="text-[11px] text-stone-500 mt-0.5">
                            Inspect tamper-evident wax seal and pay delivery courier via cash or UPI upon handover.
                          </p>
                        </div>
                      </div>
                      <span className="text-xl">📦</span>
                    </div>
                  </label>
                </div>

                {/* Demo notice banner */}
                <div className="p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
                  <span className="text-base shrink-0">🛡️</span>
                  <div>
                    <p className="font-semibold">Demo Sandbox Environment</p>
                    <p className="text-[11px] text-amber-800 mt-0.5">
                      This checkout integrates our modular PaymentService adapter. UPI displays a clearly labelled simulated QR code and payment verification state machine. No real money will be charged.
                    </p>
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="py-3.5 px-5 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleProceedToPayment}
                    disabled={isSubmitting}
                    className="flex-1 py-4 bg-[#292722] hover:bg-[#A88955] text-white text-xs uppercase tracking-[0.2em] font-semibold transition-all flex items-center justify-center gap-2 rounded-xl shadow-md disabled:opacity-50"
                  >
                    {paymentMethod === 'cod' ? (
                      <span>Place Order via Cash on Delivery ({formatCurrency(pricing.total)})</span>
                    ) : (
                      <span>Proceed to UPI Payment Gateway</span>
                    )}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Summary Sidebar (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-[#E8E2D9] rounded-2xl p-6 shadow-xs space-y-5">
            <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-stone-900 pb-3 border-b border-[#E8E2D9]">
              Payable Breakdown
            </h3>

            {/* Quick Items Thumbnail Preview */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={item.product.images[0]}
                      alt=""
                      className="w-11 h-11 object-cover rounded-lg border border-[#E8E2D9] shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-serif font-medium text-stone-900 truncate">{item.product.name}</p>
                      <p className="text-[11px] text-stone-500">
                        Qty {item.quantity} • {formatCurrency(item.unitPrice)}
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold text-stone-900 shrink-0">
                    {formatCurrency(item.unitPrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="pt-4 border-t border-[#E8E2D9] space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Gross Subtotal</span>
                <span className="text-stone-900 font-semibold">{formatCurrency(pricing.subtotal)}</span>
              </div>

              {pricing.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Atelier Privilege Discount ({pricing.couponCode})</span>
                  <span>- {formatCurrency(pricing.discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-stone-600">
                <span>Insured Express Logistics</span>
                <span>
                  {pricing.shipping === 0 ? (
                    <span className="text-emerald-700 font-semibold">Complimentary</span>
                  ) : (
                    formatCurrency(pricing.shipping)
                  )}
                </span>
              </div>

              {/* GST Tax Breakdown */}
              <div className="pt-2 border-t border-dashed border-stone-200 text-[11px] text-stone-500 space-y-1">
                <div className="flex justify-between">
                  <span>Taxable Value</span>
                  <span>{formatCurrency(taxableAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>CGST (1.5%)</span>
                  <span>{formatCurrency(cgst)}</span>
                </div>
                <div className="flex justify-between">
                  <span>SGST (1.5%)</span>
                  <span>{formatCurrency(sgst)}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-300 flex justify-between text-base font-bold text-stone-900">
                <span>Total Payable Amount</span>
                <span className="font-serif text-lg text-[#A88955]">{formatCurrency(pricing.total)}</span>
              </div>
              <p className="text-[10px] text-stone-500 pt-0.5">
                Includes all applicable taxes, gold hallmark inspection & insured transit.
              </p>
            </div>

            <div className="pt-2 text-[11px] text-stone-500 space-y-1.5 border-t border-stone-100">
              <p className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#A88955]" />
                Insured courier with tamper-evident seal
              </p>
              <p className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#A88955]" />
                7-Day Privilege Exchange Guarantee
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
