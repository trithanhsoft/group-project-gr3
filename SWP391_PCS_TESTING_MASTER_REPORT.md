# TÀI LIỆU TỔNG HỢP TOÀN BỘ DỮ LIỆU KIỂM THỬ DỰ ÁN PCS (SWP391)
*Dành cho AI để tự động sinh báo cáo kiểm thử chi tiết theo mẫu ISTQB v4.0*

---

## PHẦN 1: THÔNG TIN DỰ ÁN & THÀNH VIÊN (DOCUMENT INFORMATION)

* **Tên dự án (Project Name):** Pickleball Court & Coach Booking System (PCS)
* **Tiêu đề tài liệu (Document Title):** TEST PLAN
* **Phiên bản (Version):** v1.1
* **Người lập (Prepared By):** TRẦN QUỐC SANG - Project Manager
* **Người kiểm duyệt (Reviewed By):** TRƯƠNG QUANG TUÂN - Tester 1
* **Người phê duyệt (Approved By):** LÊ THỊ VĂN ANH - QA Leader
* **Ngày tạo (Date):** 19/07/2026
* **Trạng thái (Status):** Approved (Đã phê duyệt)

### LỊCH SỬ THAY ĐỔI (REVISION HISTORY)

| Phiên bản | Ngày | Tác giả | Mô tả thay đổi |
| --- | --- | --- | --- |
| 1.0 | 10/10/2023 | TRẦN QUỐC SANG | Tạo bản thảo kế hoạch kiểm thử ban đầu (Initial Draft Test Plan) |
| 1.1 | 19/07/2026 | TRẦN QUỐC SANG | Cập nhật ma trận truy vết yêu cầu (RTM) và số liệu kết quả chạy test |

### Thành viên nhóm SWP391 và Phân công trách nhiệm:
1. **LÊ THỊ VĂN ANH (QA Leader)** *(Người đóng góp chính - làm nhiều nhất)*:
   * **Trách nhiệm:** Chủ trì thiết lập và chạy bộ công cụ kiểm thử (`TESTING_TOOLS_REPORT.md`), viết các kịch bản kiểm thử tích hợp API trong folder `tests/api/`, viết script tổng hợp và cấu hình QA Test Dashboard, quản lý lỗi (`DEFECT_REPORT.md`), kiểm duyệt và xuất báo cáo chất lượng tổng kết (`TEST_SUMMARY_REPORT.md`). Trực tiếp quản lý QA Dashboard.
2. **TRƯƠNG QUANG TUÂN (Tester 1 - Automation Tester)**:
   * **Trách nhiệm:** Thiết kế và lập trình bộ Unit Test tự động cho các service; viết báo cáo kiểm thử đơn vị (`UNIT_TEST_REPORT.md`).
3. **TRẦN QUỐC SANG (Project Manager / Tester 2)**:
   * **Trách nhiệm:** Lập kế hoạch kiểm thử (`TEST_PLAN.md`), thiết kế kịch bản System Test dùng kỹ thuật Bảng quyết định (`DECISION_TABLE_TEST_REPORT.md`), viết đặc tả và kịch bản Use Case (`USE_CASE_TEST_REPORT.md`).
4. **NGUYỄN ĐÀO VĂN QUÝ (Developer 1 - Backend Dev)**:
   * **Trách nhiệm:** Phát triển logic backend, hỗ trợ thiết lập mock db/email phục vụ test; sửa lỗi logic và API phát sinh.
5. **LÊ HỮU SƠN (Developer 2 - Frontend Dev)**:
   * **Trách nhiệm:** Phát triển giao diện UI biểu mẫu; tích hợp React Testing Library chạy UI test màn hình Đăng nhập.

---

## PHẦN 2: KẾ HOẠCH KIỂM THỬ (TEST PLAN THEO CHUẨN ISTQB V4.0)

### 1. Introduction (Giới thiệu)
* **Mục tiêu:** Xác định kế hoạch, chiến lược, phạm vi và lịch trình kiểm thử cho dự án PCS nhằm đảm bảo hệ thống đặt sân và huấn luyện viên hoạt động ổn định, chính xác.
* **Tầm quan trọng:** Đặt sân pickleball đòi hỏi xử lý thời gian thực (real-time booking), tránh trùng lịch (double booking) và thanh toán chính xác. Kiểm thử đảm bảo giảm thiểu tối đa rủi ro giao dịch thất bại.

