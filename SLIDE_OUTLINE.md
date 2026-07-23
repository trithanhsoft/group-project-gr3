# BÁO CÁO CHI TIẾT KỊCH BẢN SLIDE THUYẾT TRÌNH ĐỒ ÁN KIỂM THỬ DỰ ÁN PCS
*Cẩm nang kịch bản slide báo cáo chi tiết - Đầy đủ nội dung copy-paste slide và lời thoại thuyết trình (Presenter Script) cho nhóm*

---

Bản thiết kế này bao gồm **19 slide chi tiết**, phân rã toàn bộ tiến trình kiểm thử của nhóm qua 10 tuần học. Mỗi slide được chia làm 2 phần:
1. **Nội dung hiển thị trên Slide (Slide Content):** Định dạng trực quan, chứa số liệu, bảng biểu, mã lệnh cụ thể.
2. **Lời thoại gợi ý thuyết trình (Presenter Script):** Kịch bản thuyết trình chi tiết bằng tiếng Việt giúp người báo cáo nói trôi chảy trước giảng viên.

---

## CHI TIẾT TỪNG SLIDE BÁO CÁO

---

### Slide 1: Trang tiêu đề (Title Slide)
#### 1. Nội dung hiển thị trên Slide:
* **Tiêu đề lớn:** DỰ ÁN KIỂM THỬ HỆ THỐNG ĐẶT SÂN & HLV PICKLEBALL (PCS)
* **Phụ đề:** Báo cáo Tổng kết Hoạt động Kiểm thử & Tự động hóa - 10 Tuần Đồng hành cùng AI
* **Thông tin nhóm:** Nhóm 3 - Lớp SWP391_SE1701 (Đại học FPT TP.HCM)
* **Thành viên & Vai trò dự án:**
  * **Trần Quốc Sang:** Project Manager / Tester 2 (Lên kế hoạch, thiết kế kịch bản Bảng quyết định & Use Case).
  * **Lê Thị Văn Anh:** QA Leader (Cấu hình tự động hóa, viết API integration tests, lập trình Dashboard, quản lý lỗi).
  * **Trương Quang Tuân:** Tester 1 (Lập trình Unit Tests, cấu hình Vitest Workspace).
  * **Nguyễn Đào Văn Quý:** Developer 1 (Phát triển backend API, fix defects).
  * **Lê Hữu Sơn:** Developer 2 (Phát triển UI Login/Register, fix UI validation defects).

#### 2. Lời thoại gợi ý thuyết trình:
> *"Kính chào giảng viên và các bạn học. Hôm nay nhóm 3 lớp SWP391 xin phép được trình bày báo cáo tổng kết hoạt động kiểm thử hệ thống đặt sân và huấn luyện viên Pickleball - viết tắt là PCS. Trong dự án này, bạn Trần Quốc Sang làm Project Manager điều phối chung và thiết kế kịch bản kiểm thử hộp đen. Bạn Lê Thị Văn Anh là QA Leader chịu trách nhiệm thiết lập môi trường tự động hóa, viết API tests và xây dựng QA Dashboard. Bạn Trương Quang Tuân phụ trách viết Unit tests. Hai bạn Nguyễn Đào Văn Quý và Lê Hữu Sơn là đội ngũ lập trình phát triển và sửa lỗi dựa trên defect report từ đội QA."*

---

### Slide 2: Danh sách chức năng hệ thống (Feature List under Test)
#### 1. Nội dung hiển thị trên Slide:
* **Mô tả:** Các nghiệp vụ cốt lõi của hệ thống PCS được đưa vào phạm vi kiểm thử:
  * **Authentication (Xác thực):** Đăng ký tài khoản mới, Đăng nhập hệ thống (mật khẩu thông thường và Google OAuth2), phân quyền người dùng (Admin, Court Owner, Player, Coach).
  * **Booking & Scheduling (Đặt sân & Lịch trình):** Chọn sân, chọn slot giờ chơi, giữ chỗ tạm thời (10 phút), kiểm tra trùng lịch (Overlap check).
  * **Payment Integration (Tích hợp thanh toán):** Tạo cổng thanh toán QR qua PayOS, xử lý webhook (IPN callback) cập nhật trạng thái đơn đặt.
  * **Promotion & Vouchers (Khuyến mãi):** Áp dụng mã giảm giá, kiểm tra điều kiện ranh giới (giá trị đơn tối thiểu, hạn dùng).
  * **Review & Rating (Đánh giá):** Người chơi đánh giá chất lượng sân và HLV sau buổi chơi.

#### 2. Lời thoại gợi ý thuyết trình:
> *"Để quý thầy cô hình dung rõ hơn, hệ thống PCS của chúng em tập trung vào 5 module chức năng cốt lõi. Thứ nhất là Xác thực người dùng và phân quyền chi tiết. Thứ hai là nghiệp vụ đặt sân thời gian thực tránh đặt trùng giờ. Thứ ba là tích hợp webhook thanh toán trực tiếp qua PayOS. Thứ tư là hệ thống Voucher khuyến mãi có áp dụng các điều kiện logic ranh giới. Và cuối cùng là tính năng Đánh giá chất lượng sau buổi chơi. Toàn bộ các module này đều được bao phủ bởi các kịch bản kiểm thử khác nhau."*

---

### Slide 3: Kế hoạch kiểm thử & Tiêu chí (Test Plan & Criteria)
#### 1. Nội dung hiển thị trên Slide:
* **Quy chuẩn áp dụng:** Dựa trên chuẩn quốc tế **ISTQB v4.0** và kế hoạch tổng thể `TEST_PLAN.md`.
* **Tiêu chí bắt đầu (Entry Criteria):**
  * Mã nguồn API Route Handlers hoàn thiện cấu trúc logic cơ bản.
  * Môi trường chạy test tự động (Vitest, JSDOM) đã cấu hình xong.
  * Dữ liệu mock tập trung sẵn sàng.
* **Tiêu chí kết thúc (Exit Criteria):**
  * 100% test cases đã thiết kế được thực thi và vượt qua (Pass Rate = 100%).
  * Độ bao phủ mã nguồn (Code Coverage) đạt **>90%**.
  * Không còn lỗi nghiêm trọng (Critical/High) nào ở trạng thái Open.

#### 2. Lời thoại gợi ý thuyết trình:
> *"Quy trình kiểm thử của nhóm tuân thủ nghiêm ngặt theo chuẩn kiểm thử ISTQB v4.0. Chúng em chỉ bắt đầu viết test khi cấu trúc logic API route và môi trường Vitest đã sẵn sàng. Và chúng em chỉ đóng dự án khi đạt được tiêu chí kết thúc bắt buộc: 100% các ca kiểm thử tự động đều phải Passed, độ bao phủ mã nguồn đạt trên 90%statement coverage, và toàn bộ lỗi nghiêm trọng phải được giải quyết triệt để."*

---

### Slide 4: Phạm vi & Sản phẩm bàn giao (Test Scope & Deliverables)
#### 1. Nội dung hiển thị trên Slide:
* **Phạm vi kiểm thử (Test Scope):**
  * *In Scope:* Unit Test cho service backend, API Integration Test cho các routes `/api/*`, UI component test cho Login Page.
  * *Out of Scope:* Kiểm thử tải (Load test), bảo mật hạ tầng mạng, tích hợp tài khoản ngân hàng thật.
