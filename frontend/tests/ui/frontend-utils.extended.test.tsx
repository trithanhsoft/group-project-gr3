import { beforeEach, describe, expect, it, vi } from "vitest";
import { isStrongPassword, isValidEmail, isValidPhone } from "@/utils/validators";
import { formatCurrency } from "@/utils/formatCurrency";
import { getCoachImageUrl, getImageUrl } from "@/utils/image";
import {
  clearAuth,
  getDashboardPath,
  getToken,
  getUser,
  saveAuth,
} from "@/utils/authStorage";
import { getRelativeTime } from "@/utils/timeFormat";

describe("Extended Frontend Utility Tests", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useRealTimers();
  });

  describe("validators", () => {
    it.each([
      ["player@example.com"],
      ["tran.quoc.sang@fpt.edu.vn"],
      ["a+b@test.co"],
      ["name_123@sub.domain.vn"],
    ])("TC_FE_VAL_EMAIL_%#: accepts valid email %s", (email) => {
      expect(isValidEmail(email)).toBe(true);
    });

    it.each([
      [""],
      ["plain-text"],
      ["missing-domain@"],
      ["@missing-local.com"],
      ["name@domain"],
      ["white space@example.com"],
    ])("TC_FE_VAL_EMAIL_ERR_%#: rejects invalid email %s", (email) => {
      expect(isValidEmail(email)).toBe(false);
    });

    it.each(["0901234567", "0123456789", "9999999999"])(
      "TC_FE_VAL_PHONE_%#: accepts ten-digit phone %s",
      (phone) => {
        expect(isValidPhone(phone)).toBe(true);
      }
    );

    it.each(["123", "09012345678", "090123456a", "090 123456", ""])(
      "TC_FE_VAL_PHONE_ERR_%#: rejects invalid phone %s",
      (phone) => {
        expect(isValidPhone(phone)).toBe(false);
      }
    );

    it.each(["Password123!", "Aaaaaaaa1@", "StrongPass9#"])(
      "TC_FE_VAL_PASS_%#: accepts strong password %s",
      (password) => {
        expect(isStrongPassword(password)).toBe(true);
      }
    );

    it.each(["short", "password123!", "Password!", "Password123", "12345678!"])(
      "TC_FE_VAL_PASS_ERR_%#: rejects weak password %s",
      (password) => {
        expect(isStrongPassword(password)).toBe(false);
      }
    );
  });

  describe("currency formatter", () => {
    it.each([
      [0, "0"],
      [1000, "1"],
      [700000, "700"],
      [123456789, "123"],
    ])("TC_FE_CURRENCY_%#: formats VND amount %s", (amount, visiblePart) => {
      expect(formatCurrency(amount)).toContain(visiblePart);
    });
  });

  describe("image URL helpers", () => {
    it.each([
      [undefined, "/images/home/avatar-placeholder.jpg"],
      [null, "/images/home/avatar-placeholder.jpg"],
      ["https://cdn.example.com/a.png", "https://cdn.example.com/a.png"],
      ["http://cdn.example.com/a.png", "http://cdn.example.com/a.png"],
      ["data:image/png;base64,abc", "data:image/png;base64,abc"],
      ["/images/home/court.png", "/images/home/court.png"],
      ["/uploads/court.png", "http://localhost:5000/uploads/court.png"],
      ["uploads/court.png", "http://localhost:5000/uploads/court.png"],
    ])("TC_FE_IMAGE_%#: resolves general image path %s", (input, expected) => {
      expect(getImageUrl(input as any)).toBe(expected);
    });

    it.each([
      [undefined, "/images/coaches/hlv1.png"],
      [null, "/images/coaches/hlv1.png"],
      ["https://cdn.example.com/coach.png", "https://cdn.example.com/coach.png"],
      ["/images/coaches/hlv2.png", "/images/coaches/hlv2.png"],
      ["images/coaches/hlv3.png", "/images/coaches/hlv3.png"],
      ["/images/users/avatar.png", "/images/coaches/hlv1.png"],
      ["/uploads/coach.png", "http://localhost:5000/uploads/coach.png"],
      ["hlv7.png", "/images/coaches/hlv7.png"],
      ["/strange/path.png", "/images/coaches/hlv1.png"],
    ])("TC_FE_COACH_IMAGE_%#: resolves coach image path %s", (input, expected) => {
      expect(getCoachImageUrl(input as any)).toBe(expected);
    });
  });

  describe("auth storage", () => {
    it("TC_FE_AUTH_STORAGE_001: saves token and user in localStorage", () => {
      saveAuth("token-123", { userId: 1, fullName: "Sang", roles: ["Player"] });

      expect(getToken()).toBe("token-123");
      expect(getUser()).toMatchObject({ userId: 1, fullName: "Sang" });
    });

    it("TC_FE_AUTH_STORAGE_002: returns null user when localStorage is empty", () => {
      expect(getUser()).toBeNull();
    });

    it("TC_FE_AUTH_STORAGE_003: returns null user when stored JSON is corrupted", () => {
      localStorage.setItem("pickleclub_user", "{bad-json");

      expect(getUser()).toBeNull();
    });

    it("TC_FE_AUTH_STORAGE_004: clears token and user", () => {
      saveAuth("token-123", { userId: 1 });
      clearAuth();

      expect(getToken()).toBeNull();
      expect(getUser()).toBeNull();
    });
  });

  describe("dashboard path", () => {
    it.each([
      ["Admin", "/admin"],
      ["Manager", "/admin"],
      ["Staff", "/staff/operations"],
      ["Coach", "/coach-dashboard"],
      ["Player", "/"],
      [undefined, "/"],
    ])("TC_FE_DASHBOARD_%#: maps role %s to dashboard path", (role, expected) => {
      expect(getDashboardPath(role)).toBe(expected);
    });
  });

  describe("relative time", () => {
    it("TC_FE_TIME_001: returns immediate label for empty date", () => {
      expect(getRelativeTime(null).length).toBeGreaterThan(0);
    });

    it.each([
      ["2026-07-19T09:59:40"],
      ["2026-07-19T09:55:00"],
      ["2026-07-19T08:00:00"],
      ["2026-07-18T10:00:00"],
      ["2026-06-19T10:00:00"],
      ["2025-07-19T10:00:00"],
    ])("TC_FE_TIME_%#: formats relative time for %s", (value) => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-07-19T10:00:00"));

      expect(getRelativeTime(value).length).toBeGreaterThan(0);
    });
  });
});
