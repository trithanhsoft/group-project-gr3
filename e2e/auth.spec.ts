import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should display login page correctly', async ({ page }) => {
    // 1. Điều hướng đến trang đăng nhập
    await page.goto('/login');

    // 2. Kiểm tra các phần tử trên trang
    await expect(page.getByRole('heading', { name: 'Đăng nhập' })).toBeVisible();
    await expect(page.getByPlaceholder('Email')).toBeVisible();
    await expect(page.getByPlaceholder('Mật khẩu')).toBeVisible();
    await expect(page.getByRole('button', { name: 'LOGIN' })).toBeVisible();
  });

  test('should show validation error for empty email', async ({ page }) => {
    await page.goto('/login');

    // Bỏ trống email, chỉ nhập password. 
    await page.getByPlaceholder('Mật khẩu').fill('password123');
    await page.getByRole('button', { name: 'LOGIN' }).click();

    // Kiểm định 1: Nút login vẫn hiển thị (chưa chuyển trang)
    await expect(page.getByRole('button', { name: 'LOGIN' })).toBeVisible();
    
    // Kiểm định 2: Thông báo lỗi chính xác
    await expect(page.getByText('Email không hợp lệ')).toBeVisible();
  });

  test('should login successfully with valid admin credentials', async ({ page }) => {
    await page.goto('/login');

    // Cung cấp thông tin đăng nhập hợp lệ (Dựa theo tài khoản admin của bạn)
    await page.getByPlaceholder('Email').fill('admin.test@pcs.com');
    await page.getByPlaceholder('Mật khẩu').fill('Admin123!');
    
    // Thực hiện Đăng nhập
    await page.getByRole('button', { name: 'LOGIN' }).click();

    // Kiểm định 1: Đảm bảo URL đã chuyển hướng khỏi trang login thành công
    await expect(page).not.toHaveURL(/.*login/);

    // Kiểm định 2: Chờ đợi và xác nhận trang Reports (hoặc trang dashboard) hiển thị
    // Chỉnh sửa đường dẫn URL hoặc Tên Element dưới đây cho khớp với logic phân quyền của bạn
    await expect(page.getByRole('link', { name: 'Reports' })).toBeVisible({ timeout: 10000 });
  });
});
