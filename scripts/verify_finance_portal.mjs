import { chromium } from 'playwright';
import { spawn } from 'child_process';

async function run() {
  console.log('Starting preview server on port 4173...');
  const server = spawn('npx', ['vite', 'preview', '--port', '4173'], {
    shell: true,
    stdio: 'pipe',
  });

  await new Promise((resolve) => setTimeout(resolve, 3000));

  console.log('Launching Chromium...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  try {
    console.log('Navigating to http://localhost:4173/finance');
    await page.goto('http://localhost:4173/finance', { waitUntil: 'networkidle' });

    // Enter Committee Portal
    const pinInput = page.getByTestId('pin-input');
    if (await pinInput.isVisible()) {
      await pinInput.fill('1903');
      await page.getByRole('button', { name: /Enter Committee Portal/i }).click();
      await page.waitForTimeout(600);

      // Screenshot 1: Committee Portal with Dedicated Grants Ledger
      await page.screenshot({
        path: 'C:/Users/aman/.gemini/antigravity-cli/brain/5dada24e-0db6-4fec-a37d-84ed697526ad/finance_committee_grants.png',
      });
      console.log('Saved finance_committee_grants.png');
    }

    // Switch to Treasurer Role
    const switchBtn = page.getByRole('button', { name: /Switch/i });
    if (await switchBtn.isVisible()) {
      await switchBtn.click();
      await page.waitForTimeout(500);

      // Select Treasurer Tab
      await page.getByRole('tab', { name: /Treasurer Master/i }).click();
      await page.getByTestId('pin-input').fill('1903');
      await page.getByRole('button', { name: /Enter Treasurer Portal/i }).click();
      await page.waitForTimeout(600);

      // Switch to Grants & Inflows Tab
      await page.getByRole('tab', { name: /Grants & Inflows/i }).click();
      await page.waitForTimeout(500);

      // Screenshot 2: Treasurer Inflows Ledger
      await page.screenshot({
        path: 'C:/Users/aman/.gemini/antigravity-cli/brain/5dada24e-0db6-4fec-a37d-84ed697526ad/finance_treasurer_inflows_ledger.png',
      });
      console.log('Saved finance_treasurer_inflows_ledger.png');

      // Open Record Inflow Modal
      const recordInflowBtn = page.getByRole('button', { name: /Record Specific Funds/i });
      if (await recordInflowBtn.isVisible()) {
        await recordInflowBtn.click();
        await page.waitForTimeout(600);

        // Screenshot 3: Record Inflow Modal
        await page.screenshot({
          path: 'C:/Users/aman/.gemini/antigravity-cli/brain/5dada24e-0db6-4fec-a37d-84ed697526ad/finance_treasurer_record_inflow_modal.png',
        });
        console.log('Saved finance_treasurer_record_inflow_modal.png');
      }
    }
  } catch (err) {
    console.error('Error during screenshot capture:', err);
  } finally {
    await browser.close();
    server.kill();
    process.exit(0);
  }
}

run();
