# BÁO CÁO CÔNG CỤ KIỂM THỬ (TESTING TOOLS REPORT) - DỰ ÁN PCS

Báo cáo này được cấu trúc thành các slide thuyết trình (kèm hướng dẫn chi tiết) để giới thiệu bộ công cụ kiểm thử tự động được sử dụng trong dự án **PCS (Pickleball Court & Coach Booking System)**.

---

## Slide 1: Bộ Công Cụ Kiểm Thử Tự Động & Quản Lý Kiểm Thử (PCS QA Stack)
* **Tiêu đề:** Giải pháp Kiểm thử Tự động và Quản lý Chất lượng Dự án PCS
* **Nhóm thực hiện:** Nhóm môn SWP391
  * **Project Manager (Chủ trì):** TRẦN QUỐC SANG (Điều phối toàn diện)
  * **QA Leader:** LÊ THỊ VĂN ANH (Phụ trách chính & xây dựng bộ công cụ kiểm thử)
  * **Các thành viên:** TRƯƠNG QUANG TUÂN, NGUYỄN ĐÀO VĂN QUÝ, LÊ HỮU SƠN
* **Các công cụ cốt lõi áp dụng:**
  1. **Vitest (Automation Testing tool):** Trình chạy kiểm thử thế hệ mới, thực thi song song, siêu nhanh.
  2. **React Testing Library (UI Testing tool):** Mô phỏng tương tác người dùng trên Virtual DOM (JSDOM).
  3. **Istanbul v8 (Coverage Tool):** Phân tích tĩnh và đo độ bao phủ mã nguồn (Statements, Branches, Lines, Functions).
  4. **PCS QA Dashboard (Test Management Tool):** Giao diện web trực quan hóa kết quả kiểm thử, quản lý lỗi (Defect Center) và lịch sử thực thi.

---

## Slide 2: Tại sao lựa chọn Vitest và React Testing Library?
* **Tốc độ vượt trội:** Vitest tận dụng Hot Module Replacement (HMR) của Vite để biên dịch code và chạy test cực nhanh (nhanh hơn Jest từ 3 - 5 lần).
* **Chạy song song (Parallel execution):** Hỗ trợ chạy đa luồng (multi-threading), giúp thực thi toàn bộ 53 test cases của hệ thống chỉ trong ~3 giây.
* **Tương thích hoàn hảo:** Hỗ trợ import alias, TypeScript, Next.js mà không cần thiết lập cấu hình Babel phức tạp.
* **Môi trường mô phỏng JSDOM:** Giúp chạy UI Component Test trên môi trường Node.js mà không cần mở trình duyệt thật (nhẹ và nhanh).

---

## Slide 3: Hướng dẫn Cài đặt & Thiết lập cấu hình (Installation)

### 3.1 Lệnh cài đặt các thư viện kiểm thử:
Chạy lệnh sau tại thư mục gốc của dự án:
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom @vitest/coverage-v8
```

### 3.2 File cấu hình chính `vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'node', // Môi trường mặc định cho API và Unit Test
    alias: {
      '@': path.resolve(__dirname, './backend/src'),
    },
  },
});
```

---

## Slide 4: Tổ chức Dữ liệu Kiểm thử (Test Data Generation)
* **Phương pháp:** Tập trung hóa dữ liệu kiểm thử vào một file duy nhất `tests/data/testData.ts` thay vì định nghĩa rải rác trong từng file test.
* **Mục tiêu:** Tránh trôi nổi dữ liệu, dễ dàng cập nhật thông tin khi database schema thay đổi.
* **Cấu trúc file `testData.ts`:**
  * **Dữ liệu User:** Tài khoản hợp lệ, tài khoản trùng email, tài khoản trùng số điện thoại, mật khẩu yếu.
  * **Dữ liệu Sân chơi:** Sân hoạt động, sân ẩn/đang bảo trì, danh sách slots giờ trống.
  * **Dữ liệu Voucher:** Voucher còn hạn, voucher quá hạn, voucher dưới hạn mức thanh toán tối thiểu.

---

## Slide 5: Chạy Kiểm Thử & Phân Tích Độ Bao Phủ (Coverage Analysis)

### 5.1 Các lệnh thực thi chính trong `package.json`:
* **Chạy toàn bộ test:**
  ```bash
  npm run test
  ```
* **Chạy và xuất báo cáo độ bao phủ mã nguồn (Coverage):**
  ```bash
  npm run test:coverage
  ```

### 5.2 Cơ chế đo độ bao phủ của Istanbul v8:
* Tự động duyệt qua từng dòng code nghiệp vụ trong `backend/src/modules/` khi chạy test.
* Đánh giá chi tiết 4 chỉ số:
  * **Statements (Câu lệnh):** % câu lệnh đã được thực thi.
  * **Branches (Nhánh quyết định):** % các điều kiện `if/else`, `switch/case` được đi qua cả 2 phía đúng/sai.
  * **Functions (Hàm):** % số lượng hàm được gọi.
  * **Lines (Dòng code):** % số dòng code thực tế được chạy.

---

## Slide 6: Quản Lý Kiểm Thử trực quan - PCS QA Dashboard
* **Tính năng:**
  * **Overview:** Hiển thị tổng số Test case, tỉ lệ Pass (100%), tổng thời gian chạy.
  * **Traceability Matrix:** Bảng ánh xạ từ mã Use Case sang Test Case và file kiểm thử cụ thể.
  * **Defect Center:** Quản lý danh sách lỗi, các bước tái hiện (Steps to Reproduce) và trạng thái vá lỗi.
  * **Coverage Stats:** Biểu đồ vòng tròn thể hiện độ bao phủ mã nguồn trực quan.
* **Cách khởi chạy Dashboard:**
  ```bash
  # 1. Tổng hợp dữ liệu test & coverage sang JSON
  npm run test:dashboard
  
  # 2. Khởi chạy server Dashboard trên cổng 8081
  node scripts/serve-dashboard.js
  ```
* Truy cập địa chỉ [http://localhost:8081](http://localhost:8081) để xem giao diện quản lý.

---

## Slide 7: Demo Chạy Kiểm Thử Thực Tế Trên Dự Án (Live Demo)
*(Nội dung thuyết trình và demo trực tiếp cho Giảng viên)*

1. **Bước 1: Demo chạy test nhanh bằng Vitest**
   * Mở terminal, chạy lệnh `npm run test`.
   * Chỉ ra tốc độ thực thi siêu tốc (~120ms cho unit tests và ~3.28s cho toàn bộ suite).
2. **Bước 2: Demo độ bao phủ mã nguồn**
   * Chạy lệnh `npm run test:coverage`.
   * Mở file `/coverage/index.html` trên trình duyệt để trình bày bảng báo cáo độ phủ chi tiết từng dòng code nghiệp vụ đạt trên 92.5%.
3. **Bước 3: Demo giao diện QA Dashboard**
   * Chạy server dashboard bằng lệnh `node scripts/serve-dashboard.js`.
   * Truy cập web browser, trình bày bảng Ma trận truy vết (Traceability Matrix) và Defect Center cho giảng viên xem.

---

## Slide 8: Kết Luận
Việc áp dụng bộ công cụ kiểm thử tự động hiện đại giúp nhóm SWP391 kiểm soát chất lượng dự án PCS một cách khoa học, chuyên nghiệp, tiết kiệm thời gian chạy hồi quy và đảm bảo độ tin cậy của phần mềm trước khi bàn giao.
