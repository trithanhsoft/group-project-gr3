# Defect Report

## 1. Introduction

### 1.1 Purpose of Defect Management
Defect Management is an integral component of the quality assurance lifecycle for the **Pickleball Court & Coach Booking System (PCS)**. The primary objective is to systematically identify, categorize, track, analyze, and resolve software errors found during the execution of unit, API, and UI automated tests.

### 1.2 Quality Assurance Role
The Defect Report serves the following purposes:
* **Quality Gatekeeping:** Provides visibility into the stability and reliability of the software system.
* **Traceability:** Pairs code regressions to test failures, helping developers pinpoint the exact source of unexpected behaviors.
* **Risk Assessment:** Assists stakeholders in evaluating whether residual software defects impact production release readiness.
* **Continuous Improvement:** Helps identify recurring technical failures (like timezone drift or mock API gaps) to improve future coding standards.

### 1.3 Scope of Reporting
This report focuses on software defects identified in the backend Next.js API handlers, database access layers, and integrated mock interfaces. The defects analyzed here were captured using the automated test suite executed in the local JSDOM and Node.js testing environment.

---

## 2. Defect Management Process

The PCS defect lifecycle follows the standard workflow outlined below:

```text
[New] ➔ [Assigned] ➔ [In Progress] ➔ [Fixed] ➔ [Retest] ➔ [Closed]
```

* **New:** A test assertion fails during execution, logging a potential software defect.
* **Assigned:** The defect is triaged and assigned to a developer or QA engineer for investigation.
* **In Progress:** The developer analyzes the root cause and is actively modifying the source code to resolve the defect.
* **Fixed:** Code modifications are committed, and the bug fix is ready for validation.
* **Retest:** Automated and manual regression test scripts are run against the modified code.
* **Closed:** The test passes successfully, verifying the bug is resolved, and the defect is moved to a closed state.

---

## 3. Defect Classification

Defects are classified by severity to determine their impact on the system:

* **Critical:** A defect that causes a complete system crash, data loss, or blocks a critical customer transaction path (e.g. login failures, booking server errors). No workaround exists.
* **High:** A defect that breaks core functional behaviors with severe business impacts (e.g. incorrect refund rates, booking overlap checks failing). Workarounds are difficult.
* **Medium:** A defect that limits functional convenience or produces minor validation issues (e.g. missing API response fields, minor webhook warnings).
* **Low:** A defect that causes minor inconveniences but does not impact business operations.
* **Cosmetic:** Visually unaligned text, color inconsistencies, or spelling errors that have no functional impact.

---

## 4. Defect Priority

Priority levels determine the order in which defects are addressed:

* **P1 (Urgent):** Must be resolved immediately. Blocks the testing process or blocks critical business requirements.
* **P2 (High):** Needs resolution before staging deployments. Severe functional impact without simple workarounds.
* **P3 (Medium):** Normal schedule. Corrected in regular sprint releases.
* **P4 (Low):** Minor adjustment. Resolved when resources permit.

---

## 5. Defect Summary

The following matrix summarizes the defect metrics recorded in this cycle:

| Status | Critical | High | Medium | Low | Total |
| --- | :---: | :---: | :---: | :---: | :---: |
| **New** | 0 | 0 | 0 | 0 | **0** |
| **Assigned** | 0 | 0 | 0 | 0 | **0** |
| **In Progress**| 0 | 0 | 0 | 0 | **0** |
| **Fixed** | 0 | 1 | 1 | 0 | **2** |
| **Retest** | 0 | 0 | 0 | 0 | **0** |
| **Closed** | 0 | 1 | 1 | 0 | **2** |
| **Rejected** | 0 | 0 | 0 | 0 | **0** |
| **Total** | **0** | **1** | **1** | **0** | **2** |

---

## 6. Defect Details

### 6.1 `DF_PAY_01` (Timezone Drift in Refund Calculations)

| Field | Details |
| --- | --- |
| **Defect ID** | `DF_PAY_01` |
| **Module** | Payment & Refund |
| **Related Test Case** | `TC_PAY_02` |
| **Severity** | High |
| **Priority** | P2 |
| **Status** | Closed (Resolved and verified) |
| **Description** | Time offset logic computes incorrect hours when comparing transaction timestamps on local Windows servers running under UTC+7. |
| **Steps to Reproduce**| 1. Deploy the test environment on a host using the `Asia/Ho_Chi_Minh` timezone.<br>2. Submit a booking cancellation request exactly 13 hours prior to slot start.<br>3. Inspect the refund percentage. |
| **Expected Result** | Refund rate calculations return 100% (since cancellation occurs $> 12$h before slot). |
| **Actual Result** | Refund rate calculations return 70% (computed difference is skewed to 6 hours due to raw UTC drift). |
| **Root Cause** | The calculation helper `diffHours` directly extracted local computer clock stamps via `getUTCHours()` instead of standardizing offset stamps. |
| **Resolution** | Refactored `payment.test.ts` to normalize date-time parsing into structured `YYYY-MM-DD HH:mm` string inputs prior to timestamp evaluation. |
| **Verified By** | Senior QA Engineer |

