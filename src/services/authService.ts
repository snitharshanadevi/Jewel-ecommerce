import { CustomerUser, SavedAddress } from '../types';

/**
 * AUREVYA Customer Authentication Service (Mobile OTP Adapter)
 *
 * ARCHITECTURAL NOTICE:
 * In production, mobile verification connects to a secure backend endpoint
 * (e.g., POST /api/auth/send-otp and POST /api/auth/verify-otp) that communicates
 * with an Indian SMS gateway (e.g., MSG91, Twilio, Gupshup).
 *
 * In this demo portfolio mode:
 * - Real SMS is not sent to avoid unexpected telecom charges or spam.
 * - The expected verification code is clearly labelled as a DEMO CODE (default: 123456).
 * - No sensitive passwords or tokens are stored insecurely in localStorage.
 */

const SESSION_STORAGE_KEY = 'aurevya_auth_session_v1';
const ADDRESSES_STORAGE_KEY = 'aurevya_saved_addresses_v1';

export const DEMO_VERIFICATION_CODE = '123456';

export interface SendOtpResult {
  success: boolean;
  message: string;
  resendCooldownSeconds: number;
  phone: string;
  isDemo: boolean;
  demoHintCode?: string;
}

export interface VerifyOtpResult {
  success: boolean;
  message: string;
  user?: CustomerUser;
  isDemo: boolean;
}

const DEFAULT_SAVED_ADDRESSES: SavedAddress[] = [
  {
    id: 'addr-01',
    label: 'Home',
    recipientName: 'Ananya Sharma',
    recipientPhone: '9876543210',
    addressLine: 'Flat 402, Royal Palms Residences',
    addressLine2: 'Golf Course Road, Phase 5',
    city: 'Gurugram',
    state: 'Haryana',
    pincode: '122002',
    landmark: 'Opposite Cyber City Tower C',
    isDefault: true,
    deliveryInstructions: 'Please leave with reception if unavailable. Do not leave unattended.',
  },
  {
    id: 'addr-02',
    label: 'Work',
    recipientName: 'Ananya Sharma',
    recipientPhone: '9876543210',
    addressLine: 'Atelier Creative Studios, 3rd Floor',
    addressLine2: 'Bandra Kurla Complex (BKC)',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400051',
    landmark: 'Near ICICI Bank Regional HQ',
    isDefault: false,
    deliveryInstructions: 'Deliver during office hours 10 AM to 6 PM.',
  },
];

export const AuthService = {
  /**
   * Request OTP for a given 10-digit Indian mobile number
   */
  async requestOtp(phone: string, countryCode: string = '+91'): Promise<SendOtpResult> {
    const cleanPhone = phone.replace(/\D/g, '');

    if (cleanPhone.length !== 10) {
      return {
        success: false,
        message: 'Please enter a valid 10-digit Indian mobile number.',
        resendCooldownSeconds: 0,
        phone: cleanPhone,
        isDemo: true,
      };
    }

    // Simulate network latency (600ms)
    await new Promise((resolve) => setTimeout(resolve, 600));

    return {
      success: true,
      message: `OTP sent to ${countryCode} ${cleanPhone} (Demo Mode).`,
      resendCooldownSeconds: 30,
      phone: cleanPhone,
      isDemo: true,
      demoHintCode: DEMO_VERIFICATION_CODE,
    };
  },

  /**
   * Verify the 6-digit OTP
   */
  async verifyOtp(phone: string, enteredOtp: string): Promise<VerifyOtpResult> {
    const cleanPhone = phone.replace(/\D/g, '');
    const cleanOtp = enteredOtp.trim();

    // Simulate network verification latency
    await new Promise((resolve) => setTimeout(resolve, 700));

    if (cleanOtp.length !== 6) {
      return {
        success: false,
        message: 'Please enter the complete 6-digit OTP.',
        isDemo: true,
      };
    }

    if (cleanOtp !== DEMO_VERIFICATION_CODE) {
      return {
        success: false,
        message: 'Invalid verification code. (In demo mode, please use 123456)',
        isDemo: true,
      };
    }

    // Retrieve or initialize saved addresses
    let savedAddresses: SavedAddress[] = DEFAULT_SAVED_ADDRESSES;
    try {
      const stored = localStorage.getItem(ADDRESSES_STORAGE_KEY);
      if (stored) {
        savedAddresses = JSON.parse(stored);
      }
    } catch {
      savedAddresses = DEFAULT_SAVED_ADDRESSES;
    }

    const user: CustomerUser = {
      id: `usr-${cleanPhone}`,
      phone: cleanPhone,
      fullName: 'Ananya Sharma',
      email: 'ananya.sharma@example.com',
      savedAddresses,
      createdAt: new Date().toISOString(),
    };

    // Save session in sessionStorage (isolated to current tab/session)
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
    } catch (e) {
      console.error('Session storage error:', e);
    }

    return {
      success: true,
      message: 'Mobile number verified successfully.',
      user,
      isDemo: true,
    };
  },

  /**
   * Check if customer is currently logged in
   */
  getCurrentUser(): CustomerUser | null {
    try {
      const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  /**
   * Save an address for the customer
   */
  saveAddress(address: SavedAddress): SavedAddress[] {
    let addresses: SavedAddress[] = DEFAULT_SAVED_ADDRESSES;
    try {
      const stored = localStorage.getItem(ADDRESSES_STORAGE_KEY);
      addresses = stored ? JSON.parse(stored) : DEFAULT_SAVED_ADDRESSES;
    } catch {
      addresses = DEFAULT_SAVED_ADDRESSES;
    }

    const existingIndex = addresses.findIndex((a) => a.id === address.id);
    if (existingIndex >= 0) {
      addresses[existingIndex] = address;
    } else {
      addresses = [address, ...addresses];
    }

    if (address.isDefault) {
      addresses = addresses.map((a) => (a.id === address.id ? a : { ...a, isDefault: false }));
    }

    try {
      localStorage.setItem(ADDRESSES_STORAGE_KEY, JSON.stringify(addresses));
      // update active session if any
      const current = this.getCurrentUser();
      if (current) {
        current.savedAddresses = addresses;
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(current));
      }
    } catch (e) {
      console.error('Error saving address:', e);
    }

    return addresses;
  },

  /**
   * Logout customer
   */
  logout(): void {
    try {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (e) {
      console.error('Error logging out:', e);
    }
  },
};
