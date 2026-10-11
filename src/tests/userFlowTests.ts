/**
 * AUREVYA Customer Checkout, Payment & Concierge Flow Test Suite
 * Validates the core service adapters, pricing engines, authentication,
 * UPI payment lifecycle, consultation booking, and grounded AI assistant.
 */

import { AuthService, DEMO_VERIFICATION_CODE } from '../services/authService';
import { PaymentService } from '../services/paymentService';
import { ConsultationService } from '../services/consultationService';
import { AiAssistantService } from '../services/aiAssistantService';
import { DEMO_PRODUCTS } from '../data/demoProducts';

export async function runAllTests(): Promise<{ passed: number; failed: number; results: string[] }> {
  const results: string[] = [];
  let passed = 0;
  let failed = 0;

  const assert = (condition: boolean, testName: string) => {
    if (condition) {
      passed++;
      results.push(`✓ PASS: ${testName}`);
    } else {
      failed++;
      results.push(`✗ FAIL: ${testName}`);
    }
  };

  try {
    // 1. Mobile OTP Request & Validation
    const invalidPhoneRes = await AuthService.requestOtp('123');
    assert(!invalidPhoneRes.success, 'Rejects invalid phone numbers (< 10 digits)');

    const validPhoneRes = await AuthService.requestOtp('9876543210');
    assert(validPhoneRes.success, 'Accepts valid 10-digit Indian phone numbers');
    assert(validPhoneRes.resendCooldownSeconds === 30, 'Enforces 30s resend cooldown');

    const wrongOtpRes = await AuthService.verifyOtp('9876543210', '000000');
    assert(!wrongOtpRes.success, 'Rejects incorrect OTP');

    const correctOtpRes = await AuthService.verifyOtp('9876543210', DEMO_VERIFICATION_CODE);
    assert(correctOtpRes.success && !!correctOtpRes.user, 'Successfully authenticates with valid demo OTP');

    // 2. UPI Payment Session & Lifecycle Transitions
    const upiSession = await PaymentService.createUpiSession('TEST-ORDER-1', 25000);
    assert(upiSession.state === 'awaiting_payment', 'Initializes UPI session in awaiting_payment state');
    assert(upiSession.upiVpa.includes('sandbox'), 'Labels VPA as sandbox adapter');
    assert(upiSession.amountInInr === 25000, 'Matches requested INR amount');

    const successVerification = await PaymentService.verifyPayment(upiSession.transactionId, 'success');
    assert(successVerification.success && successVerification.state === 'successful', 'Simulates successful bank webhook settlement');

    const declineVerification = await PaymentService.verifyPayment(upiSession.transactionId, 'failure');
    assert(!declineVerification.success && declineVerification.state === 'failed', 'Simulates bank decline outcome');

    // 3. Video Consultation Booking
    const consultation = await ConsultationService.bookConsultation({
      customerName: 'Ananya Sharma',
      customerPhone: '9876543210',
      customerEmail: 'ananya@example.com',
      topic: 'Bridal Trousseau Styling',
      date: '2026-10-15',
      timeSlot: '11:00 AM - 11:45 AM IST',
      preferredLanguage: 'Tamil',
    });
    assert(consultation.status === 'confirmed', 'Books consultation and marks status as confirmed');
    assert(consultation.isDemo, 'Labels meeting link as sandbox/demo');

    // 4. Grounded AI Jewellery Assistant
    const templeJewelQuery = await AiAssistantService.processUserQuery('Show me South Indian Attigai and Jhimikkis', []);
    assert(!!templeJewelQuery.suggestedProducts && templeJewelQuery.suggestedProducts.length > 0, 'Returns grounded product recommendations for South Indian jewels');
    assert(
      templeJewelQuery.suggestedProducts!.every((p) => DEMO_PRODUCTS.some((dp) => dp.id === p.id)),
      'Ensures all suggested jewels exist in active DEMO_PRODUCTS catalogue'
    );

    const weightQuery = await AiAssistantService.processUserQuery('Are your jhumkas heavy on earlobes?', []);
    assert(weightQuery.text.includes('hollow') || weightQuery.text.includes('weight'), 'Answers earlobe comfort and weight distribution accurately');

  } catch (err: any) {
    failed++;
    results.push(`✗ EXCEPTION: ${err.message}`);
  }

  return { passed, failed, results };
}
