import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as reviewsService from '@/modules/reviews/reviews.service';
import * as reviewsRepo from '@/modules/reviews/reviews.repository';

// Mock reviews repository
vi.mock('@/modules/reviews/reviews.repository', () => ({
  findPublicReviews: vi.fn(),
  findCoachReviews: vi.fn(),
}));

describe('Review Service Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getPublicReviews()', () => {
    it('should call findPublicReviews with correct limit', async () => {
      // Arrange
      const mockReviews = [
        { ReviewID: 1, UserID: 10, Rating: 5, Comment: "Sân rất đẹp!" }
      ];
      vi.mocked(reviewsRepo.findPublicReviews).mockResolvedValue(mockReviews);

      // Act
      const result = await reviewsService.getPublicReviews(5);

      // Assert
      expect(result).toEqual(mockReviews);
      expect(reviewsRepo.findPublicReviews).toHaveBeenCalledWith(5);
    });
  });

  describe('getCoachReviews()', () => {
    it('should call findCoachReviews with correct coachId', async () => {
      // Arrange
      const mockReviews = [
        { ReviewID: 2, UserID: 12, Rating: 4, Comment: "Coach rất nhiệt tình" }
      ];
      vi.mocked(reviewsRepo.findCoachReviews).mockResolvedValue(mockReviews);

      // Act
      const result = await reviewsService.getCoachReviews(3);

      // Assert
      expect(result).toEqual(mockReviews);
      expect(reviewsRepo.findCoachReviews).toHaveBeenCalledWith(3);
    });
  });
});
