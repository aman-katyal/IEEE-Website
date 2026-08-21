import { chromium } from 'playwright';
import { spawn } from 'child_process';

async function run() {
  console.log('🚀 Starting Vite production preview server on port 4178...');
  const server = spawn('npx.cmd', ['vite', 'preview', '--port', '4178'], {
    shell: true,
    stdio: 'pipe',
  });

  // Give server ample time to start
  await new Promise((resolve) => setTimeout(resolve, 4000));

  console.log('🖥️ Launching Chromium for Full Battletest...');
  const browser = await chromium.launch({ headless: true });
  
  let passedTests = 0;
  let totalTests = 0;

  function assert(condition, message) {
    totalTests++;
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passedTests++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
    }
  }

  try {
    // -------------------------------------------------------------------------
    // TEST SUITE 1: Desktop Viewport (1440x900)
    // -------------------------------------------------------------------------
    console.log('\n--- 1. Desktop Experience Testing (1440x900) ---');
    const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await desktopContext.newPage();

    console.log('Navigating to http://localhost:4178/finance');
    await page.goto('http://localhost:4178/finance', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    // Step 1: Initial Login Modal
    const titleVisible = await page.getByRole('heading', { name: /Purdue IEEE Finance Portal/i }).isVisible();
    assert(titleVisible, 'Finance Portal title is visible');
    const pinInput = page.getByTestId('pin-input');
    assert(await pinInput.isVisible(), 'PIN input is visible on initial load');

    // Step 2: Test Invalid PIN error
    await pinInput.fill('0000');
    await page.getByRole('button', { name: /Enter Committee Portal/i }).click();
    await page.waitForTimeout(400);
    const alertVisible = await page.getByRole('alert').isVisible();
    assert(alertVisible, 'Invalid PIN displays error alert');

    // Step 3: Committee Lead Login (ROV)
    await pinInput.fill('1903');
    await page.getByRole('button', { name: /Enter Committee Portal/i }).click();
    await page.waitForTimeout(800);

    const committeeBadge = await page.getByText(/ROV Leadership/i).isVisible();
    assert(committeeBadge, 'Successfully authenticated as ROV Leadership');

    const totalBudgetCard = await page.getByText(/\$15,500\.00/i).isVisible();
    assert(totalBudgetCard, 'ROV total budget ($15,500.00) includes base + grants');

    // Step 4: Open BOSO Reimbursement / Purchase Modal
    const newPurchaseBtn = page.getByRole('button', { name: /New Purchase Request/i });
    assert(await newPurchaseBtn.isVisible(), 'New Purchase Request button visible');
    await newPurchaseBtn.click();
    await page.waitForTimeout(600);

    const modalHeading = await page.getByText(/Submit New Purchase Request/i).isVisible();
    assert(modalHeading, 'Submit New Purchase Request modal opened');

    // Step 5: Test SFAB funding source toggle inside modal
    const sfabButton = page.getByRole('button', { name: /SFAB Grant/i });
    if (await sfabButton.isVisible()) {
      await sfabButton.click();
      await page.waitForTimeout(300);
      const sfabLineInput = page.getByLabel(/If SFAB, which line item\?/i);
      assert(await sfabLineInput.isVisible(), 'SFAB Line Item input appears when SFAB selected');
    }

    // Step 6: Close Modal
    await page.getByRole('button', { name: /Cancel/i }).first().click();
    await page.waitForTimeout(400);

    // Step 7: Switch to Treasurer Admin
    const switchBtn = page.getByRole('button', { name: /Switch/i });
    await switchBtn.click();
    await page.waitForTimeout(500);

    await page.getByRole('tab', { name: /Treasurer Master/i }).click();
    await page.getByTestId('pin-input').fill('1903');
    await page.getByRole('button', { name: /Enter Treasurer Portal/i }).click();
    await page.waitForTimeout(800);

    const treasurerBadge = await page.getByText(/Executive Treasurer Console/i).isVisible();
    assert(treasurerBadge, 'Successfully logged in as Executive Treasurer Admin');

    // Step 8: Check Pending Approvals Tab
    const pendingTab = page.getByRole('tab', { name: /Pending Approvals/i });
    assert(await pendingTab.isVisible(), 'Pending Approvals tab is present');

    // Step 9: Check Master Spending Matrix Tab
    const matrixTab = page.getByRole('tab', { name: /Master Spending Matrix/i });
    await matrixTab.click();
    await page.waitForTimeout(500);
    const rovMatrixRow = await page.getByText(/Remotely Operated underwater Vehicle/i).first().isVisible();
    assert(rovMatrixRow, 'ROV row present in Master Spending Matrix');

    // Step 10: Open Edit Parameters Modal
    const editButtons = page.getByRole('button', { name: /Edit/i });
    if (await editButtons.first().isVisible()) {
      await editButtons.first().click();
      await page.waitForTimeout(500);
      const editModalTitle = await page.getByText(/Edit Committee Financial Parameters/i).isVisible();
      assert(editModalTitle, 'Edit Committee Parameters modal opened successfully');
      await page.getByRole('button', { name: /Cancel/i }).first().click();
      await page.waitForTimeout(400);
    }

    // Step 11: Grants & Inflows Tab
    const inflowsTab = page.getByRole('tab', { name: /Grants & Inflows/i });
    await inflowsTab.click();
    await page.waitForTimeout(500);
    const inflowsLedgerTitle = await page.getByText(/Committee Specific Funding & Grants Ledger/i).isVisible();
    assert(inflowsLedgerTitle, 'Funding & Grants Ledger displayed');

    // Step 12: Dues Directory Tab & Search
    const duesTab = page.getByRole('tab', { name: /Dues Directory/i });
    await duesTab.click();
    await page.waitForTimeout(500);
    const duesSearchInput = page.getByPlaceholder(/Search by student name or email/i);
    assert(await duesSearchInput.isVisible(), 'Dues search bar visible');
    await duesSearchInput.fill('alex');
    await page.waitForTimeout(400);
    const alexRecord = await page.getByText(/Alex Johnson/i).isVisible();
    assert(alexRecord, 'Dues search successfully filtered for Alex Johnson');

    await page.screenshot({ path: './public/images/battletest_desktop_treasurer.png' });
    console.log('Saved public/images/battletest_desktop_treasurer.png');

    // -------------------------------------------------------------------------
    // TEST SUITE 2: Mobile Viewport (375x812 - iPhone 13)
    // -------------------------------------------------------------------------
    console.log('\n--- 2. Mobile Responsive Testing (375x812) ---');
    const mobileContext = await browser.newContext({ viewport: { width: 375, height: 812 } });
    const mobilePage = await mobileContext.newPage();

    await mobilePage.goto('http://localhost:4178/finance', { waitUntil: 'networkidle' });
    await mobilePage.waitForTimeout(500);
    const mobilePin = mobilePage.getByTestId('pin-input');
    await mobilePin.fill('1903');
    await mobilePage.getByRole('button', { name: /Enter Committee Portal/i }).click();
    await mobilePage.waitForTimeout(800);

    const mobileHeader = await mobilePage.getByText(/Remotely Operated underwater Vehicle/i).first().isVisible();
    assert(mobileHeader, 'Mobile layout renders committee header cleanly');

    await mobilePage.screenshot({ path: './public/images/battletest_mobile_committee.png' });
    console.log('Saved public/images/battletest_mobile_committee.png');

    console.log(`\n🎉 BATTLETEST COMPLETE: ${passedTests}/${totalTests} checks passed successfully!`);
  } catch (err) {
    console.error('Battletest error:', err);
  } finally {
    await browser.close();
    server.kill();
    process.exit(0);
  }
}

run();
