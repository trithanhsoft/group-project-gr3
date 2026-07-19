# Nhật Ký Prompt (Prompt Log) - Dự Án PCS

Tài liệu này ghi lại các câu lệnh (prompts) tiêu biểu được sử dụng trong suốt 10 tuần phát triển và kiểm thử dự án **PCS (Pickleball Court & Coach Booking System)**.

---

## Prompt 1: Thiết kế Cơ sở dữ liệu (Tuần 2)

* **Ngày:** 09/10/2023
* **Thành viên:** Nguyễn Đào Văn Quý
* **Công cụ AI:** ChatGPT
* **Mục đích:** Sinh câu lệnh SQL Server tạo các bảng quản lý Sân chơi (`Courts`) và Đặt lịch chơi (`Bookings`) có quan hệ khóa ngoại.

### Prompt đã dùng
```text
Hãy viết câu lệnh SQL Server (T-SQL) tạo 2 bảng:
1. Bảng Courts (CourtID khóa chính tự tăng, CourtName, Location, PricePerHour, OpenTime, CloseTime, Status).
2. Bảng Bookings (BookingID khóa chính tự tăng, CourtID khóa ngoại, UserID, BookingDate dạng date, StartTime dạng time, EndTime dạng time, TotalPrice, Status mặc định là 'PendingPayment').
Thiết lập các ràng buộc khóa ngoại và kiểm tra xem thời gian đóng cửa phải sau thời gian mở cửa.
```

### Cách nhóm sử dụng kết quả
* Nhóm đã copy cấu hình bảng và tích hợp vào script khởi tạo DB.
* Sửa đổi: Đổi kiểu dữ liệu của `StartTime` và `EndTime` thành kiểu chuỗi định dạng `HH:mm` (như `"08:00"`) trong mã nguồn JavaScript/TypeScript để dễ tính toán ranh giới slot hơn là dùng kiểu `time` thuần túy của SQL Server.

---

## Prompt 2: Thuật toán kiểm tra trùng slot giờ chơi (Tuần 4)

* **Ngày:** 23/10/2023
* **Thành viên:** Nguyễn Đào Văn Quý
* **Công cụ AI:** GitHub Copilot
* **Mục đích:** Viết hàm TypeScript kiểm tra xem một slot đặt sân mới có bị chồng lấn (overlap) với các slot đã được đặt và thanh toán thành công trong database hay không.

### Prompt đã dùng
```typescript
// Hàm check xem booking mới có bị trùng slot với các booking đã tồn tại hay không.
// Các tham số: newStart (string "HH:mm"), newEnd (string "HH:mm"), existingBookings (mảng chứa các booking hiện tại có StartTime và EndTime).
// Trả về true nếu trùng (overlap), false nếu không trùng.
export function checkOverlap(newStart: string, newEnd: string, existingBookings: any[]): boolean {
```

### Cách nhóm sử dụng kết quả
* Copilot sinh ra logic so sánh chuỗi: `newStart < booking.EndTime && newEnd > booking.StartTime`.
* Nhóm đã tích hợp logic này vào `bookings.service.ts` để kiểm duyệt tính hợp lệ của slot trước khi lưu vào DB.
* Kiểm chứng: Viết unit test trong `booking.test.ts` để mô phỏng 2 slot trùng khít, 1 slot gối đầu (ví dụ: 8-9h và 9-10h - trường hợp này không trùng), và 1 slot bị bao bọc hoàn toàn.

---

## Prompt 3: Sinh Unit Test cho quy tắc hoàn tiền (Tuần 7)

* **Ngày:** 13/11/2023
* **Thành viên:** Trương Quang Tuân
* **Công cụ AI:** ChatGPT
* **Mục đích:** Tạo bộ kiểm thử đơn vị bằng Vitest cho hàm tính toán tỷ lệ hoàn tiền `calculateRefundAmount()` áp dụng Phân vùng tương đương (EP) và Phân tích giá trị biên (BVA).

### Prompt đã dùng
```text
Hãy viết unit test bằng Vitest cho hàm calculateRefundAmount(dateStr, timeStr, amount). Quy tắc:
1. Hủy trước giờ chơi >= 12h: Hoàn tiền 100% (Phí hủy 0%).
2. Hủy trước giờ chơi từ 2h đến 12h: Hoàn tiền 70% (Phí hủy 30%).
3. Hủy trước giờ chơi < 2h: Hoàn tiền 0% (Phí hủy 100%).
Thiết kế các test cases đi qua các biên (12h, 2h) và các phân vùng tương đương. Sử dụng thư viện vi.mock hoặc mock Date.now() để ổn định thời gian chạy test.
```

### Cách nhóm sử dụng kết quả
* Trích xuất các test case chạy các mốc giờ ảo (hủy trước 15h, hủy trước 5h, hủy trước 1h).
* Chỉnh sửa: Thay đổi cách mock thời gian. Thay vì dùng `vi.setSystemTime`, nhóm đã viết một hàm helper `getFutureStrings(hoursAhead)` để cộng trực tiếp số giờ tương lai vào thời gian hiện tại của máy chạy test, giúp test chạy ổn định trên mọi máy chủ CI/CD mà không bị ảnh hưởng bởi múi giờ hệ điều hành.

---

## Prompt 4: Viết script tổng hợp dữ liệu Test Dashboard (Tuần 10)

* **Ngày:** 06/12/2023
* **Thành viên:** Lê Thị Văn Anh
* **Công cụ AI:** ChatGPT
* **Mục đích:** Viết một script Node.js bằng TypeScript để đọc file XML kết quả coverage sinh ra bởi Istanbul, trích xuất dữ liệu phần trăm và ghi đè sang file JSON phục vụ Test Dashboard.

### Prompt đã dùng
```text
Tôi có một file XML coverage của Istanbul sinh ra tại đường dẫn './coverage/clover.xml'. 
Hãy viết một script bằng Node.js và TypeScript đọc file XML này, parse các thuộc tính metrics (statements, branches, functions, lines) trong tag <project>, sau đó ghi các chỉ số phần trăm này vào file './test-dashboard/dashboard-data.json'.
Sử dụng thư viện 'xml2js' hoặc dùng biểu thức chính quy (Regex) để parse nhanh mà không cần cài thêm nhiều thư viện.
```

### Cách nhóm sử dụng kết quả
* ChatGPT đã sinh code sử dụng module `fs` và biểu thức chính quy (Regex) để trích xuất nhanh các chỉ số từ XML.
* Chỉnh sửa: Nhóm đã đổi sang sử dụng thư viện `xml2js` để đảm bảo tính an toàn dữ liệu khi cấu trúc XML thay đổi và tích hợp thêm phần đọc kết quả file JSON từ Vitest (`test-results.json`) để tổng hợp số lượng Test case passed/failed.
* Tích hợp: Tạo script `generate-dashboard-data.ts` chạy tự động khi thực hiện lệnh `npm run report`.
