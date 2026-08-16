import { test, expect } from '@playwright/test';

test.describe('Purdue IEEE Core Flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
  });

  test('should load the homepage and show core sections', async ({ page }) => {
    await expect(page).toHaveTitle(/Purdue IEEE/);
    
    // Check navigation
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
    
    // Check Hero section (heading with level 1 or main text)
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible({ timeout: 10000 });
  });

  test('should navigate to committees page and back', async ({ page }) => {
    // Click Committees link in nav
    await page.getByRole('link', { name: /Committees/i }).first().click();
    
    // Check URL
    await expect(page).toHaveURL(/\/committees/);
    
    // Check heading
    await expect(page.getByRole('heading', { name: /Our Committees/i })).toBeVisible();
    
    // Check if at least one committee card is present
    const cards = page.locator('.glass-card');
    await expect(cards.first()).toBeVisible();
    
    // Go to a specific committee page to test navigation
    await page.getByRole('link', { name: /Explore Committee/i }).first().click();
    await expect(page).toHaveURL(/\/committee\//);
  });

  test('should toggle theme', async ({ page }) => {
    const html = page.locator('html');
    const initialClass = await html.getAttribute('class') || '';
    
    // Find the theme toggle button in header
    const toggle = page.getByRole('button', { name: /Switch to (light|dark) mode/i }).or(page.locator('button[aria-label*="mode" i]'));
    if (await toggle.count() > 0) {
      await toggle.first().click();
      await page.waitForTimeout(500);
      const newClass = await html.getAttribute('class') || '';
      expect(newClass).not.toBe(initialClass);
    }
  });

  test('should load a specific committee page', async ({ page }) => {
    await page.goto('/committees');
    await page.getByRole('link', { name: /Explore Committee/i }).first().click();
    await expect(page).toHaveURL(/\/committee\//);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});
