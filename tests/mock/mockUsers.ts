import { vi } from 'vitest';
import { testData } from '../data/testData';

export const mockUserRepository = {
  getUserByEmail: vi.fn().mockImplementation(async (email: string) => {
    if (email === testData.users.validNewUser.Email) {
      return testData.users.validNewUser;
    }
    return null;
  }),
  createUser: vi.fn().mockImplementation(async (user: any) => {
    return { UserID: 4, ...user };
  }),
  getUserById: vi.fn().mockImplementation(async (id: number) => {
    if (id === testData.users.validNewUser.UserID) {
      return testData.users.validNewUser;
    }
    return null;
  }),
  updateUserStatus: vi.fn().mockResolvedValue(true),
};
