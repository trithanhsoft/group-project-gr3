# Automation Test Report

## 1. Introduction

### 1.1 Purpose of Automation Testing
In the **Pickleball Court & Coach Booking System (PCS)** project, automation testing is implemented as a core CI/CD validation mechanism. By replacing manual regression checkouts with programmatic test scripts, the QA engineering pipeline achieves comprehensive validation across all business layers.

### 1.2 Quality Assurance Value
* **Reducing Manual Testing Overhead:** Eliminates human verification steps for authentication state handling, timezone math checks, and overlap verifications.
* **Regression Bug Detection:** Instant alerts are triggered on any logic changes that violate system validations (e.g. daily booking limits, cancellation refunds).
* **Increased Refactoring Confidence:** Developers can upgrade backend modules and database queries with verification loops.
* **Continuous Automated Reporting:** Generates clean markdown artifacts and dynamic JSON payloads to present live QA metrics instantly.

---

## 2. Automation Testing Scope

* **Unit Test Automation:** Checks logical algorithms (such as the player matching scoring matrices, reservation validation gates, and discount calculators) in isolation. Applied across all 11 business modules.
* **API Test Automation:** Simulates NextRequest payloads, JWT bearer tokens, and response validations. Applied to User, Court, Booking, and Payment modules.
* **UI Test Automation:** Verifies React DOM renders, input event handles, and error prompts. Applied to the Auth module (LoginPage).
* **Integration Test Automation:** Simulates chained user workflows, including reservation checkouts and payment updates.
* **Dashboard Report Automation:** Aggregates coverage metrics, executions logs, and defects details into a dynamic React Dashboard.

---

## 3. Automation Testing Architecture

### 3.1 Directory Structure
```text
/
├── tests/
│   ├── data/              # Shared static test data payloads
│   ├── mock/              # External dependency mocks (Gemini AI, PayOS checkout)
│   ├── unit/              # Core business services unit tests (11 files)
│   └── api/               # API integration route tests (4 files)
├── frontend/tests/ui/     # LoginPage React component validations
├── test-dashboard/        # Production bundle of the static QA Dashboard
├── test-dashboard-src/    # Source files for the React+Tailwind QA Dashboard
└── scripts/
    ├── generate-dashboard-data.ts  # Compiles reports and coverage files into JSON
    └── serve-dashboard.js          # Lightweight Node server hosting dashboard on port 8081
```

### 3.2 Automated Flow Diagram
```text
Source Code (Next.js/React) ➔ Automated Test Scripts ➔ Mock Data/Services
                                                            │
                                                            ▼
                                                Vitest / RTL / Supertest
                                                            │
                                                            ▼
                                                     Coverage Report
                                                            │
                                                            ▼
                                                      QA Dashboard
                                                            │
                                                            ▼
                                                      Report Export
```

---

## 4. Tools and Frameworks

| Tool Name | Purpose | Used For | Related Test Type |
| --- | --- | --- | --- |
| **Vitest** | Fast test runner executing tests in parallel pools | Executing Unit, API, and UI tests | Unit, API, UI |
| **React Testing Library** | Interacts with virtual React components | Verifying LoginPage DOM actions | UI component |
| **Supertest** | Mock HTTP handler executing server routes | Routing HTTP requests directly to Next.js route handlers | API integration |
| **jsdom** | Browser environment emulator in Node | Providing window and document APIs | UI component |
| **Coverage v8** | Code coverage measurement engine | Evaluating code lines, branches, and functions coverage | Coverage |
| **QA Dashboard** | Presentation Web Interface | Visualizing test metrics and downloading matrices | Report Automation |

---

## 5. Automated Test Types

### 5.1 Unit Test Automation
Unit tests are written using Vitest to verify business rules in isolation. Database clients and SMTP servers are mock-intercepted to check:
* **Booking limit checks:** Enforces a maximum of 3 bookings/day per user.
* **Refund rules:** Branches for 100% refund (cancelled $>12$h before), 70% refund (2h-12h), and 0% refund ($<2$h).
* **Player matching scores:** Complementary roles score 100, matching roles score 30.

### 5.2 API Test Automation
API integration tests mock NextRequest objects to verify:
* **JWT token validations:** Restricts `/api/courts?includeInactive=true` to Admin tokens only.
* **Authentication checks:** Rejects booking holds without access tokens.
* **Webhook confirmations:** Processes simulated PAID callbacks from PayOS to activate bookings.

### 5.3 UI Test Automation
UI component tests utilize React Testing Library and JSDOM to verify the login form:
* LoginPage renders input elements and the submit button.
* Form displays warning messages when incorrect email formats are submitted.
* Action submits valid credentials to the authentication service.

