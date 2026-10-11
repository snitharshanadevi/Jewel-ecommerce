import React, { useState, useEffect } from 'react';
import { useSupport } from '../../context/SupportContext';
import { useAuth } from '../../context/AuthContext';
import { ConsultationService, AVAILABLE_TIME_SLOTS } from '../../services/consultationService';
import { VideoConsultationBooking } from '../../types';
import { useToast } from '../../context/ToastContext';

export const SupportPanel: React.FC = () => {
  const { isSupportOpen, closeSupport, activeTab, setActiveTab, supportOptions } = useSupport();
  const { user } = useAuth();
  const { showToast } = useToast();

  const businessPhone = '+91 98765 43210';
  const rawBusinessPhone = '919876543210';

  // Video Consultation Booking State
  const [topic, setTopic] = useState<'Bridal Trousseau Styling' | 'Custom Fitting & Sizing' | 'South Indian Temple Heirlooms' | 'Everyday Minimal Fine Jewels'>(
    'Bridal Trousseau Styling'
  );
  const [bookingDate, setBookingDate] = useState(() => {
    // Tomorrow as default
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState(AVAILABLE_TIME_SLOTS[0]);
  const [language, setLanguage] = useState<'English' | 'Tamil' | 'Hindi' | 'Telugu'>('English');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [latestBooking, setLatestBooking] = useState<VideoConsultationBooking | null>(null);
  const [allBookings, setAllBookings] = useState<VideoConsultationBooking[]>([]);

  // Initialize customer contact from auth if available
  useEffect(() => {
    if (user) {
      if (user.fullName && !customerName) setCustomerName(user.fullName);
      if (user.phone && !customerPhone) setCustomerPhone(user.phone);
      if (user.email && !customerEmail) setCustomerEmail(user.email);
    }
  }, [user]);

  // Load existing bookings on mount or when opening
  useEffect(() => {
    if (isSupportOpen) {
      setAllBookings(ConsultationService.getConsultations());
    }
  }, [isSupportOpen]);

  if (!isSupportOpen) return null;

  // Prepare WhatsApp prefilled message safely
  const getWhatsAppUrl = () => {
    let messageText = 'Namaskaram AUREVYA Concierge! I would like assistance with your jewellery collection.';
    if (supportOptions.orderReference) {
      messageText = `Namaskaram AUREVYA Concierge! I am inquiring about my Order #${supportOptions.orderReference}.`;
    } else if (supportOptions.prefilledQuery) {
      messageText = `Namaskaram! ${supportOptions.prefilledQuery}`;
    }
    return `https://wa.me/${rawBusinessPhone}?text=${encodeURIComponent(messageText)}`;
  };

  const handleBookConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) {
      showToast('Please enter your name and contact phone.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await ConsultationService.bookConsultation({
        customerName,
        customerPhone,
        customerEmail: customerEmail || 'patron@aurevya.com',
        topic,
        date: bookingDate,
        timeSlot,
        preferredLanguage: language,
      });

      setLatestBooking(result);
      setAllBookings(ConsultationService.getConsultations());
      showToast('Video styling consultation confirmed!', 'success');
    } catch {
      showToast('Failed to schedule consultation. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="support-drawer-title"
      className="fixed inset-0 z-50 flex justify-end bg-stone-900/50 backdrop-blur-xs animate-fade-in"
      onClick={closeSupport}
    >
      <div
        className="w-full max-w-md h-full bg-[#FAF5EB] shadow-2xl border-l border-[#E8E2D9] flex flex-col overflow-hidden animate-slide-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="bg-[#292722] text-[#F8F6F1] px-6 py-5 flex items-center justify-between border-b border-[#A88955]/30">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#A88955] font-semibold block">
              ATELIER CLIENT CARE
            </span>
            <h2 id="support-drawer-title" className="font-serif text-xl tracking-wide text-white">
              Customer Concierge
            </h2>
          </div>
          <button
            onClick={closeSupport}
            className="w-8 h-8 rounded-full flex items-center justify-center text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close support panel"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#E8E2D9] bg-white text-xs font-semibold">
          <button
            onClick={() => setActiveTab('concierge')}
            className={`flex-1 py-3 text-center transition-colors border-b-2 ${
              activeTab === 'concierge'
                ? 'border-[#A88955] text-[#292722] bg-[#FAF5EB]/50'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Instant Support
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`flex-1 py-3 text-center transition-colors border-b-2 ${
              activeTab === 'video'
                ? 'border-[#A88955] text-[#292722] bg-[#FAF5EB]/50'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Video Consultation
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex-1 py-3 text-center transition-colors border-b-2 relative ${
              activeTab === 'bookings'
                ? 'border-[#A88955] text-[#292722] bg-[#FAF5EB]/50'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Appointments
            {allBookings.length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-[#A88955] text-white">
                {allBookings.length}
              </span>
            )}
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'concierge' && (
            <div className="space-y-6">
              {/* Context notification if order ref is present */}
              {supportOptions.orderReference && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                  Assistance request attached to <strong>Order #{supportOptions.orderReference}</strong>
                </div>
              )}

              {/* WhatsApp Card */}
              <div className="bg-white p-5 rounded-2xl border border-[#E8E2D9] shadow-xs space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-lg">
                    💬
                  </div>
                  <div>
                    <h3 className="font-serif text-base text-stone-900 font-semibold">Official WhatsApp Concierge</h3>
                    <p className="text-[11px] text-stone-500">Fastest response for real-time sizing & order inquiries</p>
                  </div>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  Connect with our atelier stylists via verified WhatsApp. We share high-definition jewel videos, live hallmarking details, and custom sizing recommendations.
                </p>

                <div className="pt-1">
                  <a
                    href={getWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-sm"
                  >
                    <span>Open WhatsApp Chat</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                  <p className="text-[10px] text-stone-400 text-center mt-1.5">
                    * Opens the WhatsApp client. No messages are sent automatically.
                  </p>
                </div>
              </div>

              {/* Direct Phone Call Card */}
              <div className="bg-white p-5 rounded-2xl border border-[#E8E2D9] shadow-xs space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#A88955]/10 text-[#A88955] flex items-center justify-center font-bold text-lg">
                    📞
                  </div>
                  <div>
                    <h3 className="font-serif text-base text-stone-900 font-semibold">Direct Telephone Assistance</h3>
                    <p className="text-[11px] text-stone-500">Toll-free priority atelier helpline</p>
                  </div>
                </div>

                <div className="p-3 bg-[#FAF5EB] rounded-xl border border-[#E8E2D9] text-xs text-stone-700 space-y-1">
                  <div className="flex justify-between">
                    <span className="font-medium">Direct Line:</span>
                    <strong className="text-stone-900">{businessPhone}</strong>
                  </div>
                  <div className="flex justify-between text-[11px] text-stone-500">
                    <span>Business Hours:</span>
                    <span>Mon - Sat: 10:00 AM – 8:00 PM IST</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-stone-500">
                    <span>Sundays:</span>
                    <span>11:00 AM – 5:00 PM IST</span>
                  </div>
                </div>

                <div className="pt-1">
                  <a
                    href={`tel:${businessPhone.replace(/\s+/g, '')}`}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#292722] hover:bg-[#A88955] text-[#F8F6F1] text-xs font-semibold uppercase tracking-wider transition-all shadow-sm"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>Call Concierge Now</span>
                  </a>
                </div>
              </div>

              {/* Bespoke Video Consultation Promo */}
              <div className="bg-linear-to-r from-[#292722] to-stone-800 text-white p-5 rounded-2xl shadow-md space-y-2">
                <span className="text-[10px] uppercase tracking-widest text-[#A88955] font-semibold">1-ON-1 VIRTUAL TRY-ON</span>
                <h4 className="font-serif text-lg">Bespoke Video Consultation</h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Schedule an exclusive virtual session with our Master Jewellery Curators. Inspect bridal sets, weight distributions, and neck draping in 4K resolution.
                </p>
                <button
                  onClick={() => setActiveTab('video')}
                  className="mt-2 text-xs font-semibold text-[#A88955] hover:text-white underline inline-flex items-center gap-1"
                >
                  Schedule Your Free Slot →
                </button>
              </div>
            </div>
          )}

          {activeTab === 'video' && (
            <div className="space-y-5">
              {latestBooking ? (
                <div className="bg-white p-6 rounded-2xl border border-emerald-200 shadow-sm text-center space-y-4 animate-fade-in">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-xl font-bold">
                    ✓
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Booking Confirmed (Demo Sandbox)
                    </span>
                    <h3 className="font-serif text-xl text-stone-900 mt-2 font-semibold">
                      Your Consultation is Scheduled
                    </h3>
                    <p className="text-xs text-stone-500 mt-1">
                      Reference ID: <strong className="text-stone-800 font-mono">{latestBooking.id}</strong>
                    </p>
                  </div>

                  <div className="bg-[#FAF5EB] p-4 rounded-xl text-left text-xs space-y-2 border border-[#E8E2D9]">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Styling Topic:</span>
                      <span className="font-semibold text-stone-800">{latestBooking.topic}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Date & Slot:</span>
                      <span className="font-semibold text-stone-800">
                        {latestBooking.date} • {latestBooking.timeSlot}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Preferred Language:</span>
                      <span className="font-semibold text-stone-800">{latestBooking.preferredLanguage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Meeting Link:</span>
                      <span className="font-mono text-emerald-700 font-semibold">{latestBooking.meetingLink}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-stone-500 leading-relaxed">
                    * In production, an automated calendar invite and Google Meet link will be dispatched via SMS & Email.
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setLatestBooking(null)}
                      className="flex-1 py-2.5 px-3 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50"
                    >
                      Book Another
                    </button>
                    <button
                      onClick={() => setActiveTab('bookings')}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-[#292722] text-white text-xs font-semibold hover:bg-[#A88955]"
                    >
                      View All Bookings
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleBookConsultation} className="space-y-4 bg-white p-5 rounded-2xl border border-[#E8E2D9]">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                      Consultation Topic
                    </label>
                    <select
                      value={topic}
                      onChange={(e) => setTopic(e.target.value as any)}
                      className="w-full text-xs p-2.5 bg-[#FAF5EB] border border-[#E8E2D9] rounded-xl focus:ring-2 focus:ring-[#A88955] outline-none"
                    >
                      <option value="Bridal Trousseau Styling">Bridal Trousseau Styling</option>
                      <option value="South Indian Temple Heirlooms">South Indian Temple Heirlooms</option>
                      <option value="Custom Fitting & Sizing">Custom Fitting & Sizing</option>
                      <option value="Everyday Minimal Fine Jewels">Everyday Minimal Fine Jewels</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                        Date
                      </label>
                      <input
                        type="date"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full text-xs p-2.5 bg-[#FAF5EB] border border-[#E8E2D9] rounded-xl focus:ring-2 focus:ring-[#A88955] outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                        Language
                      </label>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value as any)}
                        className="w-full text-xs p-2.5 bg-[#FAF5EB] border border-[#E8E2D9] rounded-xl focus:ring-2 focus:ring-[#A88955] outline-none"
                      >
                        <option value="English">English</option>
                        <option value="Tamil">Tamil (தமிழ்)</option>
                        <option value="Hindi">Hindi (हिंदी)</option>
                        <option value="Telugu">Telugu (తెలుగు)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                      Available Time Slot
                    </label>
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full text-xs p-2.5 bg-[#FAF5EB] border border-[#E8E2D9] rounded-xl focus:ring-2 focus:ring-[#A88955] outline-none"
                    >
                      {AVAILABLE_TIME_SLOTS.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ananya Sharma"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full text-xs p-2.5 bg-[#FAF5EB] border border-[#E8E2D9] rounded-xl focus:ring-2 focus:ring-[#A88955] outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                        Mobile Number
                      </label>
                      <input
                        type="tel"
                        placeholder="9876543210"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full text-xs p-2.5 bg-[#FAF5EB] border border-[#E8E2D9] rounded-xl focus:ring-2 focus:ring-[#A88955] outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="ananya@example.com"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="w-full text-xs p-2.5 bg-[#FAF5EB] border border-[#E8E2D9] rounded-xl focus:ring-2 focus:ring-[#A88955] outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#292722] text-[#F8F6F1] text-xs uppercase font-semibold tracking-widest hover:bg-[#A88955] active:scale-[0.99] disabled:opacity-50 transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span>Reserving Slot...</span>
                    ) : (
                      <>
                        <span>Confirm Appointment</span>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="space-y-4">
              <h3 className="font-serif text-lg text-stone-900 font-semibold">Your Scheduled Consultations</h3>
              {allBookings.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl border border-[#E8E2D9] text-center space-y-3">
                  <div className="text-3xl">🗓️</div>
                  <p className="text-xs text-stone-600">You do not have any upcoming video appointments.</p>
                  <button
                    onClick={() => setActiveTab('video')}
                    className="text-xs font-semibold text-[#A88955] hover:underline"
                  >
                    Schedule a Consultation Now
                  </button>
                </div>
              ) : (
                allBookings.map((b) => (
                  <div key={b.id} className="bg-white p-4 rounded-xl border border-[#E8E2D9] shadow-xs space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="font-mono text-[11px] font-bold text-stone-500">{b.id}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                        {b.status}
                      </span>
                    </div>
                    <p className="font-serif font-semibold text-stone-900 text-sm">{b.topic}</p>
                    <p className="text-xs text-stone-600">
                      📅 {b.date} • {b.timeSlot} ({b.preferredLanguage})
                    </p>
                    {b.meetingLink && (
                      <div className="pt-1 text-[11px] font-mono text-[#A88955] bg-[#FAF5EB] p-2 rounded-lg">
                        🔗 {b.meetingLink}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
