import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as promotionsService from '@/modules/promotions/promotions.service';
import * as promotionsRepo from '@/modules/promotions/promotions.repository';
import { getPool } from '@/database/connection';
import { testData } from '../data/testData';

// Mock promotions repository
vi.mock('@/modules/promotions/promotions.repository', () => ({
  findPromotionByCode: vi.fn(),
  findUserPromotionRecord: vi.fn(),
  countUserPromotionUsages: vi.fn(),
}));

// Mock connection getPool
vi.mock('@/database/connection', () => ({
  getPool: vi.fn(),
  sql: {
    Int: 'Int',
  },
}));

describe('Promotion Service Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('validatePromotion()', () => {
    // TC_PRM_01: Expired voucher
    it('should throw an error if the voucher is expired', async () => {
      // Arrange
      const promoData = {
        PromotionID: testData.promotions.expiredVoucher.PromotionID,
        PromotionCode: testData.promotions.expiredVoucher.Code,
        PromotionName: 'Expired 50%',
        Status: testData.promotions.expiredVoucher.Status,
        StartDate: testData.promotions.expiredVoucher.StartDate,
        EndDate: testData.promotions.expiredVoucher.EndDate,
        UsageLimit: testData.promotions.expiredVoucher.PerUserLimit,
        UsedCount: 0,
        PerUserLimit: 1,
        ApplyScope: testData.promotions.expiredVoucher.ApplyScope,
        MinOrderAmount: testData.promotions.expiredVoucher.MinOrderValue,
        DiscountType: testData.promotions.expiredVoucher.DiscountType,
        DiscountValue: testData.promotions.expiredVoucher.DiscountValue,
        MaxDiscountAmount: testData.promotions.expiredVoucher.MaxDiscount,
      };

      vi.mocked(promotionsRepo.findPromotionByCode).mockResolvedValue(promoData as any);

      // Act & Assert
      await expect(
        promotionsService.validatePromotion(1, 'EXPIRED50', 101)
      ).rejects.toThrow('Voucher không trong thời gian hiệu lực');
    });

    // TC_PRM_02: Valid voucher calculation
    it('should validate and calculate discount correctly for a valid voucher', async () => {
      // Arrange
      const promoData = {
        PromotionID: testData.promotions.validVoucher.PromotionID,
        PromotionCode: testData.promotions.validVoucher.Code,
        PromotionName: 'Welcome 10%',
        Status: testData.promotions.validVoucher.Status,
        StartDate: testData.promotions.validVoucher.StartDate,
        EndDate: testData.promotions.validVoucher.EndDate,
        UsageLimit: 100,
        UsedCount: 10,
        PerUserLimit: testData.promotions.validVoucher.PerUserLimit,
        ApplyScope: testData.promotions.validVoucher.ApplyScope,
        MinOrderAmount: testData.promotions.validVoucher.MinOrderValue,
        DiscountType: 'Percent', // Use 'Percent' or 'Fixed' matching service code line 27
        DiscountValue: testData.promotions.validVoucher.DiscountValue,
        MaxDiscountAmount: testData.promotions.validVoucher.MaxDiscount,
      };

      const mockBooking = {
        BookingID: 101,
        UserID: 1,
        Status: 'PendingPayment',
        OriginalAmount: 700000,
        TotalAmount: 700000,
        DiscountAmount: 0,
      };

      vi.mocked(promotionsRepo.findPromotionByCode).mockResolvedValue(promoData as any);
      vi.mocked(promotionsRepo.countUserPromotionUsages).mockResolvedValue(0);

      // Mock database call to get booking for promotion
      const mockQuery = vi.fn().mockResolvedValue({
        recordset: [mockBooking],
      });
      const mockRequest = {
        input: vi.fn().mockReturnThis(),
        query: mockQuery,
      };
      const mockPool = {
        request: vi.fn().mockReturnValue(mockRequest),
      };
      vi.mocked(getPool).mockResolvedValue(mockPool as any);

      // Act
      const result = await promotionsService.validatePromotion(1, 'WELCOME10', 101);

      // Assert
      expect(result.promotionId).toBe(promoData.PromotionID);
      expect(result.originalAmount).toBe(700000);
      // Welcome 10% on 700k = 70k, capped at 50% booking amount (350k) and max discount (50k)
      // Since max discount is 50k, it should be 50000!
      expect(result.discountAmount).toBe(50000);
      expect(result.finalAmount).toBe(650000);
    });
  });
});
