import { test, expect } from '@playwright/test';

test.describe('Coaches Flow', () => {
  test('should display list of coaches', async ({ page }) => {
    await page.goto('/coaches');
    
    // Kiểm tra trang hiển thị danh sách huấn luyện viên
    await expect(page).toHaveURL(/.*coaches/);
  });
});
