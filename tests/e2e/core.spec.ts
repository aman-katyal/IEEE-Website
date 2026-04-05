import { test, expect } from '@playwright/test';

test.describe('Purdue IEEE Core Flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the homepage and show core sections', async ({ page }) => {
    // Check title
    await expect(page).toHaveTitle(/Purdue IEEE/);
    
    // Check navigation
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
    
    // Check Hero section - using mission statement text
    await expect(page.getByRole('heading', { name: /Fostering technological innovation/i })).toBeVisible();
  });

  test('should navigate to committees page and back', async ({ page }) => {
    // Click Committees link in nav
    await page.getByRole('link', { name: /COMMITTEES/i }).first().click();
    
    // Check URL
    await expect(page).toHaveURL(/\/committees/);
    
    // Check heading
    await expect(page.getByRole('heading', { name: /Active Engineering Teams/i })).toBeVisible();
    
    // Check if at least one committee card is present
    const cards = page.locator('.glass-card');
    await expect(cards.first()).toBeVisible();
    
    // Go to a specific committee page to test the back link
    await page.getByRole('link', { name: /Learn More/i }).first().click();
    await expect(page).toHaveURL(/\/committee\//);

    // Click "Home / Committees" back link
    await page.getByRole('link', { name: /Home \/ Committees/i }).click();
    await expect(page).toHaveURL(/\/committees/);
  });

  test('should toggle theme', async ({ page }) => {
    // Check initial theme
    const html = page.locator('html');
    const initialClass = await html.getAttribute('class') || '';
    
    // Click theme toggle button (search for aria-label if possible, or icon)
    // The ThemeToggle component uses a button with an icon
    const toggle = page.getByRole('button').filter({ has: page.locator('svg.lucide-sun, svg.lucide-moon') });
    await toggle.click();
    
    // Wait for change
    await page.waitForTimeout(500);
    
    // Check if class changed
    const newClass = await html.getAttribute('class') || '';
    expect(newClass).not.toBe(initialClass);
  });

  test('should load a specific committee page', async ({ page }) => {
    // Navigate to committees
    await page.goto('/committees');
    
    // Click on a committee card
    await page.getByRole('link', { name: /Learn More/i }).first().click();
    
    // Check URL
    await expect(page).toHaveURL(/\/committee\//);
    
    // Check if any section eyebrow is visible
    await expect(page.locator('p.section-eyebrow').first()).toBeVisible();
  });
});
