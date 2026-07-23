import { vi } from 'vitest';

export const mockRecordset = [];
export const mockQuery = vi.fn().mockResolvedValue({ recordset: mockRecordset });
export const mockInput = vi.fn().mockReturnThis();

export const mockRequest = {
  input: mockInput,
  query: mockQuery,
};

export const mockPool = {
  request: vi.fn().mockReturnValue(mockRequest),
  query: mockQuery,
  connect: vi.fn().mockResolvedValue(true),
};

// Mock mssql library functions
export const mockMssql = {
  connect: vi.fn().mockResolvedValue(mockPool),
  Int: 'Int',
  NVarChar: 'NVarChar',
  DateTime: 'DateTime',
  Decimal: 'Decimal',
  Bit: 'Bit',
  VarChar: 'VarChar',
};

// We can use this to mock connection.ts
export const mockGetPool = vi.fn().mockResolvedValue(mockPool);