* **Chi tiết cấu trúc và nội dung của sản phẩm bàn giao (Test Deliverables):**
  1. **Kế hoạch kiểm thử (`TEST_PLAN.md`):** Gồm 7 phần chính (Giới thiệu mục đích; Phạm vi trong/ngoài kiểm thử; Chiến lược cấp độ Unit/API/UI test; Tiêu chí Đạt/Không đạt hệ thống; Sản phẩm bàn giao; Môi trường kiểm thử Node & JSDOM; Phân công nhân sự & Phân tích rủi ro).
  2. **Báo cáo kiểm thử Bảng quyết định (`DECISION_TABLE_TEST_REPORT.md`):** Gồm 6 phần (Chọn chức năng Form Register UI; Quy tắc validation đầu vào; Bảng quyết định 8 quy tắc ứng xử; Thiết kế 8 ca test `TC_DT_01` -> `TC_DT_08`; Kết quả thực thi Passed 100%; Khắc phục lỗi UI).
  3. **Báo cáo kiểm thử Use Case (`USE_CASE_TEST_REPORT.md`):** Gồm 5 phần (Chọn Use Case đặt sân & thanh toán `UC-04`; Đặc tả các luồng Basic/Alternative/Exception; Thiết kế 4 ca test `TC_UC_01` -> `TC_UC_04`; Kết quả chạy Pass 100%; Đánh giá độ phủ).
  4. **Báo cáo Unit Test (`UNIT_TEST_REPORT.md`):** Gồm 8 phần (Mục tiêu cô lập logic; Môi trường Vitest; Tổng quan 41 test Passed; Kỹ thuật thiết kế EP/BVA cho 11 nhóm nghiệp vụ logic; Đặc tả chi tiết 41 ca test; Chỉ số Coverage thực tế; Kiểm thử hồi quy; Nghiệm thu).
  5. **Báo cáo lỗi (`DEFECT_REPORT.md`):** Gồm 4 phần (Mục tiêu quản lý lỗi; Vòng đời lỗi từ New -> Closed; Số liệu thống kê lỗi; Đặc tả chi tiết 2 lỗi `DF_PAY_01` và `DF_PAY_02` bao gồm ID, độ nghiêm trọng, các bước tái hiện, thực tế vs mong đợi, nguyên nhân gốc rễ và mã nguồn sửa lỗi đề xuất - Code diff).
  6. **Báo cáo tổng kết chất lượng (`TEST_SUMMARY_REPORT.md`):** Gồm 8 phần (Mục đích báo cáo; Tổng quan dự án; Phạm vi kiểm định; Kết quả thực thi test 53 Passed (100%); Chỉ số Code Coverage thực tế của Istanbul; Báo cáo lỗi đã đóng; Ma trận RTM; Đánh giá mức độ sẵn sàng release).
  7. **Mã nguồn và tệp cấu hình kiểm thử:** 53 test cases tự động (`tests/**/*.test.ts`, `frontend/**/*.test.tsx`), file cấu hình workspace (`vitest.workspace.ts`) và Postman collections (`PCS.postman_collection.json`, `PCS.postman_environment.json`).

#### 2. Lời thoại gợi ý thuyết trình:
> *"Về phạm vi kiểm thử, nhóm tập trung sâu vào kiểm thử đơn vị, kiểm thử tích hợp API và kiểm thử thành phần giao diện. Do hạn chế về tài nguyên học tập, kiểm thử tải hiệu năng và bảo mật mạng nằm ngoài phạm vi đồ án lần này. Kết thúc 10 tuần, nhóm bàn giao đầy đủ bộ tài liệu đặc tả kế hoạch kiểm thử, các báo cáo kiểm thử hộp đen như Bảng quyết định và Use Case, mã nguồn 53 test case tự động chạy trên Vitest, file collection Postman cùng các báo cáo lỗi chi tiết và báo cáo tổng kết chất lượng hệ thống trước khi release."*

---

### Slide 5: Quản lý dữ liệu kiểm thử (Test Data Management)
#### 1. Nội dung hiển thị trên Slide:
* **Chiến lược dữ liệu:** Tập trung hóa dữ liệu kiểm thử trong tệp `tests/data/testData.ts` để đảm bảo tính nhất quán và dễ bảo trì.
* **Phân loại tập dữ liệu mẫu (Sample Datasets):**
  * *Dữ liệu hợp lệ (Positive):* Thông tin đăng ký đầy đủ định dạng; payload webhook chứa chữ ký hợp lệ từ PayOS; đơn đặt sân trong khung giờ trống.
  * *Dữ liệu không hợp lệ (Negative):* Email sai định dạng, mật khẩu yếu; webhook PayOS sai signature; booking bị trùng giờ (overlap) hoặc vượt giới hạn 3 đơn/ngày.
* **Dọn dẹp dữ liệu:** Tự động khôi phục trạng thái mock (`vi.clearAllMocks()`) sau mỗi ca test để tránh ảnh hưởng chéo.

#### 2. Lời thoại gợi ý thuyết trình:
> *"Quản lý dữ liệu là phần rất quan trọng trong kiểm thử tự động. Chúng em tập trung hóa toàn bộ dữ liệu mẫu trong file testData.ts. Dữ liệu được chia rõ ràng thành các nhóm kiểm thử tích cực (Positive) để xác thực tính năng chạy đúng và các nhóm kiểm thử tiêu cực (Negative) như sai chữ ký webhook PayOS hay trùng giờ chơi để đảm bảo hệ thống báo lỗi chính xác. Sau mỗi test case chạy qua, chúng em đều gọi hàm clearAllMocks để reset lại trạng thái dữ liệu sạch."*

---

### Slide 6: Thiết kế test case hộp đen - Bảng Quyết Định (Black-box: Decision Table)
#### 1. Nội dung hiển thị trên Slide:
* **Đối tượng thiết kế:** Biểu mẫu Đăng ký tài khoản (Register UI Rules).
* **Mã hiệu test case:** `TC_DT_01` đến `TC_DT_08`.
* **Ma trận Bảng quyết định thiết kế:**

| Điều kiện (Conditions) | TC1 | TC2 | TC3 | TC4 | TC5 | TC6 | TC7 | TC8 |
| --- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **C1:** Email hợp lệ & duy nhất | Y | Y | Y | Y | N | N | N | N |
| **C2:** SĐT hợp lệ & duy nhất | Y | Y | N | N | Y | Y | N | N |
| **C3:** Mật khẩu mạnh (độ dài >= 8)| Y | N | Y | N | Y | N | Y | N |
| **Kết quả mong đợi (Expected)** | Thành công | Lỗi Pass | Lỗi SĐT | Lỗi Cả hai | Lỗi Email | Lỗi Cả hai | Lỗi Cả hai | Lỗi Tất cả |

#### 2. Lời thoại gợi ý thuyết trình:
> *"Đối với thiết kế kiểm thử hộp đen, đầu tiên bạn Sang đã áp dụng kỹ thuật Bảng quyết định cho chức năng Đăng ký tài khoản. Bằng việc phân tích 3 điều kiện ranh giới gồm tính hợp lệ của Email, Số điện thoại và độ mạnh mật khẩu, chúng em xây dựng được 8 luật rẽ nhánh tương ứng từ TC1 đến TC8. Kịch bản này giúp chúng em bao phủ hoàn toàn mọi tổ hợp lỗi nhập liệu ranh giới mà người dùng có thể mắc phải trên giao diện."*

---

### Slide 7: Thiết kế test case hộp đen - Kịch bản Use Case (Black-box: Use Case Testing)
#### 1. Nội dung hiển thị trên Slide:
* **Đối tượng thiết kế:** Use Case **UC-04 Đặt sân và Thanh toán trực tuyến**.
* **Mã hiệu kịch bản:** `TC_UC_01` đến `TC_UC_04`.
* **Đặc tả luồng nghiệp vụ kiểm thử:**

| Mã Test Case | Luồng kiểm thử (Flow) | Hành động (User Action) | Kết quả mong đợi (Expected) |
| --- | --- | --- | --- |
| **TC_UC_01** | Luồng cơ bản (Basic) | Đặt sân trống ➔ Quét QR PayOS hợp lệ | Trạng thái đặt sân chuyển thành `Paid`, khóa slot. |
| **TC_UC_02** | Rẽ nhánh 1 (Alternative) | Đặt trùng giờ chơi đã có người giữ chỗ | Hệ thống báo lỗi trùng lịch, hoàn tác giao dịch. |
| **TC_UC_03** | Rẽ nhánh 2 (Alternative) | Đặt đơn thứ 4 trong ngày (giới hạn = 3) | Hệ thống báo lỗi vượt ngưỡng đặt sân tối đa trong ngày. |
| **TC_UC_04** | Luồng ngoại lệ (Exception) | Hủy thanh toán hoặc hết hạn 10 phút giữ chỗ | Hủy đơn thanh toán, giải phóng slot sân cho người khác. |

#### 2. Lời thoại gợi ý thuyết trình:
> *"Thứ hai là kỹ thuật kiểm thử Use Case áp dụng cho luồng phức tạp nhất hệ thống - Đặt sân và Thanh toán trực tuyến. Chúng em thiết kế 4 ca kiểm thử bao phủ toàn bộ vòng đời giao dịch: từ đặt sân thành công ở luồng cơ bản, cho đến các trường hợp ngoại lệ như người dùng đặt trùng giờ chơi đã bị khóa, đặt vượt quá giới hạn 3 sân một ngày, hoặc người dùng bỏ ngang thanh toán sau 10 phút thì hệ thống phải tự giải phóng slot."*

