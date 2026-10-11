import { VideoConsultationBooking } from '../types';

const CONSULTATIONS_STORAGE_KEY = 'aurevya_consultations_v1';

export const AVAILABLE_TIME_SLOTS = [
  '11:00 AM - 11:45 AM IST',
  '02:00 PM - 02:45 PM IST',
  '04:30 PM - 05:15 PM IST',
  '06:30 PM - 07:15 PM IST',
];

export const ConsultationService = {
  /**
   * Book a video consultation appointment
   */
  async bookConsultation(
    bookingData: Omit<VideoConsultationBooking, 'id' | 'status' | 'isDemo' | 'createdAt' | 'meetingLink'>
  ): Promise<VideoConsultationBooking> {
    // Simulate booking API latency
    await new Promise((resolve) => setTimeout(resolve, 800));

    const id = `VC-${Math.floor(10000 + Math.random() * 90000)}`;
    const meetingCode = `aur-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 6)}`;
    const meetingLink = `https://meet.google.com/${meetingCode} (Demo Link)`;

    const booking: VideoConsultationBooking = {
      ...bookingData,
      id,
      status: 'confirmed',
      meetingLink,
      isDemo: true,
      createdAt: new Date().toISOString(),
    };

    let existing: VideoConsultationBooking[] = [];
    try {
      const stored = localStorage.getItem(CONSULTATIONS_STORAGE_KEY);
      existing = stored ? JSON.parse(stored) : [];
    } catch {
      existing = [];
    }

    const updated = [booking, ...existing];
    try {
      localStorage.setItem(CONSULTATIONS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to store consultation:', e);
    }

    return booking;
  },

  /**
   * Get all booked consultations for the user
   */
  getConsultations(): VideoConsultationBooking[] {
    try {
      const stored = localStorage.getItem(CONSULTATIONS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },
};
