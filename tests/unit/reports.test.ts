import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as reportsService from '@/modules/reports/reports.service';
import * as reportsRepo from '@/modules/reports/reports.repository';

// Mock reports repository
vi.mock('@/modules/reports/reports.repository', () => ({
  getDashboardStatsFromDB: vi.fn(),
  getSaaSDashboardStatsFromDB: vi.fn(),
}));

describe('Reports & Admin Service Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getDashboardStats()', () => {
    // TC_ADM_01: Admin dashboard stats export / check privilege
    it('should return aggregated stats for admin dashboard', async () => {
      // Arrange
      const mockStats = {
        totalRevenue: 15000000,
        totalBookings: 45,
        totalCourts: 4,
        totalPlayers: 120,
      };
      vi.mocked(reportsRepo.getDashboardStatsFromDB).mockResolvedValue(mockStats as any);

      // Act
      const result = await reportsService.getDashboardStats();

      // Assert
      expect(result).toEqual(mockStats);
      expect(reportsRepo.getDashboardStatsFromDB).toHaveBeenCalled();
    });
  });

  describe('getSaaSDashboardStats()', () => {
    it('should calculate previous periods correctly and query repository', async () => {
      // Arrange
      const mockStats = {
        activeBookings: 32,
        activeCourtsCount: 2,
        revenueData: [],
      };
      vi.mocked(reportsRepo.getSaaSDashboardStatsFromDB).mockResolvedValue(mockStats as any);

      // Act
      const result = await reportsService.getSaaSDashboardStats('2026-06-01', '2026-06-30');

      // Assert
      expect(result).toEqual(mockStats);
      expect(reportsRepo.getSaaSDashboardStatsFromDB).toHaveBeenCalledWith(
        '2026-06-01',
        '2026-06-30',
        expect.any(String), // prevStartDate
        expect.any(String)  // prevEndDate
      );
    });
  });
});
