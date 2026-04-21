import { test, expect } from '@playwright/test';

test.describe('Purdue IEEE Page Verification', () => {
  test('should load and verify Join page', async ({ page }) => {
    await page.goto('/join');
    
    // Check heading
    await expect(page.getByRole('heading', { name: /Become a Member/i })).toBeVisible();
    
    // Check for dues options
    await expect(page.getByText(/Standard Membership/i)).toBeVisible();
    await expect(page.getByText(/Membership \+ Shirt/i)).toBeVisible();
    
    // Check for social/discord link
    const discordLink = page.locator('a[href*="discord.gg"]');
    await expect(discordLink).toBeVisible();
    
    // Check for payment link
    const paymentLink = page.locator('a[href*="toocoolpurdue.com"]');
    await expect(paymentLink).toBeVisible();
  });

  test('should load and verify Calendar page', async ({ page }) => {
    await page.goto('/calendar');
    
    // Check heading
    await expect(page.getByRole('heading', { name: /Branch Calendar/i })).toBeVisible();
    
    // Check for Google Calendar iframe
    const iframe = page.locator('iframe[src*="calendar.google.com"]');
    await expect(iframe).toBeVisible();
    
    // Check for Subscribe button
    const subscribeBtn = page.getByRole('link', { name: /Subscribe to Calendar/i });
    await expect(subscribeBtn).toBeVisible();
  });

  test('should load and verify Constitution page', async ({ page }) => {
    await page.goto('/constitution');
    
    // Check heading
    await expect(page.getByRole('heading', { name: /Governance & Documents/i })).toBeVisible();
    
    // Check for Constitution download link
    const constitutionLink = page.getByRole('link', { name: /Download Constitution/i });
    await expect(constitutionLink).toBeVisible();
    
    // Check for Bylaws sections
    await expect(page.getByText(/Committee Bylaws/i)).toBeVisible();
  });

  test('should load and verify About page', async ({ page }) => {
    await page.goto('/about');
    
    // Check heading
    await expect(page.getByRole('heading', { name: /Our Mission/i }).or(page.getByText(/Purdue IEEE is the university's largest/i))).toBeVisible();
    
    // Check for sections
    await expect(page.locator('p.section-eyebrow').first()).toBeVisible();
  });
});
