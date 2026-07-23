# BÁO CÁO KIỂM THỬ HỆ THỐNG - ÁP DỤNG KỸ THUẬT USE CASE TESTING
*Dự án Pickleball Court & Coach Booking System (PCS)*

| Trường thông tin | Chi tiết |
| --- | --- |
| **Mã tài liệu** | USE_CASE_TEST_REPORT |
| **Phiên bản** | v1.1 |
| **Ngày lập** | 19/07/2026 |
| **Người thực hiện** | TRẦN QUỐC SANG - Project Manager / Tester 2 |
| **Kiểm duyệt** | LÊ THỊ VĂN ANH - QA Leader |
| **Trạng thái** | Approved |

---

## 1. Chọn Use Case kiểm thử
* **Use Case:** Đặt sân bóng và Thanh toán trực tuyến (`Book Court and Pay Online`).
* **Mã Use Case:** `UC-04` (Khớp với Khung phân tích tính năng).
* **Lý do lựa chọn:** Đây là luồng nghiệp vụ xương sống, có hành trình người dùng (User Journey) đầy đủ từ duyệt tin, xử lý dữ liệu trung gian cho tới chuyển hướng cổng bên thứ ba và xử lý bất đồng bộ. Luồng này chứa cả các logic ràng buộc phức tạp ở phía Backend (trùng giờ, giới hạn đặt sân).

---

## 2. Đặc tả Use Case (Use Case Specification)

### 2.1 Thông tin chung
* **Actor chính:** Người chơi (Player).
* **Mô tả tóm tắt:** Người chơi chọn sân, chọn giờ, thực hiện thanh toán online qua mã QR PayOS để hoàn tất đặt sân pickleball.
* **Tiền điều kiện (Preconditions):**
  1. Người chơi đã đăng nhập và tài khoản ở trạng thái `Active`.
  2. Slot giờ chơi mong muốn đang ở trạng thái Trống (Available).
* **Hậu điều kiện (Postconditions):**
  1. Đơn đặt sân chuyển sang trạng thái Đã thanh toán (`Paid`).
  2. Khung giờ được đặt chuyển sang trạng thái Khóa (Blocked) đối với người chơi khác.
  3. Thông báo in-app được lưu vào DB và gửi tới người chơi.

---

### 2.2 Các luồng nghiệp vụ (Flows of Events)

#### A. Luồng Cơ Bản (Basic Flow - BF)
1. **Người chơi** truy cập danh sách sân, lựa chọn một sân cụ thể.
2. **Hệ thống** hiển thị lưới 24 slot giờ chơi trong ngày kèm trạng thái (Trống/Đã đặt).
3. **Người chơi** chọn các slot trống mong muốn và nhấn nút "Tiến hành Đặt sân".
4. **Hệ thống** kiểm tra các điều kiện ràng buộc đầu vào (slot còn trống, chưa quá 3 booking/ngày).
5. **Hệ thống** tạo một bản ghi Đặt sân tạm thời với trạng thái `PendingPayment` và khóa tạm thời slot đó trong 10 phút.
6. **Hệ thống** gọi API cổng PayOS để lấy link thanh toán và mã QR, sau đó chuyển hướng người chơi sang giao diện thanh toán PayOS.
7. **Người chơi** quét mã QR và thực hiện chuyển khoản thành công trên app ngân hàng.
8. **PayOS** gửi tín hiệu Webhook (IPN Callback) xác nhận giao dịch thành công đến server PCS.
9. **Hệ thống PCS** tiếp nhận Webhook, cập nhật trạng thái đơn đặt sân từ `PendingPayment` sang `Paid`, đồng thời gửi thông báo đặt sân thành công in-app cho người chơi.

#### B. Các luồng thay thế & ngoại lệ (Alternative Flows - AF)
* **AF 1: Trùng slot giờ chơi cùng lúc (Race Condition)**
  * Tại bước 4, nếu hệ thống phát hiện slot giờ chơi vừa được đặt và thanh toán bởi một người chơi khác trước đó 1 giây.
  * Hệ thống từ chối tạo đơn đặt tạm thời, hiển thị thông báo lỗi: *"Slot giờ này đã được đặt, vui lòng chọn khung giờ khác"*. Quay lại bước 2.
* **AF 2: Vượt quá giới hạn đặt sân trong ngày (Daily Limit)**
  * Tại bước 4, nếu hệ thống phát hiện người chơi này đã thực hiện thành công 3 đơn đặt sân trong ngày hiện tại.
  * Hệ thống chặn giao dịch, thông báo lỗi: *"Bạn đã vượt quá giới hạn đặt sân tối đa 3 lần/ngày"*. Luồng kết thúc.
