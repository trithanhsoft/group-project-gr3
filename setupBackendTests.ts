import { vi } from 'vitest';

// Mock bcryptjs globally
vi.mock('bcryptjs', () => ({
  default: {
    compare: vi.fn().mockResolvedValue(true),
    hash: vi.fn().mockResolvedValue('hashed_password'),
  },
  compare: vi.fn().mockResolvedValue(true),
  hash: vi.fn().mockResolvedValue('hashed_password'),
}));

// Mock JWT globally
vi.mock('@/utils/jwt', () => ({
  verifyAccessToken: vi.fn().mockImplementation((token: string) => {
    if (token === 'mock-admin-token') {
      return { userId: 2, email: 'admin@pickleclub.vn', roles: ['Admin'] };
    }
    if (token === 'mock-player-token') {
      return { userId: 1, email: 'johndoe@example.com', roles: ['Player'] };
    }
    throw new Error('Invalid token');
  }),
  signAccessToken: vi.fn().mockReturnValue('mock-token-string'),
}));

// Mock global fetch
export const mockFetch = vi.fn().mockImplementation(async (url: string) => {
  if (url.includes('analyze-intent')) {
    return {
      ok: true,
      status: 200,
      json: async () => ({
        intent: 'court_booking',
        entities: { date: '2026-07-01', startTime: '08:00', endTime: '10:00' },
        confidence: 0.95
      })
    };
  }
  return { ok: false, status: 404 };
});

global.fetch = mockFetch;
globalThis.fetch = mockFetch;

// Define database mock globals
const mockRecordset: any[] = [];
const mockQuery = vi.fn().mockResolvedValue({ recordset: mockRecordset });
const mockInput = vi.fn().mockReturnThis();

const mockRequest = {
  input: mockInput,
  query: mockQuery,
};

const mockPool = {
  request: () => mockRequest,
  query: mockQuery,
  connect: vi.fn().mockResolvedValue(true),
};

// Mock mssql library globally for backend project
vi.mock('mssql', () => ({
  default: {
    connect: vi.fn().mockResolvedValue(mockPool),
    Int: 'Int',
    NVarChar: 'NVarChar',
    DateTime: 'DateTime',
    Decimal: 'Decimal',
    Bit: 'Bit',
    VarChar: 'VarChar',
  },
  connect: vi.fn().mockResolvedValue(mockPool),
  Int: 'Int',
  NVarChar: 'NVarChar',
  DateTime: 'DateTime',
  Decimal: 'Decimal',
  Bit: 'Bit',
  VarChar: 'VarChar',
}));

// Mock connection.ts
vi.mock('@/database/connection', () => ({
  getPool: vi.fn().mockResolvedValue(mockPool),
  sql: {
    Int: 'Int',
    NVarChar: 'NVarChar',
    DateTime: 'DateTime',
    Decimal: 'Decimal',
    Bit: 'Bit',
    VarChar: 'VarChar',
  }
}));
