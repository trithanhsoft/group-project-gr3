# Hướng dẫn Chạy Hệ thống Kiểm thử Tự động (PCS)

Dự án **Pickleball Court & Coach Booking System (PCS)** đã được tích hợp bộ kiểm thử tự động toàn diện bao gồm: Unit Test, API Integration Test, và UI Component Test.

---

## 1. Cấu trúc thư mục kiểm thử

```text
/
├── tests/
│   ├── data/
│   │   └── testData.ts              # Dữ liệu kiểm thử dùng chung
│   ├── unit/
│   │   ├── user.test.ts             # Unit test cho User & Auth
│   │   ├── court.test.ts            # Unit test cho Sân chơi
│   │   ├── booking.test.ts          # Unit test cho Đặt sân
│   │   ├── coach.test.ts            # Unit test cho Huấn luyện viên
│   │   ├── payment.test.ts          # Unit test cho Thanh toán & Hoàn tiền
│   │   ├── promotion.test.ts        # Unit test cho Voucher
│   │   ├── review.test.ts           # Unit test cho Đánh giá
│   │   ├── notification.test.ts     # Unit test cho Thông báo
│   │   ├── matching.test.ts         # Unit test cho Ghép cặp người chơi
│   │   ├── ai.test.ts               # Unit test cho Trợ lý chatbot
│   │   └── reports.test.ts          # Unit test cho Báo cáo & Admin
│   └── api/
│       ├── auth.api.test.ts         # API test cho Auth endpoints
│       ├── court.api.test.ts        # API test cho Sân chơi
│       ├── booking.api.test.ts      # API test cho Đặt sân
│       └── payment.api.test.ts      # API test cho Webhook thanh toán
│
├── frontend/tests/ui/
│   └── login.ui.test.tsx            # UI test cho màn hình Đăng nhập (React Testing Library)
│
├── test-dashboard/                  # Giao diện web hiển thị kết quả trực quan
│   ├── index.html
│   ├── dashboard.css
│   ├── dashboard.js
│   └── test-results.json
│
├── scripts/
│   ├── generate-test-dashboard.js   # Script tổng hợp kết quả ra JSON
│   └── serve-dashboard.js           # Server tĩnh chạy dashboard (cổng 8081)
│
├── tsconfig.json                    # Cấu hình tsconfig giải quyết import alias cho test
├── vitest.config.ts                 # Cấu hình Vitest cơ sở
└── vitest.workspace.ts              # Phân chia dự án backend (node) & frontend (jsdom)
```

---

## 2. Hướng dẫn cài đặt & thực thi

### Bước 1: Cài đặt thư viện
Chạy lệnh sau tại thư mục gốc để khôi phục đầy đủ các gói kiểm thử:
```bash
npm install
```

### Bước 2: Chạy toàn bộ các ca kiểm thử (53 TCs)
Chạy tất cả kiểm thử (Unit, API, UI) song song trên môi trường workspace tương ứng:
```bash
npm run test
```

### Bước 3: Chạy kiểm thử xuất báo cáo độ bao phủ mã nguồn (Coverage)
Chạy và tạo báo cáo chi tiết độ bao phủ:
```bash
npm run test:coverage
```
Báo cáo HTML sẽ được xuất ra thư mục `/coverage/index.html`.

### Bước 4: Khởi chạy Test Result Dashboard
Biên dịch dữ liệu mới nhất và khởi chạy giao diện dashboard trên trình duyệt:
```bash
# 1. Tổng hợp dữ liệu kiểm thử & coverage sang JSON
npm run test:dashboard

# 2. Chạy server tĩnh hiển thị Dashboard
node scripts/serve-dashboard.js
```
Mở trình duyệt truy cập: [http://localhost:8081](http://localhost:8081) để xem trực quan kết quả.

---

## 3. Các tài liệu báo cáo đầu ra (Workbook Reports)
Các tệp báo cáo markdown phục vụ điền dữ liệu vào Excel được xuất ở thư mục gốc:
* **[FEATURE_MATRIX.md](./FEATURE_MATRIX.md)**
* **[TEST_DATA_REPORT.md](./TEST_DATA_REPORT.md)**
* **[TEST_EXECUTION_REPORT.md](./TEST_EXECUTION_REPORT.md)**
* **[DEFECT_REPORT.md](./DEFECT_REPORT.md)**
* **[TEST_SUMMARY_REPORT.md](./TEST_SUMMARY_REPORT.md)**
* **[PCS.postman_collection.json](./PCS.postman_collection.json)**
* **[PCS.postman_environment.json](./PCS.postman_environment.json)**