---

### Slide 8: Thiết kế kiểm thử đơn vị - White-box & Điều kiện biên (Unit Testing: EP & BVA)
#### 1. Nội dung hiển thị trên Slide:
* **Mục tiêu:** Kiểm thử cấu trúc mã nguồn bên trong của các dịch vụ logic (Statement & Branch Coverage).
* **Kiểm thử biên (BVA) cho hàm tính tiền hoàn trả (`calculateRefundAmount`):**
  * Hủy trước 12 tiếng: Hoàn tiền 100% ➔ Test giá trị biên ranh giới `12h01` (Pass) và `11h59` (Fail hoàn 100%).
  * Hủy từ 2 tiếng - 12 tiếng: Hoàn tiền 70% ➔ Test biên `2h01` (Pass) và `1h59` (Fail hoàn 70%).
  * Hủy dưới 2 tiếng: Hoàn tiền 0% ➔ Test biên `1h50` (Pass hoàn 0%).
* **Kiểm thử rẽ nhánh cho hàm áp dụng Voucher khuyến mãi (`validatePromotion`):**
  * Viết test đi qua tất cả các nhánh điều kiện `if/else`: Voucher hết hạn, Đơn hàng không đạt giá trị tối thiểu, Áp dụng thành công.

#### 2. Lời thoại gợi ý thuyết trình:
> *"Đối với kiểm thử đơn vị hộp trắng, bạn Tuân đã áp dụng kỹ thuật Phân tích giá trị biên BVA vào hàm tính toán tiền hoàn trả khi người dùng hủy đặt lịch. Chúng em tập trung kiểm định các ranh giới thời gian cực kỳ nhạy cảm như biên 12 tiếng và biên 2 tiếng để xem thuật toán làm tròn và rẽ nhánh của hệ thống có hoạt động chuẩn xác hay không. Đồng thời kiểm thử rẽ nhánh phủ kín 100% các kịch bản voucher khuyến mãi."*

---

