import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as paymentsService from '@/modules/payments/payments.service';
import * as paymentsRepo from '@/modules/payments/payments.repository';
import * as refundsService from '@/modules/refunds/refunds.service';
import * as refundsRepo from '@/modules/refunds/refunds.repository';
import { testData } from '../data/testData';

// Mock repositories
vi.mock('@/modules/payments/payments.repository', () => ({
  findBookingForPayment: vi.fn(),
  hasPaidPayment: vi.fn(),
  expireOldPendingPayments: vi.fn().mockResolvedValue(true),
  createPendingPayment: vi.fn(),
  updatePaymentGatewayInfo: vi.fn().mockResolvedValue(true),
  getPaymentByCode: vi.fn(),
  getPaymentByGatewayOrderId: vi.fn(),
  getPaymentStatus: vi.fn(),
  markPaymentPaid: vi.fn(),
  markPaymentFailed: vi.fn(),
  getCoachOrComboPaymentSuccessEmailData: vi.fn(),
}));

vi.mock('@/modules/refunds/refunds.repository', () => ({
  findRefundableBooking: vi.fn(),
  createRefundRecord: vi.fn(),
}));

// Mock payos and momo gateways
vi.mock('@/modules/payments/gateways/payos.gateway', () => ({
  createPayosPaymentLink: vi.fn().mockResolvedValue({
    success: true,
    paymentLinkId: 'payos_link_123',
    checkoutUrl: 'https://checkout.payos.vn/payment/link-id-123',
  }),
}));

vi.mock('@/modules/payments/gateways/momo.gateway', () => ({
  createMomoPaymentLink: vi.fn().mockResolvedValue({
    payUrl: 'https://test-payment.momo.vn/v2/gateway/api/create',
  }),
}));

vi.mock('@/modules/notifications/notifications.service', () => ({
  createNotification: vi.fn().mockResolvedValue(true),
}));

describe('Payment & Refund Service Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createPayment()', () => {
    // TC_PAY_01: Create Payment Link (PayOS)
    it('should generate payos payment link successfully for pending payment booking', async () => {
      // Arrange
      const input = {
        bookingId: 101,
        userId: 1,
        gateway: 'PayOS' as const,
      };

      const mockBooking = {
        BookingID: 101,
        UserID: 1,
        Status: 'PendingPayment',
        TotalAmount: 700000,
        CourtID: 1,
      };

      vi.mocked(paymentsRepo.findBookingForPayment).mockResolvedValue(mockBooking as any);
      vi.mocked(paymentsRepo.hasPaidPayment).mockResolvedValue(false);
      vi.mocked(paymentsRepo.createPendingPayment).mockResolvedValue({
        paymentId: 501,
        expiredAt: new Date(Date.now() + 10 * 60 * 1000),
      } as any);

      const mockReq = {
        headers: {
          get: () => 'http://localhost:3000',
        },
      };

      // Act
      const result = await paymentsService.createPayment({
        bookingId: 101,
        userId: 1,
        paymentMethod: 'PayOS' as const,
      }, mockReq);

      // Assert
      expect(result).toHaveProperty('paymentUrl');
      expect(paymentsRepo.findBookingForPayment).toHaveBeenCalledWith(101, 1);
      expect(paymentsRepo.hasPaidPayment).toHaveBeenCalledWith(101);
      expect(paymentsRepo.createPendingPayment).toHaveBeenCalled();
    });
  });

  describe('calculateRefundAmount()', () => {
    // Helper to format a future Date in UTC+7, matching refund service parsing.
    const getFutureStrings = (hoursAhead: number) => {
      const futureDate = new Date(Date.now() + (hoursAhead + 7) * 60 * 60 * 1000);
      const pad = (n: number) => String(n).padStart(2, '0');
      const dateStr = `${futureDate.getUTCFullYear()}-${pad(futureDate.getUTCMonth() + 1)}-${pad(futureDate.getUTCDate())}`;
      const timeStr = `${pad(futureDate.getUTCHours())}:${pad(futureDate.getUTCMinutes())}`;
      return { dateStr, timeStr };
    };

    // TC_PAY_02: Refund calculation based on timeline hours
    it('should calculate 100% refund if play time is in >= 12 hours', () => {
      // Arrange
      const { dateStr, timeStr } = getFutureStrings(15); // 15 hours in future

      // Act
      const result = refundsService.calculateRefundAmount(dateStr, timeStr, 700000);

      // Assert
      expect(result.percent).toBe(100);
      expect(result.amount).toBe(700000);
    });

    it('should calculate 70% refund if play time is between 2 and 12 hours', () => {
      // Arrange
      const { dateStr, timeStr } = getFutureStrings(5); // 5 hours in future

      // Act
      const result = refundsService.calculateRefundAmount(dateStr, timeStr, 700000);

      // Assert
      expect(result.percent).toBe(70);
      expect(result.amount).toBe(490000);
    });

    it('should calculate 0% refund if play time is less than 2 hours', () => {
      // Arrange
      const { dateStr, timeStr } = getFutureStrings(1); // 1 hour in future

      // Act
      const result = refundsService.calculateRefundAmount(dateStr, timeStr, 700000);

      // Assert
      expect(result.percent).toBe(0);
      expect(result.amount).toBe(0);
    });
  });
});