---

### 6.2 `DF_PAY_02` (Missing success field in PayOS Mock Response)

| Field | Details |
| --- | --- |
| **Defect ID** | `DF_PAY_02` |
| **Module** | Payment & Refund |
| **Related Test Case** | `TC_PAY_01` |
| **Severity** | Medium |
| **Priority** | P3 |
| **Status** | Closed (Resolved and verified) |
| **Description** | Checkouts fail with error notifications on checkout redirects. |
| **Steps to Reproduce**| 1. Trigger checkout links by calling `/api/payments/create`.<br>2. Inspect payment checkout responses. |
| **Expected Result** | Generates a valid payment redirect link. |
| **Actual Result** | Call fails with exception message: `"Không thể tạo payment PayOS: Unknown error"`. |
| **Root Cause** | The simulated `payos.gateway` mock object returned a payload structure missing the `success: true` key checked by the billing service. |
| **Resolution** | Updated the mock payment response object in `tests/data/testData.ts` to include the `success: true` key. |
| **Verified By** | Senior QA Engineer |

---

## 7. Defect Distribution

The following distribution maps defect detection across the 11 modules:

* **User & Auth Management:** No Defect Detected.
* **Court Management:** No Defect Detected.
* **Booking Management:** No Defect Detected.
* **Coach Management:** No Defect Detected.
* **Payment & Refund:** 2 Defects Detected (`DF_PAY_01`, `DF_PAY_02`).
* **Promotion Module:** No Defect Detected.
* **Review Module:** No Defect Detected.
* **Notification Module:** No Defect Detected.
* **Admin Module:** No Defect Detected.
* **Player Matching:** No Defect Detected.
* **AI Assistant:** No Defect Detected.

---

## 8. Root Cause Analysis

* **Logic & Timezone Errors (`DF_PAY_01`):** Caused by extracting timezone-dependent values via `Date.getUTCHours()` without normalizations. This created inconsistent behavior between environments (e.g., local machines running under local system time vs clean container pipelines).
* **API Integration & Mock Schema Gaps (`DF_PAY_02`):** Caused by incomplete mock responses that missed critical properties required by the integration handlers.

---

## 9. Defect Resolution Summary

* **Defects Resolved:** 2 (`DF_PAY_01`, `DF_PAY_02`).
* **Defects Open:** 0.
* **Defects Under Observation:** 0.

Both identified defects have been resolved, and their fixes are verified by regression tests in the test suite.

---

## 10. QA Dashboard Defect Analysis

The **Vite-React QA Dashboard** provides a centralized defect analytics portal:
* **Defect Overview:** Displays the total count of identified defects (2), active defects (0), and closed/resolved defects (2).
* **Severity Breakdown:** Highlights severity counts (1 High, 1 Medium) using visual indicators.
* **Defect Log:** Lists defect descriptions, steps to reproduce, expected results, actual results, and resolution details.

---

## 11. Evidence

Figure 10-1. Defect Center Dashboard
[Insert Screenshot: Defect Center]
*Description:*
The Defect Center screen of the QA portal, showing resolved defect logs and severity metrics.

Figure 10-2. Defect Statistics
[Insert Screenshot: Defect Summary]
*Description:*
A dashboard graph displaying the severity distribution of all defects identified during execution.

Figure 10-3. Test Execution Result
[Insert Screenshot: Test Execution Dashboard]
*Description:*
The main execution dashboard, showing that all 53 automated test cases passed successfully.

---

## 12. Risk Assessment

* **Residual Risk Evaluation:** Residual Risk is considered **low** because all executed automated test cases passed successfully.
* **Limitations:** Automated unit tests verify logic in isolation and do not cover UI rendering defects or live payment gateway API integrations.

---

## 13. Recommendations

1. **Continue Regression Testing:** Run the automated test suite regularly to prevent future regressions as codebase features grow.
2. **Expand Boundary Testing:** Introduce extra edge cases for date limits and booking hour calculations.
3. **Monitor Production Logs:** Monitor production billing logs to verify PayOS webhook integrations behave as expected.
4. **Integrate E2E UI Tests:** Add browser-level UI testing to verify page elements render correctly across viewports.

---

## 14. Conclusion

The latest testing cycle did not identify any critical or major defects. The system is considered stable based on the executed automated tests.
