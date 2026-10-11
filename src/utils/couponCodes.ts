export interface CouponDiscountResult {
  isValid: boolean;
  code: string;
  discountAmount: number;
  message: string;
}

interface CouponRule {
  code: string;
  description: string;
  minSubtotal: number;
  type: 'percentage' | 'flat';
  value: number; // percentage (e.g. 10) or flat INR (e.g. 2500)
}

export const AVAILABLE_DEMO_COUPONS: CouponRule[] = [
  {
    code: 'AUREVYA10',
    description: '10% off on all orders',
    minSubtotal: 0,
    type: 'percentage',
    value: 10,
  },
  {
    code: 'TRADITION',
    description: '₹2,500 off on heritage orders above ₹15,000',
    minSubtotal: 15000,
    type: 'flat',
    value: 2500,
  },
  {
    code: 'FESTIVE15',
    description: '15% festive discount on orders above ₹20,000',
    minSubtotal: 20000,
    type: 'percentage',
    value: 15,
  },
  {
    code: 'WELCOME1000',
    description: '₹1,000 off on your first order above ₹5,000',
    minSubtotal: 5000,
    type: 'flat',
    value: 1000,
  },
];

export function validateCoupon(inputCode: string, subtotal: number): CouponDiscountResult {
  const normalized = inputCode.trim().toUpperCase();
  const rule = AVAILABLE_DEMO_COUPONS.find((c) => c.code === normalized);

  if (!rule) {
    return {
      isValid: false,
      code: normalized,
      discountAmount: 0,
      message: 'Invalid promo code. Try AUREVYA10 or TRADITION.',
    };
  }

  if (subtotal < rule.minSubtotal) {
    return {
      isValid: false,
      code: normalized,
      discountAmount: 0,
      message: `Minimum order value for ${rule.code} is ₹${rule.minSubtotal.toLocaleString('en-IN')}.`,
    };
  }

  let discountAmount = 0;
  if (rule.type === 'percentage') {
    discountAmount = Math.round((subtotal * rule.value) / 100);
  } else {
    discountAmount = rule.value;
  }

  return {
    isValid: true,
    code: rule.code,
    discountAmount,
    message: `Promo code ${rule.code} applied successfully! Saved ₹${discountAmount.toLocaleString('en-IN')}.`,
  };
}
