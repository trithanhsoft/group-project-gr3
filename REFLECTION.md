# Báo Cáo Thu Hoạch & Phản Tư (Reflection Report) - Dự Án PCS

Tài liệu tổng kết quá trình làm việc nhóm, ứng dụng công nghệ AI và đánh giá mức độ đóng góp của từng thành viên trong suốt 10 tuần thực hiện dự án **PCS (Pickleball Court & Coach Booking System)**.

---

## 1. Nhóm đã học được gì?
* **Quy trình kiểm thử chuyên nghiệp:** Hiểu cách lập kế hoạch kiểm thử theo chuẩn IEEE 829/ISTQB và áp dụng các kỹ thuật thiết kế test case hộp đen (Phân vùng tương đương, Phân tích giá trị biên, Bảng quyết định, Use Case) và hộp trắng (Độ bao phủ câu lệnh và nhánh quyết định).
* **Kiểm thử tự động thực tế:** Làm chủ bộ công cụ Vitest và React Testing Library để tự động hóa 100% việc chạy test, tránh rủi ro kiểm thử thủ công sai sót và tiết kiệm thời gian chạy kiểm thử hồi quy (Regression Testing).
* **Quản lý dữ liệu và môi trường:** Học cách quản lý dữ liệu tập trung qua `testData.ts` và cách xử lý lỗi Flaky test liên quan đến lệch múi giờ hệ thống khi chạy test trên các nền tảng khác nhau (như Windows local vs Linux CI/CD).

---

## 2. AI đã hỗ trợ nhóm như thế nào?
* **Tăng tốc độ viết code test:** AI (GitHub Copilot, ChatGPT) hỗ trợ sinh nhanh các đoạn mã boilerplate cho test cases, mô phỏng NextRequest và các Mock Repositories giúp tiết kiệm 50% thời gian gõ code.
* **Tối ưu hóa thiết kế kiểm thử:** Claude hỗ trợ nhóm tư duy tốt trong việc vẽ Bảng quyết định cho form UI đăng ký và chỉ ra các luồng thay thế (Alternative Flows) của Use Case Đặt sân mà nhóm có thể bỏ sót.
* **Học hỏi công nghệ mới:** AI giải thích nhanh cách cấu hình Vitest Workspace và cách đọc file XML để tổng hợp báo cáo tự động sang JSON hiển thị lên QA Dashboard.

---

## 3. AI đã gợi ý sai hoặc thiếu gì?
* **Lỗi lệch múi giờ hệ thống (Timezone Drift):** Khi sinh test case cho quy tắc hoàn tiền, ChatGPT đã sử dụng các mốc giờ cứng dựa trên múi giờ UTC. Khi chạy trên máy local của nhóm (UTC+7), test case liên tục bị fail. Nhóm đã phải tự sửa lại bằng cách viết hàm helper sinh ngày tương lai động.
* **Lỗi thư viện lỗi thời:** GitHub Copilot gợi ý sử dụng một số cú pháp cũ của `@testing-library/react` (như gọi `fireEvent` trực tiếp mà không bọc trong `act` hoặc dùng `waitForElement` đã bị loại bỏ ở các phiên bản mới). Nhóm đã phải tra cứu tài liệu chính thức của RTL để cập nhật lại.
* **Thiếu kiểm tra điều kiện biên:** Khi sinh logic so khớp trình độ (Player Matching), AI chỉ viết các trường hợp thông thường mà bỏ sót kiểm tra ranh giới khi hai người chơi có trình độ lệch nhau ở mức tối đa (Beginner vs Elite).

---

## 4. Nhóm đã kiểm chứng kết quả bằng cách nào?
* **Thực thi bộ test tự động:** Chạy lệnh `npm run test` trên máy của tất cả thành viên để đảm bảo 53 test cases đều đạt trạng thái **Pass**.
* **Đo lường Code Coverage:** Sử dụng Istanbul v8 (`npm run test:coverage`) để xuất báo cáo HTML và kiểm tra từng dòng code logic dịch vụ, đảm bảo các dòng điều kiện `if/else` đều được phủ kín (đạt tỷ lệ tổng thể >92.5%).
* **Kiểm chứng chéo (Peer Review):** Các đoạn code do AI sinh ra hoặc do thành viên viết đều phải trải qua quá trình review chéo giữa Dev và Tester trước khi merge vào nhánh chính.

