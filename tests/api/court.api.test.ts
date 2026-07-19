import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET as getCourtsHandler } from '@/app/api/courts/route';
import * as courtService from '@/modules/courts/courts.service';
import { NextRequest } from 'next/server';
import { testData } from '../data/testData';

// Mock court.service
vi.mock('@/modules/courts/courts.service', () => ({
  getAllCourts: vi.fn(),
}));

describe('Courts API Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/courts', () => {
    it('should return list of courts successfully', async () => {
      // Arrange
      const mockCourts = [testData.courts.validCourt];
      vi.mocked(courtService.getAllCourts).mockResolvedValue(mockCourts);

      const req = new NextRequest('http://localhost/api/courts');

      // Act
      const res = await getCourtsHandler(req);
      const body = await res.json();

      // Assert
      expect(res.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.data).toEqual(mockCourts);
      expect(courtService.getAllCourts).toHaveBeenCalledWith(false);
    });

    it('should call getAllCourts with true if includeInactive is true (requires admin token authentication)', async () => {
      // Arrange
      const mockCourts = [testData.courts.validCourt, testData.courts.inactiveCourt];
      vi.mocked(courtService.getAllCourts).mockResolvedValue(mockCourts);

      const req = new NextRequest('http://localhost/api/courts?includeInactive=true', {
        headers: {
          'Authorization': 'Bearer mock-admin-token',
        },
      });

      // Act
      const res = await getCourtsHandler(req);
      const body = await res.json();

      // Assert
      expect(res.status).toBe(200);
      expect(body.success).toBe(true);
      expect(courtService.getAllCourts).toHaveBeenCalledWith(true);
    });

    it('should return 401 Unauthorized for includeInactive if token is missing', async () => {
      const req = new NextRequest('http://localhost/api/courts?includeInactive=true');

      // Act
      const res = await getCourtsHandler(req);
      const body = await res.json();

      // Assert
      expect(res.status).toBe(401);
      expect(body.success).toBe(false);
      expect(body.message).toContain('Bạn chưa đăng nhập');
    });
  });
});
