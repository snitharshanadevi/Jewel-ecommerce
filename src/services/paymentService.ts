import { PaymentLifecycleState, PaymentMethod } from '../types';

/**
 * AUREVYA UPI & Multichannel Payment Service Interface
 *
 * ARCHITECTURAL NOTICE:
 * Production UPI integration requires creating an order on the merchant's secure
 * application server, obtaining a provider-signed payment link / dynamic QR (e.g. Razorpay,
 * Cashfree, Pine Labs), and verifying the payment signature via server webhooks.
 *
 * IN THIS DEMO ENVIRONMENT:
 * - A visibly labelled Sandbox / Demo QR code is rendered.
 * - Real UPI PINs, card CVVs, and banking passwords are NEVER requested.
 * - Complete test lifecycle transitions (awaiting -> verifying -> success/failure)
 *   are provided for UX testing.
 */

export interface UpiPaymentSession {
  transactionId: string;
  orderReference: string;
  amountInInr: number;
  upiVpa: string; // e.g. aurevya.atelier@sandbox
  upiDeepLink: string;
  qrPayload: string;
  state: PaymentLifecycleState;
  createdAt: string;
  expiresInSeconds: number;
  isDemo: true;
}

export interface PaymentVerificationResult {
  success: boolean;
  state: PaymentLifecycleState;
  transactionId: string;
  paidAt?: string;
  message: string;
  isDemo: true;
}

export const PaymentService = {
  /**
   * Initialize a UPI payment session
   */
  async createUpiSession(orderReference: string, amount: number): Promise<UpiPaymentSession> {
    // Simulate server communication latency
    await new Promise((resolve) => setTimeout(resolve, 600));

    const txnNumber = Math.floor(100000000 + Math.random() * 900000000);
    const vpa = 'aurevya.atelier@sandbox';
    const note = encodeURIComponent(`AUREVYA Order ${orderReference}`);
    const deepLink = `upi://pay?pa=${vpa}&pn=AUREVYA%20Fine%20Jewellery&am=${amount}&cu=INR&tn=${note}`;

    return {
      transactionId: `DEMO-UPI-${txnNumber}`,
      orderReference,
      amountInInr: amount,
      upiVpa: vpa,
      upiDeepLink: deepLink,
      qrPayload: deepLink,
      state: 'awaiting_payment',
      createdAt: new Date().toISOString(),
      expiresInSeconds: 600, // 10 minutes
      isDemo: true,
    };
  },

  /**
   * Verify server-side payment outcome (simulated sandbox adapter)
   */
  async verifyPayment(
    transactionId: string,
    forcedOutcome: 'success' | 'failure' | 'timeout' = 'success'
  ): Promise<PaymentVerificationResult> {
    // Simulate bank webhook verification latency (900ms)
    await new Promise((resolve) => setTimeout(resolve, 900));

    const now = new Date().toISOString();

    if (forcedOutcome === 'success') {
      return {
        success: true,
        state: 'successful',
        transactionId,
        paidAt: now,
        message: 'Payment verified and settled by simulated bank gateway (Demo Mode).',
        isDemo: true,
      };
    } else if (forcedOutcome === 'failure') {
      return {
        success: false,
        state: 'failed',
        transactionId,
        message: 'Payment verification failed: Simulated bank decline or user rejection.',
        isDemo: true,
      };
    } else {
      return {
        success: false,
        state: 'verification_pending',
        transactionId,
        message: 'Payment confirmation is still pending from the banking partner. Please check again in a moment.',
        isDemo: true,
      };
    }
  },

  /**
   * Cancel an active payment session
   */
  async cancelSession(transactionId: string): Promise<{ success: boolean; state: PaymentLifecycleState }> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      success: true,
      state: 'cancelled',
    };
  },
};
