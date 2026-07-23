# BÁO CÁO KIỂM THỬ HỆ THỐNG - ÁP DỤNG BẢNG QUYẾT ĐỊNH (DECISION TABLE TESTING)

## 1. Chọn chức năng kiểm thử
* **Chức năng lựa chọn:** Form Đăng ký tài khoản (`Register Form`).
* **Lý do lựa chọn:** Đây là giao diện UI điển hình có sự kết hợp của nhiều trường nhập liệu đầu vào cùng các quy tắc kiểm tra ràng buộc (Validation rules). Việc đăng ký thành công hay thất bại phụ thuộc hoàn toàn vào tổ hợp tính đúng đắn của các trường này.

## 2. Quy tắc nghiệp vụ cho các trường nhập liệu (Field Validation Rules)
1. **Email:** Bắt buộc nhập, đúng định dạng (có `@` và tên miền), chưa tồn tại trong cơ sở dữ liệu (DB).
2. **Số điện thoại (SĐT):** Bắt buộc nhập, phải gồm đúng 10 chữ số, chưa tồn tại trong DB.
3. **Mật khẩu:** Bắt buộc nhập, tối thiểu 8 ký tự, chứa ít nhất một chữ hoa, một chữ thường, một chữ số và một ký tự đặc biệt.

---

## 3. Vẽ Bảng Quyết Định (Decision Table)

Để tối ưu hóa số lượng kịch bản, ta giả định trường Họ tên luôn được nhập hợp lệ. Bảng quyết định sẽ dựa trên 3 điều kiện đầu vào chính với 8 quy tắc ứng xử tương ứng:

| Thành phần | Điều kiện / Hành động | R1 | R2 | R3 | R4 | R5 | R6 | R7 | R8 |
| --- | --- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Conditions** | **C1:** Email hợp lệ & chưa tồn tại | Y | Y | Y | Y | N | N | N | N |
| | **C2:** SĐT hợp lệ (10 số) & chưa tồn tại | Y | Y | N | N | Y | Y | N | N |
| | **C3:** Mật khẩu hợp lệ (độ mạnh đạt yêu cầu)| Y | N | Y | N | Y | N | Y | N |
| **Actions** | **A1:** Đăng ký thành công & gửi mã OTP | X | | | | | | | |
| | **A2:** Báo lỗi mật khẩu không hợp lệ | | X | | X | | X | | X |
| | **A3:** Báo lỗi SĐT không hợp lệ / đã tồn tại | | | X | X | | | X | X |
| | **A4:** Báo lỗi Email không hợp lệ / đã tồn tại| | | | | X | X | X | X |

---

## 4. Thiết kế các Ca kiểm thử (Test Case Design)

Dựa trên 8 quy tắc của bảng quyết định, chúng tôi xây dựng bộ kịch bản kiểm thử chi tiết theo template tiêu chuẩn:

| TC_ID | Rule | Tên ca kiểm thử | Dữ liệu kiểm thử đầu vào | Kết quả mong đợi (Expected Result) |
| --- | :---: | --- | --- | --- |
| **TC_DT_01** | R1 | Đăng ký thành công | - Email: `newuser@example.com` (chưa tồn tại)<br>- SĐT: `0987654321` (chưa tồn tại)<br>- Mật khẩu: `SecurePass123!` | Đăng ký thành công. Hệ thống gửi mã OTP xác nhận về Email và hiển thị màn hình nhập OTP. |
| **TC_DT_02** | R2 | Lỗi mật khẩu yếu | - Email: `newuser2@example.com`<br>- SĐT: `0987654322`<br>- Mật khẩu: `123` (yếu) | Hệ thống từ chối đăng ký, hiển thị thông báo lỗi: *"Mật khẩu tối thiểu 8 ký tự, phải gồm chữ hoa, chữ thường, số và ký tự đặc biệt"*. |
| **TC_DT_03** | R3 | Lỗi SĐT đã tồn tại | - Email: `newuser3@example.com`<br>- SĐT: `0905123456` (đã có trong DB)<br>- Mật khẩu: `SecurePass123!` | Hệ thống từ chối đăng ký, hiển thị thông báo lỗi: *"Số điện thoại đã được đăng ký bởi tài khoản khác"*. |
| **TC_DT_04** | R4 | Lỗi trùng SĐT và mật khẩu yếu | - Email: `newuser4@example.com`<br>- SĐT: `0905123456` (trùng)<br>- Mật khẩu: `abc` (yếu) | Hệ thống báo lỗi đồng thời cả 2 trường: *"Số điện thoại đã tồn tại"* và *"Mật khẩu không đúng định dạng"*. |
| **TC_DT_05** | R5 | Lỗi Email đã tồn tại | - Email: `existed@example.com` (đã có trong DB)<br>- SĐT: `0987654323`<br>- Mật khẩu: `SecurePass123!` | Hệ thống từ chối đăng ký, hiển thị thông báo lỗi: *"Email đã được đăng ký bởi tài khoản khác"*. |
| **TC_DT_06** | R6 | Lỗi trùng Email và mật khẩu yếu | - Email: `existed@example.com` (trùng)<br>- SĐT: `0987654324`<br>- Mật khẩu: `123` (yếu) | Hệ thống báo lỗi đồng thời cả 2 trường: *"Email đã tồn tại"* và *"Mật khẩu không đúng định dạng"*. |
| **TC_DT_07** | R7 | Lỗi trùng Email và trùng SĐT | - Email: `existed@example.com` (trùng)<br>- SĐT: `0905123456` (trùng)<br>- Mật khẩu: `SecurePass123!` | Hệ thống báo lỗi đồng thời cả 2 trường: *"Email đã tồn tại"* và *"Số điện thoại đã tồn tại"*. |
| **TC_DT_08** | R8 | Lỗi tất cả các trường đầu vào | - Email: `existed@example.com` (trùng)<br>- SĐT: `0905123456` (trùng)<br>- Mật khẩu: `abc` (yếu) | Hệ thống báo lỗi trên tất cả các trường nhập liệu tương ứng trên form UI. |

## 5. Trạng thái thực thi (Execution Status)
* **Mức độ hoàn thành:** **Thiết kế (Design Level)**.
* **Lưu ý nghiệp vụ:** Bộ ca kiểm thử từ `TC_DT_01` đến `TC_DT_08` hiện đang dừng lại ở mức thiết kế lý thuyết và chạy bao phủ gián tiếp qua các unit/UI tests của module Auth. Hệ thống kiểm thử tự động chưa hỗ trợ tách biệt log thực thi (Execution Log) riêng lẻ cho từng tổ hợp của bảng quyết định này từ mã nguồn.

---

## 6. Kết luận
Kỹ thuật Bảng quyết định giúp bao phủ toàn bộ các trường hợp logic nghiệp vụ kết hợp đầu vào trên Form Đăng ký tài khoản UI của hệ thống PCS. Việc áp dụng giúp nhóm kiểm thử SWP391 tránh bỏ sót các lỗi tiềm ẩn khi người dùng nhập sai đồng thời nhiều thông tin.
