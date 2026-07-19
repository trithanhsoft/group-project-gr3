import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as notificationsService from '@/modules/notifications/notifications.service';
import * as notificationsRepo from '@/modules/notifications/notifications.repository';

// Mock notifications repository
vi.mock('@/modules/notifications/notifications.repository', () => ({
  insertNotification: vi.fn(),
  getMyNotifications: vi.fn(),
  countUnreadNotifications: vi.fn(),
  markNotificationAsRead: vi.fn(),
  markAllNotificationsAsRead: vi.fn(),
}));

describe('Notification Service Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createNotification()', () => {
    it('should call insertNotification but not throw error on repo failure', async () => {
      // Arrange
      const input = {
        userId: 1,
        title: "Test Title",
        message: "Test Message",
        notificationType: "Booking" as const,
      };

      vi.mocked(notificationsRepo.insertNotification).mockRejectedValue(new Error("Database error"));

      // Act & Assert
      // Should not throw!
      await expect(notificationsService.createNotification(input)).resolves.not.toThrow();
      expect(notificationsRepo.insertNotification).toHaveBeenCalledWith(input);
    });
  });

  describe('getMyNotifications()', () => {
    it('should return user notifications list', async () => {
      // Arrange
      const mockNotifs = [
        { NotificationID: 1, UserID: 1, Title: "A", Message: "B", Status: "Sent" }
      ];
      vi.mocked(notificationsRepo.getMyNotifications).mockResolvedValue(mockNotifs as any);

      // Act
      const result = await notificationsService.getMyNotifications(1, 10);

      // Assert
      expect(result).toEqual(mockNotifs);
      expect(notificationsRepo.getMyNotifications).toHaveBeenCalledWith(1, 10);
    });
  });
});
