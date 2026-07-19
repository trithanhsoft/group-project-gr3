import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as aiService from '@/modules/ai/ai.service';
import { testData } from '../data/testData';

// Mock dependent services to avoid real database calls
vi.mock('@/modules/courts/courts.service', () => ({
  getAllCourts: vi.fn().mockResolvedValue([]),
  getAvailableCourts: vi.fn().mockResolvedValue([]),
}));

vi.mock('@/modules/coaches/coaches.service', () => ({
  getAllCoaches: vi.fn().mockResolvedValue([]),
}));

vi.mock('@/modules/player-matching/player-matching.repository', () => ({
  findProfileByUserId: vi.fn().mockResolvedValue(null),
}));

describe('AI Assistant Service Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('analyzeIntentWithFastAPI()', () => {
    // TC_AI_01: Success chatbot flow
    it('should successfully analyze intent via AI service and return structured response', async () => {
      // Act
      const result: any = await aiService.analyzeIntentWithFastAPI("Tôi muốn đặt sân ngày 01/07 từ 8h đến 10h");

      // Assert
      expect(result.intent).toBe("court_booking");
      expect(result.entities.date).toBe("2026-07-01");
      expect(global.fetch).toHaveBeenCalled();
    });

    // TC_AI_02: AI Service Down / Timeout Fallback
    it('should throw an error when FastAPI service is down/fails', async () => {
      // Arrange - Mock fetch failure once
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        status: 503,
      } as any);

      // Act & Assert
      await expect(
        aiService.analyzeIntentWithFastAPI("Tôi muốn đặt sân")
      ).rejects.toThrow('Failed to analyze intent from AI Service');
    });
  });
});
