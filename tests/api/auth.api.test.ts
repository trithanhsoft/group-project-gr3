import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST as loginHandler } from '@/app/api/auth/login/route';
import { POST as registerHandler } from '@/app/api/auth/register/route';
import * as authService from '@/modules/auth/auth.service';
import { NextRequest } from 'next/server';
import { testData } from '../data/testData';

// Mock auth.service methods
vi.mock('@/modules/auth/auth.service', () => ({
  login: vi.fn(),
  register: vi.fn(),
}));

describe('Auth API Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/auth/login', () => {
    it('should return token and user info on successful login', async () => {
      // Arrange
      const mockResult = {
        token: 'mock-jwt-token-xyz',
        user: {
          userId: 1,
          fullName: testData.users.validNewUser.FullName,
          email: testData.users.validNewUser.Email,
          phoneNumber: testData.users.validNewUser.PhoneNumber,
        },
      };
      vi.mocked(authService.login).mockResolvedValue(mockResult as any);

      const requestBody = {
        email: testData.users.validNewUser.Email,
        password: testData.users.validNewUser.Password,
      };
      
      const req = new NextRequest('http://localhost/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      // Act
      const res = await loginHandler(req);
      const body = await res.json();

      // Assert
      expect(res.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.data).toEqual(mockResult);
      expect(authService.login).toHaveBeenCalledWith(requestBody);
    });

    it('should return error status and message on login failure', async () => {
      // Arrange
      vi.mocked(authService.login).mockRejectedValue(new Error('Invalid email or password'));

      const req = new NextRequest('http://localhost/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'wrong@example.com', password: 'wrong' }),
      });

      // Act
      const res = await loginHandler(req);
      const body = await res.json();

      // Assert
      expect(res.status).toBe(500); // handleError handles custom errors or fallback to 500
      expect(body.success).toBe(false);
      expect(body.message).toContain('Invalid email or password');
    });
  });

  describe('POST /api/auth/register', () => {
    it('should return success and OTP instructions on valid register fields', async () => {
      // Arrange
      const mockResult = {
        message: 'OTP đã được gửi đến Gmail',
        email: 'newuser@example.com',
      };
      vi.mocked(authService.register).mockResolvedValue(mockResult as any);

      const requestBody = {
        fullName: 'New User',
        email: 'newuser@example.com',
        phoneNumber: '0988776655',
        password: 'Password123!',
      };

      const req = new NextRequest('http://localhost/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      // Act
      const res = await registerHandler(req);
      const body = await res.json();

      // Assert
      expect(res.status).toBe(201);
      expect(body.success).toBe(true);
      expect(body.data).toEqual(mockResult);
      expect(authService.register).toHaveBeenCalledWith(requestBody);
    });
  });
});
