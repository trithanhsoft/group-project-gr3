import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST as payosWebhookHandler } from '@/app/api/payments/payos-webhook/route';
import * as paymentsRepo from '@/modules/payments/payments.repository';
import { verifyPayosWebhook } from '@/modules/payments/gateways/payos.gateway';
import { NextRequest } from 'next/server';
import { testData } from '../data/testData';

// Mock payments repository
vi.mock('@/modules/payments/payments.repository', () => ({
  getPaymentByCode: vi.fn(),
  getPaymentByGatewayOrderId: vi.fn(),
  updatePaymentGatewayInfo: vi.fn().mockResolvedValue(true),
  markPaymentPaid: vi.fn().mockResolvedValue(true),
}));

// Mock payos gateway methods
vi.mock('@/modules/payments/gateways/payos.gateway', () => ({
  verifyPayosWebhook: vi.fn().mockReturnValue({
    isValid: true,
    data: {
      orderCode: 1780151464,
      amount: 700000,
      description: 'Thanh toan don hang BK-1780151464',
      status: 'PAID',
      reference: 'PAYOS_REF_123',
    },
  }),
  isPayosWebhookSuccess: vi.fn().mockReturnValue(true),
}));

// Mock connection to avoid real DB imports in webhook subroutines
vi.mock('@/database/connection', () => ({
  getPool: vi.fn().mockResolvedValue({
    request: vi.fn().mockReturnValue({
      input: vi.fn().mockReturnThis(),
      query: vi.fn().mockResolvedValue({
        recordset: [{ SlotID: 10, CoachScheduleID: null }],
      }),
    }),
  }),
  sql: {
    Int: 'Int',
  },
}));

describe('Payments Webhook API Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default valid mock values
    vi.mocked(verifyPayosWebhook).mockReturnValue({
      isValid: true,
      data: {
        orderCode: 1780151464,
        amount: 700000,
        description: 'Thanh toan don hang BK-1780151464',
        status: 'PAID',
        reference: 'PAYOS_REF_123',
      },
    } as any);
  });

  describe('POST /api/payments/payos-webhook', () => {
    it('should process paid payos webhook callback successfully and update payment status', async () => {
      // Arrange
      const mockPayment = {
        PaymentID: 501,
        BookingID: 101,
        OrderCode: 1780151464,
        Amount: 700000,
        Status: 'Pending',
      };
      
      vi.mocked(paymentsRepo.getPaymentByGatewayOrderId).mockResolvedValue(mockPayment as any);

      const requestBody = {
        success: true,
        data: testData.payments.payOSWebhookMock.data,
      };

      const req = new NextRequest('http://localhost/api/payments/payos-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      // Act
      const res = await payosWebhookHandler(req);
      const body = await res.json();

      // Assert
      expect(res.status).toBe(200);
      expect(body.success).toBe(true);
      expect(paymentsRepo.getPaymentByGatewayOrderId).toHaveBeenCalledWith('1780151464');
    });

    it('should return 400 Bad Request when signature is invalid', async () => {
      // Arrange
      vi.mocked(verifyPayosWebhook).mockReturnValue({
        isValid: false,
        data: null,
      } as any);

      const requestBody = {
        success: true,
        data: testData.payments.payOSWebhookMock.data,
      };

      const req = new NextRequest('http://localhost/api/payments/payos-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      // Act
      const res = await payosWebhookHandler(req);
      const body = await res.json();

      // Assert
      expect(res.status).toBe(400);
      expect(body.success).toBe(false);
    });

    it('should return 200 OK and skip update when payment status is already Paid', async () => {
      // Arrange
      const mockPayment = {
        PaymentID: 501,
        BookingID: 101,
        OrderCode: 1780151464,
        Amount: 700000,
        Status: 'Paid',
      };
      
      vi.mocked(paymentsRepo.getPaymentByGatewayOrderId).mockResolvedValue(mockPayment as any);

      const requestBody = {
        success: true,
        data: testData.payments.payOSWebhookMock.data,
      };

      const req = new NextRequest('http://localhost/api/payments/payos-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      // Act
      const res = await payosWebhookHandler(req);
      const body = await res.json();

      // Assert
      expect(res.status).toBe(200);
      expect(body.success).toBe(true);
    });
  });
});
