import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard & Management Flow', () => {
  
  test.beforeEach(async ({ page }) => {
    // 1. Đăng nhập bắt buộc bằng tài khoản ADMIN
    await page.goto('/login');
    await page.getByPlaceholder('Email').fill('admin.test@pcs.com');
    await page.getByPlaceholder('Mật khẩu').fill('Admin123!');
    await page.getByRole('button', { name: 'LOGIN' }).click();
    
    // Đảm bảo đăng nhập thành công
    await expect(page).not.toHaveURL(/.*login/);
  });

  test('should allow admin to access Reports and Statistics page', async ({ page }) => {
    // 1. Chuyển hướng đến trang Admin Dashboard hoặc Reports
    // Bạn hãy chỉnh sửa URL này cho đúng với đường dẫn trang Admin của hệ thống
    await page.goto('/admin');

    // 2. Kiểm định: Menu Quản trị viên (Admin) hoặc Báo cáo phải xuất hiện
    await expect(page.getByRole('heading', { name: 'Dashboard', exact: false }).or(page.getByText('Tổng quan', { exact: false }))).toBeVisible({ timeout: 10000 });

    // 3. Sử dụng Codegen để bấm vào tab "Reports" / "Thống kê"
    // await page.getByRole('link', { name: 'Reports' }).click();
    // await expect(page).toHaveURL(/.*reports/);
  });
  
  // LƯU Ý DÀNH CHO THÀNH VIÊN LÀM PHẦN ADMIN:
  // Dưới đây là bài test Bảo mật (Security). Để bài test này Pass, bạn phải thay bằng 
  // một tài khoản CỦA KHÁCH HÀNG (Customer). Vì lúc nãy tôi điền tạm tài khoản Admin vào đây
  // nên hệ thống cấp quyền cho vào trang /admin luôn, dẫn đến test bị Failed!
  //
  // test('should block unauthorized customer from accessing admin page', async ({ page }) => {
  //   await page.goto('/login');
  //   await page.getByPlaceholder('Email').fill('customer_that_cua_ban@example.com');
  //   await page.getByPlaceholder('Mật khẩu').fill('MatKhauKhachHang');
  //   await page.getByRole('button', { name: 'LOGIN' }).click();
  //   await expect(page).not.toHaveURL(/.*login/);
  //
  //   // Cố tình truy cập trang Admin
  //   await page.goto('/admin');
  //
  //   // Kiểm định: Hệ thống phải báo lỗi Không có quyền hoặc đẩy về trang chủ
  //   await expect(page).not.toHaveURL(/.*admin/);
  // });
});
