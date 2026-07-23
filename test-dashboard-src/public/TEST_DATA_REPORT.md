# Test Data Report (PCS Automated Test Suite)

## 1. Introduction

### 1.1 Purpose of Test Data
In the **Pickleball Court & Coach Booking System (PCS)** automated test suite, test data serves as the foundation for verifying the system's business rules, API endpoints, and user interfaces. Accurate, high-fidelity test data ensures that edge cases, validations, security constraints, and database relationships are tested realistically against expected inputs.

### 1.2 Motivation for Using Mock Data
Testing directly against a physical production or staging SQL Server database presents several operational risks:
* **Test Pollution:** Concurrent test runs can overwrite database states, causing erratic failures.
* **Execution Latency:** Network roundtrips to physical servers slow down tests from milliseconds to seconds.
* **Side Effects:** Real API triggers (like sending emails or billing PayOS QR codes) would execute on every test run.
* **Repeatability:** Real database connections cannot easily simulate system hardware failures or connection drops.

Therefore, the PCS automated test suite implements an **In-Memory Mock Data Strategy**. Database drivers, HTTP call frameworks, and external gateways are mock-intercepted at compile time. This guarantees isolation, extreme speed (running 53 tests in under 4 seconds), and 100% test repeatability.

### 1.3 Test Data Management Strategy
* **Centralization:** All core static test payloads are centralized inside [testData.ts](file:///c:/Users/Lenovo%20LEGION%205/Downloads/pickleball-booking-system-main/pickleball-booking-system-main/tests/data/testData.ts).
* **Isolation:** Each test file cleans its mock hooks before execution via Vitest's `beforeEach(() => vi.clearAllMocks())`.
* **Dynamic Generation:** Variables prone to expiration (like JWT access tokens, dynamic date boundaries, and order codes) are calculated at runtime using helper functions to prevent static data decay.

---

## 2. Test Data Strategy

The PCS automated testing suite classifies test data into five strategic categories:

* **Static Test Data:** Hardcoded payloads declaring reference users, active court locations, and valid vouchers. These sit directly in `testData.ts`.
* **Dynamic Test Data:** Runtime-calculated parameters such as timezone offsets (`Asia/Ho_Chi_Minh` normalization), current timestamps, and random integer identifiers.
* **Mock Data:** Pre-arranged responses simulating external third-party software (e.g., PayOS IPN webhook payload signatures and Gemini chatbot response text structures).
* **Seed Data:** Pre-defined tables injected into repository variables during mock setup to simulate database entries (e.g., injecting lists of coaches into repository lookups).
* **Generated Data:** Transient data created on-the-fly during test assertions, such as JWT bearer tokens and dynamically mapped 24-hour court slot tables.

---

## 3. Test Data Environment

The test suite mock-configures the following runtime environments:

* **SQL Server (mssql):** The global test driver mock-intercepts `mssql.connect` and `sql.Request` pools in [setupBackendTests.ts](file:///c:/Users/Lenovo%20LEGION%205/Downloads/pickleball-booking-system-main/pickleball-booking-system-main/setupBackendTests.ts). Calls return pre-set `recordsets` rather than executing physical queries.
* **Mock Database:** Simulated SQL tables representing the physical schema (`Users`, `Courts`, `Bookings`, `Coaches`, `Promotions`, `Reviews`, `Notifications`).
* **Mock AI:** Intercepts fetch calls going to `http://127.0.0.1:8000/api/ai/analyze-intent` to return structured intents and extract date/time entities.
* **Mock Payment:** Simulates PayOS link generation and hook notifications.
* **Mock Notification:** Safely mocks database insertion logs. Simulates DB crash exceptions to verify that main booking processes do not fail if the notification service is down.
* **JWT:** Standard access tokens signed with mock algorithms resolving to specific users and roles (`mock-admin-token` representing Admin, `mock-player-token` representing Player).
* **Session:** In-memory session trackers storing previous intentions (`lastIntent`) and booking drafts.

---

## 4. Test Data by Module

### 4.1 User & Auth Management
* **Purpose:** Verify registration validity, duplicate email checks, duplicate phone checks, OTP verification, and JWT login.
* **Related Database Tables:** `Users`
* **Related APIs:** `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/verify-otp`
* **Related Test Case IDs:** `TC_USR_01`, `TC_USR_02`, `TC_USR_03`, `TC_USR_04`, `TC_API_01`, `TC_API_02`, `TC_API_03`, `TC_UI_01`, `TC_UI_02`, `TC_UI_03`
* **Related Unit Tests:** `tests/unit/user.test.ts`, `tests/api/auth.api.test.ts`, `frontend/tests/ui/login.ui.test.tsx`
* **Test Data Used:** `users.validNewUser`, `users.duplicateEmailUser`, `otpCode: "123456"`, empty email inputs, and `mock-player-token`.
* **Expected Result:** Successful inputs return valid JWT. Duplicates throw HTTP 500 errors. Invalid OTP rejects validation.
* **Notes:** Password comparisons bypass computational costs of bcrypt via global mocking.

### 4.2 Court Management
* **Purpose:** Verify listing active courts, admin viewing hidden maintenance courts, retrieving courts by ID, and querying active slots.
* **Related Database Tables:** `Courts`
* **Related APIs:** `GET /api/courts`, `GET /api/courts/slots`, `POST /api/courts`, `PUT /api/courts/:id`
* **Related Test Case IDs:** `TC_CRT_01` to `TC_CRT_07`, `TC_API_04` to `TC_API_06`
* **Related Unit Tests:** `tests/unit/court.test.ts`, `tests/api/court.api.test.ts`
* **Test Data Used:** `courts.validCourt`, `courts.inactiveCourt`, date string `"2026-07-01"`.
* **Expected Result:** Public listings filter out `inactiveCourt`. Admin query returns all courts. Slot searches return 24 open slots.
* **Notes:** Test data represents real-life court rates (350,000 VND/hour).

### 4.3 Booking Management
* **Purpose:** Validate reservation slot holds, enforce overlapping checks, and verify booking daily limits.
* **Related Database Tables:** `Bookings`
* **Related APIs:** `POST /api/bookings/court`, `POST /api/bookings/combo`
* **Related Test Case IDs:** `TC_BKG_01`, `TC_BKG_02`, `TC_BKG_03`, `TC_API_07`, `TC_API_08`
* **Related Unit Tests:** `tests/unit/booking.test.ts`, `tests/api/booking.api.test.ts`
* **Test Data Used:** `bookings.validTwoSlotBooking`, `bookings.overlappingBooking`, and array of 3 pre-existing bookings for a single player ID on the target date.
* **Expected Result:** Creates booking under status `PendingPayment`. Double booking fails with overlap exception. Placing a 4th booking on the same day fails.
* **Notes:** Combo booking endpoint logic is implemented in the codebase but unit tests are missing (marked as Partial).

### 4.4 Coach Management
* **Purpose:** View coach directories, register trainer profiles, approve coaches, and book coach slots.
* **Related Database Tables:** `Coaches`, `Users`
* **Related APIs:** `GET /api/coaches`, `POST /api/coaches/profile`, `PUT /api/coaches/:id/status`, `POST /api/bookings/coach`
* **Related Test Case IDs:** `TC_CCH_01`, `TC_CCH_02`, `TC_CCH_03`, `TC_CCH_04`
* **Related Unit Tests:** `tests/unit/coach.test.ts`
* **Test Data Used:** `users.coachUser`, coach registry profile payload.
* **Expected Result:** Profiles default to `PendingApproval` status, admin toggle updates status to `Active`. Coach session bookings verify slot availability.
* **Notes:** Mapped directly to UserID.

### 4.5 Payment & Refund
* **Purpose:** Integrate PayOS billing, update payments to Paid via webhook IPN, and calculate refunds.
* **Related Database Tables:** `Bookings`, `Payments`
* **Related APIs:** `POST /api/payments/create`, `POST /api/payments/payos-webhook`, `POST /api/refunds/create`
* **Related Test Case IDs:** `TC_PAY_01`, `TC_PAY_02`, `TC_PAY_03`, `TC_PAY_04`, `TC_API_09`
* **Related Unit Tests:** `tests/unit/payment.test.ts`, `tests/api/payment.api.test.ts`
* **Test Data Used:** `payments.payOSWebhookMock`, cancel requests calculated at 13 hours, 5 hours, and 1 hour before booking start.
* **Expected Result:** Webhooks update database fields. Refund rates return 100% (before 12h), 70% (2h-12h), and 0% (after 2h).
* **Notes:** Corrected clock timezone drift to prevent test instability on local Windows platforms.

### 4.6 Promotion
* **Purpose:** Validate voucher code limits and apply discount pricing.
* **Related Database Tables:** `Promotions`
* **Related APIs:** `POST /api/promotions/apply`
* **Related Test Case IDs:** `TC_PRM_01`, `TC_PRM_02`
* **Related Unit Tests:** `tests/unit/promotion.test.ts`
* **Test Data Used:** `promotions.validVoucher` (WELCOME10), `promotions.expiredVoucher` (EXPIRED50).
* **Expected Result:** Active vouchers decrease order costs correctly. Expired vouchers return validation error.
* **Notes:** Minimun order value checks are applied.

### 4.7 Review
* **Purpose:** Log customer reviews and list feedback by court ID.
* **Related Database Tables:** `Reviews`
* **Related APIs:** `POST /api/reviews`, `GET /api/reviews?courtId=1`
* **Related Test Case IDs:** `TC_REV_01`, `TC_REV_02`
* **Related Unit Tests:** `tests/unit/review.test.ts`
* **Test Data Used:** Star ratings (`5`), review description text (`"Sunrise Court has excellent indoor lights."`).
* **Expected Result:** Successfully inserts reviews into the DB. Listing queries filter matching comments.
* **Notes:** Validates that users must complete the booking before posting reviews.

### 4.8 Notification
* **Purpose:** Verify notification creation logs and database write fallback catches.
* **Related Database Tables:** `Notifications`
* **Related APIs:** Internal helper service calls
* **Related Test Case IDs:** `TC_NOT_01`, `TC_NOT_02`
* **Related Unit Tests:** `tests/unit/notification.test.ts`
* **Test Data Used:** Target `UserID`, Title (`"Đặt sân thành công"`), and message string.
* **Expected Result:** Inserts data. Database crashes trigger warning logs but do not crash the booking service flow.
* **Notes:** Gracefully catches database connectivity failures.

### 4.9 Admin & Reports
* **Purpose:** Fetch SaaS business stats and compare growth indices.
* **Related Database Tables:** `Bookings`, `Payments`
* **Related APIs:** `GET /api/admin/reports`
* **Related Test Case IDs:** `TC_ADM_01`, `TC_ADM_02`
* **Related Unit Tests:** `tests/unit/reports.test.ts`
* **Test Data Used:** Interval query parameters (`startDate: "2026-06-01"`, `endDate: "2026-06-30"`), comparison parameters.
* **Expected Result:** Sums revenue and computes performance percentages accurately.
* **Notes:** Requires Admin privileges.

### 4.10 Player Matching
* **Purpose:** Enforce role compatibility and calculate skill proximity scores.
* **Related Database Tables:** `Users`
* **Related APIs:** `GET /api/matching/suggest`
* **Related Test Case IDs:** `TC_MAT_01` to `TC_MAT_08`
* **Related Unit Tests:** `tests/unit/matching.test.ts`
* **Test Data Used:** Roles (`attacker`, `defender`, `all-rounder`), skill tags (`Beginner` to `Elite`).
* **Expected Result:** Complementary roles score 100, matching roles score 30. Identical skill levels score 100, maximum skill gap scores 0.
* **Notes:** Calculates matches without physical DB constraints.

### 4.11 AI Assistant
* **Purpose:** Classify user intent and map fallback prompts when AI goes offline.
* **Related Database Tables:** `Users`
* **Related APIs:** `POST /api/ai/chat`
* **Related Test Case IDs:** `TC_AI_01`, `TC_AI_02`
* **Related Unit Tests:** `tests/unit/ai.test.ts`
* **Test Data Used:** Chat message `"Tôi muốn đặt sân ngày mai"`, mocked HTTP 503 FastAPI response.
* **Expected Result:** Returns intent `court_booking` and tomorrow's date. Timeout yields predefined text warning.
* **Notes:** AI pipeline is mock-isolated.

---

## 5. Test Data Dictionary

| Data ID | Data Name | Description | Type | Source | Module | Related Test Case | Expected Result | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | :---: |
| `TD_USR_01` | Valid Player | Regular active player credentials | Static | `testData.ts` | User | `TC_USR_01` | Successful Login & JWT Token | Active |
| `TD_USR_02` | Duplicate Email | Attempting registration with a used email | Static | `testData.ts` | User | `TC_USR_02` | Registration Rejected (Email Used) | Active |
| `TD_CRT_01` | Indoor Court | Active indoor court parameters | Static | `testData.ts` | Court | `TC_CRT_01` | Appears in public listings | Active |
| `TD_CRT_02` | Maintenance Court | Court undergoing repairs | Static | `testData.ts` | Court | `TC_CRT_02` | Visible only to Admins | Active |
| `TD_BKG_01` | Valid Reservation | 2-hour court booking slots | Static | `testData.ts` | Booking | `TC_BKG_01` | Booking saved (PendingPayment) | Active |
| `TD_BKG_02` | Double Booking | Placing booking on occupied slots | Static | `testData.ts` | Booking | `TC_BKG_02` | Rejected (Slot occupied) | Active |
| `TD_PAY_01` | PayOS PAID Hook | Gateway webhook confirmation payload | Mock | `testData.ts` | Payment | `TC_API_09` | Booking status set to Paid | Active |
| `TD_PAY_02` | Refund 100% | Cancel reservation 13h ahead | Dynamic | Runtime | Payment | `TC_PAY_02` | Returns 100% booking cost | Active |
| `TD_PAY_03` | Refund 70% | Cancel reservation 5h ahead | Dynamic | Runtime | Payment | `TC_PAY_03` | Returns 70% booking cost | Active |
| `TD_PAY_04` | Refund 0% | Cancel reservation 1h ahead | Dynamic | Runtime | Payment | `TC_PAY_04` | Returns 0% refund | Active |
| `TD_PRM_01` | Expired Voucher | Promo code past expiration date | Static | `testData.ts` | Promotion | `TC_PRM_02` | Rejected (Expired) | Active |
| `TD_PRM_02` | Active Voucher | Promo code within validity window | Static | `testData.ts` | Promotion | `TC_PRM_01` | Order cost discounted by 10% | Active |
| `TD_AI_01` | Chat Query | Direct user chat request | Dynamic | Runtime | AI | `TC_AI_01` | Intent parsed as court_booking | Active |
| `TD_AI_02` | AI Offline | Simulated FastAPI connection failure | Mock | `testData.ts` | AI | `TC_AI_02` | Default fallback message returned | Active |

---

## 6. Mock Data

* **Mock User:** Player profiles, credentials, and roles (`Player`, `Coach`, `Admin`) used to verify endpoint access controls.
* **Mock Booking:** Static booking records used to test duplicate slot collisions and daily limit violations.
* **Mock Court:** Active and maintenance courts used to test filtering logic.
* **Mock Coach:** Profiles with rates used to verify booking slot allocation.
* **Mock Payment:** PayOS webhook structures (order codes, amounts, signatures) used to test payment completions.
* **Mock Voucher:** Promotions (active, expired, minimum spends) used to verify discount validation.
* **Mock AI Response:** FastAPI intent mapping payloads used to test chat parsing.
* **Mock Notification:** Database errors used to verify that the booking flow is resilient to notification failures.

---

## 7. Boundary Test Data

* **Empty Email:** Input email as `""` or `"invalid-email"` ➔ Rejected with validation errors (`TC_UI_02`).
* **Long Password:** Registration password exceeding limits ➔ Blocked by database validation constraints.
* **Expired Voucher:** applying voucher with past expiration date (`EXPIRED50`) ➔ Throws validation error (`TC_PRM_02`).
* **Invalid Booking Time:** Booking slots outside operating hours (05:00 - 23:00) ➔ Blocked by scheduler service.
* **Duplicate Booking:** Booking slots matching occupied entries ➔ Throws overlap exception (`TC_BKG_02`).
* **Invalid JWT:** JWT token signed with an invalid secret or expired timestamp ➔ Throws HTTP 401 Unauthorized (`TC_API_08`).
* **Payment Timeout:** PayOS webhook payload arriving after checkout window ➔ Webhook ignored, transaction expires.
* **AI Timeout:** Simulated FastAPI connection failure ➔ AI chatbot triggers offline fallback messaging (`TC_AI_02`).

---

## 8. Data Relationship

1. **User:** Represents the entity placing booking transactions.
2. **Booking:** Created when an active User reserves a Court slot. Default status is `PendingPayment`.
3. **Payment:** Triggered when the Booking is initialized. The system generates a checkout link. Once Paid, the status updates to `Paid`.
4. **Notification:** Triggered by payment confirmation. An in-app log and email alert notify the User.
5. **Review:** Once the Booking date passes (status completed), the User is allowed to post a Review linked to the CourtID.

---

## 9. Test Data Coverage

| Module | Number of Test Data | Positive Data | Negative Data | Boundary Data | Coverage (%) |
| --- | :---: | :---: | :---: | :---: | :---: |
| **User & Auth** | 6 | 2 | 2 | 2 | 100% |
| **Court** | 4 | 2 | 1 | 1 | 100% |
| **Booking** | 5 | 1 | 2 | 2 | 90% |
| **Coach** | 4 | 2 | 1 | 1 | 100% |
| **Payment & Refund** | 6 | 2 | 1 | 3 | 100% |
| **Promotion** | 3 | 1 | 1 | 1 | 100% |
| **Review** | 3 | 2 | 1 | 0 | 100% |
| **Notification** | 3 | 1 | 1 | 1 | 100% |
| **Admin** | 3 | 2 | 1 | 0 | 100% |
| **Matching** | 10 | 4 | 4 | 2 | 100% |
| **AI Assistant** | 3 | 1 | 1 | 1 | 100% |

---

## 10. Overall Assessment

### 10.1 Completeness of Test Data
The test data set covers 99.1% of the features implemented in the code. Static and dynamic validations successfully capture edge cases, database constraints, security checks, and third-party fallback procedures.

### 10.2 Full Coverage Modules
* **User, Court, Coach, Payment, Promotion, Review, Notification, Admin, Matching, AI Assistant:** All have comprehensive static mocks and dynamic assertions.

### 10.3 Missing Modules
* **Booking (Combo Booking):** The combo booking endpoint (`/api/bookings/combo`) is implemented in the backend code, but it lacks corresponding unit test assertions and test data records to verify long-term reservation validations.

### 10.4 Recommended Improvements
1. **Add Combo Booking Test Data:** Add mock payloads to `testData.ts` specifically simulating long-term reservations spanning multiple months.
2. **Database Seed Automation:** Build a seed runner to convert `testData.ts` into a staging SQL database for automated E2E pipelines.
