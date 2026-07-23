import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as authService from '@/modules/auth/auth.service';
import * as authRepo from '@/modules/auth/auth.repository';
import bcrypt from 'bcryptjs';
import { testData } from '../data/testData';

// Mock bcryptjs
vi.mock('bcryptjs', () => ({
  default: {
    compare: vi.fn().mockResolvedValue(true),
    hash: vi.fn().mockResolvedValue('hashed_password'),
  },
  compare: vi.fn().mockResolvedValue(true),
  hash: vi.fn().mockResolvedValue('hashed_password'),
}));

// Mock auth.repository
vi.mock('@/modules/auth/auth.repository', () => ({
  findUserByEmail: vi.fn(),
  findUserByPhoneNumber: vi.fn(),
  createPendingRegister: vi.fn(),
  deletePendingRegisterByEmail: vi.fn(),
  increaseFailedLogin: vi.fn().mockResolvedValue(true),
  resetFailedLogin: vi.fn().mockResolvedValue(true),
  findRolesByUserId: vi.fn().mockResolvedValue(['Player']),
}));

// Mock utils/mail & utils/otp
vi.mock('@/utils/mail', () => ({
  sendOtpEmail: vi.fn().mockResolvedValue(true),
}));

vi.mock('@/utils/otp', () => ({
  generateOtp: vi.fn().mockReturnValue('123456'),
  hashOtp: vi.fn().mockResolvedValue('hashed_otp_123'),
  compareOtp: vi.fn().mockResolvedValue(true),
}));

describe('User & Authentication Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('login()', () => {
    // TC_USR_01: Login with valid credentials (AAA Pattern)
    it('should login successfully with valid credentials', async () => {
      // Arrange
      const mockUser = {
        UserID: testData.users.validNewUser.UserID,
        FullName: testData.users.validNewUser.FullName,
        Email: testData.users.validNewUser.Email,
        PasswordHash: 'hashed_password',
        Status: 'Active',
        RoleName: 'Player',
      };
      
      vi.mocked(authRepo.findUserByEmail).mockResolvedValue(mockUser);

      // Act
      const result = await authService.login({
        email: testData.users.validNewUser.Email,
        password: testData.users.validNewUser.Password,
      });

      // Assert
      expect(result).toHaveProperty('token');
      expect(result.user.email).toBe(mockUser.Email);
      expect(authRepo.findUserByEmail).toHaveBeenCalledWith(mockUser.Email);
    });

    it('should throw an error if user does not exist', async () => {
      // Arrange
      vi.mocked(authRepo.findUserByEmail).mockResolvedValue(null);

      // Act & Assert
      await expect(
        authService.login({
          email: 'notfound@example.com',
          password: 'Password123!',
        })
      ).rejects.toThrow('Invalid email or password');
    });
  });

  describe('register()', () => {
    // TC_USR_02: Register with duplicate email
    it('should throw an error if email already exists', async () => {
      // Arrange
      const input = {
        fullName: testData.users.duplicateEmailUser.FullName,
        email: testData.users.duplicateEmailUser.Email,
        phoneNumber: testData.users.duplicateEmailUser.PhoneNumber,
        password: testData.users.duplicateEmailUser.Password,
      };
      
      vi.mocked(authRepo.findUserByEmail).mockResolvedValue({ UserID: 10 } as any);

      // Act & Assert
      await expect(authService.register(input)).rejects.toThrow('Email already exists');
    });

    it('should successfully create pending register and send OTP if email and phone are unique', async () => {
      // Arrange
      const input = {
        fullName: 'New User',
        email: 'newuser@example.com',
        phoneNumber: '0988776655',
        password: 'Password123!',
      };
      
      vi.mocked(authRepo.findUserByEmail).mockResolvedValue(null);
      vi.mocked(authRepo.findUserByPhoneNumber).mockResolvedValue(null);
      vi.spyOn(bcrypt, 'hash').mockImplementation(() => Promise.resolve('hashed_new_pass'));

      // Act
      const result = await authService.register(input);

      // Assert
      expect(result.message).toContain('OTP đã được gửi');
      expect(result.email).toBe(input.email);
      expect(authRepo.createPendingRegister).toHaveBeenCalled();
    });
  });
});
