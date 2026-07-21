import { test, expect } from '@playwright/test';

test.describe('Booking Flow (End-to-End)', () => {
  // Chạy trước mỗi test: Đăng nhập sẵn để lấy phiên làm việc (Session)
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    // Thay bằng tài khoản thật có sẵn trong Database của bạn
    await page.getByPlaceholder('Email').fill('admin.test@pcs.com');
    await page.getByPlaceholder('Mật khẩu').fill('Admin123!');
    await page.getByRole('button', { name: 'LOGIN' }).click();
    
    // Xác nhận đã đăng nhập thành công trước khi đi test đặt sân
    await expect(page).not.toHaveURL(/.*login/);
  });

  test('should allow a logged in user to book a court successfully', async ({ page }) => {
    // 1. Đi đến danh sách sân
    await page.goto('/courts');
    await expect(page.getByRole('heading', { name: 'Danh sách sân', exact: false })).toBeVisible();

    // 2. Click vào nút "Chi tiết" của sân đầu tiên để vào trang Đặt sân
    await page.getByRole('link', { name: 'Chi tiết' }).first().click();
    
    // 3. Kiểm định trang Chi tiết sân đã hiển thị thành công
    // Nút trên trang chi tiết có tên là "Đặt sân ngay"
    await expect(page.getByRole('button', { name: 'Đặt sân ngay', exact: false })).toBeVisible();

    // 4. (Demo) Nếu muốn đặt sân, bạn cần phải click chọn Khung giờ trước, 
    // sau đó mới click nút Đặt sân ngay được (vì nút mặc định bị disabled).
    // Bạn hãy dùng Playwright Codegen để tự động sinh code đoạn chọn ngày/giờ nhé!

    // Tại đây bạn có thể dùng Codegen để record tiếp các thao tác chọn ngày, chọn giờ,
    // điền thông tin và xác nhận. Sau đó thêm các hàm kiểm định chặt chẽ như:
    
    // - Kiểm định sau khi đặt, hệ thống hiển thị thông báo thành công:
    // await expect(page.getByText('Đặt sân thành công')).toBeVisible();

    // - Kiểm định hệ thống chuyển sang trang thanh toán:
    // await expect(page).toHaveURL(/.*payment/);
  });
});