### Slide 9: Kiểm thử API bằng công cụ Postman (API Testing with Postman)
#### 1. Nội dung hiển thị trên Slide:
* **Mục tiêu:** Kiểm thử hộp đen tự động ở cấp độ giao thức HTTP endpoints.
* **Cấu hình môi trường (`PCS.postman_environment.json`):**
  * Quản lý biến môi trường: `baseUrl` (http://localhost:3000), `jwt_token` tự động lưu.
* **Quy trình kịch bản tích hợp trong Collection (`PCS.postman_collection.json`):**
  * Gửi request POST `auth/register` ➔ POST `auth/login` ➔ Tự động phân tách và lưu token vào biến `jwt_token` ở tab *Tests* của Postman.
  * Tab *Tests* viết mã JS tự động assert:
    ```javascript
    pm.test("Status code is 200/201", () => {
        pm.expect(pm.response.code).to.be.oneOf([200, 201]);
    });
    pm.test("Response contains token", () => {
        pm.expect(pm.response.json()).to.have.property("token");
    });
    ```

#### 2. Lời thoại gợi ý thuyết trình:
> *"Bên cạnh chạy mã test, chúng em cũng xây dựng bộ API collection trên Postman phục vụ kiểm thử tích hợp. Điểm đặc biệt là chúng em viết mã kiểm thử tự động ngay trong tab Tests của Postman để kiểm tra mã trạng thái HTTP trả về luôn là 200 hoặc 201 và cấu trúc dữ liệu JSON trả về phải khớp với đặc tả kỹ thuật."*

---

### Slide 10: Kiểm thử tự động bằng Vitest (Automation Testing with Vitest)
#### 1. Nội dung hiển thị trên Slide:
* **Lấy lý do lựa chọn công nghệ:**
  * **Vitest:** Tận dụng tối đa bộ biên dịch Vite, thực thi siêu tốc (chạy 55 test cases chỉ trong ~4.22 giây trên local).
  * **Workspace phân tách (`vitest.workspace.ts`):** Chia dự án làm 2 luồng song song: Backend (môi trường Node để test API) và Frontend (môi trường JSDOM để giả lập DOM của React components).
* **Kỹ thuật mock API Handlers:**
  * Giả lập lớp `NextRequest` để gửi payload trực tiếp vào Route Handlers:
    ```typescript
    const req = new NextRequest("http://localhost/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: "test@gmail.com", password: "Password123" })
    });
    const res = await loginController(req);
    expect(res.status).toBe(200);
    ```

#### 2. Lời thoại gợi ý thuyết trình:
> *"Về phần kiểm thử tự động hoá do bạn Văn Anh làm chủ trì, chúng em sử dụng Vitest làm lõi chạy test. Cấu hình vitest.workspace cho phép phân chia môi trường giả lập DOM cho client và môi trường NodeJS cho backend. Để tối ưu tốc độ chạy test tích hợp API, chúng em không chạy server HTTP thật mà viết mã giả lập NextRequest để truyền trực tiếp payload vào hàm controller, giúp toàn bộ suite test chạy xong chỉ trong 4.22 giây."*

---

### Slide 11: Đo lường và Báo cáo độ bao phủ (Code Coverage with Istanbul)
#### 1. Nội dung hiển thị trên Slide:
* **Công cụ sử dụng:** Trình phân tích tĩnh mã nguồn **Istanbul v8** tích hợp sẵn trong Vitest qua thư viện `@vitest/coverage-v8`.
* **Kết quả đo lường độ bao phủ mã nguồn thực tế:**
  * **Độ bao phủ câu lệnh (Statement Coverage):** **92.5%**
  * **Độ bao phủ nhánh rẽ (Branch Coverage):** **88.3%**
  * **Độ bao phủ hàm (Function Coverage):** **95.0%**
  * **Độ bao phủ dòng code (Line Coverage):** **92.5%**
* **Trực quan hóa:** Xuất file HTML tĩnh cho phép QA Leader duyệt từng dòng code để xem dòng nào chưa chạy qua test.

#### 2. Lời thoại gợi ý thuyết trình:
> *"Để kiểm chứng chất lượng của bộ test tự động, chúng em tích hợp Istanbul v8 để đo chỉ số Code Coverage. Kết quả đạt được rất ấn tượng: 92.5% số câu lệnh và 88.3% số nhánh rẽ của toàn bộ logic nghiệp vụ hệ thống đều đã được chạy qua kiểm thử. Điều này đảm bảo rằng hầu như không có dòng code chết hoặc logic lỗi nào bị bỏ sót trước khi bàn giao."*

---

### Slide 12: QA Dashboard - Overview & Code Coverage Portal
#### 1. Nội dung hiển thị trên Slide:
* **Tổng quan Dashboard:** Web Portal viết bằng React + Tailwind CSS, phục vụ trên Express server (port 8081).
* **Màn hình Overview Portal:**
  * Hiển thị chỉ số KPI: Tổng số ca test (55), Pass Rate (100%), tổng thời gian chạy (4.22s).
  * **Test Suite Allocation:** Biểu đồ phân bổ tỷ lệ giữa Unit test (41 ca), API test (11 ca) và UI component test (3 ca).
  * **QA Pipeline Workflow:** Sơ đồ quy trình CI/CD giả lập từ khâu biên dịch mã nguồn, kiểm thử các cấp độ, kiểm tra điều kiện rào cản Code Coverage (Coverage Gate > 80%) đến xuất báo cáo lên Dashboard.

#### 2. Lời thoại gợi ý thuyết trình:
> *"Một trong những điểm sáng của dự án là chúng em tự xây dựng một trang QA Dashboard nội bộ chạy trên cổng 8081. Màn hình Overview hiển thị toàn bộ chỉ số KPI quan trọng của dự án gồm tỷ lệ Pass Rate đạt 100% của 55 test cases và sơ đồ trực quan luồng CI/CD QA Pipeline từ bước build code cho đến bước kiểm duyệt độ bao phủ."*

---

### Slide 13: QA Dashboard - Test Execution Grid & Defect Center
#### 1. Nội dung hiển thị trên Slide:
* **Các cấu phần màn hình:**
  * **Test Execution Grid:** Hiển thị danh sách chi tiết 55 test cases chạy thành công, hỗ trợ tìm kiếm theo từ khóa tức thời và lọc nhanh theo độ ưu tiên (High/Medium/Low) hoặc trạng thái lỗi.
  * **Defect Center (Trung tâm quản lý lỗi):** Thống kê số lỗi theo mức độ nghiêm trọng (Critical/High/Medium/Low).
  * **Defect Detail Modal (Hộp thoại chi tiết lỗi):** Hiển thị chi tiết từng bug: mã lỗi, mô tả hành vi lỗi, các bước tái hiện lỗi (Steps to Reproduce), kết quả mong đợi vs thực tế và gợi ý giải pháp sửa đổi (Suggested Fix) trực quan cho Dev.

#### 2. Lời thoại gợi ý thuyết trình:
> *"Tại màn hình Test Execution và Defect Center của Dashboard, chúng em quản lý chi tiết kết quả chạy của từng ca test và quản lý vòng đời của lỗi. Khi lập trình viên click vào bất kỳ lỗi nào trên Defect Center, một cửa sổ Modal chi tiết sẽ hiện lên hiển thị đầy đủ các bước tái hiện lỗi cũng như gợi ý sửa code cụ thể, giúp rút ngắn thời gian debug của nhóm."*

---

### Slide 14: QA Dashboard - Traceability (RTM) & Trend Analytics
#### 1. Nội dung hiển thị trên Slide:
* **Các cấu phần màn hình:**
  * **Traceability Matrix (Bảng ma trận RTM):** Ánh xạ trực tiếp từ Yêu cầu nghiệp vụ (Use Case Code) sang Ca kiểm thử (TC_ID), trỏ đến file code kiểm thử vật lý tương ứng, đi kèm phần trăm bao phủ code và trạng thái lỗi liên quan.
  * **Trend Analytics:** Vẽ biểu đồ đường và vùng (Line & Area Chart) thể hiện xu hướng tăng trưởng của chất lượng phần mềm qua các lần chạy test gần đây.
  * **Compare Runs Log:** Tiện ích so sánh chéo, cho phép chọn hai phiên bản chạy test bất kỳ (Run A và Run B) để đối soát sự thay đổi về số lượng test case, thời gian thực thi và độ phủ coverage.

#### 2. Lời thoại gợi ý thuyết trình:
> *"Trang Traceability Matrix và Trend Analytics cung cấp ma trận truy vết thông minh để chứng minh mọi tính năng khách hàng yêu cầu đều có kịch bản test tương ứng. Biểu đồ Trend Analytics sử dụng thư viện Recharts để mô hình hóa xu hướng cải thiện chất lượng mã nguồn qua các đợt build. Đồng thời tính năng Compare Runs cho phép so sánh chéo hiệu năng và độ bao phủ giữa hai phiên bản build bất kỳ."*

---

### Slide 15: Báo cáo lỗi dự án (Defect Report Summary)
#### 1. Nội dung hiển thị trên Slide:
* **Vòng đời quản lý lỗi áp dụng:** New ➔ Assigned ➔ In Progress ➔ Fixed ➔ Retest ➔ Closed.
* **Danh sách lỗi tiêu biểu đã được sửa và đóng (100% Closed):**

| Mã Defect | Mức độ | Mô tả lỗi phát hiện | Nguyên nhân gốc rễ | Trạng thái |
| --- | :---: | --- | --- | :---: |
| **DF_PAY_01** | High | Lệch múi giờ hoàn tiền khi chạy trên Linux CI/CD | Môi trường Linux chạy UTC+0, không đồng bộ UTC+7 của Việt Nam | **Closed** |
| **DF_REG_01** | Medium | Chấp nhận email sai cú pháp có hai dấu chấm (`a@g..com`) | Biểu thức Regex trong Zod validation chưa chặt chẽ | **Closed** |
| **DF_PAY_02** | Medium | API thanh toán thiếu trường thông tin trạng thái | Thiếu thuộc tính `success: true` trong JSON payload trả về | **Closed** |

#### 2. Lời thoại gợi ý thuyết trình:
> *"Trong quá trình thực hiện kiểm thử tự động, đội QA đã phát hiện và báo cáo 3 lỗi lớn. Nghiêm trọng nhất là lỗi lệch múi giờ DF_PAY_01 khi chạy test trên GitHub Actions do hệ điều hành Linux chạy múi giờ UTC+0 khiến thuật toán tính giờ hoàn tiền bị sai lệch. Lỗi thứ hai là Regex của form đăng ký chưa chặn được email có hai dấu chấm liên tiếp. Toàn bộ các lỗi này đã được bàn giao, sửa đổi và đóng trạng thái Closed 100%."*

---

### Slide 16: Báo cáo tổng kết kiểm thử (Test Summary Report)
#### 1. Nội dung hiển thị trên Slide:
* **Thống kê kết quả kiểm thử cuối cùng:**
  * **Tổng số ca kiểm thử:** 55.
  * **Passed:** 55 ca (Tỷ lệ đạt **100%**).
  * **Failed / Blocked:** 0 ca (0%).
  * **Độ ổn định hệ thống:** Đạt mức tuyệt đối trên môi trường thử nghiệm.
* **Kết luận chất lượng hệ thống:**
  * Hệ thống PCS đủ điều kiện phát hành (Release Ready).
  * Các chức năng quan trọng (Đăng nhập, Đặt sân thời gian thực, Thanh toán PayOS, Hủy lịch hoàn tiền) hoạt động hoàn toàn ổn định, chính xác theo thiết kế nghiệp vụ và không phát sinh lỗi hồi quy.

#### 2. Lời thoại gợi ý thuyết trình:
> *"Thông qua tài liệu Test Summary Report, nhóm tự tin báo cáo rằng 100% trên tổng số 55 ca kiểm thử tự động của hệ thống đều vượt qua thành công, không còn bất kỳ lỗi tồn đọng nào. Các luồng xử lý then chốt của dự án đã hoạt động vô cùng trơn tru, không có lỗi hồi quy. Hệ thống đã hoàn toàn sẵn sàng bàn giao cho người dùng cuối."*

---

### Slide 17: Nhật ký kiểm toán AI & Prompt Engineering (AI Audit Log)
#### 1. Nội dung hiển thị trên Slide:
* **Vai trò của AI (ChatGPT, Claude, Copilot):**
  * Tăng tốc sinh mã kiểm thử boilerplate lên 50% (cấu trúc NextRequest mock, sinh mảng dữ liệu giả lập).
  * Hỗ trợ QA phân tích các nhánh Use Case để bổ sung kịch bản test ranh giới.
* **Các lỗi sai của AI và phương án khắc phục:**
  * *Lỗi 1 (Múi giờ):* AI viết cứng múi giờ UTC gây lỗi lệch ngày khi chạy test trên CI. QA Leader tự khắc phục bằng cách thay thế bằng hàm sinh ngày tương lai động theo múi giờ Việt Nam.
  * *Lỗi 2 (Cú pháp lỗi thời):* AI đề xuất cú pháp React Testing Library cũ không tương thích bản Next.js mới. Nhóm đã tự đọc tài liệu gốc của thư viện để sửa lại cú pháp import.

#### 2. Lời thoại gợi ý thuyết trình:
> *"Trong suốt dự án, chúng em đã ứng dụng công cụ AI để sinh mã kiểm thử và phân tích kịch bản ranh giới giúp nâng cao năng suất. Tuy nhiên, AI cũng mắc các lỗi sai như viết cứng múi giờ hoặc gợi ý mã nguồn thư viện đã lỗi thời. Nhóm đã thực hiện kiểm toán AI chặt chẽ và chủ động đọc tài liệu kỹ thuật gốc để sửa lại mã nguồn thủ công, đảm bảo code chạy chính xác."*

---

### Slide 18: Đóng góp thành viên (Team Contribution Matrix)
#### 1. Nội dung hiển thị trên Slide:
* **Bảng thống kê tỷ lệ đóng góp thực tế của các thành viên:**

| Thành viên | Vai trò | Công việc chính đóng góp | Mã minh chứng (PR/Commit) |
| --- | --- | --- | --- |
| **Trần Quốc Sang** | Project Manager | Lập kế hoạch kiểm thử (`TEST_PLAN.md`), thiết kế kịch bản Bảng quyết định và kịch bản Use Case. | PR #1, PR #3 |
| **Lê Thị Văn Anh** | QA Leader | Thiết lập Vitest Workspace, lập trình API integration tests, viết script JSON, phát triển QA Dashboard và quản lý defect. | PR #6, PR #7 |
| **Trương Quang Tuân**| Tester 1 | Lập trình toàn bộ Unit Tests và cấu hình môi trường giả lập JSDOM. | PR #2, PR #4 |
| **Nguyễn Đào Văn Quý**| Developer 1 | Phát triển các API Route Handlers, mock database logic, sửa lỗi API. | PR #5, PR #8 |
| **Lê Hữu Sơn** | Developer 2 | Thiết kế giao diện UI Login/Register, liên kết RTL test, sửa lỗi UI validation. | PR #9, PR #10 |

#### 2. Lời thoại gợi ý thuyết trình:
> *"Đây là bảng ma trận đóng góp của các thành viên trong nhóm 3. Bạn Sang điều phối kế hoạch dự án; bạn Văn Anh viết API tests và xây dựng Dashboard; bạn Tuân viết Unit tests; hai bạn Quý và Sơn tập trung phát triển code và sửa lỗi nghiệp vụ. Sự phân công rõ ràng, minh bạch này giúp nhóm đạt hiệu suất tối đa và hoàn thành đúng hạn."*

---

### Slide 19: Kết luận & Hướng phát triển (Conclusion & Future Improvements)
#### 1. Nội dung hiển thị trên Slide:
* **Kết luận:**
  * Dự án hoàn thành xuất sắc các mục tiêu chất lượng đề ra.
  * Tích hợp thành công pipeline CI/CD (GitHub Actions) tự động chạy kiểm thử mỗi khi tạo Pull Request giúp bảo vệ nhánh code chính.
  * Vận hành QA Dashboard phục vụ trực quan hóa dữ liệu kiểm thử chuyên nghiệp.
* **Hướng phát triển tương lai:**
  * Tích hợp kiểm thử hiệu năng tự động (Sử dụng K6 hoặc JMeter) vào luồng CI/CD.
  * Phát triển bộ kiểm thử End-to-End (E2E) mô phỏng hành vi người dùng thật trên trình duyệt thực tế bằng công cụ **Playwright**.

#### 2. Lời thoại gợi ý thuyết trình:
> *"Để kết luận, dự án kiểm thử hệ thống PCS của nhóm đã hoàn thành rất tốt, đạt độ bao phủ code cao và tích hợp thành công CI/CD tự động hóa cùng QA Dashboard trực quan. Trong tương lai, nhóm định hướng sẽ mở rộng thêm bộ test End-to-End bằng Playwright để kiểm thử toàn diện giao diện người dùng và kiểm thử hiệu năng chịu tải trước khi đưa dự án chạy thực tế. Xin cảm ơn thầy cô và các bạn đã lắng nghe!"*

---

## PHẦN 2: KỊCH BẢN SLIDE THEO TIẾN ĐỘ THỜI GIAN 10 TUẦN (10-WEEK TIMELINE DECK)
*Cấu trúc báo cáo tiến độ tuần tự từ Tuần 1 đến Tuần 10 kết hợp hướng dẫn Demo thực tế và Tổng kết dự án.*

---

### Slide 1: Trang tiêu đề & Tổng quan Tiến trình 10 Tuần
#### 1. Nội dung hiển thị trên Slide:
* **Tiêu đề chính:** BÁO CÁO TIẾN ĐỘ & TỔNG KẾT KIỂM THỬ DỰ ÁN PCS
* **Phụ đề:** Hành trình 10 Tuần Xây dựng Hệ thống Kiểm thử Tự động & QA Dashboard
* **Nhóm thực hiện:** Nhóm 3 - Môn SWP391 (Lớp SE1701 - FPTU HCM)
* **Bảng tiến độ 10 tuần chi tiết:**

| Giai đoạn | Tuần thực hiện | Hoạt động chính | Sản phẩm bàn giao bàn cứng | % Hoàn thành |
| --- | :---: | --- | --- | :---: |
| **Giai đoạn 1** | Tuần 1 - 2 | Khảo sát kiến trúc, lập Feature Matrix & Lập Test Plan chi tiết theo ISTQB. | `FEATURE_MATRIX.md`, `TEST_PLAN.md` | 100% |
| **Giai đoạn 2** | Tuần 3 - 4 | Thiết kế kịch bản test (EP, BVA, Decision Table, Use Case) & Mock Test Data. | `testData.ts`, `DECISION_TABLE_REPORT.md` | 100% |
| **Giai đoạn 3** | Tuần 5 - 6 | Kiểm thử tích hợp API (Postman Collections) & Lập trình 41 Unit Tests (Vitest). | `PCS.postman_collection.json`, `UNIT_TEST_REPORT.md` | 100% |
| **Giai đoạn 4** | Tuần 7 - 8 | Cấu hình Vitest Workspace, chạy GitHub Actions, tìm & sửa lỗi (Defects). | `vitest.workspace.ts`, `DEFECT_REPORT.md` | 100% |
| **Giai đoạn 5** | Tuần 9 - 10 | Thiết lập QA Dashboard Portal, Báo cáo Tổng kết & Thuyết trình nghiệm thu. | `dashboard-data.json`, `TEST_SUMMARY_REPORT.md` | 100% |

#### 2. Lời thoại gợi ý thuyết trình:
> *"Kính chào giảng viên và các bạn học. Hôm nay nhóm 3 xin phép được trình bày kịch bản báo cáo tổng kết tiến trình kiểm thử hệ thống đặt sân và huấn luyện viên Pickleball - PCS qua dòng thời gian 10 tuần. Nhóm sẽ đi qua từng giai đoạn từ phân tích nghiệp vụ, lập kế hoạch, viết mã test tự động, quản lý lỗi cho đến việc xây dựng một QA Dashboard Portal trực quan để giám sát chất lượng phần mềm."*

---

### Slide 2: Tuần 1 – Khảo sát & Phân tích tính năng (Feature Analysis)
#### 1. Nội dung hiển thị trên Slide:
* **Hoạt động chính:** Khảo sát kiến trúc mã nguồn và phân tích tính năng nghiệp vụ.
* **Kiến trúc hệ thống vật lý (Architecture Under Test):**
  * *Frontend:* Next.js / React, CSS styling, UI Components cho đặt sân, đăng nhập.
  * *Backend Router:* Next.js API Routes (Route Handlers `/api/auth/*`, `/api/bookings/*`, `/api/courts/*`, `/api/coaches/*`, `/api/payment/*`).
  * *Database Connection:* MS SQL Server (Được mô phỏng qua Mock repository phục vụ test biệt lập).
* **Feature Matrix (Bảng ma trận chức năng):**
  * Ánh xạ chi tiết 11 module chức năng của hệ thống gồm:
    * `Auth & Register`: Đăng ký, đăng nhập JWT, phân quyền tài khoản (Admin, Owner, Player, Coach).
    * `Court Scheduling`: Xem danh sách sân, tìm slot trống theo ngày, giữ slot tạm thời 10 phút.
    * `Booking Management`: Xử lý đặt sân, kiểm tra trùng lịch (Overlap), giới hạn tối đa 3 booking/ngày/user.
    * `Coach Management`: Duyệt hồ sơ HLV, đặt lịch học HLV.
    * `Payment Integration`: Tạo link thanh toán PayOS QR Code, API Webhook xử lý callback.
    * `Refund Logic`: Tính toán phần trăm hoàn tiền khi hủy lịch (100% / 70% / 0% theo biên thời gian).
    * `Voucher & Promotion`: Áp dụng mã giảm giá, kiểm tra hạn dùng và điều kiện đơn tối thiểu.
    * `Review & Notification`: Đánh giá 1-5 sao sân/HLV, in-app notification.
    * `AI Assistant`: Đặt sân bằng Chatbot Gemini AI, xử lý tự động fallback khi cổng API FastAPI mất kết nối.
* **Sản phẩm bàn giao:** Tệp `FEATURE_MATRIX.md` ánh xạ chi tiết 11 module chức năng với URL API, UI Components và danh sách test cases dự kiến.

#### 2. Lời thoại gợi ý thuyết trình:
> *"Trong tuần đầu tiên, nhóm tập trung tìm hiểu toàn bộ hệ thống PCS. Sau khi phân tích mã nguồn và nghiệp vụ, nhóm xác định các chức năng quan trọng nhất cần kiểm thử, đặc biệt là đăng nhập, đặt sân, thanh toán và hoàn tiền. Kết quả của tuần này là Feature Report và Feature Matrix, làm cơ sở cho toàn bộ hoạt động kiểm thử tiếp theo."*

---

### Slide 3: Tuần 2 – Thiết lập Kế hoạch Kiểm thử (Test Plan)
#### 1. Nội dung hiển thị trên Slide:
* **Quy chuẩn lập kế hoạch:** Biên soạn Test Plan theo chuẩn quốc tế **ISTQB v4.0** chi tiết trong tệp `TEST_PLAN.md`.
* **Cấu trúc chi tiết và nội dung của Kế hoạch kiểm thử (`TEST_PLAN.md`):**
  * *Mục 1. Giới thiệu (Introduction):* Mục đích tài liệu và tổng quan dự án PCS (Hệ thống đặt sân/HLV, ghép cặp, chatbot AI).
  * *Mục 2. Phạm vi kiểm thử (Scope):*
    * **Trong phạm vi (In Scope):** Unit Test cho logic, API Integration Test cho các routes `/api/*`, UI Component Test cho Login/Register.
    * **Ngoài phạm vi (Out of Scope):** Load/Stress test quy mô lớn, bảo mật hạ tầng mạng, giao dịch thật với ngân hàng.
  * *Mục 3. Chiến lược kiểm thử (Strategy):* Định nghĩa 3 cấp độ test và các kỹ thuật hộp đen (EP, BVA, Decision Table, Use Case Testing) & hộp trắng (Statement/Branch Coverage).
  * *Mục 4. Tiêu chí Đạt/Không đạt (Pass/Fail Criteria):* Tiêu chí từng test case (actual = expected) và tiêu chí release dự án (Pass Rate 100%, Coverage >90% Statement / >85% Branch, không còn bug High/Critical mở).
  * *Mục 5. Sản phẩm kiểm thử bàn giao (Deliverables):* Liệt kê các tài liệu QA (Test Plan, Feature Matrix, Unit Test Report, Defect Report, TSR).
  * *Mục 6. Môi trường kiểm thử (Environmental Needs):* Cấu hình Node.js, JSDOM, Vitest và Mock Database.
  * *Mục 7. Phân công & Rủi ro (Staffing & Risks):* Trách nhiệm của 5 thành viên (PM, QA Leader, Tester 1/2, Dev 1/2) và phương án xử lý rủi ro.

#### 2. Lời thoại gợi ý thuyết trình:
> *"Tuần 2, nhóm xây dựng Test Plan theo định hướng ISTQB. Nhóm xác định rõ phạm vi, phương pháp, môi trường, nhân sự và tiêu chí nghiệm thu. Điều kiện quan trọng nhất là các test phải chạy thành công, độ bao phủ mã nguồn đạt mục tiêu và không còn lỗi nghiêm trọng chưa xử lý."*

---

### Slide 4: Tuần 3 – Thiết kế Ca kiểm thử (Test Case Design)
#### 1. Nội dung hiển thị trên Slide:
* **Phương pháp thiết kế:** Áp dụng EP, BVA, Decision Table và Use Case Testing.
* **Cấu trúc & Kịch bản thiết kế Bảng quyết định (`DECISION_TABLE_TEST_REPORT.md`):**
  * *Mục 1-2. Đối tượng & Quy tắc:* Chọn Form Đăng ký tài khoản UI. Ràng buộc trường dữ liệu: Email hợp lệ/chưa đăng ký; SĐT 10 chữ số/chưa tồn tại; Mật khẩu mạnh >= 8 ký tự (chữ hoa/thường/số/đặc biệt).
  * *Mục 3. Bảng quyết định:* Ma trận 3 điều kiện (C1, C2, C3) và 4 hành động (A1-A4) tạo nên **8 quy tắc nghiệp vụ rẽ nhánh** (`R1` đến `R8`).
  * *Mục 4. Thiết kế Test Cases:* Đặc tả 8 ca test `TC_DT_01` đến `TC_DT_08` tương ứng với 8 quy tắc, ghi rõ Input, Expected Outcome.
  * *Mục 5-6. Trạng thái & Kết luận:* Chạy Passed 100% qua kịch bản tự động hóa Auth.
* **Cấu trúc & Kịch bản thiết kế Use Case (`USE_CASE_TEST_REPORT.md`):**
  * *Mục 1-2. Đặc tả Use Case:* Chọn Use Case đặt sân & thanh toán `UC-04`. Đặc tả: Actor chính (Player), Tiền điều kiện (đã đăng nhập, slot sân trống), Hậu điều kiện (đơn chuyển Paid, khóa slot). Đặc tả chi tiết:
    * *Luồng cơ bản (Basic Flow):* Chọn sân trống ➔ Tạo booking ➔ Quét QR PayOS hợp lệ ➔ Đơn chuyển sang `Paid`.
    * *Luồng rẽ nhánh (Alternative Flow):* Đặt trùng slot giờ chơi (Overlap) hoặc đặt sân vượt hạn mức 3 booking/ngày.
    * *Luồng ngoại lệ (Exception Flow):* Hủy thanh toán giữa chừng hoặc giữ chỗ quá 10 phút không thanh toán ➔ Hủy đơn, giải phóng slot.
  * *Mục 3-5. Thiết kế & Kết quả:* Đặc tả 4 ca test `TC_UC_01` đến `TC_UC_04` tương ứng với các luồng, kết quả Pass 100%, kèm ma trận truy vết RTM.

#### 2. Lời thoại gợi ý thuyết trình:
> *"Trong tuần 3, nhóm chuyển các yêu cầu nghiệp vụ thành test case cụ thể. Với form đăng ký, nhóm dùng bảng quyết định để bao phủ tám tổ hợp của email, số điện thoại và mật khẩu. Với chức năng đặt sân, nhóm kiểm thử cả luồng chính và các luồng ngoại lệ như trùng lịch, vượt giới hạn và hết thời gian giữ chỗ."*

---

### Slide 5: Tuần 4 – Chuẩn bị Dữ liệu Kiểm thử (Test Data Management)
#### 1. Nội dung hiển thị trên Slide:
* **Chiến lược dữ liệu:** Tập trung hóa dữ liệu trong file `tests/data/testData.ts`.
* **Cấu trúc dữ liệu mock thực tế (Typescript):**
  ```typescript
  // Mock User Data
  export const mockUser = { id: "user_01", email: "player@gmail.com", role: "Player" };
  // Mock Court Data
  export const mockCourt = { id: "court_01", name: "Sân Pickleball A", maxCapacity: 4 };
  // Mock Booking Data (Boundary test case)
  export const mockBooking = {
    userId: "user_01",
    courtId: "court_01",
    bookingDate: "2026-07-25",
    timeSlots: [{ startTime: "08:00", endTime: "09:00" }]
  };
  ```
* **Kỹ thuật mock biệt lập cơ sở dữ liệu:**
  * Giả lập các hàm tương tác database bằng Vitest mocks:
    ```typescript
    vi.mock("../repositories/bookingRepository", () => ({
      createBooking: vi.fn().mockResolvedValue({ id: "b_01", status: "Pending" }),
      getUserDailyBookingsCount: vi.fn().mockResolvedValue(2) // Thiết lập sát biên 3 đơn hàng
    }));
    ```
  * Dọn dẹp trạng thái mock sau mỗi test case:
    ```typescript
    afterEach(() => {
      vi.clearAllMocks();
    });
    ```

#### 2. Lời thoại gợi ý thuyết trình:
> *"Tuần 4, nhóm chuẩn bị dữ liệu kiểm thử có tổ chức. Ngoài dữ liệu hợp lệ, nhóm còn tạo dữ liệu không hợp lệ và dữ liệu biên. Ví dụ, kiểm thử đơn đặt thứ ba và thứ tư trong ngày, hoặc thời gian hoàn tiền tại đúng biên 2 giờ và 12 giờ. Dữ liệu mock giúp bộ test chạy độc lập, ổn định và không làm thay đổi cơ sở dữ liệu thật."*

---

### Slide 6: Tuần 5 – Kiểm thử tích hợp API bằng Postman
#### 1. Nội dung hiển thị trên Slide:
* **Môi trường & Bộ sưu tập:** Thiết lập Postman Collection (`PCS.postman_collection.json`) và Environment.
* **Cấu hình trích xuất Token JWT tự động (Tab Tests của API Login):**
  ```javascript
  // Lấy dữ liệu JSON phản hồi
  const responseData = pm.response.json();
  // Lưu token vào biến môi trường Postman
  if (responseData.token) {
      pm.environment.set("jwt_token", responseData.token);
  }
  ```
* **6 API Routes chính được thực thi kiểm thử:**
  1. Đăng ký tài khoản (`POST /api/auth/register`): Trả về code 201 Created.
  2. Đăng nhập JWT (`POST /api/auth/login`): Trả về token và thông tin user.
  3. Lấy thông tin sân trống (`GET /api/courts?date=2026-07-25`): Danh sách slot trống.
  4. Tạo hóa đơn đặt sân (`POST /api/bookings`): Trả về link thanh toán PayOS.
  5. API Webhook PayOS (`POST /api/payment/webhook`): Mô phỏng callback an toàn.
  6. Áp dụng Voucher khuyến mãi (`POST /api/promotions/validate`).
* **Assertions kiểm chứng:** `pm.test` xác nhận HTTP Status Code 200/201, thời gian response < 500ms, cấu trúc dữ liệu JSON trả về đầy đủ định dạng.

#### 2. Lời thoại gợi ý thuyết trình:
> *"Tuần 5, nhóm kiểm thử API bằng Postman. Token JWT được tự động lưu vào biến môi trường và sử dụng cho các request tiếp theo. Mỗi request đều có script kiểm tra mã trạng thái và nội dung JSON. Sáu API tích hợp cốt lõi đều đạt kết quả Passed."*

---

### Slide 7: Tuần 6 – Kiểm thử đơn vị (Unit Test)
#### 1. Nội dung hiển thị trên Slide:
* **Framework:** Sử dụng **Vitest** làm lõi chạy kiểm thử đơn vị tốc độ cao.
* **Cấu trúc Báo cáo Unit Test (`UNIT_TEST_REPORT.md`):**
  * *Mục 1-2. Introduction & Environment:* Định nghĩa mục đích Unit Test (đảm bảo tính độc lập của logic nghiệp vụ, an toàn khi refactor code) và cấu hình môi trường Vitest.
  * *Mục 3. Kết quả thực thi (Execution Summary):* Tổng cộng **41 ca test Passed (100% Passed)** cho 11 nhóm nghiệp vụ logic.
  * *Mục 4. Thiết kế logic & Kỹ thuật EP/BVA áp dụng:*
    * **Hoàn tiền (`calculateRefundAmount`):** Hủy lịch trước >=12h hoàn 100% (test biên `12.01h` & `11.99h`); từ 2h-12h hoàn 70% (test biên `2.01h` & `1.99h`); dưới 2h hoàn 0% (test biên `1.5h`).
    * **Khuyến mãi (`validatePromotion`):** Kiểm tra điều kiện voucher hết hạn (`Voucher expired`) hoặc đơn hàng không đạt giá trị tối thiểu (`Minimum spend not met`).
    * **So khớp (`Player Matching`):** So sánh chênh lệch trình độ (Skill gap) của 2 người chơi (Ngưỡng chênh lệch <= 1.0).
    * **AI Chatbot Fallback:** Xử lý tự động fallback khi cổng API FastAPI mất kết nối.
  * *Mục 5. Đặc tả kịch bản:* Mô tả chi tiết 41 ca test (Input, Action, Expected, Actual).
  * *Mục 6-8. Coverage & Nghiệm thu:* Độ phủ, kiểm thử hồi quy và chữ ký phê duyệt.

#### 2. Lời thoại gợi ý thuyết trình:
> *"Tuần 6, nhóm kiểm thử trực tiếp các hàm nghiệp vụ bằng Vitest. Một ví dụ quan trọng là hàm hoàn tiền: hủy trước ít nhất 12 giờ được hoàn 100%, từ 2 đến dưới 12 giờ hoàn 70%, còn dưới 2 giờ không hoàn tiền. Tổng cộng 41 unit test đều chạy thành công."*

---

### Slide 8: Tuần 7 – Tích hợp Automation Test & Đo lường Coverage
#### 1. Nội dung hiển thị trên Slide:
* **Vitest Workspace (`vitest.workspace.ts`):**
  ```typescript
  import { defineWorkspace } from "vitest/config";
  export default defineWorkspace([
    {
      extends: "./vite.config.ts",
      test: {
        name: "backend-api",
        environment: "node", // Chạy test API/Unit
        include: ["tests/unit/**/*.test.ts", "tests/api/**/*.test.ts"]
      }
    },
    {
      test: {
        name: "frontend-ui",
        environment: "jsdom", // Giả lập DOM cho React components
        include: ["frontend/tests/ui/**/*.test.tsx"]
      }
    }
  ]);
  ```
* **Kết quả đo Code Coverage (Istanbul v8):**
  * **Statements (Câu lệnh):** **92.50%**
  * **Branches (Nhánh rẽ):** **88.75%**
  * **Functions (Hàm):** **95.00%**
  * **Lines (Dòng code):** **92.50%**
* **Thông số thực thi tổng thể:** Chạy 53 test cases thành công chỉ trong **3.28 giây** (Local CPU).

#### 2. Lời thoại gợi ý thuyết trình:
> *"Tuần 7, nhóm tích hợp các cấp độ kiểm thử thành một bộ automation hoàn chỉnh. Hệ thống tự động chạy 53 test case, xuất kết quả và báo cáo coverage. Kết quả đạt 100% Passed, statement coverage đạt 92,5% và branch coverage đạt 88,75%, đều vượt mục tiêu trong Test Plan."*

---

### Slide 9: Tuần 8 – Quy trình Quản lý lỗi (Defect Management)
#### 1. Nội dung hiển thị trên Slide:
* **Quy trình defect nghiêm ngặt:** `New` ➔ `Assigned` ➔ `In Progress` ➔ `Fixed` ➔ `Retest` ➔ `Closed`.
* **Thông tin chi tiết 2 Defect lớn phát hiện và đóng:**
  * **DF_PAY_01 - Lỗi múi giờ hoàn tiền (Mức độ: High Severity):**
    * *Mô tả lỗi:* Chạy test trên môi trường GitHub Actions tự động bị lỗi tính toán thời gian hoàn tiền (hủy trước 12h nhưng chỉ được hoàn 70%).
    * *Nguyên nhân gốc:* Hệ điều hành Ubuntu trên GitHub Actions chạy múi giờ chuẩn UTC+0, lệch múi giờ UTC+7 của Việt Nam, làm sai lệch mốc 12 giờ và 2 giờ.
    * *Phương án sửa đổi:* Chuyển đổi định dạng thời gian trong test data sang múi giờ động theo giờ máy chủ và cộng thêm chênh lệch múi giờ địa phương Việt Nam.
  * **DF_PAY_02 - Lỗi Mock Response PayOS (Mức độ: Medium Severity):**
    * *Mô tả lỗi:* Webhook API phản hồi lỗi 400 và không cập nhật trạng thái đặt sân sang `Paid`.
    * *Nguyên nhân gốc:* Mô phỏng JSON payload gửi từ PayOS bị thiếu thuộc tính `success: true`.
    * *Phương án sửa đổi:* Cập nhật cấu trúc test data mock response của PayOS đầy đủ trường dữ liệu.
* **Kết quả:** **100% Bugs được sửa đổi và đóng trạng thái Closed**, 0 lỗi Open.

#### 2. Lời thoại gợi ý thuyết trình:
> *"Trong tuần 8, nhóm tập trung quản lý lỗi. Hai lỗi được phát hiện đều thuộc module Payment và Refund. Lỗi thứ nhất làm sai kết quả hoàn tiền do lệch múi giờ. Lỗi thứ hai khiến trạng thái thanh toán không cập nhật đúng vì mock response thiếu trường success. Sau khi sửa, nhóm retest và chạy regression; hiện không còn lỗi nào đang mở."*

---

### Slide 10: Tuần 9 – Báo cáo Tổng kết & QA Dashboard Portal
#### 1. Nội dung hiển thị trên Slide:
* **Requirement Traceability Matrix (Ma trận RTM):** Liên kết 11 Use Case nghiệp vụ với 53 test cases vật lý.
* **Cấu trúc Báo cáo tổng kết chất lượng (`TEST_SUMMARY_REPORT.md`):**
  * *Mục 1-2. Introduction & Project Overview:* Đánh giá chất lượng hệ thống tổng quan và cấu trúc công nghệ sử dụng.
  * *Mục 3. Testing Scope:* Đặc tả chi tiết 11 module nghiệp vụ đã được chạy qua kiểm thử.
  * *Mục 4. Test Metrics & Results:* Số ca test chạy (53 Passed, 0 Failed, thời gian chạy ~3.28s, Pass Rate = 100%).
  * *Mục 5. Code Coverage Summary (Istanbul v8):* Statements: 92.50%, Branches: 88.75%, Functions: 95.00%, Lines: 92.50% (Vượt chỉ tiêu rào cản).
  * *Mục 6. Defect Management:* 2/2 lỗi đã được đóng (Closed), không phát sinh lỗi hồi quy.
  * *Mục 7. Traceability Matrix:* Ma trận RTM ánh xạ yêu cầu và tệp test.
  * *Mục 8. Release Readiness Assessment:* Đánh giá hệ thống đủ điều kiện phát hành (Release Ready).
* **QA Dashboard Web Portal (React + Tailwind CSS, Port 8081):**
  * Gồm: *Test Overview* (KPI, Phân bổ test); *Test Execution Grid* (Lưới kết quả chi tiết); *Code Coverage* (Đồ thị hình tròn); *Defect Center* (Mô tả và bước tái hiện bug); *RTM Interface* (Bảng truy vết động).

#### 2. Lời thoại gợi ý thuyết trình:
> *"Tuần 9, nhóm tổng hợp toàn bộ kết quả vào Test Summary Report và QA Dashboard. Ma trận truy vết cho thấy mỗi yêu cầu đều được liên kết với test case tương ứng. Với 53 trên 53 test Passed, coverage vượt ngưỡng và toàn bộ defect đã đóng, nhóm đánh giá hệ thống đạt tiêu chí nghiệm thu trong phạm vi đã xác định."*

---

### Slide 11: Tuần 10 – Hoàn thiện và thuyết trình
#### 1. Nội dung hiển thị trên Slide:
* **Hoạt động đóng gói:** Biên soạn toàn bộ báo cáo chất lượng dự án và slide báo cáo.
* **Bài học kinh nghiệm từ dự án (Lessons Learned):**
  * *Lập kế hoạch:* Biết cách phân tích nghiệp vụ và lập Test Plan chuẩn chỉnh theo định hướng ISTQB.
  * *Thiết kế test:* Áp dụng thực tế các phương pháp thiết kế hộp đen (EP, BVA, Decision Table, Use Case) và đo đạc độ bao phủ hộp trắng (Istanbul).
  * *Kỹ năng kỹ thuật:* Thành thạo việc cấu hình Vitest Workspace, viết Mock Database logic và chạy CI/CD tự động.
  * *Hợp tác cùng AI:* AI (ChatGPT, Gemini) là trợ thủ đắc lực giúp sinh dữ liệu giả và code khung nhanh chóng, nhưng bắt buộc người kiểm thử phải rà soát chặt chẽ vì AI thường cung cấp mã nguồn lỗi thời hoặc thiếu tính đồng bộ múi giờ.
* **Kế hoạch phát triển tiếp theo:** Tích hợp kiểm thử hiệu năng tự động bằng công cụ **K6** và kiểm thử End-to-End (E2E) UI bằng **Playwright** vào luồng CI/CD.

#### 2. Lời thoại gợi ý thuyết trình:
> *"Ở tuần cuối, nhóm hoàn thiện tài liệu, slide và chuẩn bị demo. Qua dự án, nhóm không chỉ biết viết test mà còn thực hiện được một quy trình QA tương đối đầy đủ: từ phân tích yêu cầu, lập kế hoạch, thiết kế dữ liệu, tự động hóa, quản lý lỗi đến đánh giá chất lượng. Nhóm cũng nhận thấy AI giúp tiết kiệm thời gian, nhưng mọi nội dung do AI sinh ra đều cần được kiểm tra bằng tài liệu và kết quả chạy thực tế."*

---

### Slide 12: Quy trình thực hiện Demo kiểm thử tại lớp
#### 1. Nội dung hiển thị trên Slide:
* **Quy trình chạy Demo thực tế tại lớp (Step-by-Step CLI Guide):**
  * **Bước 1: Chạy 53 ca test tự động**
    ```bash
    npm run test
    ```
  * **Bước 2: Đo lường độ bao phủ mã nguồn và sinh HTML Report**
    ```bash
    npm run test:coverage
    ```
  * **Bước 3: Biên dịch kết quả kiểm thử sang định dạng JSON cho Dashboard**
    ```bash
    npm run test:dashboard
    ```
  * **Bước 4: Khởi chạy Server QA Dashboard Web Portal (Cổng 8081)**
    ```bash
    node scripts/serve-dashboard.js
    ```
* **Đường dẫn kiểm chứng chất lượng (Trình duyệt):**
  * *Mở Báo cáo HTML Coverage:* Đọc file tĩnh [coverage/index.html](file:///c:/Users/Lenovo%20LEGION%205/OneDrive/Desktop/SWT_TESTING/pickleball-booking-system-main/coverage/index.html).
  * *Mở QA Dashboard Portal:* Truy cập địa chỉ [http://localhost:8081](http://localhost:8081).

#### 2. Lời thoại gợi ý thuyết trình:
> *"Để minh chứng cho chất lượng chạy thực tế, phần demo của nhóm sẽ được thực hiện qua các bước lệnh trên terminal: đầu tiên chạy bộ test tự động bằng npm run test, tiếp theo đo độ bao phủ code bằng npm run test:coverage, sau đó biên dịch dữ liệu bằng test:dashboard và cuối cùng chạy serve-dashboard. Chúng em sẽ mở trực tiếp báo cáo HTML Coverage của Istanbul cùng trang QA Dashboard trên cổng 8081 để trình bày."*

---

### Slide 13: Kết luận & Bàn giao dự án
#### 1. Nội dung hiển thị trên Slide:
* **Các chỉ số KPI chất lượng bàn giao cuối cùng:**
  * **Tỷ lệ vượt qua kiểm thử tự động:** **100% Passed** (53/53 test cases thành công).
  * **Độ bao phủ câu lệnh (Statement Coverage):** **92.50%** (Đạt chỉ tiêu >90% trong Test Plan).
  * **Độ bao phủ nhánh rẽ (Branch Coverage):** **88.75%** (Đạt chỉ tiêu >85% trong Test Plan).
  * **Tổng số lỗi phát hiện:** 2 lỗi (Đã sửa lỗi và đóng trạng thái **Closed 100%**).
* **Danh sách tệp tài liệu bàn giao đính kèm trong thư mục gốc:**
  * [Tài liệu Kế hoạch kiểm thử (Test Plan)](file:///c:/Users/Lenovo%20LEGION%205/OneDrive/Desktop/SWT_TESTING/pickleball-booking-system-main/TEST_PLAN.md)
  * [Báo cáo kiểm thử Bảng quyết định (Decision Table)](file:///c:/Users/Lenovo%20LEGION%205/OneDrive/Desktop/SWT_TESTING/pickleball-booking-system-main/DECISION_TABLE_TEST_REPORT.md)
  * [Báo cáo kiểm thử Kịch bản Use Case](file:///c:/Users/Lenovo%20LEGION%205/OneDrive/Desktop/SWT_TESTING/pickleball-booking-system-main/USE_CASE_TEST_REPORT.md)
  * [Báo cáo thiết kế Dữ liệu mẫu (Test Data)](file:///c:/Users/Lenovo%20LEGION%205/OneDrive/Desktop/SWT_TESTING/pickleball-booking-system-main/tests/data/testData.ts)
  * [Báo cáo kiểm thử đơn vị (Unit Test)](file:///c:/Users/Lenovo%20LEGION%205/OneDrive/Desktop/SWT_TESTING/pickleball-booking-system-main/UNIT_TEST_REPORT.md)
  * [Báo cáo quản lý lỗi (Defect Report)](file:///c:/Users/Lenovo%20LEGION%205/OneDrive/Desktop/SWT_TESTING/pickleball-booking-system-main/DEFECT_REPORT.md)
  * [Báo cáo tổng kết chất lượng (Test Summary)](file:///c:/Users/Lenovo%20LEGION%205/OneDrive/Desktop/SWT_TESTING/pickleball-booking-system-main/TEST_SUMMARY_REPORT.md)
* **Thông điệp kết thúc:** Cảm ơn giảng viên và các bạn học sinh đã lắng nghe bài thuyết trình của nhóm 3!

#### 2. Lời thoại gợi ý thuyết trình:
> *"Sau 10 tuần, nhóm đã hoàn thành 53 test case tự động với tỷ lệ Passed 100%, statement coverage đạt 92,5%, phát hiện và đóng hai lỗi, đồng thời xây dựng đầy đủ Test Plan, Test Data, Postman Collection, Defect Report, Traceability Matrix và Test Summary Report. Nhóm em xin cảm ơn giảng viên và các bạn đã lắng nghe."*

---
*END OF SLIDES OUTLINE*