### 2. Project Overview (Tổng quan dự án)
* **Hệ thống:** PCS cho phép tìm kiếm sân, đặt sân trực tuyến, thuê huấn luyện viên, ghép cặp người chơi, tư vấn qua chatbot AI và thống kê SaaS doanh thu cho Admin.
* **Công nghệ sử dụng:** Next.js (Backend & Frontend), MS SQL Server (Database driver mocked), Vitest + React Testing Library (Kiểm thử).

### 3. Test Objectives (Mục tiêu kiểm thử)
* Đạt tỉ lệ Pass Rate = 100% đối với toàn bộ các ca kiểm thử tự động đã thiết kế.
* Đạt độ bao phủ mã nguồn (Code Coverage) ở lớp xử lý logic nghiệp vụ >90%.
* Xác thực các quy tắc nghiệp vụ ranh giới (hủy lịch hoàn tiền, giới hạn 3 booking/ngày, áp voucher).

### 4. Test Scope (Phạm vi kiểm thử)
* **Trong phạm vi (In Scope):** 11 module nghiệp vụ: User & Auth, Court, Booking, Coach, Payment & Refund, Promotion, Review, Notification, Player Matching, AI Assistant, Admin Reports.
* **Ngoài phạm vi (Out Scope):** Bảo mật hạ tầng mạng, thanh toán tiền thật với ngân hàng (chỉ dùng sandbox PayOS), kiểm thử hiệu năng chịu tải (Load Test).

### 5. Test Items (Đối tượng kiểm thử)
* Các API Endpoints: `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/bookings/court`, `POST /api/payments/payos-webhook`, v.v.
* Trang giao diện: Màn hình Đăng nhập (`LoginPage` component).
* Các hàm logic backend trong `backend/src/modules/`.

### 6. Test Types (Các loại kiểm thử)
* **Functional Testing:** Đăng ký, đăng nhập, đặt sân, áp dụng voucher, gợi ý ghép cặp.
* **Integration Testing:** Kiểm thử liên kết luồng Đặt sân ➔ Gọi cổng PayOS ➔ Nhận Webhook xác nhận thanh toán.
* **System Testing:** Áp dụng kỹ thuật Bảng quyết định và kịch bản Use Case.
* **Regression Testing:** Chạy lại toàn bộ bộ test tự động mỗi khi có thay đổi code.

### 7. Test Strategy & Levels (Chiến lược & Cấp độ)
* **Unit Testing:** Thực hiện bởi Tester 1 (Tuân) viết bằng Vitest.
* **API Testing:** Thực hiện bởi cả đội sử dụng Vitest NextRequest simulation.
* **UI Component Testing:** Thực hiện bởi Tester 1 & Dev 2 sử dụng React Testing Library.
* **Automation Testing:** Tự động hóa 100% bằng Vitest.

### 8. Entry Criteria (Điều kiện bắt đầu)
* Tài liệu đặc tả yêu cầu đã được phê duyệt.
* Code đã được deploy ổn định trên môi trường local test.
* Bộ dữ liệu mock (`testData.ts`) đã sẵn sàng.

### 9. Exit Criteria (Điều kiện kết thúc)
* 100% test cases tự động chạy thành công (Pass rate = 100%).
* Không còn lỗi nghiêm trọng (Critical/High) chưa sửa.
* Độ bao phủ các file service nghiệp vụ đạt trên 90%.

### 10. Test Environment (Môi trường)
* Node.js v18+, JSDOM (Giả lập trình duyệt), Mock SQL Server Driver.

### 11. Test Tools (Công cụ)
* Vitest, React Testing Library, Istanbul v8, QA Dashboard.

### 12. Test Data Management (Quản lý dữ liệu)
* Toàn bộ dữ liệu kiểm thử được tập trung hóa tại `tests/data/testData.ts` (chia làm các phân vùng dữ liệu hợp lệ và không hợp lệ).

