# BẢN XÁC NHẬN CHI TIẾT THÔNG TIN KIỂM THỬ DỰ ÁN PCS (SWP391)
*Tài liệu cung cấp dữ liệu chi tiết, thực tế và toàn diện phục vụ việc sinh báo cáo kiểm thử 19 mục chuẩn ISTQB v4.0*

---

## 1. THÔNG TIN BẮT BUỘC (DOCUMENT INFORMATION & METADATA)

* **Giảng viên hướng dẫn môn SWP391:** TS. Nguyễn Thị Minh (Giảng viên bộ môn Kiểm thử phần mềm, Đại học FPT).
* **Trường/Lớp/Mã nhóm:**
  * **Trường:** Đại học FPT TP. Hồ Chí Minh (FPT University HCMC).
  * **Lớp học:** SWP391_SE1701.
  * **Nhóm thực hiện (Group):** Nhóm 3 (Phát triển dự án PCS - Pickleball Court & Coach Booking System).
* **Trạng thái tài liệu (Document Status):** **Internal Approved** (Đã được các thành viên trong nhóm kiểm thử review chéo và phê duyệt nội bộ).
* **Phiên bản & Ngày tạo:** Giữ nguyên phiên bản **v1.1** và ngày tạo **19/07/2026** để đồng bộ với dòng thời gian phát triển của dự án.
* **Người phê duyệt cuối cùng (Approvals):** 
  * TRẦN QUỐC SANG (Project Manager) - Người phê duyệt kế hoạch.
  * LÊ THỊ VĂN ANH (QA Lead) - Người kiểm duyệt chất lượng.
  * TRƯƠNG QUANG TUÂN (Tester 1) - Người kiểm duyệt kỹ thuật.

---

## 2. KẾT QUẢ RIÊNG CỦA 8 DECISION TABLE TEST CASES (FORM ĐĂNG KÝ)

Do bộ chạy test tự động Vitest hiện tại tập trung chạy song song toàn bộ 53 test cases của hệ thống và chỉ trả về log tổng hợp, kết quả của 8 ca kiểm thử Bảng quyết định (`TC_DT_01` đến `TC_DT_08`) trên giao diện Form Đăng ký được xác nhận trung thực như sau:

* **Trạng thái thực thi (Execution Status):** **Designed – Not Yet Executed** (Đã thiết kế kịch bản chi tiết - Chưa chạy độc lập trên log hệ thống).
* **Lý do:** Mã nguồn chạy test tự động kiểm thử tích hợp luồng API đăng ký và render UI đơn lẻ nhưng chưa xuất log thực thi phân tách độc lập cho từng tổ hợp của Bảng quyết định.
* **Chi tiết kịch bản thiết kế đầu vào và kết quả mong đợi:**

| TC_ID | Quy tắc (Rule) | Kịch bản kiểm thử | Dữ liệu đầu vào chi tiết | Kết quả mong đợi (Expected Oracle) | Trạng thái thực tế (Actual Result) |
| --- | :---: | --- | --- | --- | --- |
| **TC_DT_01** | R1 | Đăng ký thành công | - Họ tên: `Lê Thị Văn Anh`<br>- Email: `new@example.com` (chưa tồn tại)<br>- SĐT: `0987654321` (chưa tồn tại)<br>- Mật khẩu: `Secure123!` | Đăng ký thành công; hệ thống lưu thông tin tạm thời, gửi mã OTP 6 chữ số về Email và mở form nhập OTP. | **Designed** (Chờ đối soát log chạy tự động) |
| **TC_DT_02** | R2 | Lỗi mật khẩu yếu | - Họ tên: `Lê Thị Văn Anh`<br>- Email: `new@example.com`<br>- SĐT: `0987654321`<br>- Mật khẩu: `123` (dưới 8 ký tự, không ký tự đặc biệt) | Hệ thống từ chối đăng ký, hiển thị thông báo lỗi ngay dưới trường mật khẩu: *"Mật khẩu tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt"*. | **Designed** (Chờ đối soát log chạy tự động) |
| **TC_DT_03** | R3 | Lỗi số điện thoại đã tồn tại | - Họ tên: `Lê Thị Văn Anh`<br>- Email: `new@example.com`<br>- SĐT: `0905123456` (đã đăng ký trong hệ thống)<br>- Mật khẩu: `Secure123!` | Hệ thống từ chối đăng ký, hiển thị lỗi dưới trường SĐT: *"Số điện thoại đã được đăng ký bởi tài khoản khác"*. | **Designed** (Chờ đối soát log chạy tự động) |
| **TC_DT_04** | R4 | Lỗi trùng SĐT và mật khẩu yếu | - Họ tên: `Lê Thị Văn Anh`<br>- Email: `new@example.com`<br>- SĐT: `0905123456` (trùng)<br>- Mật khẩu: `abc` (yếu) | Hệ thống chặn đăng ký, hiển thị đồng thời cả 2 lỗi dưới trường SĐT và Mật khẩu. | **Designed** (Chờ đối soát log chạy tự động) |
| **TC_DT_05** | R5 | Lỗi Email đã tồn tại | - Họ tên: `Lê Thị Văn Anh`<br>- Email: `existed@example.com` (đã đăng ký trong hệ thống)<br>- SĐT: `0987654321`<br>- Mật khẩu: `Secure123!` | Hệ thống từ chối đăng ký, hiển thị lỗi dưới trường Email: *"Email đã được đăng ký bởi tài khoản khác"*. | **Designed** (Chờ đối soát log chạy tự động) |
| **TC_DT_06** | R6 | Lỗi trùng Email và mật khẩu yếu | - Họ tên: `Lê Thị Văn Anh`<br>- Email: `existed@example.com` (trùng)<br>- SĐT: `0987654321`<br>- Mật khẩu: `123` (yếu) | Hệ thống chặn đăng ký, hiển thị đồng thời lỗi trùng Email và mật khẩu yếu dưới các trường tương ứng. | **Designed** (Chờ đối soát log chạy tự động) |
| **TC_DT_07** | R7 | Lỗi trùng Email và trùng SĐT | - Họ tên: `Lê Thị Văn Anh`<br>- Email: `existed@example.com` (trùng)<br>- SĐT: `0905123456` (trùng)<br>- Mật khẩu: `Secure123!` | Hệ thống chặn đăng ký, báo lỗi trùng lặp dữ liệu trên cả trường Email và Số điện thoại. | **Designed** (Chờ đối soát log chạy tự động) |
| **TC_DT_08** | R8 | Lỗi tất cả các trường đầu vào | - Họ tên: `Lê Thị Văn Anh`<br>- Email: `existed@example.com` (trùng)<br>- SĐT: `0905123456` (trùng)<br>- Mật khẩu: `abc` (yếu) | Hệ thống từ chối đăng ký, hiển thị thông báo lỗi chi tiết trên tất cả các trường nhập liệu bị sai. | **Designed** (Chờ đối soát log chạy tự động) |

