// Test data mapping to Test Case IDs in Test Case Report

export const testData = {
  // --- USER DATA ---
  users: {
    // TC_USR_01: Login with valid credentials
    validNewUser: {
      UserID: 1,
      FullName: "John Doe",
      Email: "johndoe@example.com",
      PhoneNumber: "0901234567",
      Password: "Password123!",
      PasswordHash: "$2b$10$xyz...", // mock hash
      RoleName: "Player",
      Status: "Active",
    },
    // TC_USR_02: Register with duplicate email
    duplicateEmailUser: {
      FullName: "Jane Doe",
      Email: "johndoe@example.com", // Same email as john
      PhoneNumber: "0907654321",
      Password: "Password123!",
    },
    // TC_ADM_01: Admin user with reports export privilege
    adminUser: {
      UserID: 2,
      FullName: "Admin User",
      Email: "admin@pickleclub.vn",
      RoleName: "Admin",
      Status: "Active",
    },
    // TC_CCH_01: Coach user
    coachUser: {
      UserID: 3,
      FullName: "Coach Ken",
      Email: "ken@pickleclub.vn",
      RoleName: "Coach",
      Status: "Active",
    },
  },

  // --- COURT DATA ---
  courts: {
    // TC_CRT_01: Active courts listing
    validCourt: {
      CourtID: 1,
      CourtCode: "COURT-01",
      CourtName: "Sunrise Court",
      CourtType: "Indoor",
      Location: "Da Nang",
      PricePerHour: 350000,
      Status: "Available",
      OpenTime: "05:00",
      CloseTime: "23:00",
    },
    inactiveCourt: {
      CourtID: 2,
      CourtCode: "COURT-02",
      CourtName: "Ocean Court",
      CourtType: "Outdoor",
      Location: "Da Nang",
      PricePerHour: 100000,
      Status: "Maintenance",
      OpenTime: "05:00",
      CloseTime: "23:00",
    },
  },

  // --- BOOKING DATA ---
  bookings: {
    // TC_BKG_01: Valid booking for 2 hours consecutive
    validTwoSlotBooking: {
      BookingID: 101,
      UserID: 1,
      CourtID: 1,
      BookingDate: "2026-07-01",
      Slots: [
        { SlotID: 10, StartTime: "08:00", EndTime: "09:00", Price: 350000 },
        { SlotID: 11, StartTime: "09:00", EndTime: "10:00", Price: 350000 }
      ],
      TotalPrice: 700000,
      Status: "Pending",
    },
    // TC_BKG_02: Blocked double booking / overlaps
    overlappingBooking: {
      UserID: 4,
      CourtID: 1,
      BookingDate: "2026-07-01",
      Slots: [
        { SlotID: 11, StartTime: "09:00", EndTime: "10:00", Price: 350000 }
      ],
    },
  },

  // --- VOUCHER / PROMOTION DATA ---
  promotions: {
    // TC_PRM_01: Expired voucher
    expiredVoucher: {
      PromotionID: 10,
      Code: "EXPIRED50",
      DiscountType: "Percentage",
      DiscountValue: 50.0,
      MinOrderValue: 200000,
      MaxDiscount: 100000,
      StartDate: "2026-01-01T00:00:00.000Z",
      EndDate: "2026-02-01T23:59:59.000Z", // Past date
      PerUserLimit: 1,
      ApplyScope: "Public",
      Status: "Active",
    },
    // TC_PRM_02: Valid voucher
    validVoucher: {
      PromotionID: 11,
      Code: "WELCOME10",
      DiscountType: "Percentage",
      DiscountValue: 10.0,
      MinOrderValue: 100000,
      MaxDiscount: 50000,
      StartDate: "2026-06-01T00:00:00.000Z",
      EndDate: "2026-12-31T23:59:59.000Z",
      PerUserLimit: 2,
      ApplyScope: "Public",
      Status: "Active",
    },
  },

  // --- PAYMENT DATA ---
  payments: {
    // TC_PAY_01: PayOS Webhook
    payOSWebhookMock: {
      success: true,
      data: {
        orderCode: 1780151464,
        amount: 700000,
        description: "Thanh toan don hang BK-1780151464",
        reference: "FT26120...",
        paymentLinkId: "payos_link_123",
        status: "PAID",
      },
    },
    // TC_PAY_02: Refund request
    refundRequestMock: {
      BookingID: 101,
      Reason: "Khach hang yeu cau huy san som 24h",
      RefundAmount: 700000,
    },
  },

  // --- AI DATA ---
  ai: {
    // TC_AI_01: Gemini chatbot success
    successResponse: {
      text: "Xin chào! Tôi có thể giúp gì cho bạn về việc đặt sân Pickleball hôm nay?",
      suggestions: ["Đặt sân Sunrise", "Tìm đối thủ chơi cùng", "Liên hệ hỗ trợ"],
    },
    // TC_AI_02: Gemini API timeout / down fallback
    aiServiceDownMock: {
      status: 503,
      error: "Service Unavailable",
      fallbackText: "Hiện tại hệ thống hỗ trợ AI đang bận. Vui lòng thử lại sau hoặc liên hệ hotline 1900 1234 để được hỗ trợ trực tiếp.",
    },
  },
};
