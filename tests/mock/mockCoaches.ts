import { vi } from 'vitest';
import { testData } from '../data/testData';

export const mockCoachRepository = {
  getAllCoaches: vi.fn().mockResolvedValue([testData.users.coachUser]),
  getCoachById: vi.fn().mockImplementation(async (id: number) => {
    if (id === testData.users.coachUser.UserID) {
      return {
        ...testData.users.coachUser,
        HourlyRate: 200000,
        Rating: 4.8,
        Specialty: "Advanced Play & Spin Techniques",
      };
    }
    return null;
  }),
  getCoachIncome: vi.fn().mockImplementation(async (coachId: number, month: number, year: number) => {
    return {
      CoachID: coachId,
      Month: month,
      Year: year,
      TotalHours: 15,
      TotalIncome: 3000000,
      Status: "Unpaid",
    };
  }),
  getCoachSchedule: vi.fn().mockResolvedValue([
    { ScheduleID: 201, CoachID: 3, Date: "2026-07-01", StartTime: "08:00", EndTime: "12:00", Status: "Available" }
  ]),
};
