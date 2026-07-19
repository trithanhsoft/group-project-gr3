import { vi } from 'vitest';
import { testData } from '../data/testData';

export const mockPaymentRepository = {
  createPayment: vi.fn().mockImplementation(async (payment: any) => {
    return { PaymentID: 501, ...payment, Status: "Pending" };
  }),
  getPaymentByOrderCode: vi.fn().mockImplementation(async (orderCode: number) => {
    if (orderCode === testData.payments.payOSWebhookMock.data.orderCode) {
      return {
        PaymentID: 501,
        BookingID: 101,
        OrderCode: orderCode,
        Amount: 700000,
        Status: "Pending",
      };
    }
    return null;
  }),
  updatePaymentStatus: vi.fn().mockResolvedValue(true),
  createRefund: vi.fn().mockImplementation(async (refund: any) => {
    return { RefundID: 601, ...refund, Status: "Completed" };
  }),
};

export const mockPayOS = {
  createPaymentLink: vi.fn().mockResolvedValue({
    bin: "970415",
    checkoutUrl: "https://checkout.payos.vn/payment/link-id-123",
    paymentLinkId: "payos_link_123",
    qrCode: "000201...",
  }),
  verifyPaymentWebhookData: vi.fn().mockImplementation((webhookBody: any) => {
    return testData.payments.payOSWebhookMock.data;
  }),
};

export const mockMomo = {
  createPayment: vi.fn().mockResolvedValue({
    partnerCode: "MOMO",
    orderId: "MOMO17801514",
    payUrl: "https://test-payment.momo.vn/v2/gateway/api/create",
    signature: "signature123",
  }),
};
