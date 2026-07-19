import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as playerMatchingService from '@/modules/player-matching/player-matching.service';
import * as playerMatchingRepo from '@/modules/player-matching/player-matching.repository';

// Mock player matching repository
vi.mock('@/modules/player-matching/player-matching.repository', () => ({
  findProfileByUserId: vi.fn(),
  updatePlayerProfile: vi.fn(),
}));

describe('Player Matching & Scoring Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('calculateRoleScore()', () => {
    it('should return 100 for complementary attacker and defender roles', () => {
      expect(playerMatchingService.calculateRoleScore('attacker', 'defender')).toBe(100);
      expect(playerMatchingService.calculateRoleScore('defender', 'attacker')).toBe(100);
    });

    it('should return 75 if either role is all-rounder', () => {
      expect(playerMatchingService.calculateRoleScore('attacker', 'all-rounder')).toBe(75);
      expect(playerMatchingService.calculateRoleScore('all-rounder', 'defender')).toBe(75);
    });

    it('should return 30 if roles are identical', () => {
      expect(playerMatchingService.calculateRoleScore('attacker', 'attacker')).toBe(30);
    });
  });

  describe('calculateSkillScore()', () => {
    it('should return 100 if skill levels are identical', () => {
      expect(playerMatchingService.calculateSkillScore('Intermediate', 'Intermediate')).toBe(100);
    });

    it('should calculate score based on diff steps', () => {
      // Beginner (1) vs Intermediate (2) -> diff 1 -> 100 - 25 = 75
      expect(playerMatchingService.calculateSkillScore('Beginner', 'Intermediate')).toBe(75);
      // Beginner (1) vs Professional (4) -> diff 3 -> 100 - 75 = 25
      expect(playerMatchingService.calculateSkillScore('Beginner', 'Professional')).toBe(25);
    });
  });

  describe('calculateScheduleScore()', () => {
    it('should return 100 for overlap of >= 90 mins', () => {
      // 08:00 to 10:00 (120 mins) vs 08:30 to 11:00 (150 mins)
      // Overlap: 08:30 to 10:00 = 90 mins
      expect(playerMatchingService.calculateScheduleScore('08:00', '10:00', '08:30', '11:00')).toBe(100);
    });

    it('should return 70 for overlap of 60 to 89 mins', () => {
      // 08:00 to 09:30 (90 mins) vs 08:30 to 11:00 (150 mins)
      // Overlap: 08:30 to 09:30 = 60 mins
      expect(playerMatchingService.calculateScheduleScore('08:00', '09:30', '08:30', '11:00')).toBe(70);
    });

    it('should return 0 for overlap of < 60 mins', () => {
      expect(playerMatchingService.calculateScheduleScore('08:00', '09:00', '08:45', '11:00')).toBe(0);
    });
  });
});
