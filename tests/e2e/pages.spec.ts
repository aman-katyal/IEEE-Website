import { test, expect } from '@playwright/test';

test.describe('Purdue IEEE Page Verification', () => {
  test('should load and verify Join page', async ({ page }) => {
    await page.goto('/join');
    
    // Check heading
    await expect(page.getByRole('heading', { name: /Joining Purdue IEEE/i })).toBeVisible();
    
    // Check for dues options
    await expect(page.getByText(/Standard Membership/i)).toBeVisible();
    
    // Check for social/discord link
    const discordLink = page.locator('a[href*="discord.gg"]');
    await expect(discordLink.first()).toBeVisible();
    
    // Check for payment link
    const paymentLink = page.locator('a[href*="toocoolpurdue.com"]');
    await expect(paymentLink).toBeVisible();
  });

  test('should load and verify Calendar page', async ({ page }) => {
    await page.goto('/calendar');
    
    // Check heading
    await expect(page.getByRole('heading', { name: /Events Calendar/i })).toBeVisible();
    
    // Check for Google Calendar iframe (first iframe on page)
    const iframe = page.locator('iframe[src*="calendar.google.com"]').first();
    await expect(iframe).toBeVisible();
  });

  test('should load and verify Constitution page', async ({ page }) => {
    await page.goto('/constitution');
    
    // Check heading
    await expect(page.getByRole('heading', { name: /Constitution and Bylaws/i })).toBeVisible();
    
    // Check for Branch Constitution card
    await expect(page.getByRole('heading', { name: /Branch Constitution/i })).toBeVisible();
    
    // Check for Bylaws section
    await expect(page.getByRole('heading', { name: /Committee Bylaws/i })).toBeVisible();
  });

  test('should load and verify About page', async ({ page }) => {
    await page.goto('/about');
    
    // Check for section cards or headings
    await expect(page.getByRole('heading', { name: /Established 1903/i })).toBeVisible();
  });
});
