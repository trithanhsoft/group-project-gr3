import { vi } from 'vitest';
import { testData } from '../data/testData';

export const mockBookingRepository = {
  getBookingById: vi.fn().mockImplementation(async (bookingId: number) => {
    if (bookingId === testData.bookings.validTwoSlotBooking.BookingID) {
      return testData.bookings.validTwoSlotBooking;
    }
    return null;
  }),
  createBooking: vi.fn().mockImplementation(async (booking: any) => {
    return { BookingID: 102, ...booking, Status: "Pending" };
  }),
  checkOverlappingBooking: vi.fn().mockImplementation(async (courtId: number, date: string, slotIds: number[]) => {
    // If attempting overlappingBooking slots (e.g. SlotID 11)
    if (slotIds.includes(11)) {
      return true; // overlapping
    }
    return false; // free
  }),
  cancelBooking: vi.fn().mockResolvedValue(true),
  releaseExpiredBookings: vi.fn().mockResolvedValue({ releasedHoldings: 2, autoCheckedIn: 0 }),
  markCompletedExpiredCheckins: vi.fn().mockResolvedValue(1),
};