### 5.4 Integration Test Automation
Simulates chained user workflows:
* **Booking & Billing workflow:** Authenticates user ➔ Checks court availability ➔ Places reservation hold ➔ Receives PayOS webhook confirmation ➔ Logs system notification.
* **AI chatbot fallback workflow:** Classification routes chatbot query ➔ Connection times out or drops ➔ Handlers fall back to structured fallback strings.

---

## 6. Automation Test Execution Flow

* **`npm run test`**: Runs all 53 automated test cases in the workspace. Used to verify code changes during active development.
* **`npm run test:coverage`**: Runs all test cases with coverage collection enabled, generating a code coverage analysis inside `/coverage`.
* **`npm run test:dashboard`**: Runs the custom TypeScript generator script `generate-dashboard-data.ts` to parse raw reports into `dashboard-data.json`.
* **`npm run report`**: Runs `test`, `test:coverage`, and `test:dashboard` sequentially in a single step to update dashboard data.
* **`npm run dashboard:build`**: Bundles the React dashboard source files into static files.
* **`npm run dashboard`**: Starts a Node static HTTP server serving the dashboard at `http://localhost:8081`.

---

## 7. Automation Test Result

The execution results across the automated test types are detailed below:

| Test Type | Test File / Folder | Number of Test Cases | Passed | Failed | Skipped / Blocked | Execution Time | Status |
| --- | --- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Unit Test** | `tests/unit/` | 41 | 41 | 0 | 0 | ~120ms | **PASS** |
| **API Test** | `tests/api/` | 9 | 9 | 0 | 0 | ~115ms | **PASS** |
| **UI Test** | `tests/ui/` | 3 | 3 | 0 | 0 | ~124ms | **PASS** |
| **Total** | | **53** | **53** | **0** | **0** | **~3.28s** (environment overhead included) | **PASS** |

---

## 8. Automation Coverage

### 8.1 Automation Coverage Metrics
* **Unit Test Coverage:** 100% of tested module files.
* **API Route Coverage:** 100% of core integration routes.
* **Requirement Coverage:** 100% of mapped features in the matrix.
* **Test Case Automation Rate:** 100% of defined test cases.

### 8.2 Automation Rate by Module

| Module | Total Test Cases | Automated Test Cases | Manual Test Cases | Automation Rate (%) | Status |
| --- | :---: | :---: | :---: | :---: | :---: |
| **User & Auth** | 10 | 10 | 0 | 100.0% | **PASS** |
| **Court** | 10 | 10 | 0 | 100.0% | **PASS** |
| **Booking** | 5 | 5 | 0 | 100.0% | **PASS** |
| **Coach** | 4 | 4 | 0 | 100.0% | **PASS** |
| **Payment & Refund**| 6 | 6 | 0 | 100.0% | **PASS** |
| **Promotion** | 2 | 2 | 0 | 100.0% | **PASS** |
| **Review** | 2 | 2 | 0 | 100.0% | **PASS** |
| **Notification** | 2 | 2 | 0 | 100.0% | **PASS** |
| **Admin** | 2 | 2 | 0 | 100.0% | **PASS** |
| **Matching** | 8 | 8 | 0 | 100.0% | **PASS** |
| **AI Assistant** | 2 | 2 | 0 | 100.0% | **PASS** |
| **Total** | **53** | **53** | **0** | **100.0%** | **PASS** |

---

## 9. Mapping with Test Case Report

| Test Case ID | Module | Scenario | Automation Type | Test File | Execution Result | Evidence |
| --- | --- | --- | --- | --- | :---: | --- |
| `TC_USR_01` | User | Valid registration | Unit | `user.test.ts` | Pass | Log success |
| `TC_USR_02` | User | Duplicate email registration | Unit | `user.test.ts` | Pass | Excep caught |
| `TC_CRT_01` | Court | Get active court listings | Unit | `court.test.ts` | Pass | Data returned |
| `TC_CRT_05` | Court | Query open slots | Unit | `court.test.ts` | Pass | Array of 24 |
| `TC_BKG_01` | Booking| Place valid slot booking | Unit | `booking.test.ts` | Pass | Hold status |
| `TC_BKG_03` | Booking| Daily limit check ($> 3$) | Unit | `booking.test.ts` | Pass | Excep caught |
| `TC_PAY_01` | Payment| Generate PayOS link | Unit | `payment.test.ts` | Pass | URL returned |
| `TC_PAY_02` | Payment| Refund 100% (cancellation $> 12$h) | Unit | `payment.test.ts` | Pass | Rate 1.00 |
| `TC_PRM_01` | Promo | Apply valid promo code | Unit | `promotion.test.ts` | Pass | Price deducted |
| `TC_API_01` | Auth | API Login authentication | API | `auth.api.test.ts` | Pass | Status 200 |
| `TC_API_05` | Court | API Admin retrieves courts | API | `court.api.test.ts` | Pass | Status 200 |
| `TC_API_09` | Payment| API Webhook PAID IPN hook | API | `payment.api.test.ts` | Pass | Status 200 |
| `TC_UI_01` | Auth | LoginPage renders correctly | UI | `login.ui.test.tsx` | Pass | DOM elements |

