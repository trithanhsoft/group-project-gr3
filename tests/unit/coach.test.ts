import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as coachService from '@/modules/coaches/coaches.service';
import * as coachRepo from '@/modules/coaches/coaches.repository';
import { testData } from '../data/testData';

// Mock coaches.repository
vi.mock('@/modules/coaches/coaches.repository', () => ({
  findAllApprovedCoaches: vi.fn(),
  findCoachById: vi.fn(),
  findAvailableCoachSchedules: vi.fn(),
  findCoachByUserId: vi.fn(),
}));

describe('Coach Service Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllCoaches()', () => {
    // TC_CCH_01: Search coaches
    it('should return all approved coaches by default', async () => {
      // Arrange
      const mockCoaches = [testData.users.coachUser];
      vi.mocked(coachRepo.findAllApprovedCoaches).mockResolvedValue(mockCoaches as any);

      // Act
      const result = await coachService.getAllCoaches();

      // Assert
      expect(result).toEqual(mockCoaches);
      expect(coachRepo.findAllApprovedCoaches).toHaveBeenCalledWith({});
    });
  });

  describe('getCoachById()', () => {
    it('should return coach profile if coach exists', async () => {
      // Arrange
      const mockProfile = {
        ...testData.users.coachUser,
        HourlyRate: 200000,
        Rating: 4.8,
        Specialty: "Advanced Play",
      };
      vi.mocked(coachRepo.findCoachById).mockResolvedValue(mockProfile as any);

      // Act
      const result = await coachService.getCoachById(3);

      // Assert
      expect(result).toEqual(mockProfile);
      expect(coachRepo.findCoachById).toHaveBeenCalledWith(3);
    });

    it('should throw error if coach does not exist', async () => {
      // Arrange
      vi.mocked(coachRepo.findCoachById).mockResolvedValue(null);

      // Act & Assert
      await expect(coachService.getCoachById(999)).rejects.toThrow('Coach không tồn tại hoặc chưa được duyệt');
    });
  });

  describe('getAvailableCoachSchedules()', () => {
    // TC_CCH_02: View Coach Schedules
    it('should return working schedules', async () => {
      // Arrange
      const futureDate = new Date(Date.now() + 86400000 * 10);
      const dateStr = futureDate.toISOString().split('T')[0];
      const mockSchedules = [
        { ScheduleID: 201, CoachID: 3, WorkingDate: dateStr, StartTime: '08:00', EndTime: '12:00', Status: 'Available' }
      ];
      vi.mocked(coachRepo.findAvailableCoachSchedules).mockResolvedValue(mockSchedules as any);

      // Act
      const result = await coachService.getAvailableCoachSchedules(dateStr, '08:00', '10:00');

      // Assert
      expect(result).toEqual(mockSchedules);
      expect(coachRepo.findAvailableCoachSchedules).toHaveBeenCalledWith(dateStr, '08:00', '10:00');
    });
  });
});
