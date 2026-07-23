# Test Execution Report

| TC_ID | Module | Scenario | Preconditions | Test Data | Expected Result | Actual Result | Execution Time | Status | Related Test File | Evidence |
| --- | --- | --- | --- | --- | --- | --- | :---: | :---: | --- | --- |
| `TC_USR_01` | User & Auth | Đăng ký tài khoản mới | Email chưa tồn tại | `TD_USR_01` | Trả về thông điệp gửi OTP | Trả về thông điệp gửi OTP | 8ms | Pass | `user.test.ts` | Log thành công |
| `TC_USR_02` | User & Auth | Đăng ký trùng email | Email đã tồn tại | Trùng `email` | Báo lỗi trùng email | Báo lỗi trùng email | 4ms | Pass | `user.test.ts` | Exception caught |
| `TC_USR_03` | User & Auth | Đăng ký trùng điện thoại | Điện thoại đã tồn tại | Trùng `phone` | Báo lỗi trùng điện thoại | Báo lỗi trùng điện thoại | 3ms | Pass | `user.test.ts` | Exception caught |
| `TC_USR_04` | User & Auth | Xác thực OTP đăng ký | Tài khoản chờ OTP | `otpCode: "123456"` | Trả về JWT token kích hoạt | Trả về JWT token kích hoạt | 5ms | Pass | `user.test.ts` | Log thành công |
| `TC_CRT_01` | Court | Lấy danh sách sân hoạt động | Có sân trong DB | Quyền User | Chỉ hiển thị các sân hoạt động | Chỉ hiển thị các sân hoạt động | 6ms | Pass | `court.test.ts` | Data returned |
| `TC_CRT_02` | Court | Lấy danh sách gồm sân ẩn | Có sân ẩn | Quyền Admin | Hiển thị cả sân đang bảo trì | Hiển thị cả sân đang bảo trì | 3ms | Pass | `court.test.ts` | Data returned |
| `TC_CRT_03` | Court | Lấy sân theo ID hợp lệ | Sân tồn tại | `courtId: 1` | Trả về chi tiết sân chơi | Trả về chi tiết sân chơi | 2ms | Pass | `court.test.ts` | Data returned |
| `TC_CRT_04` | Court | Lấy sân theo ID không hợp lệ | Sân không tồn tại | `courtId: 999` | Trả về báo lỗi không tìm thấy | Trả về báo lỗi không tìm thấy | 2ms | Pass | `court.test.ts` | Exception caught |
| `TC_CRT_05` | Court | Lấy danh sách slots trống | Lịch hoạt động sẵn sàng | `date: "2026-07-01"` | Trả về 24 slot rảnh | Trả về 24 slot rảnh | 4ms | Pass | `court.test.ts` | Data returned |
| `TC_CRT_06` | Court | Thêm mới sân chơi | Quyền Admin | Dữ liệu sân hợp lệ | Sân mới được lưu vào DB | Sân mới được lưu vào DB | 3ms | Pass | `court.test.ts` | Data returned |
| `TC_CRT_07` | Court | Sửa thông tin sân chơi | Quyền Admin | Dữ liệu cập nhật | Cập nhật thông tin thành công | Cập nhật thông tin thành công | 2ms | Pass | `court.test.ts` | Data returned |
| `TC_BKG_01` | Booking | Tạo mới đặt sân hợp lệ | Slot còn trống | `TD_BKG_01` | Trạng thái đặt sân PendingPayment | Trạng thái đặt sân PendingPayment | 12ms | Pass | `booking.test.ts` | Data returned |
| `TC_BKG_02` | Booking | Đặt sân trùng khung giờ | Slot đã có người đặt | Khung giờ trùng | Báo lỗi trùng giờ chơi | Báo lỗi trùng giờ chơi | 3ms | Pass | `booking.test.ts` | Exception caught |
| `TC_BKG_03` | Booking | Vượt quá giới hạn đặt sân | User đã đặt 3 lần/ngày | Đặt lượt thứ 4 | Báo lỗi vượt quá giới hạn đặt | Báo lỗi vượt quá giới hạn đặt | 4ms | Pass | `booking.test.ts` | Exception caught |
| `TC_CCH_01` | Coach | Xem danh sách HLV | Có HLV trong hệ thống | Quyền User | Trả về danh sách HLV hoạt động | Trả về danh sách HLV hoạt động | 6ms | Pass | `coach.test.ts` | Data returned |
| `TC_CCH_02` | Coach | Đăng ký hồ sơ HLV mới | Tài khoản chưa là HLV | Dữ liệu hồ sơ | Tạo hồ sơ HLV thành công | Tạo hồ sơ HLV thành công | 3ms | Pass | `coach.test.ts` | Data returned |
| `TC_CCH_03` | Coach | Cập nhật trạng thái duyệt HLV | Quyền Admin | Duyệt hồ sơ | Cập nhật trạng thái thành công | Cập nhật trạng thái thành công | 2ms | Pass | `coach.test.ts` | Data returned |
| `TC_CCH_04` | Coach | Đặt lịch tập với HLV | HLV có lịch rảnh | `coachId: 1` | Đặt lịch thành công | Đặt lịch thành công | 4ms | Pass | `coach.test.ts` | Data returned |
| `TC_PAY_01` | Payment | Tạo link thanh toán PayOS | Booking hợp lệ | `bookingId: 101` | Trả về link checkout PayOS | Trả về link checkout PayOS | 10ms | Pass | `payment.test.ts` | Link generated |
| `TC_PAY_02` | Payment | Hủy lịch và hoàn tiền 100% | Trước giờ chơi > 12h | Hủy lịch trước 13h | Tính toán hoàn tiền 100% | Tính toán hoàn tiền 100% | 2ms | Pass | `payment.test.ts` | Tỉ lệ 100% |
| `TC_PAY_03` | Payment | Hủy lịch và hoàn tiền 70% | Trước giờ chơi từ 2h - 12h| Hủy lịch trước 5h | Tính toán hoàn tiền 70% | Tính toán hoàn tiền 70% | 1ms | Pass | `payment.test.ts` | Tỉ lệ 70% |
| `TC_PAY_04` | Payment | Hủy lịch không được hoàn tiền | Trước giờ chơi < 2h | Hủy lịch trước 1h | Tính toán hoàn tiền 0% | Tính toán hoàn tiền 0% | 1ms | Pass | `payment.test.ts` | Tỉ lệ 0% |
| `TC_PRM_01` | Promotion | Áp dụng mã Voucher hợp lệ | Voucher còn hạn sử dụng | `SAVE20`, giá 500k | Khấu trừ giảm giá 20% | Khấu trừ giảm giá 20% | 5ms | Pass | `promotion.test.ts` | Voucher applied |
| `TC_PRM_02` | Promotion | Áp dụng Voucher hết hạn | Voucher đã quá hạn | Voucher quá hạn | Báo lỗi voucher hết hạn | Báo lỗi voucher hết hạn | 3ms | Pass | `promotion.test.ts` | Exception caught |
| `TC_REV_01` | Review | Gửi đánh giá cho sân chơi | Đặt sân đã hoàn thành | `rating: 5`, sân 1 | Đăng bài đánh giá thành công | Đăng bài đánh giá thành công | 4ms | Pass | `review.test.ts` | Log thành công |
| `TC_REV_02` | Review | Lấy đánh giá của sân chơi | Có đánh giá trong hệ thống | `courtId: 1` | Trả về danh sách bình luận | Trả về danh sách bình luận | 2ms | Pass | `review.test.ts` | Data returned |
| `TC_NOT_01` | Notification | Gửi thông báo hệ thống | Người nhận hợp lệ | Nội dung thông báo | Đăng ký thông báo vào DB | Đăng ký thông báo vào DB | 8ms | Pass | `notification.test.ts` | Data inserted |
| `TC_NOT_02` | Notification | Ghi đè lỗi khi DB thông báo lỗi | DB báo lỗi chèn dữ liệu | Lỗi kết nối | Bắt lỗi nhưng không gây crash | Bắt lỗi nhưng không gây crash | 3ms | Pass | `notification.test.ts` | Exception caught |
| `TC_MAT_01` | Player Matching | Ghép cặp tương khắc vai trò | Vai trò Attacker vs Defender | `attacker`, `defender` | Trả về điểm vai trò 100 | Trả về điểm vai trò 100 | 2ms | Pass | `matching.test.ts` | Score 100 |
| `TC_MAT_02` | Player Matching | Ghép cặp vai trò All-rounder | Một bên là All-rounder | `all-rounder`, `defender` | Trả về điểm vai trò 75 | Trả về điểm vai trò 75 | 1ms | Pass | `matching.test.ts` | Score 75 |
| `TC_MAT_03` | Player Matching | Ghép cặp trùng vai trò | Trùng vai trò | Attacker vs Attacker | Trả về điểm vai trò 30 | Trả về điểm vai trò 30 | 1ms | Pass | `matching.test.ts` | Score 30 |
| `TC_MAT_04` | Player Matching | Trình độ tương đồng | Skills giống nhau | Intermediate vs Intermediate| Điểm trình độ 100 | Điểm trình độ 100 | 1ms | Pass | `matching.test.ts` | Score 100 |
| `TC_MAT_05` | Player Matching | Trình độ lệch 1 bậc | Lệch 1 bậc | Beginner vs Intermediate | Điểm trình độ 75 | Điểm trình độ 75 | 1ms | Pass | `matching.test.ts` | Score 75 |
| `TC_MAT_06` | Player Matching | Trình độ lệch 2 bậc | Lệch 2 bậc | Beginner vs Advanced | Điểm trình độ 50 | Điểm trình độ 50 | 1ms | Pass | `matching.test.ts` | Score 50 |
| `TC_MAT_07` | Player Matching | Trình độ lệch 3 bậc | Lệch 3 bậc | Beginner vs Professional | Điểm trình độ 25 | Điểm trình độ 25 | 1ms | Pass | `matching.test.ts` | Score 25 |
| `TC_MAT_08` | Player Matching | Trình độ lệch tối đa | Lệch 4 bậc | Beginner vs Elite | Điểm trình độ 0 | Điểm trình độ 0 | 1ms | Pass | `matching.test.ts` | Score 0 |
| `TC_AI_01` | AI Assistant | Chatbot phân tích ý định đặt sân | Cổng FastAPI AI hoạt động | `"Tôi muốn đặt sân sáng mai"` | Intent: court_booking | Intent: court_booking | 3ms | Pass | `ai.test.ts` | Intent returned |
| `TC_AI_02` | AI Assistant | Chatbot fallback khi AI lỗi | Cổng FastAPI AI chết | Lỗi kết nối | Trả về tin nhắn phản hồi cứng | Trả về tin nhắn phản hồi cứng | 2ms | Pass | `ai.test.ts` | Fallback message |
| `TC_ADM_01` | Admin & Reports | Lấy báo cáo thống kê Dashboard | Quyền Admin | Lọc ngày tháng | Trả về số liệu tổng doanh thu | Trả về số liệu tổng doanh thu | 3ms | Pass | `reports.test.ts` | Stats returned |
| `TC_ADM_02` | Admin & Reports | Báo cáo SaaS theo chu kỳ so sánh| Quyền Admin | Chu kỳ so sánh | Trả về số liệu chu kỳ trước | Trả về số liệu chu kỳ trước | 3ms | Pass | `reports.test.ts` | Stats returned |
| `TC_API_01` | Auth API | API Đăng nhập thành công | Tài khoản hợp lệ | Email & Password | Status 200, trả về Token | Status 200, trả về Token | 14ms | Pass | `auth.api.test.ts` | Status 200 |
| `TC_API_02` | Auth API | API Đăng nhập thất bại | Mật khẩu sai | Sai thông tin | Status 500, báo lỗi | Status 500, báo lỗi | 9ms | Pass | `auth.api.test.ts` | Status 500 |
| `TC_API_03` | Auth API | API Đăng ký tài khoản mới | Dữ liệu hợp lệ | FullName, Email... | Status 201 Created, gửi OTP | Status 201 Created, gửi OTP | 7ms | Pass | `auth.api.test.ts` | Status 201 |
| `TC_API_04` | Court API | API Lấy danh sách sân công khai | Không gửi token | includeInactive=false | Status 200, trả về sân active | Status 200, trả về sân active | 18ms | Pass | `court.api.test.ts` | Status 200 |
| `TC_API_05` | Court API | API Admin lấy tất cả sân | Gửi token Admin | includeInactive=true | Status 200, trả về toàn bộ sân | Status 200, trả về toàn bộ sân | 15ms | Pass | `court.api.test.ts` | Status 200 |
| `TC_API_06` | Court API | API Admin chặn token thường | Gửi token Player | includeInactive=true | Status 401 Unauthorized | Status 401 Unauthorized | 2ms | Pass | `court.api.test.ts` | Status 401 |
| `TC_API_07` | Booking API | API Đặt sân trực tuyến | Gửi token Player | CourtID, bookingDate... | Status 201 Created | Status 201 Created | 19ms | Pass | `booking.api.test.ts` | Status 201 |
| `TC_API_08` | Booking API | API Đặt sân chưa đăng nhập | Không gửi token | CourtID, bookingDate... | Status 401 Unauthorized | Status 401 Unauthorized | 2ms | Pass | `booking.api.test.ts` | Status 401 |
| `TC_API_09` | Payment API | API Webhook PayOS xác nhận | Signature hợp lệ | Data thanh toán thành công | Status 200, cập nhật Booking | Status 200, cập nhật Booking | 25ms | Pass | `payment.api.test.ts` | Status 200 |
| `TC_API_10` | Payment API | API Webhook PayOS sai signature | Signature không hợp lệ | Data sai signature | Status 400 Bad Request | Status 400 Bad Request | 5ms | Pass | `payment.api.test.ts` | Status 400 |
| `TC_API_11` | Payment API | API Webhook PayOS trùng lặp đơn | Đơn hàng trạng thái Paid | Data thanh toán đã trả | Status 200, bỏ qua cập nhật | Status 200, bỏ qua cập nhật | 4ms | Pass | `payment.api.test.ts` | Status 200 |
| `TC_UI_01` | Login UI | Kết xuất form đăng nhập |LoginPage renders | Email/Password fields | Renders LOGIN button & form | Renders LOGIN button & form | 28ms | Pass | `login.ui.test.tsx` | UI Rendered |
| `TC_UI_02` | Login UI | Hiển thị lỗi nhập email sai |LoginPage renders | Email: `"invalid-email"` | Hiển thị "Email không hợp lệ" | Hiển thị "Email không hợp lệ" | 4ms | Pass | `login.ui.test.tsx` | Error shown |
| `TC_UI_03` | Login UI | Gọi API đăng nhập khi nhấn LOGIN |LoginPage renders | Email & Password hợp lệ | Gọi loginApi và chuyển hướng | Gọi loginApi và chuyển hướng | 18ms | Pass | `login.ui.test.tsx` | loginApi called |
