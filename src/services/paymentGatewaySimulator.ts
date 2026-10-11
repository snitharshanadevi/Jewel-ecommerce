/**
 * AUREVYA Simulated Payment Gateway Adapter (DEMO / SANDBOX ONLY)
 *
 * ARCHITECTURAL NOTICE:
 * This module acts as an isolated client-side boundary interface simulating
 * third-party checkout flows (e.g. Razorpay, Cashfree, Stripe).
 *
 * PRODUCTION INTEGRATION GUIDELINES:
 * 1. Real payments MUST create an order via a secure server endpoint (`POST /api/orders/create`).
 * 2. Secrets (e.g., RAZORPAY_KEY_SECRET) must NEVER be shipped in frontend builds.
 * 3. Frontend collects checkout tokens or handles redirection callbacks without touching raw CVVs or UPI PINs.
 * 4. The server MUST verify cryptographic payment signatures via webhooks before confirming fulfillment.
 */

export interface PaymentRequestPayload {
  amountInInr: number;
  orderReference: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  method: 'card' | 'upi' | 'netbanking' | 'cod';
}

export type PaymentSimulationOutcome = 'success' | 'failure' | 'cancelled';

export interface PaymentSimulationResponse {
  success: boolean;
  transactionId: string;
  outcome: PaymentSimulationOutcome;
  timestamp: string;
  message: string;
  isDemo: true;
}

/**
 * Isolated simulated payment processor
 */
export async function processDemoPayment(
  payload: PaymentRequestPayload,
  simulatedOutcome: PaymentSimulationOutcome = 'success'
): Promise<PaymentSimulationResponse> {
  // Simulate network latency (800ms)
  await new Promise((resolve) => setTimeout(resolve, 800));

  const timestamp = new Date().toISOString();
  const txNumber = Math.floor(100000000 + Math.random() * 900000000);

  if (payload.method === 'cod') {
    return {
      success: true,
      transactionId: `DEMO-COD-${txNumber}`,
      outcome: 'success',
      timestamp,
      message: 'Demo Cash on Delivery confirmed. Payment to be collected upon physical delivery.',
      isDemo: true,
    };
  }

  switch (simulatedOutcome) {
    case 'success':
      return {
        success: true,
        transactionId: `DEMO-TXN-${txNumber}`,
        outcome: 'success',
        timestamp,
        message: 'Simulated payment succeeded. No real funds were charged (Demo mode).',
        isDemo: true,
      };

    case 'failure':
      return {
        success: false,
        transactionId: `DEMO-FAIL-${txNumber}`,
        outcome: 'failure',
        timestamp,
        message: 'Simulated payment failed (simulated bank decline or timeout for testing).',
        isDemo: true,
      };

    case 'cancelled':
      return {
        success: false,
        transactionId: `DEMO-ABORT-${txNumber}`,
        outcome: 'cancelled',
        timestamp,
        message: 'Transaction cancelled by user (simulated sandbox back-button / exit).',
        isDemo: true,
      };
  }
}