* **Minh chứng chạy kiểm thử tự động:**
  * **Tổng thời gian thực thi toàn bộ suite test:** 4.22 giây (chạy song song cho 53 test cases bao gồm Unit, API và UI).
  * **Log chạy tổng hợp:** Có (hiển thị 53 tests passed trên terminal và Test Dashboard).
  * **Ảnh minh chứng:** Đã lưu trữ hình ảnh giao diện Dashboard hiển thị biểu đồ Pass rate 100% trong thư mục báo cáo.

---

## 3. ĐỐI TƯỢNG VÀ CHIẾN LƯỢC KIỂM THỬ (TEST ITEMS & STRATEGY)

* **Register Form kiểm thử ở mức độ nào:** Kiểm thử ở cả 2 mức:
  1. **UI Component Testing:** Kiểm tra tính chính xác của giao diện, placeholder, nút nhấn và hiển thị thông báo lỗi (sử dụng React Testing Library + JSDOM).
  2. **API Integration Testing:** Kiểm tra dữ liệu gửi lên backend có đúng cấu trúc, xử lý trùng lặp trong DB SQL Server và ném lỗi HTTP Status Code 400/500 tương ứng (sử dụng Vitest NextRequest simulation).
* **API đăng ký tài khoản:** `POST /api/auth/register` (Luồng nhận payload gồm: `fullName`, `email`, `phoneNumber`, `password`).
* **Trình duyệt thực tế:** Không nằm trong phạm vi kiểm thử tự động (chỉ chạy trên môi trường giả lập JSDOM để tối ưu hóa tốc độ thực thi trong CI/CD). Nhóm chỉ thực hiện kiểm tra tương thích trình duyệt (Chrome, Safari, Edge) bằng phương pháp thủ công (Manual Testing).

---

## 4. QUY TRÌNH ĐĂNG KÝ THỰC TẾ (SYSTEM WORKFLOW)

* **Trạng thái tài khoản sau khi đăng ký thành công:** Tài khoản được lưu tạm thời ở trạng thái **Chờ kích hoạt** (`PendingOTP`). Người dùng chưa thể sử dụng tài khoản này để đăng nhập hệ thống cho đến khi xác thực thành công.
* **OTP kích hoạt:**
  * Được gửi duy nhất qua **Email** (sử dụng helper dịch vụ gửi mail mock `sendOtpEmail` kết hợp mã xác thực 6 chữ số tự động sinh).
  * Mã OTP có hiệu lực trong vòng **5 phút** (300 giây).
  * Giao diện UI **có nút "Gửi lại OTP" (Resend OTP)**. Khi nhấn nút này, hệ thống sẽ cập nhật mã OTP mới và gửi lại email cho người dùng (giới hạn tối đa 3 lần/giờ để tránh spam).
* **Quy trình kiểm tra trùng lặp dữ liệu:**
  * Kiểm tra định dạng cú pháp (Regex Email, độ dài SĐT) diễn ra ngay **khi người dùng rời khỏi trường (onBlur)**.
  * Kiểm tra trùng lặp trong database (Duplicate check Email/SĐT đã tồn tại) chỉ diễn ra **khi người dùng nhấn nút Register (onSubmit)** để tiết kiệm tài nguyên truy vấn cơ sở dữ liệu.
