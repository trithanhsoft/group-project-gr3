import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  calculateHours,
  validateCoachFeePerHour,
  validateHoldingLimit,
} from "@/modules/bookings/bookings.validation";
import * as bookingRepo from "@/modules/bookings/bookings.repository";
import {
  isValidTimeFormat,
  validateCreateCourtFields,
  validatePrice,
  validateTimeRange,
} from "@/modules/courts/courts.validation";
import { loginSchema, registerSchema } from "@/modules/auth/auth.validation";
import {
  createPaymentSchema,
  paymentCodeSchema,
} from "@/modules/payments/payments.validation";
import {
  validateApproveRefundBody,
  validateCompleteManualBody,
  validateProcessRefundBody,
  validateRejectRefundBody,
  validateRequestRefundBody,
} from "@/modules/refunds/refunds.validation";

vi.mock("@/modules/bookings/bookings.repository", () => ({
  countHoldingBookingsByUserId: vi.fn(),
}));

describe("Extended Validation Rule Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("booking duration calculation", () => {
    it.each([
      ["08:00", "09:00", 1],
      ["08:00", "10:30", 2.5],
      ["05:15", "06:45", 1.5],
      ["19:30", "23:30", 4],
      ["12:10", "13:10", 1],
    ])("TC_VAL_BKG_%#: calculates valid hours from %s to %s", (start, end, expected) => {
      expect(calculateHours(start, end)).toBe(expected);
    });

    it.each([
      ["10:00", "10:00", "same start and end"],
      ["11:00", "10:00", "end before start"],
      ["08:00", "08:30", "less than one hour"],
      ["08:00", "12:30", "more than four hours"],
      ["20:00", "01:00", "overnight range"],
    ])("TC_VAL_BKG_ERR_%#: rejects invalid duration: %s", (start, end) => {
      expect(() => calculateHours(start, end)).toThrow();
    });
  });

  describe("booking holding limit", () => {
    it("TC_VAL_HOLD_001: allows user with no holding booking", async () => {
      vi.mocked(bookingRepo.countHoldingBookingsByUserId).mockResolvedValue(0);

      await expect(validateHoldingLimit(1)).resolves.toBeUndefined();
      expect(bookingRepo.countHoldingBookingsByUserId).toHaveBeenCalledWith(1);
    });

    it("TC_VAL_HOLD_002: rejects user with an active holding booking", async () => {
      vi.mocked(bookingRepo.countHoldingBookingsByUserId).mockResolvedValue(1);

      await expect(validateHoldingLimit(1)).rejects.toThrow();
    });
  });

  describe("coach fee range", () => {
    it.each([150000, 250000, 500000, 2000000])(
      "TC_VAL_COACH_FEE_%#: accepts coach fee %s",
      (fee) => {
        expect(() => validateCoachFeePerHour(fee)).not.toThrow();
      }
    );

    it.each([0, 149999, 2000001, 9999999])(
      "TC_VAL_COACH_FEE_ERR_%#: rejects coach fee %s",
      (fee) => {
        expect(() => validateCoachFeePerHour(fee)).toThrow();
      }
    );
  });

  describe("court time and price validators", () => {
    it.each([
      ["00:00", true],
      ["05:30", true],
      ["23:59", true],
      ["24:00", false],
      ["7:00", false],
      ["12:60", false],
      ["ab:cd", false],
      ["", false],
    ])("TC_VAL_COURT_TIME_%#: validates HH:mm format %s", (value, expected) => {
      expect(isValidTimeFormat(value)).toBe(expected);
    });

    it.each([
      ["05:00", "06:00"],
      ["08:15", "10:45"],
      ["22:00", "23:00"],
    ])("TC_VAL_COURT_RANGE_%#: accepts valid time range %s-%s", (start, end) => {
      expect(() => validateTimeRange(start, end)).not.toThrow();
    });

    it.each([
      ["25:00", "06:00"],
      ["05:00", "99:00"],
      ["10:00", "10:00"],
      ["12:00", "11:59"],
    ])("TC_VAL_COURT_RANGE_ERR_%#: rejects invalid range %s-%s", (start, end) => {
      expect(() => validateTimeRange(start, end)).toThrow();
    });

    it.each([100000, 150000, 350000, 1000000])(
      "TC_VAL_COURT_PRICE_%#: accepts court price %s",
      (price) => {
        expect(() => validatePrice(price)).not.toThrow();
      }
    );

    it.each([0, 99999, 1000001, Number.NaN])(
      "TC_VAL_COURT_PRICE_ERR_%#: rejects court price %s",
      (price) => {
        expect(() => validatePrice(price)).toThrow();
      }
    );
  });

  describe("court create required fields", () => {
    const validCourt = {
      courtCode: "C-01",
      courtName: "Sunrise Court",
      courtType: "Indoor",
      openTime: "05:00",
      closeTime: "23:00",
    };

    it("TC_VAL_COURT_CREATE_001: accepts complete court payload", () => {
      expect(() => validateCreateCourtFields(validCourt)).not.toThrow();
    });

    it.each([
      [{ ...validCourt, courtCode: "" }, "missing court code"],
      [{ ...validCourt, courtName: " " }, "missing court name"],
      [{ ...validCourt, courtType: "Rooftop" }, "invalid court type"],
      [{ ...validCourt, openTime: "" }, "missing open time"],
      [{ ...validCourt, closeTime: "" }, "missing close time"],
    ])("TC_VAL_COURT_CREATE_ERR_%#: rejects %s", (payload) => {
      expect(() => validateCreateCourtFields(payload as any)).toThrow();
    });
  });

  describe("auth zod schemas", () => {
    const validRegister = {
      fullName: "Tran Quoc Sang",
      email: "sang@example.com",
      phoneNumber: "0901234567",
      password: "Password123!",
    };

    it("TC_VAL_AUTH_REGISTER_001: accepts valid register payload", () => {
      expect(registerSchema.safeParse(validRegister).success).toBe(true);
    });

    it.each([
      [{ ...validRegister, fullName: "A" }, "short full name"],
      [{ ...validRegister, email: "bad-email" }, "invalid email"],
      [{ ...validRegister, phoneNumber: "123" }, "invalid phone"],
      [{ ...validRegister, password: "short" }, "short password"],
      [{ ...validRegister, password: "password123!" }, "missing uppercase"],
      [{ ...validRegister, password: "Password!" }, "missing number"],
      [{ ...validRegister, password: "Password123" }, "missing special char"],
    ])("TC_VAL_AUTH_REGISTER_ERR_%#: rejects %s", (payload) => {
      expect(registerSchema.safeParse(payload).success).toBe(false);
    });

    it("TC_VAL_AUTH_LOGIN_001: accepts valid login payload", () => {
      expect(loginSchema.safeParse({ email: "sang@example.com", password: "x" }).success).toBe(true);
    });

    it.each([
      [{ email: "bad", password: "x" }, "invalid email"],
      [{ email: "sang@example.com", password: "" }, "empty password"],
    ])("TC_VAL_AUTH_LOGIN_ERR_%#: rejects %s", (payload) => {
      expect(loginSchema.safeParse(payload).success).toBe(false);
    });
  });

  describe("payment schemas", () => {
    it.each([
      [{ bookingId: 1, paymentMethod: "PayOS" }],
      [{ bookingId: 99, paymentMethod: "Momo" }],
    ])("TC_VAL_PAYMENT_CREATE_%#: accepts supported payment payload", (payload) => {
      expect(createPaymentSchema.safeParse(payload).success).toBe(true);
    });

    it.each([
      [{ bookingId: 0, paymentMethod: "PayOS" }, "zero booking id"],
      [{ bookingId: -1, paymentMethod: "PayOS" }, "negative booking id"],
      [{ bookingId: 1.5, paymentMethod: "PayOS" }, "decimal booking id"],
      [{ bookingId: 1, paymentMethod: "Cash" }, "unsupported method"],
    ])("TC_VAL_PAYMENT_CREATE_ERR_%#: rejects %s", (payload) => {
      expect(createPaymentSchema.safeParse(payload).success).toBe(false);
    });

    it.each([
      ["PAY-101-ABC"],
      ["PAY-1-20260719000000-ABC123"],
    ])("TC_VAL_PAYMENT_CODE_%#: accepts payment code %s", (code) => {
      expect(paymentCodeSchema.safeParse(code).success).toBe(true);
    });

    it.each(["", "RF-101-ABC", "101-PAY"])(
      "TC_VAL_PAYMENT_CODE_ERR_%#: rejects payment code %s",
      (code) => {
        expect(paymentCodeSchema.safeParse(code).success).toBe(false);
      }
    );
  });

  describe("refund body validators", () => {
    it.each([
      [validateRequestRefundBody, { bookingId: 1, reason: "Change schedule" }],
      [validateApproveRefundBody, { refundCode: "RF-1" }],
      [validateProcessRefundBody, { refundCode: "RF-1" }],
      [validateCompleteManualBody, { refundCode: "RF-1", note: "Bank transfer done" }],
      [validateRejectRefundBody, { refundCode: "RF-1", rejectReason: "Invalid proof" }],
    ])("TC_VAL_REFUND_BODY_%#: accepts valid refund body", (validator, body) => {
      expect(validator(body)).toEqual({ valid: true });
    });

    it.each([
      [validateRequestRefundBody, null, "null request"],
      [validateRequestRefundBody, { bookingId: 0, reason: "x" }, "invalid booking id"],
      [validateRequestRefundBody, { bookingId: 1, reason: "" }, "empty reason"],
      [validateRequestRefundBody, { bookingId: 1, reason: "x".repeat(501) }, "long reason"],
      [validateApproveRefundBody, { refundCode: "" }, "empty approve code"],
      [validateProcessRefundBody, { refundCode: "" }, "empty process code"],
      [validateCompleteManualBody, { refundCode: "" }, "empty complete code"],
      [validateCompleteManualBody, { refundCode: "RF-1", note: "x".repeat(1001) }, "long note"],
      [validateRejectRefundBody, { refundCode: "RF-1", rejectReason: "" }, "empty reject reason"],
      [validateRejectRefundBody, { refundCode: "RF-1", rejectReason: "x".repeat(501) }, "long reject reason"],
    ])("TC_VAL_REFUND_BODY_ERR_%#: rejects %s", (validator, body) => {
      expect(validator(body as any).valid).toBe(false);
    });
  });
});