### 13. Test Schedule (Lịch trình - 01 tháng từ 01/10/2023 đến 01/11/2023)
* **Giai đoạn 1 (01/10 - 07/10):** Khảo sát yêu cầu & Lập kế hoạch kiểm thử (Owner: TRẦN QUỐC SANG).
* **Giai đoạn 2 (08/10 - 14/10):** Thiết kế Test Cases (Unit Test, Bảng quyết định, Use Case) (Owner: TRẦN QUỐC SANG & TRƯƠNG QUANG TUÂN).
* **Giai đoạn 3 (15/10 - 24/10):** Thiết lập môi trường, lập trình scripts test tự động bằng Vitest, chạy test phát hiện lỗi (Owner: Cả nhóm).
* **Giai đoạn 4 (25/10 - 01/11):** Chạy kiểm thử hồi quy (Regression test), đóng lỗi và xuất báo cáo nghiệm thu (Owner: LÊ THỊ VĂN ANH).

### 14. Defect Management (Quy trình quản lý lỗi)
* **Quy trình luân chuyển trạng thái:** `New` (Lỗi mới phát hiện) ➔ `Assigned` (Giao cho Developer sửa) ➔ `In Progress` (Đang sửa) ➔ `Fixed` (Đã sửa xong) ➔ `Retest` (Kiểm thử viên kiểm tra lại) ➔ `Closed` (Đã xác nhận sửa thành công và đóng lỗi).
* **Định nghĩa mức độ nghiêm trọng (Severity Levels):**
  * **Critical:** Gây crash hệ thống, mất dữ liệu, hoặc nghẽn luồng đăng ký/đăng nhập.
  * **High:** Lỗi chức năng chính không hoạt động (như lỗi múi giờ hoàn tiền hoặc không tạo được QR Code thanh toán).
  * **Medium:** Lỗi chức năng phụ hoặc lỗi giao diện hiển thị sai trường dữ liệu.
  * **Low:** Lỗi nhỏ về font chữ, căn lề UI, hoặc các lỗi không ảnh hưởng đến trải nghiệm người dùng.

### 15. Risks & Mitigation (Rủi ro & Biện pháp giảm thiểu)
* **Rủi ro 1: Trễ hạn API backend từ phía đội phát triển.**
  * **Biện pháp giảm thiểu:** Đội QA (Anh, Tuân) chủ động viết các Mock Repositories để mô phỏng hoàn toàn database và service, cho phép chạy test độc lập không phụ thuộc backend.
* **Rủi ro 2: Lỗi chạy không đồng nhất (Flaky tests) do môi trường hoặc múi giờ.**
  * *Biện pháp giảm thiểu:* Thiết lập múi giờ mặc định chạy test là UTC+7 trong script khởi chạy để loại trừ sai số thời gian hoàn tiền.

### 16. Test Deliverables (Sản phẩm kiểm thử bàn giao)
* Kế hoạch kiểm thử (`TEST_PLAN.md`).
* Các kịch bản kiểm thử chi tiết (`UNIT_TEST_REPORT.md`, `DECISION_TABLE_TEST_REPORT.md`, `USE_CASE_TEST_REPORT.md`).
* Mã nguồn scripts kiểm thử tự động (Vitest scripts).
* Báo cáo tổng hợp lỗi và chất lượng (`DEFECT_REPORT.md`, `TEST_SUMMARY_REPORT.md`).
* Ma trận truy vết yêu cầu (Requirement Traceability Matrix - RTM).

### 17. Communication Plan (Kế hoạch trao đổi thông tin)
* **Họp QA hàng ngày (Daily Standup):** Tần suất: Hàng ngày \| Thành viên: Nhóm QA \| Mục tiêu: Báo cáo tiến độ chạy test và lỗi mới phát hiện.
* **Họp duyệt lỗi (Defect Review Meeting):** Tần suất: 2 lần/tuần \| Thành viên: QA + Dev \| Mục tiêu: Đánh giá độ ưu tiên sửa lỗi và bàn giao bản build sửa lỗi.
* **Báo cáo tình trạng kiểm thử (Weekly Status Report):** Tần suất: Hàng tuần \| Thành viên: QA Lead gửi Stakeholders \| Mục tiêu: Báo cáo tỷ lệ Pass rate và biểu đồ lỗi.

### 18. Approvals (Phê duyệt tài liệu)
* **QA Lead:** LÊ THỊ VĂN ANH (Đã ký duyệt)
* **Project Manager:** TRẦN QUỐC SANG (Đã ký duyệt)
* **Giảng viên hướng dẫn môn SWP391:** (Chờ phê duyệt)

---

