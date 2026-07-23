import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as courtService from '@/modules/courts/courts.service';
import * as courtRepo from '@/modules/courts/courts.repository';
import { testData } from '../data/testData';

// Mock court.repository
vi.mock('@/modules/courts/courts.repository', () => ({
  findAllCourts: vi.fn(),
  findCourtById: vi.fn(),
  findAvailableCourts: vi.fn(),
  createCourt: vi.fn(),
}));

describe('Court Service Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllCourts()', () => {
    // TC_CRT_01: List Active Courts
    it('should return all active courts by default', async () => {
      // Arrange
      const mockCourts = [testData.courts.validCourt];
      vi.mocked(courtRepo.findAllCourts).mockResolvedValue(mockCourts as any);

      // Act
      const result = await courtService.getAllCourts();

      // Assert
      expect(result).toEqual(mockCourts);
      expect(courtRepo.findAllCourts).toHaveBeenCalledWith(false);
    });

    it('should return active and inactive courts when includeInactive is true', async () => {
      // Arrange
      const mockCourts = [testData.courts.validCourt, testData.courts.inactiveCourt];
      vi.mocked(courtRepo.findAllCourts).mockResolvedValue(mockCourts as any);

      // Act
      const result = await courtService.getAllCourts(true);

      // Assert
      expect(result).toEqual(mockCourts);
      expect(courtRepo.findAllCourts).toHaveBeenCalledWith(true);
    });
  });

  describe('getCourtById()', () => {
    it('should return court detail if court exists', async () => {
      // Arrange
      vi.mocked(courtRepo.findCourtById).mockResolvedValue(testData.courts.validCourt as any);

      // Act
      const result = await courtService.getCourtById(testData.courts.validCourt.CourtID);

      // Assert
      expect(result).toEqual(testData.courts.validCourt);
      expect(courtRepo.findCourtById).toHaveBeenCalledWith(testData.courts.validCourt.CourtID);
    });

    it('should throw error if court does not exist', async () => {
      // Arrange
      vi.mocked(courtRepo.findCourtById).mockResolvedValue(null as any);

      // Act & Assert
      await expect(courtService.getCourtById(999)).rejects.toThrow('Court not found');
    });
  });

  describe('getAvailableCourts()', () => {
    // TC_CRT_02: View slots / Available courts
    it('should call findAvailableCourts with booking date', async () => {
      // Arrange
      vi.mocked(courtRepo.findAvailableCourts).mockResolvedValue([testData.courts.validCourt] as any);

      // Act
      const result = await courtService.getAvailableCourts('2026-07-01', '', '');

      // Assert
      expect(result).toEqual([testData.courts.validCourt]);
      expect(courtRepo.findAvailableCourts).toHaveBeenCalledWith('2026-07-01', '', '');
    });

    it('should validate time range if startTime and endTime are supplied', async () => {
      // Arrange
      vi.mocked(courtRepo.findAvailableCourts).mockResolvedValue([testData.courts.validCourt] as any);

      // Act
      const result = await courtService.getAvailableCourts('2026-07-01', '08:00', '10:00');

      // Assert
      expect(result).toEqual([testData.courts.validCourt]);
    });

    it('should throw error if only one of startTime or endTime is supplied', async () => {
      // Act & Assert
      await expect(
        courtService.getAvailableCourts('2026-07-01', '08:00', '')
      ).rejects.toThrow('Cần cung cấp cả startTime và endTime, hoặc không cung cấp cả hai');
    });
  });
});
