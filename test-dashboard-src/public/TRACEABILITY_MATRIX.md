# Requirement Traceability Matrix (RTM)

| Feature | Use Case | Test Case ID | Unit Test File | API Test File | UI Test File | Execution Result | Coverage (%) | Related Defect |
| --- | --- | --- | --- | --- | --- | :---: | :---: | --- |
| **Đăng ký tài khoản** | UC-01: Khách hàng đăng ký tài khoản mới | `TC_USR_01` | `user.test.ts` | `auth.api.test.ts` | `login.ui.test.tsx` (Register flow placeholder) | Pass | 95.0% | None |
| **Đăng ký tài khoản** | UC-01: Nhập trùng email hiện có | `TC_USR_02` | `user.test.ts` | `auth.api.test.ts` | - | Pass | 100.0% | None |
| **Đăng nhập hệ thống** | UC-02: Đăng nhập bằng tài khoản và mật khẩu | `TC_USR_04` | `user.test.ts` | `auth.api.test.ts` | `login.ui.test.tsx` | Pass | 98.0% | None |
| **Hiển thị sân chơi** | UC-03: Liệt kê danh sách sân | `TC_CRT_01` | `court.test.ts` | `court.api.test.ts` | - | Pass | 92.0% | None |
| **Hiển thị sân chơi** | UC-03: Xem chi tiết thông tin sân | `TC_CRT_03` | `court.test.ts` | - | - | Pass | 94.0% | None |
| **Tra cứu slot trống** | UC-04: Tìm kiếm slots theo ngày | `TC_CRT_05` | `court.test.ts` | - | - | Pass | 90.0% | None |
| **Đặt sân trực tuyến** | UC-05: Đặt chỗ giữ sân | `TC_BKG_01` | `booking.test.ts` | `booking.api.test.ts` | - | Pass | 96.0% | None |
| **Đặt sân trực tuyến** | UC-05: Đặt trùng giờ hoặc trùng slot | `TC_BKG_02` | `booking.test.ts` | - | - | Pass | 100.0% | None |
| **Đặt sân trực tuyến** | UC-05: Giới hạn 3 lượt đặt/ngày | `TC_BKG_03` | `booking.test.ts` | - | - | Pass | 100.0% | None |
| **Thanh toán cổng ngoại** | UC-06: Tạo liên kết PayOS | `TC_PAY_01` | `payment.test.ts` | `payment.api.test.ts` | - | Pass | 95.0% | `DF_PAY_02` (Fixed) |
| **Thanh toán cổng ngoại** | UC-06: Nhận phản hồi thanh toán | `TC_API_09` | - | `payment.api.test.ts` | - | Pass | 100.0% | None |
| **Hoàn tiền hủy lịch** | UC-07: Hủy lịch và tính hoàn tiền | `TC_PAY_02` | `payment.test.ts` | - | - | Pass | 100.0% | `DF_PAY_01` (Fixed) |
| **Hoàn tiền hủy lịch** | UC-07: Hủy lịch trước 12h (hoàn 100%) | `TC_PAY_02` | `payment.test.ts` | - | - | Pass | 100.0% | `DF_PAY_01` (Fixed) |
| **Hoàn tiền hủy lịch** | UC-07: Hủy lịch trước 2h-12h (hoàn 70%)| `TC_PAY_03` | `payment.test.ts` | - | - | Pass | 100.0% | None |
| **Hoàn tiền hủy lịch** | UC-07: Hủy lịch sau 2h (hoàn 0%) | `TC_PAY_04` | `payment.test.ts` | - | - | Pass | 100.0% | None |
| **Áp dụng Voucher** | UC-08: Áp voucher hợp lệ | `TC_PRM_01` | `promotion.test.ts` | - | - | Pass | 94.0% | None |
| **Áp dụng Voucher** | UC-08: Check voucher quá hạn | `TC_PRM_02` | `promotion.test.ts` | - | - | Pass | 100.0% | None |
| **Ghép cặp người chơi** | UC-09: Thuật toán so khớp vai trò | `TC_MAT_01` | `matching.test.ts` | - | - | Pass | 100.0% | None |
| **Ghép cặp người chơi** | UC-09: Thuật toán so khớp trình độ | `TC_MAT_04` | `matching.test.ts` | - | - | Pass | 100.0% | None |
| **Tư vấn thông minh** | UC-10: Nhận diện ý định hội thoại | `TC_AI_01` | `ai.test.ts` | - | - | Pass | 92.0% | None |
| **Tư vấn thông minh** | UC-10: Chatbot fallback offline | `TC_AI_02` | `ai.test.ts` | - | - | Pass | 100.0% | None |
| **Admin Dashboard** | UC-11: Tổng hợp thống kê doanh thu | `TC_ADM_01` | `reports.test.ts` | - | - | Pass | 96.0% | None |
| **Admin Dashboard** | UC-11: So sánh SaaS theo chu kỳ | `TC_ADM_02` | `reports.test.ts` | - | - | Pass | 98.0% | None |