## PHẦN 3: UNIT TEST - PHÂN TÍCH KỸ THUẬT HỌC THUẬT (EP, BVA & WHITE-BOX)
* **Người thực hiện:** TRƯƠNG QUANG TUÂN (Tester 1 - Automation Tester)

### 1. Kỹ thuật Hộp đen áp dụng cho hàm `calculateRefundAmount()` (Tính tiền hoàn khi hủy lịch)
* **Quy tắc nghiệp vụ:** Hủy trước $\ge 12$h hoàn 100%; Hủy từ 2h - 12h hoàn 70%; Hủy $< 2$h hoàn 0%.
* **Phân vùng tương đương (EP):**
  * *Phân vùng 1 (Hoàn 100%):* Thời gian hủy trước $\ge 12$ giờ. (Giá trị đại diện: 15 giờ).
  * *Phân vùng 2 (Hoàn 70%):* Thời gian hủy trước từ 2 giờ đến dưới 12 giờ. (Giá trị đại diện: 5 giờ).
  * *Phân vùng 3 (Hoàn 0%):* Thời gian hủy trước $< 2$ giờ. (Giá trị đại diện: 1 giờ).
* **Phân tích giá trị biên (BVA):**
  * *Biên 12 giờ:* Giá trị thử nghiệm: 11.9 giờ (hoàn 70%), 12 giờ (hoàn 100%), 12.1 giờ (hoàn 100%).
  * *Biên 2 giờ:* Giá trị thử nghiệm: 1.9 giờ (hoàn 0%), 2 giờ (hoàn 70%), 2.1 giờ (hoàn 70%).

### 2. Kỹ thuật Hộp đen áp dụng cho hàm `createBooking()` (Giới hạn đặt sân)
* **Quy tắc:** Tối đa 3 đơn đặt/ngày/user.
* **Phân tích giá trị biên (BVA):**
  * Lượt đặt thứ 2: Đạt (Thành công).
  * Lượt đặt thứ 3 (Tại biên): Đạt (Thành công).
  * Lượt đặt thứ 4 (Vượt biên): Lỗi (Bị từ chối).

### 3. Kỹ thuật Hộp trắng áp dụng cho hàm `validatePromotion()` (Áp dụng Voucher)
* **Độ bao phủ câu lệnh (Statement Coverage):** Thiết kế test cases đi qua tất cả dòng code bao gồm các khối ném lỗi ngoại lệ (Voucher hết hạn, đơn hàng chưa đạt giá trị tối thiểu) và khối tính toán giảm giá thành công.
* **Độ bao phủ nhánh (Branch Coverage):**
  * *Nhánh 1:* Hết hạn = True ➔ Lỗi "Voucher không trong thời gian hiệu lực".
  * *Nhánh 2:* Hết hạn = False, Đơn hàng < MinOrderAmount = True ➔ Lỗi "Giá trị đơn chưa đạt tối thiểu".
  * *Nhánh 3:* Hợp lệ ➔ Tính giảm giá thành công.

---

## PHẦN 4: SYSTEM TEST - BẢNG QUYẾT ĐỊNH (DECISION TABLE TESTING)
* **Người thực hiện:** TRẦN QUỐC SANG (Project Manager / Tester 2)

* **Chức năng chọn:** Form Đăng ký tài khoản UI (`Register Form`).
* **Các điều kiện đầu vào:**
  * **C1:** Email đúng định dạng và chưa tồn tại trong hệ thống. (Y/N)
  * **C2:** Số điện thoại gồm 10 chữ số và chưa tồn tại trong hệ thống. (Y/N)
  * **C3:** Mật khẩu mạnh (độ dài $\ge 8$ ký tự, chứa chữ hoa, chữ thường, số, ký tự đặc biệt). (Y/N)
* **Các hành động đầu ra:**
  * **A1:** Tạo tài khoản thành công và gửi OTP.
  * **A2:** Báo lỗi mật khẩu không hợp lệ.
  * **A3:** Báo lỗi số điện thoại không hợp lệ/đã tồn tại.
  * **A4:** Báo lỗi email không hợp lệ/đã tồn tại.

### Bảng Quyết Định (Decision Table):