* **AF 3: Người chơi hủy thanh toán hoặc hết hạn thanh toán (Timeout)**
  * Tại bước 7, người chơi nhấn nút "Hủy thanh toán" trên màn hình cổng PayOS, hoặc quá 10 phút mà hệ thống chưa nhận được Webhook thanh toán thành công.
  * Hệ thống tự động giải phóng slot giờ chơi bị khóa tạm thời, cập nhật trạng thái đơn đặt sân thành `Cancelled` (Hủy). Luồng kết thúc.

---

## 3. Thiết kế các Ca kiểm thử (Test Case Design)

Dưới đây là bộ Test Case được thiết kế theo luồng nghiệp vụ cơ bản và thay thế của Use Case:

| TC_ID | Luồng kiểm thử | Tên kịch bản kiểm thử | Các bước thực hiện (Steps) | Dữ liệu đầu vào (Input) | Kết quả mong đợi (Expected Result) |
| --- | :---: | --- | --- | --- | --- |
| **TC_UC_01** | BF | Đặt sân và thanh toán thành công | 1. Chọn sân 1.<br>2. Chọn slot trống 09:00 - 10:00.<br>3. Nhấn "Tiến hành Đặt sân".<br>4. Quét QR thanh toán thành công trên PayOS. | - CourtID: 1<br>- Slot: 09:00-10:00<br>- Số tiền: 150.000đ | - Chuyển hướng thành công sang cổng PayOS.<br>- Nhận Webhook thành công.<br>- Trạng thái đơn đặt sân: `Paid`. Slot giờ chuyển sang màu đỏ (Đã đặt). |
| **TC_UC_02** | AF 1 | Đặt trùng slot giờ bị chặn | 1. Chọn sân 1.<br>2. Chọn slot 09:00 - 10:00 (vừa bị đặt bởi người khác).<br>3. Nhấn "Tiến hành Đặt sân". | - CourtID: 1<br>- Slot: 09:00-10:00 (đã khóa) | - Hệ thống từ chối tạo đơn.<br>- Hiển thị thông báo lỗi: *"Slot giờ này đã được đặt..."*.<br>- Không chuyển hướng sang PayOS. |
| **TC_UC_03** | AF 2 | Vượt quá giới hạn 3 lần/ngày | 1. Chọn sân 1.<br>2. Chọn slot trống 14:00 - 15:00.<br>3. Nhấn "Tiến hành Đặt sân" (đây là lần đặt thứ 4 trong ngày của User). | - CourtID: 1<br>- Slot: 14:00-15:00<br>- Tài khoản đã có 3 đơn đặt | - Hệ thống chặn tạo đơn.<br>- Hiển thị thông báo lỗi: *"Bạn đã vượt quá giới hạn đặt sân tối đa 3 lần/ngày"*. |
| **TC_UC_04** | AF 3 | Hủy giao dịch thanh toán | 1. Chọn sân 1.<br>2. Chọn slot trống 10:00 - 11:00.<br>3. Nhấn đặt sân.<br>4. Nhấn "Hủy thanh toán" trên giao diện PayOS. | - CourtID: 1<br>- Slot: 10:00-11:00 | - Hệ thống giải phóng slot 10:00-11:00 (trở lại trạng thái Trống).<br>- Trạng thái đơn chuyển thành `Cancelled`. |

## 5. Quy trình thực thi và Tiêu chí đánh giá (Execution and Evaluation)

### 5.1 Quy trình thực thi
1. Thiết lập cơ sở dữ liệu giả lập (mock database) chứa thông tin tài khoản Player ở trạng thái hoạt động và các sân chơi trong `testData.ts`.
2. Mô phỏng hành động đặt sân của người dùng bằng cách gửi HTTP Request `POST /api/bookings/court` kèm theo token JWT xác thực.
3. Sử dụng cổng thanh toán mock để tạo liên kết thanh toán PayOS và mã QR.
4. Gửi IPN webhook giả lập trạng thái thanh toán thành công đến server PCS.
5. Kiểm duyệt trạng thái booking cập nhật thành `Paid` và lưu thông báo in-app thành công trong cơ sở dữ liệu.
6. Lặp lại với các điều kiện rẽ nhánh (slot đã đặt, đặt quá 3 lượt/ngày, hủy thanh toán).

### 5.2 Tiêu chí Pass/Fail
* **Pass:** Thực tế kết quả xử lý (API Status Code, trạng thái booking trong DB) khớp 100% với mong đợi; các ràng buộc trùng giờ chơi và giới hạn 3 lượt đặt/ngày được kích hoạt đúng; không phát sinh crash hệ thống.
* **Fail:** Phát sinh lỗi trùng lịch (double booking) thực tế, booking tạo thành công khi vi phạm giới hạn đặt, cổng thanh toán không cập nhật trạng thái đúng khi nhận webhook, hoặc xảy ra ngoại lệ làm treo ứng dụng.

---

## 6. Tiêu chí bắt đầu/kết thúc, Môi trường và Công cụ

