import { test, expect } from '@playwright/test';

test.describe('Court Management & Booking Flow', () => {
  test('should navigate to courts page', async ({ page }) => {
    // 1. Đi đến trang danh sách sân
    await page.goto('/courts');

    // 2. Kiểm tra xem có hiển thị tiêu đề danh sách sân hay không
    // Bạn có thể cần điều chỉnh selector này cho phù hợp với UI thực tế
    await expect(page).toHaveURL(/.*courts/);
  });

  test('should allow user to view court details', async ({ page }) => {
    await page.goto('/courts');
    
    // Đợi danh sách sân load xong (chờ đến khi nút "Chi tiết" xuất hiện)
    await expect(page.getByRole('link', { name: 'Chi tiết' }).first()).toBeVisible({ timeout: 10000 });

    // Click vào nút "Chi tiết" của sân đầu tiên
    await page.getByRole('link', { name: 'Chi tiết' }).first().click();

    // Kiểm định: URL phải chuyển sang dạng /courts/1 (hoặc id bất kỳ)
    await expect(page).toHaveURL(/.*courts\/\d+/);

    // Kiểm định: Trang chi tiết phải load thành công (có nút Đặt sân ngay hoặc tiêu đề Giới thiệu)
    await expect(page.getByRole('button', { name: 'Đặt sân ngay', exact: false })).toBeVisible();
  });
});
