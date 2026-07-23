import { vi } from 'vitest';
import { testData } from '../data/testData';

export const mockGenerativeModel = {
  generateContent: vi.fn().mockImplementation(async (prompt: string) => {
    // Return mock response based on prompt structure
    if (prompt.includes("fail") || prompt.includes("timeout")) {
      throw new Error("Gemini AI API service unavailable or timed out");
    }
    return {
      response: {
        text: () => JSON.stringify(testData.ai.successResponse),
      },
    };
  }),
};

export const mockGoogleGenAI = {
  getGenerativeModel: vi.fn().mockReturnValue(mockGenerativeModel),
};

vi.mock('@google/generativeai', () => ({
  GoogleGenAI: vi.fn().mockImplementation(() => mockGoogleGenAI),
}));
