import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DEMO_VERIFICATION_CODE } from '../../services/authService';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, requestOtp, verifyOtp } = useAuth();

  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [countryCode, setCountryCode] = useState('+91');
  const [phone, setPhone] = useState('');
  const [otpValues, setOtpValues] = useState<string[]>(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [cooldown, setCooldown] = useState(0);

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const phoneInputRef = useRef<HTMLInputElement | null>(null);

  // Reset modal state on open/close
  useEffect(() => {
    if (isAuthModalOpen) {
      setStep('phone');
      setPhone('');
      setOtpValues(['', '', '', '', '', '']);
      setErrorMessage('');
      setCooldown(0);
      setTimeout(() => {
        phoneInputRef.current?.focus();
      }, 100);
    }
  }, [isAuthModalOpen]);

  // Handle countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  if (!isAuthModalOpen) return null;

  // Handle sending OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const clean = phone.replace(/\D/g, '');

    if (clean.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    setLoading(true);
    try {
      const res = await requestOtp(clean, countryCode);
      if (res.success) {
        setStep('otp');
        setCooldown(res.resendCooldownSeconds || 30);
        setTimeout(() => {
          otpInputsRef.current[0]?.focus();
        }, 150);
      } else {
        setErrorMessage(res.message);
      }
    } catch {
      setErrorMessage('A network connectivity issue occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle resend OTP
  const handleResend = async () => {
    if (cooldown > 0 || loading) return;
    setErrorMessage('');
    setLoading(true);
    try {
      const res = await requestOtp(phone, countryCode);
      if (res.success) {
        setCooldown(res.resendCooldownSeconds || 30);
        setOtpValues(['', '', '', '', '', '']);
        otpInputsRef.current[0]?.focus();
      } else {
        setErrorMessage(res.message);
      }
    } catch {
      setErrorMessage('Unable to resend OTP. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  // Handle individual OTP input changes
  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) {
      // Handles pasting or fast input
      handlePasteValue(val);
      return;
    }

    const cleanChar = val.replace(/\D/g, '');
    const updated = [...otpValues];
    updated[index] = cleanChar;
    setOtpValues(updated);
    setErrorMessage('');

    // Advance focus
    if (cleanChar && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  // Keyboard navigation for OTP (backspace)
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otpValues[index] && index > 0) {
        otpInputsRef.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  // Paste support
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text');
    handlePasteValue(pasted);
  };

  const handlePasteValue = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 6);
    if (!digits) return;
    const updated = ['', '', '', '', '', ''];
    for (let i = 0; i < digits.length; i++) {
      updated[i] = digits[i];
    }
    setOtpValues(updated);
    const nextIndex = Math.min(digits.length, 5);
    otpInputsRef.current[nextIndex]?.focus();
  };

  // Auto fill demo code
  const handleFillDemoCode = () => {
    const chars = DEMO_VERIFICATION_CODE.split('');
    setOtpValues(chars);
    setErrorMessage('');
    otpInputsRef.current[5]?.focus();
  };

  // Handle verify submission
  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    const fullOtp = otpValues.join('');

    if (fullOtp.length !== 6) {
      setErrorMessage('Please enter all 6 digits of the verification code.');
      return;
    }

    setLoading(true);
    try {
      const res = await verifyOtp(phone, fullOtp);
      if (!res.success) {
        setErrorMessage(res.message);
      }
    } catch {
      setErrorMessage('Verification failed due to a server connection error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in"
      onClick={closeAuthModal}
    >
      <div
        className="relative w-full max-w-md bg-[#FAF5EB] rounded-2xl shadow-2xl border border-[#E8E2D9] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div className="bg-[#292722] text-[#F8F6F1] px-6 py-5 flex items-center justify-between border-b border-[#A88955]/30">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#A88955] font-semibold block mb-0.5">
              AUREVYA ATELIER PRIVILEGE
            </span>
            <h2 id="auth-modal-title" className="font-serif text-xl tracking-wide text-white">
              {step === 'phone' ? 'Patron Identification' : 'Verify Mobile Number'}
            </h2>
          </div>
          <button
            onClick={closeAuthModal}
            className="w-8 h-8 rounded-full flex items-center justify-center text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close dialog"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Demo Notice Banner */}
        <div className="bg-amber-50/80 border-b border-amber-200/60 px-6 py-2 flex items-center gap-2 text-xs text-amber-900">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          <span>
            <strong>Sandbox Demo Flow:</strong> Real telecom charges avoided. Demo Code:{' '}
            <code className="font-mono font-bold bg-amber-100 px-1.5 py-0.5 rounded text-amber-950">123456</code>
          </span>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-7">
          {errorMessage && (
            <div
              role="alert"
              className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5 animate-shake"
            >
              <svg className="w-4 h-4 text-red-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}

          {step === 'phone' ? (
            /* STEP 1: Enter Mobile Number */
            <form onSubmit={handleSendOtp} className="space-y-5">
              <p className="text-xs text-stone-600 leading-relaxed">
                Enter your mobile number to retrieve your saved addresses, track bespoke jewellery orders, and proceed to secure checkout.
              </p>

              <div>
                <label htmlFor="auth-phone-input" className="block text-xs uppercase tracking-wider font-semibold text-stone-700 mb-2">
                  Mobile Number
                </label>
                <div className="flex rounded-xl border border-[#E8E2D9] bg-white overflow-hidden focus-within:ring-2 focus-within:ring-[#A88955] focus-within:border-transparent transition-all shadow-sm">
                  <div className="flex items-center px-3 bg-[#FAF5EB] border-r border-[#E8E2D9] text-stone-700 text-sm font-medium">
                    <span className="mr-1">🇮🇳</span>
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      aria-label="Country dial code"
                      className="bg-transparent text-xs font-semibold text-stone-800 outline-none cursor-pointer"
                    >
                      <option value="+91">+91 (IN)</option>
                    </select>
                  </div>
                  <input
                    id="auth-phone-input"
                    ref={phoneInputRef}
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    placeholder="98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    maxLength={10}
                    className="flex-1 px-3.5 py-3 text-stone-900 text-sm placeholder:text-stone-400 focus:outline-none"
                    required
                  />
                </div>
                <p className="mt-1.5 text-[11px] text-stone-500">
                  Standard 10-digit Indian mobile number.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || phone.replace(/\D/g, '').length !== 10}
                className="w-full py-3.5 px-4 rounded-xl bg-[#292722] text-[#F8F6F1] text-xs uppercase font-semibold tracking-widest hover:bg-[#A88955] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    <span>Requesting Code...</span>
                  </>
                ) : (
                  <>
                    <span>Continue to Verification</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>

              <div className="pt-2 text-center text-[11px] text-stone-500 leading-normal">
                By continuing, you agree to AUREVYA&apos;s{' '}
                <a href="#terms" onClick={(e) => e.preventDefault()} className="text-[#A88955] underline hover:text-stone-800">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#privacy" onClick={(e) => e.preventDefault()} className="text-[#A88955] underline hover:text-stone-800">
                  Privacy Policy
                </a>.
              </div>
            </form>
          ) : (
            /* STEP 2: Verify 6-digit OTP */
            <form onSubmit={handleVerify} className="space-y-5">
              <div className="flex items-center justify-between text-xs text-stone-600">
                <span>
                  Code sent to: <strong className="text-stone-900">{countryCode} {phone}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setStep('phone');
                    setErrorMessage('');
                  }}
                  className="text-[#A88955] font-semibold hover:underline text-xs"
                >
                  Change
                </button>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 mb-2">
                  Enter 6-Digit OTP
                </label>
                <div className="flex justify-between gap-2" onPaste={handlePaste}>
                  {otpValues.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        otpInputsRef.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      aria-label={`Digit ${idx + 1}`}
                      className="w-11 h-12 text-center text-lg font-serif font-bold text-stone-900 bg-white border border-[#E8E2D9] rounded-xl focus:ring-2 focus:ring-[#A88955] focus:border-transparent outline-none shadow-sm transition-all"
                    />
                  ))}
                </div>
              </div>

              {/* Demo Helper Button */}
              <div className="flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={handleFillDemoCode}
                  className="inline-flex items-center gap-1.5 text-xs text-[#A88955] font-medium bg-[#A88955]/10 px-2.5 py-1.5 rounded-lg hover:bg-[#A88955]/20 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Auto-fill Demo Code (123456)</span>
                </button>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={cooldown > 0 || loading}
                  className="text-xs font-medium text-stone-600 disabled:text-stone-400 hover:text-stone-900 transition-colors"
                >
                  {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend OTP'}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading || otpValues.join('').length !== 6}
                className="w-full py-3.5 px-4 rounded-xl bg-[#292722] text-[#F8F6F1] text-xs uppercase font-semibold tracking-widest hover:bg-[#A88955] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    <span>Verifying Authenticity...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm & Continue</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
