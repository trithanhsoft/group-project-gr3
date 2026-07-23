import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as bookingService from '@/modules/bookings/bookings.service';
import * as bookingRepo from '@/modules/bookings/bookings.repository';
import { testData } from '../data/testData';

// Mock bookings.repository
vi.mock('@/modules/bookings/bookings.repository', () => ({
  findUserById: vi.fn(),
  findCourtByIdForBooking: vi.fn(),
  findAvailableCourtSlot: vi.fn(),
  repoCreateCourtBooking: vi.fn(),
  countActiveGroupMembers: vi.fn(),
}));

// Mock bookings.validation
vi.mock('@/modules/bookings/bookings.validation', () => ({
  calculateHours: vi.fn().mockReturnValue(2),
  validateBookingDate: vi.fn().mockReturnValue(true),
  validateHoldingLimit: vi.fn().mockResolvedValue(true),
  validateCoachFeePerHour: vi.fn().mockReturnValue(true),
}));

// Mock notifications & refunds & systemlogs & mail
vi.mock('@/modules/notifications/notifications.service', () => ({
  createNotification: vi.fn().mockResolvedValue(true),
}));

vi.mock('@/modules/refunds/refunds.service', () => ({
  requestRefund: vi.fn().mockResolvedValue(true),
  requestCoachCancelRefund: vi.fn().mockResolvedValue(true),
}));

vi.mock('@/modules/systemlogs/systemlogs.service', () => ({
  createSystemLog: vi.fn().mockResolvedValue(true),
}));

vi.mock('@/utils/mail', () => ({
  sendBookingCreatedEmail: vi.fn().mockResolvedValue(true),
  sendPaymentSuccessEmail: vi.fn().mockResolvedValue(true),
  sendCoachAssignedEmail: vi.fn().mockResolvedValue(true),
  sendNoShowEmail: vi.fn().mockResolvedValue(true),
  sendPaymentExpiredEmail: vi.fn().mockResolvedValue(true),
}));

describe('Booking Service Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createCourtBooking()', () => {
    // TC_BKG_01: Valid booking for 2 hours consecutive
    it('should create booking successfully for active user and available court', async () => {
      // Arrange
      const input = {
        userId: testData.users.validNewUser.UserID,
        courtId: testData.courts.validCourt.CourtID,
        bookingDate: testData.bookings.validTwoSlotBooking.BookingDate,
        startTime: '08:00',
        endTime: '10:00',
      };

      vi.mocked(bookingRepo.findUserById).mockResolvedValue(testData.users.validNewUser as any);
      vi.mocked(bookingRepo.findCourtByIdForBooking).mockResolvedValue(testData.courts.validCourt as any);
      vi.mocked(bookingRepo.findAvailableCourtSlot).mockResolvedValue({
        SlotID: 10,
        Price: 350000,
      } as any);
      
      const mockResult = {
        BookingID: 101,
        CourtID: 1,
        UserID: 1,
        TotalPrice: 700000,
        Status: 'Pending',
      };
      vi.mocked(bookingRepo.repoCreateCourtBooking).mockResolvedValue(mockResult as any);

      // Act
      const result = await bookingService.createCourtBooking(input);

      // Assert
      expect(result).toEqual(mockResult);
      expect(bookingRepo.findUserById).toHaveBeenCalledWith(input.userId);
      expect(bookingRepo.findCourtByIdForBooking).toHaveBeenCalledWith(input.courtId);
      expect(bookingRepo.findAvailableCourtSlot).toHaveBeenCalledWith(
        input.courtId,
        input.bookingDate,
        input.startTime,
        input.endTime
      );
      expect(bookingRepo.repoCreateCourtBooking).toHaveBeenCalled();
    });

    // TC_BKG_02: Blocked double booking / overlaps
    it('should throw error when slot is already booked / overlapping', async () => {
      // Arrange
      const input = {
        userId: 4,
        courtId: testData.courts.validCourt.CourtID,
        bookingDate: testData.bookings.validTwoSlotBooking.BookingDate,
        startTime: '09:00',
        endTime: '10:00',
      };

      vi.mocked(bookingRepo.findUserById).mockResolvedValue(testData.users.validNewUser as any);
      vi.mocked(bookingRepo.findCourtByIdForBooking).mockResolvedValue(testData.courts.validCourt as any);
      // Mock slot overlap by returning null (no available slot)
      vi.mocked(bookingRepo.findAvailableCourtSlot).mockResolvedValue(null);

      // Act & Assert
      await expect(bookingService.createCourtBooking(input)).rejects.toThrow(
        'Khung gio nay da bi dat hoac khong co slot phu hop'
      );
    });

    it('should throw error when court does not exist or inactive', async () => {
      // Arrange
      const input = {
        userId: testData.users.validNewUser.UserID,
        courtId: 999,
        bookingDate: '2026-07-01',
        startTime: '08:00',
        endTime: '10:00',
      };

      vi.mocked(bookingRepo.findUserById).mockResolvedValue(testData.users.validNewUser as any);
      vi.mocked(bookingRepo.findCourtByIdForBooking).mockResolvedValue(null);

      // Act & Assert
      await expect(bookingService.createCourtBooking(input)).rejects.toThrow('San khong ton tai');
    });
  });
});