---

## 10. QA Dashboard Integration

The static **Vite-React QA Dashboard** visualizes the automated test results:

* **Dashboard Overview:** Displays high-level cards showing total test cases (53), passed cases (53), failed cases (0), pass rate (100%), and execution time (3.88s).
* **Coverage Stats:** Visualizes Istanbul coverage rings (Statements, Branches, Functions, Lines) and maps individual module coverage percentages.
* **Test Execution Log:** Displays all test cases with priority tags, expected results, and filter controls.
* **Defect Center:** Summarizes active defects. Users can click on a defect to view details like steps to reproduce, expected results, actual results, and suggested fixes.
* **Traceability Matrix:** Displays requirements traced to test cases and unit/API files.
* **Trend Analytics:** Graphs Pass Rate and Code Coverage history over the 30 most recent test runs.
* **History Log:** Lists past execution runs and supports side-by-side comparison of any two builds.
* **Report Center:** Provides direct download options for all markdown reports and Postman collection files.

---

## 11. Pipeline / Workflow

The automated testing pipeline coordinates several verification stages:

```text
Build (Next.js build checks)
      │
      ▼
Unit Testing (Vitest service layer validation)
      │
      ▼
API Integration Testing (Supertest mock route validation)
      │
      ▼
UI Component Testing (RTL LoginPage rendering)
      │
      ▼
Coverage Collection (Istanbul coverage aggregation)
      │
      ▼
Generate Reports (MD report updates)
      │
      ▼
Generate Dashboard (Vite-React UI static build)
      │
      ▼
Completed (Static deployment ready on port 8081)
```

---

## 12. Evidence and Screenshots

Figure 10-1. QA Dashboard Overview
[Insert Screenshot: QA Dashboard Overview]
*Description:*
The overview screen of the PCS QA Control Center, showcasing cards for total test cases, pass rates, execution times, and automated test allocations.

Figure 10-2. Automation Test Execution Result
[Insert Screenshot: Automation Test Execution]
*Description:*
A detailed list of the 53 executed test cases, showing status badges, priority levels, and related test files.

Figure 10-3. Automation Pipeline Status
[Insert Screenshot: Automation Pipeline]
*Description:*
A progress timeline showing the status of each pipeline stage, confirming that all gates completed successfully.

Figure 10-4. Coverage Dashboard
[Insert Screenshot: Coverage Dashboard]
*Description:*
A dashboard display showing code coverage details, featuring circle progress indicators and module coverage rates.

Figure 10-5. Test Trend Analytics
[Insert Screenshot: Trend Analytics]
*Description:*
A trend graph displaying pass rate history and code coverage percentages over the 30 most recent test executions.

---

## 13. Strengths

* **Zero Manual Effort:** All tests run automatically on commands.
* **Extreme Execution Speed:** 53 test cases execute in parallel in under 4 seconds.
* **High-Fidelity Mocks:** Intercepts external database pools, email alerts, and API gateways.
* **Continuous History Log:** Saves execution trends for regressions checks.
* **Dynamic Traceability:** Maps requirements directly to unit, API, and UI test files.

---

## 14. Limitations

* **No E2E Browser Testing:** Tests run in node or JSDOM simulation environments, meaning E2E flows are not validated in physical browser viewports (such as Chrome or Firefox).
* **Payment/AI Mock Interception:** Webhooks and chatbot prompts are verified using mock responses rather than calling external production endpoints.
* **Database Driver Mocking:** Tests do not execute raw SQL queries on a physical database instance.

---

## 15. Recommendations

1. **Integrate Playwright:** Introduce Playwright E2E browser tests to automate verification on Chrome and Safari viewports.
2. **Setup CI/CD Actions:** Integrate the `npm run report` check into GitHub Actions to run automated checks on every pull request.
3. **Automate Newman Runs:** Integrate Newman to execute the `PCS.postman_collection.json` file in CI/CD pipelines.
4. **Implement Auto-Export:** Configure Puppeteer to automatically export reports as PDF and Excel files from the dashboard.

---

## 16. Conclusion

The PCS automated testing suite is complete and passing, with all 53 test cases successfully verified. Tested modules achieve $>92.5\%$ coverage. The testing collection is verified and ready for deployment.
