import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST as createBookingHandler } from '@/app/api/bookings/court/route';
import * as bookingsService from '@/modules/bookings/bookings.service';
import { NextRequest } from 'next/server';
import { testData } from '../data/testData';

// Mock bookings.service
vi.mock('@/modules/bookings/bookings.service', () => ({
  createCourtBooking: vi.fn(),
}));

describe('Bookings API Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/bookings', () => {
    it('should successfully create a new booking for authenticated user', async () => {
      // Arrange
      const mockResult = {
        BookingID: 101,
        UserID: 1,
        CourtID: 1,
        TotalPrice: 700000,
        Status: 'Pending',
      };
      vi.mocked(bookingsService.createCourtBooking).mockResolvedValue(mockResult as any);

      const requestBody = {
        courtId: 1,
        bookingDate: '2026-07-01',
        startTime: '08:00',
        endTime: '10:00',
      };

      const req = new NextRequest('http://localhost/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock-player-token',
        },
        body: JSON.stringify(requestBody),
      });

      // Act
      const res = await createBookingHandler(req);
      const body = await res.json();

      // Assert
      expect(res.status).toBe(201);
      expect(body.success).toBe(true);
      expect(body.data).toEqual(mockResult);
      expect(bookingsService.createCourtBooking).toHaveBeenCalledWith({
        ...requestBody,
        userId: 1,
      });
    });

    it('should return 401 if request is unauthenticated', async () => {
      // Arrange
      const requestBody = {
        courtId: 1,
        bookingDate: '2026-07-01',
        startTime: '08:00',
        endTime: '10:00',
      };

      const req = new NextRequest('http://localhost/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      // Act
      const res = await createBookingHandler(req);
      const body = await res.json();

      // Assert
      expect(res.status).toBe(401);
      expect(body.success).toBe(false);
      expect(body.message).toContain('Bạn chưa đăng nhập');
    });
  });
});
