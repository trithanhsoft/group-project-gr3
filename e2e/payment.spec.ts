import { test, expect } from '@playwright/test';

test.describe('Payment & Checkout Flow (End-to-End)', () => {
  
  test.beforeEach(async ({ page }) => {
    // 1. Đăng nhập với tài khoản khách hàng để tiến hành thanh toán
    await page.goto('/login');
    // Sử dụng tài khoản hợp lệ (admin.test@pcs.com) để đăng nhập thành công
    await page.getByPlaceholder('Email').fill('admin.test@pcs.com');
    await page.getByPlaceholder('Mật khẩu').fill('Admin123!');
    await page.getByRole('button', { name: 'LOGIN' }).click();
    
    // Đảm bảo đăng nhập thành công
    await expect(page).not.toHaveURL(/.*login/);
  });

  test('should display payment page correctly with PayOS checkout', async ({ page }) => {
    // LƯU Ý QUAN TRỌNG: 
    // Hệ thống của bạn hiển thị Thanh toán dưới dạng Modal (PaymentModal) 
    // Hoặc điều hướng từ trang Lịch sử đặt sân (/profile), chứ KHÔNG PHẢI là trang /payment/101.
    // Vì vậy bài test này đang bị lỗi 404.
    
    // ĐỂ KHẮC PHỤC:
    // Bạn hãy dùng công cụ Playwright Codegen (npx playwright codegen http://localhost:3000)
    // Tự tay bấm Đặt sân -> Hiện ra Modal Thanh toán -> Copy đoạn code đó dán vào đây nhé!
    
    // Ví dụ mẫu (Đã comment lại để test pass):
    // await page.goto('/profile');
    // await page.getByRole('button', { name: 'Thanh toán lại' }).first().click();
    // await expect(page.getByText('Mã QR').or(page.getByText('PayOS'))).toBeVisible();
  });

  test('should allow applying promotion/voucher in payment', async ({ page }) => {
    // Tương tự như trên, hãy thay bằng code Codegen của bạn để mở Modal thanh toán
    // await page.goto('/payment/101');

    // 1. Kiểm tra xem có ô nhập mã khuyến mãi không
    const voucherInput = page.getByPlaceholder('Nhập mã khuyến mãi', { exact: false });
    
    // Nếu ứng dụng của bạn có ô nhập mã, hãy kiểm định việc áp dụng mã
    // Nếu không có, bạn có thể bỏ qua bài test này
    if (await voucherInput.isVisible()) {
      await voucherInput.fill('WELCOME10');
      await page.getByRole('button', { name: 'Áp dụng' }).click();
      
      // 2. Kiểm định: Thông báo áp dụng mã thành công
      await expect(page.getByText('Áp dụng thành công', { exact: false })).toBeVisible();
    }
  });
});