| Điều kiện / Hành động | R1 | R2 | R3 | R4 | R5 | R6 | R7 | R8 |
| --- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **C1:** Email hợp lệ & duy nhất | Y | Y | Y | Y | N | N | N | N |
| **C2:** SĐT hợp lệ & duy nhất | Y | Y | N | N | Y | Y | N | N |
| **C3:** Mật khẩu hợp lệ | Y | N | Y | N | Y | N | Y | N |
| **A1:** Đăng ký thành công & gửi OTP | **X** | | | | | | | |
| **A2:** Báo lỗi mật khẩu | | **X** | | **X** | | **X** | | **X** |
| **A3:** Báo lỗi SĐT | | | **X** | **X** | | | **X** | **X** |
| **A4:** Báo lỗi Email | | | | | **X** | **X** | **X** | **X** |

### Bộ Ca kiểm thử Thiết kế (Test Cases):
* **Trạng thái thực thi:** **Thiết kế (Design Level)**. Các ca kiểm thử dưới đây dùng để thiết kế kiểm thử trên UI. Vì mã nguồn hiện tại chưa tách biệt log thực thi cho từng trường hợp quy tắc quyết định (`TC_DT`) riêng lẻ, chúng đang ở mức thiết kế lý thuyết và được bao phủ gián tiếp qua các unit/UI test của hệ thống.
* **TC_DT_01 (R1 - Thành công):** Email `new@example.com`, SĐT `0987654321`, Pass `Secure123!`. *Kỳ vọng:* Đăng ký thành công.
* **TC_DT_02 (R2 - Mật khẩu yếu):** Email `new@example.com`, SĐT `0987654321`, Pass `123`. *Kỳ vọng:* Lỗi mật khẩu.
* **TC_DT_03 (R3 - Trùng SĐT):** Email `new@example.com`, SĐT `0905123456` (trùng), Pass `Secure123!`. *Kỳ vọng:* Lỗi SĐT.
* **TC_DT_04 (R4 - Trùng SĐT + Pass yếu):** Email `new@example.com`, SĐT `0905123456` (trùng), Pass `abc`. *Kỳ vọng:* Báo lỗi SĐT và Pass.
* **TC_DT_05 (R5 - Trùng Email):** Email `existed@example.com` (trùng), SĐT `0987654321`, Pass `Secure123!`. *Kỳ vọng:* Lỗi Email.
* **TC_DT_06 (R6 - Trùng Email + Pass yếu):** Email `existed@example.com` (trùng), SĐT `0987654321`, Pass `123`. *Kỳ vọng:* Báo lỗi Email và Pass.
* **TC_DT_07 (R7 - Trùng Email + Trùng SĐT):** Email `existed@example.com` (trùng), SĐT `0905123456` (trùng), Pass `Secure123!`. *Kỳ vọng:* Báo lỗi Email và SĐT.
* **TC_DT_08 (R8 - Lỗi tất cả các trường):** Email `existed@example.com` (trùng), SĐT `0905123456` (trùng), Pass `abc`. *Kỳ vọng:* Báo lỗi tất cả các trường.

---

## PHẦN 5: SYSTEM TEST - KỊCH BẢN USE CASE (USE CASE TESTING)
* **Người thực hiện:** TRẦN QUỐC SANG (Project Manager / Tester 2)

* **Use Case:** Đặt sân bóng và Thanh toán trực tuyến (`Book Court and Pay Online` - Code: `UC-04`).
* **Tiền điều kiện:** User đăng nhập, tài khoản `Active`, slot chọn đang trống.
* **Hậu điều kiện:** Booking chuyển thành `Paid`, slot giờ bị khóa, thông báo được gửi đi.

### Các luồng nghiệp vụ:
1. **Luồng Cơ Bản (Basic Flow - BF):**
   * Người chơi chọn sân ➔ Chọn slot giờ trống ➔ Nhấn "Đặt sân" ➔ Hệ thống kiểm tra ràng buộc hợp lệ ➔ Tạo đơn hàng tạm thời `PendingPayment` (giữ chỗ trong 10 phút) ➔ Chuyển hướng sang cổng PayOS hiển thị mã QR ➔ Người chơi quét mã QR thanh toán thành công ➔ Hệ thống nhận Webhook IPN từ PayOS ➔ Cập nhật trạng thái đơn thành `Paid`, khóa slot chính thức và gửi thông báo.
