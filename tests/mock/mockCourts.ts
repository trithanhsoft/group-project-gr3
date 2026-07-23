import { vi } from 'vitest';
import { testData } from '../data/testData';

export const mockCourtRepository = {
  getAllCourts: vi.fn().mockImplementation(async (includeInactive: boolean) => {
    if (includeInactive) {
      return [testData.courts.validCourt, testData.courts.inactiveCourt];
    }
    return [testData.courts.validCourt];
  }),
  getCourtById: vi.fn().mockImplementation(async (courtId: number) => {
    if (courtId === testData.courts.validCourt.CourtID) {
      return testData.courts.validCourt;
    }
    return null;
  }),
  getAvailableCourts: vi.fn().mockResolvedValue([testData.courts.validCourt]),
  getCourtSlots: vi.fn().mockImplementation(async (courtId: number, slotDate: string) => {
    return [
      { SlotID: 10, StartTime: "08:00", EndTime: "09:00", Price: 350000, Status: "Available" },
      { SlotID: 11, StartTime: "09:00", EndTime: "10:00", Price: 350000, Status: "Available" },
      { SlotID: 12, StartTime: "10:00", EndTime: "11:00", Price: 350000, Status: "Booked" },
    ];
  }),
  createCourt: vi.fn().mockImplementation(async (court: any) => {
    return { CourtID: 3, ...court };
  }),
};
