import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, ArrowRight, Tag, Check, Truck, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatINR } from '../utils/formatters';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { ImageWithFallback } from '../components/common/ImageWithFallback';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, openAuthModal } = useAuth();
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    pricing,
    appliedCoupon,
    applyCouponCode,
    removeCoupon,
    freeShippingThreshold,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  const breadcrumbs = [{ label: 'Shopping Bag' }];

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      openAuthModal(() => navigate('/checkout'));
    } else {
      navigate('/checkout');
    }
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCouponCode(couponInput.trim());
    if (res.success) {
      setCouponInput('');
      setCouponError('');
    } else {
      setCouponError(res.message);
    }
  };

  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - pricing.subtotal);
  const freeShippingProgress = Math.min(100, Math.round((pricing.subtotal / freeShippingThreshold) * 100));

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Breadcrumbs items={breadcrumbs} />
        <div className="max-w-xl mx-auto text-center py-20 px-4 bg-white border border-[#E8E2D9] rounded-xs shadow-xs my-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-[#EDE4D8]/50 rounded-full flex items-center justify-center text-[#A88955]">
            <ShoppingBag className="w-8 h-8 stroke-1" />
          </div>
          <h1 className="font-serif-luxury text-3xl font-light text-[#292722]">
            Your Shopping Bag is Empty
          </h1>
          <p className="text-xs sm:text-sm text-[#77736B] mt-2 mb-8 max-w-sm mx-auto font-light">
            You haven’t added any pieces yet. Explore our handcrafted jewellery collections to begin.
          </p>
          <Link
            to="/collections"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#A88955] text-white text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#8F7241] transition-colors rounded-xs shadow-xs"
          >
            <span>Explore Collections</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Breadcrumbs items={breadcrumbs} />

      <div className="flex items-center justify-between pb-6 border-b border-[#E8E2D9] mb-8">
        <div>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#292722] font-light">
            Shopping Bag ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})
          </h1>
          <p className="text-xs text-[#77736B] mt-1 font-light">
            Carefully packed with bespoke velvet jewel boxes and wax seal certificates.
          </p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-[#77736B] hover:text-[#A63D40] transition-colors uppercase tracking-wider"
        >
          Clear Bag
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Cart Items List (8 cols on lg) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Free Shipping Alert Bar */}
          <div className="p-4 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xs space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-[#292722] flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#A88955]" />
                {amountNeededForFreeShipping === 0 ? (
                  <span className="text-[#3D6847] font-semibold">
                    Congratulations! You unlocked complimentary insured express delivery.
                  </span>
                ) : (
                  <span>
                    Add <strong className="text-[#292722]">{formatINR(amountNeededForFreeShipping)}</strong> more to enjoy complimentary insured shipping!
                  </span>
                )}
              </span>
              <span className="text-[11px] text-[#77736B] font-semibold">
                {freeShippingProgress}%
              </span>
            </div>
            <div className="w-full bg-[#E8E2D9] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#A88955] h-full transition-all duration-500 rounded-full"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Table / List */}
          <div className="bg-white border border-[#E8E2D9] rounded-xs divide-y divide-[#E8E2D9]">
            {cartItems.map((item) => (
              <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                {/* Thumbnail */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xs overflow-hidden shrink-0">
                  <Link to={`/products/${item.product.slug}`}>
                    <ImageWithFallback
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] uppercase tracking-widest text-[#A88955] font-semibold">
                    {item.product.category}
                  </p>
                  <Link to={`/products/${item.product.slug}`}>
                    <h3 className="font-serif-luxury text-base font-medium text-[#292722] hover:text-[#A88955] transition-colors truncate">
                      {item.product.name}
                    </h3>
                  </Link>

                  {item.selectedVariant && (
                    <p className="text-xs text-[#77736B] mt-0.5">
                      Variant: <span className="text-[#292722] font-medium">{item.selectedVariant}</span>
                    </p>
                  )}

                  <p className="text-xs text-[#77736B] mt-1">
                    Unit Price: {formatINR(item.unitPrice)}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-[#E8E2D9] bg-[#FAF8F5] rounded-xs">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-2.5 py-1 text-sm text-[#292722] hover:bg-white"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-xs font-semibold text-[#292722] min-w-[2rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2.5 py-1 text-sm text-[#292722] hover:bg-white"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-1.5 text-[#77736B] hover:text-[#A63D40] transition-colors"
                    aria-label={`Remove ${item.product.name} from bag`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Item Subtotal */}
                <div className="text-right sm:min-w-[100px]">
                  <p className="text-sm font-bold text-[#292722]">
                    {formatINR(item.unitPrice * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 flex justify-between items-center text-xs text-[#77736B]">
            <Link to="/collections" className="hover:text-[#292722] inline-flex items-center gap-1">
              &larr; Continue browsing jewels
            </Link>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#A88955]" />
              <span>Insured packaging with tamper-evident seal</span>
            </div>
          </div>
        </div>

        {/* Order Summary & Coupon (4 cols on lg) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-[#E8E2D9] rounded-xs p-6 space-y-6 shadow-xs">
            <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#292722] pb-3 border-b border-[#E8E2D9]">
              Order Summary
            </h2>

            {/* Price Breakdown */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-[#77736B]">
                <span>Bag Subtotal</span>
                <span className="text-[#292722] font-semibold">{formatINR(pricing.subtotal)}</span>
              </div>

              {pricing.discount > 0 && (
                <div className="flex justify-between text-[#3D6847]">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" />
                    Promo Discount ({pricing.couponCode})
                  </span>
                  <span className="font-semibold">-{formatINR(pricing.discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-[#77736B]">
                <span>Insured Express Shipping</span>
                <span>
                  {pricing.shipping === 0 ? (
                    <span className="text-[#3D6847] font-semibold">FREE</span>
                  ) : (
                    formatINR(pricing.shipping)
                  )}
                </span>
              </div>

              <div className="pt-3 border-t border-[#E8E2D9] flex justify-between text-base font-bold text-[#292722]">
                <span>Total Amount</span>
                <span>{formatINR(pricing.total)}</span>
              </div>
              <p className="text-[10px] text-[#77736B] pt-0.5">
                Inclusive of GST and insured transit coverage.
              </p>
            </div>

            {/* Coupon Code Section */}
            <div className="pt-4 border-t border-[#E8E2D9]">
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#292722] mb-2">
                Have a Promo Code?
              </label>

              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 bg-[#EDE4D8]/30 border border-[#E8E2D9] rounded-xs text-xs">
                  <div className="flex items-center gap-2 text-[#3D6847] font-medium">
                    <Check className="w-4 h-4" />
                    <span>Coupon <strong>{appliedCoupon}</strong> active</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-[#A63D40] hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value);
                        setCouponError('');
                      }}
                      placeholder="e.g. AUREVYA10"
                      className="flex-1 bg-[#FAF8F5] border border-[#E8E2D9] px-3 py-2 text-xs uppercase text-[#292722] rounded-xs focus:outline-none focus:border-[#A88955]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#292722] text-[#F8F6F1] text-xs uppercase tracking-wider font-semibold hover:bg-black transition-colors rounded-xs"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-[11px] text-[#A63D40]">{couponError}</p>
                  )}
                  <p className="text-[10px] text-[#77736B]">
                    Try demo codes: <strong className="text-[#292722]">AUREVYA10</strong> (10% off) or <strong className="text-[#292722]">TRADITION</strong> (₹2,500 off)
                  </p>
                </form>
              )}
            </div>

            {/* Checkout CTA */}
            <button
              onClick={handleProceedToCheckout}
              className="w-full py-4 bg-[#A88955] text-white text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#8F7241] transition-colors flex items-center justify-center gap-2 rounded-xs shadow-xs"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