2. **Luồng Thay Thế / Ngoại Lệ (Alternative Flows - AF):**
   * **AF 1 (Trùng giờ):** Slot giờ vừa bị người khác đặt trước 1 giây ➔ Hệ thống chặn giao dịch, báo lỗi trùng lịch.
   * **AF 2 (Quá giới hạn đặt):** Đã đặt thành công 3 đơn trước đó ➔ Hệ thống chặn tạo đơn thứ 4, báo lỗi giới hạn ngày.
   * **AF 3 (Hủy/Quá hạn thanh toán):** Người chơi nhấn Hủy trên cổng PayOS hoặc quá 10 phút không chuyển khoản ➔ Hệ thống giải phóng slot giữ chỗ, chuyển trạng thái đơn sang `Cancelled`.

### Bộ Ca kiểm thử Thiết kế (Test Cases):
* **TC_UC_01 (Kiểm thử BF):** Đặt sân 1, slot 09:00 - 10:00, quét mã thanh toán thành công. *Kỳ vọng:* Đơn chuyển thành `Paid`.
* **TC_UC_02 (Kiểm thử AF 1):** Đặt slot 09:00 - 10:00 đã bị khóa. *Kỳ vọng:* Báo lỗi trùng lịch chơi.
* **TC_UC_03 (Kiểm thử AF 2):** Đặt slot khi đã có 3 đơn hàng trước đó. *Kỳ vọng:* Báo lỗi quá giới hạn 3 lần/ngày.
* **TC_UC_04 (Kiểm thử AF 3):** Đặt lịch thành công nhưng ấn "Hủy thanh toán" trên PayOS. *Kỳ vọng:* Đơn chuyển thành `Cancelled`, slot giờ mở lại trạng thái trống.

---

## PHẦN 6: BỘ CÔNG CỤ KIỂM THỬ & DEMO THUYẾT TRÌNH (SLIDES GUIDE)
* **Người thực hiện:** LÊ THỊ VĂN ANH (QA Leader)

* **Bộ công cụ sử dụng:**
  1. **Vitest:** Thực thi test chạy cực nhanh, song song, hỗ trợ Hot Module Replacement.
  2. **React Testing Library & JSDOM:** Giả lập môi trường trình duyệt để render và test DOM ảo màn hình Login.
  3. **Istanbul v8:** Công cụ phân tích tĩnh đo độ bao phủ mã nguồn.
  4. **QA Dashboard (Vite-React):** Công cụ quản lý kiểm thử, hiển thị kết quả, lịch sử và ma trận truy vết trực quan (cổng 8081).

### Hướng dẫn chạy và Demo trên lớp (8 phút):
1. **Lệnh cài đặt:**
   ```bash
   npm install
   ```
2. **Chạy toàn bộ 53 ca kiểm thử tự động:**
   ```bash
   npm run test
   ```
3. **Chạy đo độ bao phủ (Coverage) đạt >92.5%:**
   ```bash
   npm run test:coverage
   ```
   *(Báo cáo HTML chi tiết được xuất tại `/coverage/index.html`)*.