### 6.1 Tiêu chí bắt đầu (Entry Criteria)
* Bản thiết kế nghiệp vụ đặt sân và tích hợp cổng PayOS được phê duyệt.
* Các mock repositories mô phỏng dữ liệu giao dịch đã sẵn sàng.
* Môi trường local test đã được cấu hình chạy cổng thanh toán sandbox.

### 6.2 Tiêu chí kết thúc (Exit Criteria)
* 100% các ca kiểm thử tích hợp API và Unit Test luồng đặt sân chạy thành công.
* Tỷ lệ phủ dòng code (Code Coverage) của module `booking` đạt trên 95%.
* Không còn lỗi nghiêm trọng nào liên quan đến logic đặt chỗ và webhook tồn đọng.

### 6.3 Môi trường và Công cụ kiểm thử (Environment and Tools)
* **Runtime:** Node.js v18 trở lên.
* **API Testing Tool:** Supertest (kiểm thử tích hợp Next.js Route Handlers).
* **Test Runner:** Vitest (vực thi test song song tự động).
* **Coverage Tool:** Istanbul v8.
* **Database Driver:** Mocked SQL Server Connection.
* **Management Tool:** QA Dashboard & Traceability Matrix.

---

## 7. Kết quả thực thi cấp dự án (Project-Level Execution Results)

Kết quả thực thi toàn bộ hệ thống kiểm thử:
* **Tổng số ca kiểm thử:** 53.
* **Kết quả:** **53 Passed / 0 Failed** (Tỷ lệ thành công 100%).
* **Thời gian thực thi:** 4.22 giây.

### 7.1 Các lỗi liên quan đã được đóng (Closed Defects)
* **DF_PAY_01 (High):** Lỗi tính toán hoàn tiền bị lệch múi giờ hệ thống (Đã đồng nhất về UTC+7 và đóng lỗi).
* **DF_PAY_02 (Medium):** Thiếu Success Indicator trên Webhook IPN từ PayOS dẫn đến không cập nhật được trạng thái booking thành `Paid` (Đã bổ sung validation và đóng lỗi).

---

## 8. Ma trận truy vết yêu cầu (RTM - Requirement Traceability Matrix)

| Yêu cầu tính năng | Mã Use Case | Mã Test Case ID | Unit Test File | API Test File | Kết quả | Coverage | Lỗi liên quan |
| --- | :---: | --- | --- | --- | :---: | :---: | --- |
| Đặt sân trực tuyến | UC-04 | `TC_BKG_01` | `booking.test.ts` | `booking.api.test.ts` | Pass | 96.0% | Không có |
| Kiểm tra trùng slot | UC-04 | `TC_BKG_02` | `booking.test.ts` | - | Pass | 100.0% | Không có |
| Giới hạn lượt đặt | UC-04 | `TC_BKG_03` | `booking.test.ts` | - | Pass | 100.0% | Không có |
| Tạo liên kết PayOS | UC-04 | `TC_PAY_01` | `payment.test.ts` | `payment.api.test.ts` | Pass | 95.0% | `DF_PAY_02` (Fixed)|
| Webhook thanh toán | UC-04 | `TC_API_09` | - | `payment.api.test.ts` | Pass | 100.0% | Không có |
| Hủy lịch hoàn tiền | UC-04 | `TC_PAY_02` | `payment.test.ts` | - | Pass | 100.0% | `DF_PAY_01` (Fixed)|

---

## 9. Quản trị, Giao tiếp và Phê duyệt (Governance, Communication, and Approval)

### 9.1 Rủi ro và Biện pháp giảm thiểu
* **Rủi ro:** Trễ tiến độ tích hợp webhook của PayOS ➔ **Giảm thiểu:** Viết mock webhook server để kiểm thử độc lập luồng IPN trước khi tích hợp API thực tế.
* **Rủi ro:** Đụng độ dữ liệu khi chạy test song song ➔ **Giảm thiểu:** Dọn dẹp mock và cơ sở dữ liệu sau mỗi ca kiểm thử bằng hooks `beforeEach` và `vi.clearAllMocks`.

### 9.2 Kế hoạch giao tiếp
* Báo cáo kết quả chạy test tự động lên QA Dashboard hàng tuần.
* Đội QA họp daily để cập nhật tình trạng lỗi của cổng thanh toán.

### 9.3 Phê duyệt
* **QA Lead:** LÊ THỊ VĂN ANH (Đã ký duyệt)
* **Project Manager:** TRẦN QUỐC SANG (Đã ký duyệt)
* **SWP391 Instructor:** (Chờ phê duyệt)

---

## 10. Kết luận
Kỹ thuật Use Case Testing đã kiểm chứng thành công trọn vẹn luồng nghiệp vụ cốt lõi Đặt sân và Thanh toán trực tuyến (`UC-04`). Bộ ca kiểm thử tự động đã phủ kín các kịch bản lỗi biên, lỗi trùng giờ và tích hợp thanh toán thành công, đảm bảo hệ thống PCS vận hành ổn định và sẵn sàng bàn giao.