* **Confirm Password (Xác nhận mật khẩu):** **Có**. Biểu mẫu đăng ký yêu cầu người dùng nhập lại mật khẩu và kiểm tra trùng khớp trước khi gửi request.
* **Terms and Conditions (Điều khoản dịch vụ):** **Có**. Bắt buộc người dùng phải tích chọn checkbox đồng ý với điều khoản sử dụng thì nút "Register" mới chuyển sang trạng thái kích hoạt để nhấn.
* **Hiển thị lỗi đồng thời:** **Có**. Khi nhiều trường đầu vào bị sai hoặc thiếu, UI sử dụng React Hook Form kết hợp Zod schema validation sẽ hiển thị đồng thời tất cả các lỗi lỗi tương ứng ngay dưới từng ô nhập liệu.

---

## 5. LỊCH TRÌNH VÀ PHÂN CÔNG CHI TIẾT (SCHEDULE & RESPONSIBILITIES)

* **Lịch trình thời gian:** Giữ nguyên lịch từ **01/10/2023 đến 01/11/2023** (Tổng cộng 4 tuần tương ứng 1 tháng kiểm thử môn học).
* **Phân công chi tiết vai trò kiểm thử của từng cá nhân:**
  * **Thiết kế kịch bản kiểm thử (Bảng quyết định & Use Case):** TRẦN QUỐC SANG (Project Manager - phụ trách phân tích hệ thống và thiết kế kịch bản).
  * **Lập trình code test tự động (Vitest scripts):** TRƯƠNG QUANG TUÂN (Tester 1 - phụ trách viết code unit/API test).
  * **Thực thi và chạy kiểm thử tự động:** TRƯƠNG QUANG TUÂN (Tester 1) và LÊ THỊ VĂN ANH (QA Lead).
  * **Review kết quả và phê duyệt chất lượng báo cáo:** LÊ THỊ VĂN ANH (QA Lead - kiểm duyệt mã nguồn test và duyệt lỗi).
  * **Sửa các lỗi logic phát sinh trong code:** NGUYỄN ĐÀO VĂN QUÝ (Dev 1 - Backend) và LÊ HỮU SƠN (Dev 2 - Frontend).

---

## 6. QUẢN LÝ LỖI (DEFECT MANAGEMENT FOR REGISTER FORM)

Mặc dù 2 lỗi `DF_PAY_01` và `DF_PAY_02` thuộc về module Payment, nhóm kiểm thử có phát hiện và sửa chữa một lỗi trực tiếp liên quan đến trường Email trên Register Form như sau:

* **Mã lỗi (Defect ID):** `DF_REG_01`
* **Mức độ nghiêm trọng (Severity):** **Medium** (Lỗi logic kiểm duyệt dữ liệu đầu vào).
* **Tóm tắt lỗi (Summary):** Zod Schema Validation chấp nhận định dạng email có hai dấu chấm liên tiếp ở phần tên miền (Ví dụ: `test@gmail..com`).
* **Các bước tái hiện (Steps to Reproduce):**
  1. Truy cập trang Đăng ký tài khoản hệ thống PCS.
  2. Nhập Họ tên, Số điện thoại và Mật khẩu hợp lệ.
  3. Nhập Email: `test@gmail..com` (định dạng sai nguyên tắc tên miền).
  4. Nhấn nút "Register".
* **Kết quả mong đợi (Expected Result):** Hệ thống chặn đăng ký và báo lỗi: *"Email không đúng định dạng"*.
* **Kết quả thực tế (Actual Result):** Hệ thống chấp nhận thông tin đăng ký, tạo bản ghi chờ kích hoạt trong database và gửi mã OTP về email.
* **Trạng thái lỗi hiện tại (Status):** **Closed** (Đã sửa). Đội phát triển (Quý) đã cập nhật lại biểu thức chính quy (Regex) của trường email trong schema validation của Zod để chặn định dạng hai dấu chấm liên tiếp.

---

## 7. HÌNH THỨC VÀ ĐẦU RA BÁO CÁO (REPORTING FORMAT)

* **Ngôn ngữ báo cáo:** **Tiếng Anh** hoàn toàn (hoặc song ngữ Việt - Anh để phù hợp với yêu cầu giảng dạy đại học FPT).
* **Phạm vi tài liệu:** Thực hiện lập báo cáo **Bảng quyết định (Decision Table)** và **Kế hoạch kiểm thử (Test Plan) đầy đủ 19 mục** chuẩn ISTQB v4.0.
* **Định dạng đầu ra:** Cung cấp cả hai định dạng **Word (.docx)** và **PDF** phục vụ in ấn và nộp bài.
* **Yêu cầu trình bày:** Cần có trang bìa chuẩn (Tên trường, tên môn SWP391, tên đề tài, danh sách nhóm kèm mã số sinh viên), mục lục tự động và logo trường FPT ở đầu trang.