4. **Khởi chạy Test Dashboard (Test Management Tool):**
   ```bash
   npm run test:dashboard
   node scripts/serve-dashboard.js
   ```
   Mở trình duyệt truy cập: [http://localhost:8081](http://localhost:8081) để xem trực quan kết quả, xem Traceability Matrix và Defect Center.

---

## PHẦN 7: BÁO CÁO KẾT QUẢ THỰC THI (TEST EXECUTION & STATISTICS)

* **Tổng số ca kiểm thử:** 53 test cases (41 unit tests, 9 API tests, 3 UI component tests).
* **Kết quả:** **53 Passed / 0 Failed (Tỷ lệ thành công 100%)**.
* **Tổng thời gian chạy test thực tế:** 4.22 giây.
* **Tổng số lỗi phát hiện và đã sửa (Defects):**
  1. **DF_PAY_01 (High):** Lệch múi giờ khi tính toán thời gian hoàn tiền trên Windows máy local và server (Đã sửa và đồng nhất múi giờ về UTC+7).
  2. **DF_PAY_02 (Medium):** Thiếu success indicator khi PayOS xác nhận webhook trong module thanh toán (Đã sửa và bổ sung trường validation).
* **Trạng thái đóng lỗi:** Đã đóng (Closed) 100%, không còn lỗi tồn đọng.

---

## PHẦN 8: MA TRẬN TRUY VẾT YÊU CẦU (REQUIREMENT TRACEABILITY MATRIX - RTM)

Ma trận dưới đây ánh xạ các yêu cầu nghiệp vụ / Use Case của dự án PCS với các ca kiểm thử tự động tương ứng (bao gồm Unit, API và UI tests), kết quả thực thi thực tế cùng độ bao phủ code:

| Tính năng | Use Case Code | Mã Test Case ID | File Unit Test | File API Test | File UI Test | Kết quả | Coverage | Lỗi liên quan |
| --- | :---: | --- | --- | --- | --- | :---: | :---: | --- |
| Đăng ký tài khoản | UC-01 | `TC_USR_01` | `user.test.ts` | `auth.api.test.ts` | `login.ui.test.tsx` (mẫu đăng ký) | Pass | 95.0% | Không có |
| Đăng ký tài khoản | UC-01 | `TC_USR_02` | `user.test.ts` | `auth.api.test.ts` | - | Pass | 100.0% | Không có |
| Đăng nhập hệ thống | UC-02 | `TC_USR_04` | `user.test.ts` | `auth.api.test.ts` | `login.ui.test.tsx` | Pass | 98.0% | Không có |
| Danh sách sân chơi | UC-03 | `TC_CRT_01` | `court.test.ts` | `court.api.test.ts` | - | Pass | 92.0% | Không có |
| Chi tiết sân chơi | UC-03 | `TC_CRT_03` | `court.test.ts` | - | - | Pass | 94.0% | Không có |
| Tra cứu slot trống | UC-04 | `TC_CRT_05` | `court.test.ts` | - | - | Pass | 90.0% | Không có |
| Đặt sân trực tuyến | UC-05 | `TC_BKG_01` | `booking.test.ts` | `booking.api.test.ts` | - | Pass | 96.0% | Không có |
| Kiểm tra trùng slot | UC-05 | `TC_BKG_02` | `booking.test.ts` | - | - | Pass | 100.0% | Không có |
| Giới hạn lượt đặt | UC-05 | `TC_BKG_03` | `booking.test.ts` | - | - | Pass | 100.0% | Không có |
| Liên kết PayOS | UC-06 | `TC_PAY_01` | `payment.test.ts` | `payment.api.test.ts` | - | Pass | 95.0% | `DF_PAY_02` (Fixed) |
| Webhook thanh toán | UC-06 | `TC_API_09` | - | `payment.api.test.ts` | - | Pass | 100.0% | Không có |
| Tính hoàn tiền hủy | UC-07 | `TC_PAY_02` | `payment.test.ts` | - | - | Pass | 100.0% | `DF_PAY_01` (Fixed) |
| Hoàn tiền 70% | UC-07 | `TC_PAY_03` | `payment.test.ts` | - | - | Pass | 100.0% | Không có |
| Hoàn tiền 0% | UC-07 | `TC_PAY_04` | `payment.test.ts` | - | - | Pass | 100.0% | Không có |
| Áp dụng Voucher | UC-08 | `TC_PRM_01` | `promotion.test.ts` | - | - | Pass | 94.0% | Không có |
| Check Voucher hết hạn| UC-08 | `TC_PRM_02` | `promotion.test.ts` | - | - | Pass | 100.0% | Không có |
| Ghép cặp vai trò | UC-09 | `TC_MAT_01` | `matching.test.ts` | - | - | Pass | 100.0% | Không có |
| Ghép cặp trình độ | UC-09 | `TC_MAT_04` | `matching.test.ts` | - | - | Pass | 100.0% | Không có |
| Phân tích ý định AI | UC-10 | `TC_AI_01` | `ai.test.ts` | - | - | Pass | 92.0% | Không có |
| Fallback chatbot | UC-10 | `TC_AI_02` | `ai.test.ts` | - | - | Pass | 100.0% | Không có |
| Thống kê doanh thu | UC-11 | `TC_ADM_01` | `reports.test.ts` | - | - | Pass | 96.0% | Không có |
| So sánh chu kỳ | UC-11 | `TC_ADM_02` | `reports.test.ts` | - | - | Pass | 98.0% | Không có |

---

## PHẦN 9: NHẬT KÝ AI AUDIT, PROMPTS & PHẢN TƯ (AI AUDIT LOG, PROMPTS & REFLECTION - 10 TUẦN)

Các tài liệu chi tiết đã được khởi tạo riêng biệt tại:
* **[AI_AUDIT_LOG.md](file:///c:/Users/Lenovo%20LEGION%205/OneDrive/Desktop/SWT_TESTING/pickleball-booking-system-main/AI_AUDIT_LOG.md)**
* **[PROMPTS.md](file:///c:/Users/Lenovo%20LEGION%205/OneDrive/Desktop/SWT_TESTING/pickleball-booking-system-main/PROMPTS.md)**
* **[REFLECTION.md](file:///c:/Users/Lenovo%20LEGION%205/OneDrive/Desktop/SWT_TESTING/pickleball-booking-system-main/REFLECTION.md)**

Dưới đây là nội dung tổng hợp tóm tắt phục vụ AI sinh báo cáo:

### 9.1. Tóm tắt AI Audit Log qua 10 tuần
* **Tuần 1-2 (Khảo sát & Database):** Dùng ChatGPT gợi ý chức năng hệ thống PCS và sinh mã tạo bảng SQL Server (Users, Courts, Bookings). Sửa đổi: Điều chỉnh định dạng slot giờ chơi dạng chuỗi `HH:mm` để dễ xử lý.
* **Tuần 3-5 (Phát triển Backend):** Copilot sinh code Auth JWT helper, mật khẩu bcryptjs, check trùng slot giờ (Overlap check) và thuật toán ghép cặp (Player matching compatibility). Sửa đổi: Đổi thang điểm skill gap từ 10 sang 100 và tách JWT keys ra `.env`.
* **Tuần 6-8 (Thiết lập & Viết Test):** Claude gợi ý cấu hình Vitest Workspace chạy song song; ChatGPT sinh unit tests cho quy tắc hoàn tiền (`payment.test.ts` 100%/70%/0%) và `login.ui.test.tsx` (màn Login DOM test). Sửa đổi: Khắc phục lỗi timezone bằng hàm sinh ngày tương lai động.
* **Tuần 9-10 (System Test & Dashboard):** Claude hỗ trợ thiết kế Bảng quyết định và Use Case đặt sân & thanh toán; ChatGPT sinh code React Test Dashboard cổng 8081 và script Node.js parse file XML coverage.

### 9.2. Nhật ký Prompt tiêu biểu
* **Prompt sinh Test Quy tắc hoàn tiền (Tuần 7):** *"Hãy viết unit test bằng Vitest cho hàm calculateRefundAmount(dateStr, timeStr, amount). Quy tắc: Hủy trước >=12h hoàn 100%, hủy 2h-12h hoàn 70%, hủy <2h hoàn 0%. Thiết kế test cases qua các biên 12h, 2h..."* ➔ Nhóm đã sử dụng cấu hình và viết thêm hàm xử lý ngày tương lai tránh flaky test.
* **Prompt sinh script parse xml (Tuần 10):** *"Viết script Node.js và TypeScript đọc file xml coverage từ Istanbul, parse các chỉ số statements, branches, functions, lines ghi vào json..."* ➔ Nhóm tích hợp thêm phần đọc Vitest `test-results.json` để đồng bộ Dashboard.

### 9.3. Báo cáo phản tư (Reflection Summary)
1. **Bài học đạt được:** Nắm vững lý thuyết thiết kế kiểm thử hộp đen/hộp trắng; tự động hóa 100% suite 53 test cases; làm sạch dữ liệu kiểm thử tập trung qua `testData.ts`.
2. **AI hỗ trợ:** Tiết kiệm 50% thời gian viết mã boilerplate; gợi ý tốt các luồng rẽ nhánh Use Case đặt sân.
3. **AI gợi ý sai:** Gặp lỗi lệch múi giờ hệ thống (timezone drift) và gợi ý cú pháp Testing Library React cũ đã lỗi thời. Nhóm phải tự tra cứu tài liệu gốc để sửa đổi.
4. **Kiểm chứng:** Chạy `npm run test` (100% Pass) và phân tích HTML Coverage (đạt >92.5%).
5. **Đóng góp của LÊ THỊ VĂN ANH:** Đóng góp nhiều nhất với vai trò QA Leader (Thiết lập bộ công cụ kiểm thử tự động, viết các kịch bản kiểm thử API, viết script và cấu hình QA Test Dashboard, quản lý lỗi và kiểm duyệt chất lượng báo cáo).

