# Feature Matrix

| Module | Feature | Description | Related API | Related UI Page | Related Test Case ID | Implementation Status |
| --- | --- | --- | --- | --- | --- | --- |
| **User & Auth** | Đăng ký tài khoản | Đăng ký người chơi mới & gửi mã OTP xác minh qua Gmail | `POST /api/auth/register` | `/register` | `TC_USR_01` | Implemented |
| **User & Auth** | Đăng nhập hệ thống | Xác thực tài khoản bằng JWT & Google OAuth | `POST /api/auth/login` | `/login` | `TC_USR_02` | Implemented |
| **Court Management** | Hiển thị sân chơi | Liệt kê danh sách các sân (lọc sân hoạt động/không hoạt động) | `GET /api/courts` | `/courts` | `TC_CRT_01` | Implemented |
| **Court Management** | Tra cứu slot trống | Tìm kiếm lịch hoạt động và slot còn trống theo ngày | `GET /api/courts/slots` | `/courts` | `TC_CRT_02` | Implemented |
| **Booking Management** | Đặt sân trực tuyến | Đặt lịch giữ sân cho người chơi (giới hạn 3 booking/ngày) | `POST /api/bookings/court` | `/bookings` | `TC_BKG_01` | Implemented |
| **Booking Management** | Đặt lịch cố định (Combo) | Đặt giữ lịch cố định theo tháng kèm hoặc không kèm HLV | `POST /api/bookings/combo` | `/combo` | `TC_BKG_02` | Implemented |
| **Coach Management** | Quản lý lịch tập | Đăng ký hồ sơ, lịch rảnh và đặt lịch tập với HLV | `POST /api/bookings/coach` | `/coaches` | `TC_CCH_01` | Implemented |
| **Player Matching** | Ghép cặp & Tìm đội | Thuật toán ghép cặp người chơi dựa trên Skills, Role, Schedule | `GET /api/matching/suggest` | `/matching` | `TC_MAT_01` | Implemented |
| **Payment & Refund** | Thanh toán cổng ngoại | Tích hợp cổng PayOS & Momo thanh toán hóa đơn | `POST /api/payments/create` | `/payment` | `TC_PAY_01` | Implemented |
| **Payment & Refund** | Hoàn tiền hủy lịch | Tính toán tỉ lệ hoàn tiền (100% trước 12h, 70% trước 2h) | `POST /api/refunds/create` | `/refunds` | `TC_PAY_02` | Implemented |
| **Promotion** | Áp dụng Voucher | Khấu trừ voucher giảm giá theo điều kiện (Hạn dùng, Min Spend) | `POST /api/promotions/apply` | `/promotions` | `TC_PRM_01` | Implemented |
| **Review** | Đánh giá & Phản hồi | Viết đánh giá chất lượng sân và huấn luyện viên sau buổi chơi | `POST /api/reviews` | `/courts` | `TC_REV_01` | Implemented |
| **Notification** | Thông báo hệ thống | Gửi thông báo đặt sân, nhắc lịch chơi qua Email/In-app | `POST /api/notifications` | `/notifications` | `TC_NOT_01` | Implemented |
| **Admin & Reports** | Xuất báo cáo doanh thu | Tổng hợp thống kê doanh thu sân, lượt đặt phục vụ SaaS | `GET /api/admin/reports` | `/admin` | `TC_ADM_01` | Implemented |
| **AI Assistant** | Tư vấn thông minh | Trợ lý chatbot Gemini tư vấn đặt sân, trả lời câu hỏi tự động | `POST /api/ai/chat` | `/` (AI Widget) | `TC_AI_01` | Implemented |
