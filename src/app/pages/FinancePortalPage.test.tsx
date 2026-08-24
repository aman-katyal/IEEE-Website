import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FinancePortalPage } from './FinancePortalPage';
import '@testing-library/jest-dom';

// Mock next-themes
vi.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'dark' }),
}));

// Mock URL.createObjectURL
if (typeof window.URL.createObjectURL === 'undefined') {
  window.URL.createObjectURL = vi.fn().mockReturnValue('blob:mock-url');
}

describe('FinancePortalPage Integration Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('1. Authentication & Role Switching', () => {
    it('renders the initial unauthenticated login portal view', () => {
      render(<FinancePortalPage />);

      expect(screen.getByText('Purdue IEEE Finance Portal')).toBeInTheDocument();
      expect(screen.getByText('BoilerBooks')).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /Committee Lead/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /Treasurer Master/i })).toBeInTheDocument();
      expect(screen.getByTestId('pin-input')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Enter Committee Portal/i })).toBeInTheDocument();
    });

    it('allows toggling PIN visibility with the eye button', async () => {
      const user = userEvent.setup();
      render(<FinancePortalPage />);

      const pinInput = screen.getByTestId('pin-input');
      expect(pinInput).toHaveAttribute('type', 'password');

      const toggleButton = screen.getByRole('button', { name: /Show PIN/i });
      await user.click(toggleButton);

      expect(pinInput).toHaveAttribute('type', 'text');

      const hideButton = screen.getByRole('button', { name: /Hide PIN/i });
      await user.click(hideButton);

      expect(pinInput).toHaveAttribute('type', 'password');
    });

    it('shows validation error when submitting with empty PIN or invalid PIN', async () => {
      const user = userEvent.setup();
      render(<FinancePortalPage />);

      const submitButton = screen.getByRole('button', { name: /Enter Committee Portal/i });
      await user.click(submitButton);

      expect(
        screen.getByText('Please enter your authentication PIN to proceed.')
      ).toBeInTheDocument();

      const pinInput = screen.getByTestId('pin-input');
      await user.type(pinInput, '0000');
      await user.click(submitButton);

      expect(
        screen.getByText(/Invalid authentication PIN/i)
      ).toBeInTheDocument();
    });

    it('switches role tabs from Committee Lead to Treasurer Master', async () => {
      const user = userEvent.setup();
      render(<FinancePortalPage />);

      const treasurerTab = screen.getByRole('tab', { name: /Treasurer Master/i });
      await user.click(treasurerTab);

      expect(screen.getByText(/Executive Access Required/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Enter Treasurer Portal/i })).toBeInTheDocument();
    });
  });

  describe('2. Committee Portal View & Purchase Submission', () => {
    it('authenticates as Committee Lead and displays spending metrics', async () => {
      const user = userEvent.setup();
      render(<FinancePortalPage />);

      const pinInput = screen.getByTestId('pin-input');
      await user.type(pinInput, '1903');

      const submitButton = screen.getByRole('button', { name: /Enter Committee Portal/i });
      await user.click(submitButton);

      expect(screen.getByText(/Remotely Operated underwater Vehicle/i)).toBeInTheDocument();
      expect(screen.getByText('Total Committee Budget')).toBeInTheDocument();
      expect(screen.getByText('Total Spent')).toBeInTheDocument();
      expect(screen.getByText('Pending Queue')).toBeInTheDocument();
      expect(screen.getByText('Remaining Balance')).toBeInTheDocument();
      expect(screen.getByText(/Quick Member Dues Verification/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /New Purchase Request/i })).toBeInTheDocument();
    });

    it('filters dues verification search in real-time', async () => {
      const user = userEvent.setup();
      render(<FinancePortalPage />);

      const pinInput = screen.getByTestId('pin-input');
      await user.type(pinInput, '1903');
      await user.click(screen.getByRole('button', { name: /Enter Committee Portal/i }));

      expect(screen.getByTestId('dues-search-input')).toBeInTheDocument();

      const duesInput = screen.getByTestId('dues-search-input');
      fireEvent.change(duesInput, { target: { value: 'Rivera' } });

      const emailMatches = screen.getAllByText('arivera@purdue.edu');
      expect(emailMatches.length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText(/DUES PAID/i)).toBeInTheDocument();
    });

    it('opens New Purchase Request modal and handles file dropzone submission', async () => {
      const user = userEvent.setup();
      render(<FinancePortalPage />);

      const pinInput = screen.getByTestId('pin-input');
      await user.type(pinInput, '1903');
      await user.click(screen.getByRole('button', { name: /Enter Committee Portal/i }));

      const newReqBtn = screen.getByRole('button', { name: /New Purchase Request/i });
      await user.click(newReqBtn);

      expect(screen.getByText(/Submit New Purchase Request/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Name \(First Last\)/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Purdue Username/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Purdue Email Address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Vendor \/ Store Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Total Amount/i)).toBeInTheDocument();

      // Fill in fields
      fireEvent.change(screen.getByLabelText(/Name \(First Last\)/i), { target: { value: 'Jordan Taylor' } });
      fireEvent.change(screen.getByLabelText(/Purdue Username/i), { target: { value: 'jtaylor' } });
      fireEvent.change(screen.getByLabelText(/Purdue Email Address/i), { target: { value: 'jtaylor@purdue.edu' } });
      fireEvent.change(screen.getByLabelText(/Phone \(XXX-XXX-XXXX\)/i), { target: { value: '765-555-0199' } });
      fireEvent.change(screen.getByLabelText(/Full Address/i), { target: { value: '123 Main St, West Lafayette, IN' } });
      fireEvent.change(screen.getByLabelText(/Vendor \/ Store Name/i), { target: { value: 'Pololu Robotics' } });
      fireEvent.change(screen.getByLabelText(/Total Amount/i), { target: { value: '145.50' } });

      // Attach file
      const fileInput = document.getElementById('receipt-file-input') as HTMLInputElement;
      expect(fileInput).toBeInTheDocument();

      const fakeFile = new File(['dummy receipt content'], 'pololu_invoice.pdf', {
        type: 'application/pdf',
      });
      await user.upload(fileInput, fakeFile);

      expect(screen.getByText('pololu_invoice.pdf')).toBeInTheDocument();

      // Submit Form
      const submitReqButton = screen.getByRole('button', { name: /Submit Request/i });
      await user.click(submitReqButton);

      // Verify the new purchase request appears in the table
      expect(screen.getByText('Jordan Taylor')).toBeInTheDocument();
      expect(screen.getByText('Pololu Robotics')).toBeInTheDocument();
    }, 15000);
  });

  describe('3. Treasurer Portal View, Master Matrix & COOL Exporter', () => {
    it('authenticates as Treasurer and displays master matrix and branch totals', async () => {
      const user = userEvent.setup();
      render(<FinancePortalPage />);

      const treasurerTab = screen.getByRole('tab', { name: /Treasurer Master/i });
      await user.click(treasurerTab);

      const pinInput = screen.getByTestId('pin-input');
      await user.type(pinInput, '1903');

      const submitButton = screen.getByRole('button', { name: /Enter Treasurer Portal/i });
      await user.click(submitButton);

      expect(screen.getByText('Executive Treasurer Console')).toBeInTheDocument();
      expect(screen.getByText('Total Branch Capital')).toBeInTheDocument();
      expect(screen.getByText('Disbursed & Approved')).toBeInTheDocument();
      expect(screen.getByText('Pending Queue Total')).toBeInTheDocument();
      expect(screen.getByText('Remaining Balance')).toBeInTheDocument();

      // Check Tabs
      expect(screen.getByRole('tab', { name: /Pending Approvals/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /Master Spending Matrix/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /Grants & Inflows/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /Dues Directory/i })).toBeInTheDocument();
    });

    it('approves a pending request in the queue', async () => {
      const user = userEvent.setup();
      render(<FinancePortalPage />);

      const treasurerTab = screen.getByRole('tab', { name: /Treasurer Master/i });
      await user.click(treasurerTab);

      const pinInput = screen.getByTestId('pin-input');
      await user.type(pinInput, '1903');
      await user.click(screen.getByRole('button', { name: /Enter Treasurer Portal/i }));

      expect(screen.getByText('Pending Purchase Approvals Queue')).toBeInTheDocument();

      const approveButtons = screen.getAllByRole('button', { name: /Approve/i });
      expect(approveButtons.length).toBeGreaterThan(0);

      await user.click(approveButtons[0]);

      expect(screen.getByText(/Purdue COOL Batch Exporter/i)).toBeInTheDocument();
    });

    it('opens Purdue COOL Batch Exporter and copies formatted batch text', async () => {
      const user = userEvent.setup();
      render(<FinancePortalPage />);

      const treasurerTab = screen.getByRole('tab', { name: /Treasurer Master/i });
      await user.click(treasurerTab);

      const pinInput = screen.getByTestId('pin-input');
      await user.type(pinInput, '1903');
      await user.click(screen.getByRole('button', { name: /Enter Treasurer Portal/i }));

      const exporterButton = screen.getByRole('button', { name: /Purdue COOL Batch Exporter/i });
      await user.click(exporterButton);

      expect(screen.getByText(/PURDUE COOL \/ BOSOP REIMBURSEMENT BATCH EXPORT/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Download COOL CSV/i })).toBeInTheDocument();

      const copyButton = screen.getByRole('button', { name: /Copy Text/i });
      await user.click(copyButton);

      expect(screen.getByText(/Copied!/i)).toBeInTheDocument();
    });

    it('switches between Master Spending Matrix and Dues Directory tabs', async () => {
      const user = userEvent.setup();
      render(<FinancePortalPage />);

      const treasurerTab = screen.getByRole('tab', { name: /Treasurer Master/i });
      await user.click(treasurerTab);

      const pinInput = screen.getByTestId('pin-input');
      await user.type(pinInput, '1903');
      await user.click(screen.getByRole('button', { name: /Enter Treasurer Portal/i }));

      // Switch to Master Spending Matrix tab
      await user.click(screen.getByRole('tab', { name: /Master Spending Matrix/i }));
      expect(screen.getByText(/Technical Committees Master Spending Matrix/i)).toBeInTheDocument();
      expect(screen.getByText('Remotely Operated underwater Vehicle (ROV)')).toBeInTheDocument();
      expect(screen.getByText('IEEE Racing (EV Go-Kart)')).toBeInTheDocument();

      // Switch to Dues Directory tab
      await user.click(screen.getByRole('tab', { name: /Dues Directory/i }));
      expect(screen.getByText(/Student Member Dues Directory/i)).toBeInTheDocument();
    });

    it('allows Treasurer to edit committee budgets, categories, and parameters', async () => {
      const user = userEvent.setup();
      render(<FinancePortalPage />);

      const treasurerTab = screen.getByRole('tab', { name: /Treasurer Master/i });
      await user.click(treasurerTab);

      const pinInput = screen.getByTestId('pin-input');
      await user.type(pinInput, '1903');
      await user.click(screen.getByRole('button', { name: /Enter Treasurer Portal/i }));

      // Switch to Master Spending Matrix tab
      await user.click(screen.getByRole('tab', { name: /Master Spending Matrix/i }));

      // Find Edit button for ROV
      const editButtons = screen.getAllByRole('button', { name: /Edit/i });
      expect(editButtons.length).toBeGreaterThan(0);
      await user.click(editButtons[0]);

      expect(screen.getByText(/Edit Parameters/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Allocated Budget Capital/i)).toBeInTheDocument();

      // Update allocated budget
      fireEvent.change(screen.getByLabelText(/Allocated Budget Capital/i), {
        target: { value: '18500' },
      });

      // Save parameters
      await user.click(screen.getByRole('button', { name: /Save Parameters/i }));

      // Verify updated allocation in matrix
      expect(screen.getAllByText('$18,500.00').length).toBeGreaterThanOrEqual(1);
    });

    it('allows Treasurer to record specific funding inflow/grant for a committee', async () => {
      const user = userEvent.setup();
      render(<FinancePortalPage />);

      const treasurerTab = screen.getByRole('tab', { name: /Treasurer Master/i });
      await user.click(treasurerTab);

      const pinInput = screen.getByTestId('pin-input');
      await user.type(pinInput, '1903');
      await user.click(screen.getByRole('button', { name: /Enter Treasurer Portal/i }));

      // Open Record Inflow modal from top banner
      const recordInflowBtn = screen.getByRole('button', { name: /Record Specific Funds \/ Grant/i });
      await user.click(recordInflowBtn);

      expect(screen.getByText(/Record Specific Committee Funding & Grants/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Grant \/ Sponsorship Title/i)).toBeInTheDocument();

      // Fill in inflow details
      fireEvent.change(screen.getByLabelText(/Grant \/ Sponsorship Title/i), {
        target: { value: 'Texas Instruments Autonomous Grant' },
      });
      fireEvent.change(screen.getByLabelText(/Amount \(\$\)/i), {
        target: { value: '4500' },
      });

      // Submit inflow
      const submitInflowBtn = screen.getByRole('button', { name: /Credit Funding Inflow/i });
      await user.click(submitInflowBtn);

      // Switch to Grants & Inflows tab and verify
      const inflowsTab = screen.getByRole('tab', { name: /Grants & Inflows/i });
      await user.click(inflowsTab);

      expect(screen.getByText('Texas Instruments Autonomous Grant')).toBeInTheDocument();
      expect(screen.getAllByText('+$4,500.00').length).toBeGreaterThanOrEqual(1);
    });

    it('allows signing out and returning to the login modal', async () => {
      const user = userEvent.setup();
      render(<FinancePortalPage />);

      const treasurerTab = screen.getByRole('tab', { name: /Treasurer Master/i });
      await user.click(treasurerTab);

      const pinInput = screen.getByTestId('pin-input');
      await user.type(pinInput, '1903');
      await user.click(screen.getByRole('button', { name: /Enter Treasurer Portal/i }));

      const signOutBtn = screen.getByRole('button', { name: /Sign Out/i });
      await user.click(signOutBtn);

      expect(screen.getByText('BoilerBooks')).toBeInTheDocument();
      expect(screen.getByTestId('pin-input')).toBeInTheDocument();
    });

    it('displays the official Purdue BOSO / COOL Statement tab with SOA #04612', async () => {
      const user = userEvent.setup();
      render(<FinancePortalPage />);

      const treasurerTab = screen.getByRole('tab', { name: /Treasurer Master/i });
      await user.click(treasurerTab);

      const pinInput = screen.getByTestId('pin-input');
      await user.type(pinInput, '1903');
      await user.click(screen.getByRole('button', { name: /Enter Treasurer Portal/i }));

      // Switch to BOSO Statement tab
      const statementTab = screen.getByRole('tab', { name: /BOSO Statement/i });
      await user.click(statementTab);

      expect(screen.getByText('INST ELECTR ELECTN ENGR SFAB')).toBeInTheDocument();
      expect(screen.getByText('SOA #04612')).toBeInTheDocument();
      expect(screen.getByText('Underground Printing')).toBeInTheDocument();
      expect(screen.getByText('EUROS')).toBeInTheDocument();
      expect(screen.getByText('$11,390.55')).toBeInTheDocument();
    });
  });
});
