export interface PincodeCheckResult {
  isValid: boolean;
  city?: string;
  state?: string;
  estimatedDays?: number;
  estimatedDeliveryDate?: string;
  isCodAvailable?: boolean;
  message: string;
}

const PINCODE_DIRECTORY: Record<string, { city: string; state: string; days: number }> = {
  '110001': { city: 'New Delhi', state: 'Delhi', days: 2 },
  '400001': { city: 'Mumbai', state: 'Maharashtra', days: 2 },
  '560001': { city: 'Bengaluru', state: 'Karnataka', days: 3 },
  '600001': { city: 'Chennai', state: 'Tamil Nadu', days: 3 },
  '700001': { city: 'Kolkata', state: 'West Bengal', days: 3 },
  '500001': { city: 'Hyderabad', state: 'Telangana', days: 2 },
  '302001': { city: 'Jaipur', state: 'Rajasthan', days: 3 },
  '380001': { city: 'Ahmedabad', state: 'Gujarat', days: 3 },
  '411001': { city: 'Pune', state: 'Maharashtra', days: 2 },
  '682001': { city: 'Kochi', state: 'Kerala', days: 4 },
  '226001': { city: 'Lucknow', state: 'Uttar Pradesh', days: 3 },
  '160017': { city: 'Chandigarh', state: 'Punjab', days: 3 },
};

/**
 * Checks Indian 6-digit PIN code delivery feasibility with simulated carrier metrics.
 * Note: Clearly labelled as demo simulation for testing.
 */
export function checkPincodeDelivery(pincode: string): PincodeCheckResult {
  const cleaned = pincode.trim();

  if (!/^\d{6}$/.test(cleaned)) {
    return {
      isValid: false,
      message: 'Please enter a valid 6-digit Indian postal code.',
    };
  }

  const known = PINCODE_DIRECTORY[cleaned];
  const days = known ? known.days : 4;
  const city = known ? known.city : 'Your City';
  const state = known ? known.state : 'Your State';

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + days);

  const formattedDate = new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(deliveryDate);

  return {
    isValid: true,
    city,
    state,
    estimatedDays: days,
    estimatedDeliveryDate: formattedDate,
    isCodAvailable: true,
    message: `Delivery available to ${city}, ${state} by ${formattedDate} (Demo Estimated). Free express courier with insured tamper-proof packaging.`,
  };
}