---

## 5. Đóng góp của từng thành viên (Roles & Contributions)

Dưới đây là bảng thống kê chi tiết vai trò và minh chứng đóng góp của 5 thành viên nhóm SWP391:

| Thành viên | Vai trò | Trách nhiệm đóng góp chính | Minh chứng Commit/PR |
| --- | --- | --- | --- |
| **LÊ THỊ VĂN ANH** | QA Lead | - Thiết lập bộ công cụ kiểm thử tự động (`TESTING_TOOLS_REPORT.md`).<br>- Viết các kịch bản kiểm thử tích hợp API trong folder `tests/api/`.<br>- Viết script tổng hợp và cấu hình QA Test Dashboard.<br>- Quản lý lỗi (`DEFECT_REPORT.md`) và kiểm duyệt báo cáo chất lượng tổng kết (`TEST_SUMMARY_REPORT.md`). | PR #6 (API testing integration), PR #7 (Dashboard integration) |
| **TRƯƠNG QUANG TUÂN** | Tester 1 (Automation Tester) | - Thiết lập môi trường chạy test song song Vitest Workspace.<br>- Lập trình toàn bộ Unit Tests cho các service trong folder `tests/unit/`.<br>- Viết báo cáo kỹ thuật Unit Test (`UNIT_TEST_REPORT.md`). | PR #2 (Vitest config), PR #4 (Unit tests implementation), Commit `d31298a` |
| **TRẦN QUỐC SANG** | Project Manager / Tester 2 | - Quản lý tiến độ dự án 10 tuần.<br>- Lập kế hoạch kiểm thử (`TEST_PLAN.md`).<br>- Nghiên cứu thiết kế kịch bản kiểm thử Bảng quyết định (`DECISION_TABLE_TEST_REPORT.md`).<br>- Xây dựng kịch bản Use Case (`USE_CASE_TEST_REPORT.md`).<br>- Lập ma trận truy vết yêu cầu (RTM Matrix). | PR #1 (Test Plan), PR #3 (Decision table design), Commit `fe23a9b` (Use Case spec) |
| **NGUYỄN ĐÀO VĂN QUÝ**| Developer 1 (Backend Dev) | - Phát triển API Route Handlers cho hệ thống Next.js.<br>- Thiết lập mock database, mock mail, mock PayOS webhook.<br>- Sửa các defects nghiệp vụ do đội QA phát hiện. | PR #5 (Backend modules dev), PR #8 (PayOS integration) |
| **LÊ HỮU SƠN** | Developer 2 (Frontend Dev) | - Phát triển giao diện UI biểu mẫu (Đăng ký, Đăng nhập, Đặt sân).<br>- Tích hợp React Testing Library viết UI component test cho màn hình Login (`login.ui.test.tsx`). | PR #9 (Frontend UI forms), PR #10 (RTL Login test implementation) |

---

## 6. Nếu làm lại, nhóm sẽ cải thiện điều gì?
* **Tích hợp CI/CD sớm hơn:** Nhóm sẽ cấu hình GitHub Actions ngay từ tuần thứ 3 để tự động chạy bộ test Vitest mỗi khi có thành viên tạo Pull Request, thay vì chạy thủ công trên local.
* **Viết prompt rõ ràng hơn:** Chia nhỏ các yêu cầu gửi cho AI thay vì gửi một prompt dài chứa quá nhiều điều kiện dễ khiến AI sinh code bị sót hoặc sai cấu trúc dữ liệu của dự án.
* **Bổ sung kiểm thử End-to-End (E2E):** Áp dụng thêm Playwright để chạy test trên trình duyệt thật (Chrome, Safari) để nâng cao chất lượng giao diện người dùng frontend thay vì chỉ dùng JSDOM giả lập.
