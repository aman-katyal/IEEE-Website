import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BosoCoolStatementView } from './BosoCoolStatementView';
import type { BosoAccountStatement } from './financeData';

const mockTestStatement: BosoAccountStatement = {
  accountName: 'INST ELECTR ELECTN ENGR SFAB',
  soaNumber: '04612',
  statementPeriod: 'From 6/1/2025 thru 8/31/2026',
  organization: 'Purdue University W. Lafayette',
  department: 'Business Office for Student Organizations (BOSO)',
  officeLocation: 'Krach Leadership Center, (KRCH) RM 365, 1198 Third Street, West Lafayette, IN 47907',
  phone: '(765) 494-6724',
  fax: '(765) 496-2208',
  website: 'https://www.purdue.edu/treasurer/finance/business',
  beginningBalance: 11390.55,
  totalPayments: 1062.77,
  totalCredits: 563.13,
  totalDebits: 10145.53,
  totalTransfersOut: 745.38,
  endingBalance: 0.00,
  payments: [
    {
      id: 'PAY-001',
      type: 'PAYMENT',
      date: '06/01/26',
      docOrCheckNumber: '372271',
      refCode: 'U8583858',
      refNumber: 'SFAB 25-26',
      amount: 161.34,
      clearedDate: '07/13/26',
      expenseOrIncomeCode: 'Equipment $4999 or Less',
      payeeOrVendor: 'Underground Printing',
    },
    {
      id: 'PAY-002',
      type: 'PAYMENT',
      date: '06/11/26',
      docOrCheckNumber: 'E331454',
      refCode: 'Amazon',
      amount: 7.48,
      clearedDate: '07/13/26',
      expenseOrIncomeCode: 'Equipment $4999 or Less',
      payeeOrVendor: 'Brendon Hayes',
    },
  ],
  credits: [
    {
      id: 'CRD-001',
      type: 'CREDIT',
      date: '06/03/26',
      docOrCheckNumber: '0626015',
      refCode: 'AMAZON.COM, INC',
      amount: 2.99,
      clearedDate: '07/13/26',
      expenseOrIncomeCode: 'Supplies',
      payeeOrVendor: 'AMAZON.COM, INC',
    },
  ],
  debits: [
    {
      id: 'DEB-001',
      type: 'DEBIT',
      date: '06/03/26',
      docOrCheckNumber: '0626014',
      refCode: 'MCMASTER-CARR S',
      amount: 88.03,
      clearedDate: '07/13/26',
      expenseOrIncomeCode: 'Supplies',
      payeeOrVendor: 'MCMASTER-CARR S',
    },
    {
      id: 'DEB-002',
      type: 'DEBIT',
      date: '06/03/26',
      docOrCheckNumber: '0626011',
      refCode: 'EUROS',
      amount: 8999.51,
      clearedDate: '07/13/26',
      expenseOrIncomeCode: 'Event Expense',
      payeeOrVendor: 'EUROS',
    },
  ],
  transfersOut: [
    {
      id: 'TRF-001',
      type: 'TRANSFER_OUT',
      date: '07/10/26',
      docOrCheckNumber: '26874',
      refCode: 'Unused SFAB',
      amount: 745.38,
      clearedDate: '08/17/26',
      expenseOrIncomeCode: 'Transfer',
      payeeOrVendor: 'Unused SFAB (Fiscal Year Closeout Sweep)',
    },
  ],
};

describe('BosoCoolStatementView Component', () => {
  it('renders clean default state when no transactions exist', () => {
    render(<BosoCoolStatementView />);

    expect(screen.getByText('INST ELECTR ELECTN ENGR SFAB')).toBeInTheDocument();
    expect(screen.getByText('SOA #04612')).toBeInTheDocument();
  });

  it('renders official account statement header with SOA number and account details', () => {
    render(<BosoCoolStatementView statement={mockTestStatement} />);

    expect(screen.getByText('INST ELECTR ELECTN ENGR SFAB')).toBeInTheDocument();
    expect(screen.getByText('SOA #04612')).toBeInTheDocument();
    expect(screen.getByText(/From 6\/1\/2025 thru 8\/31\/2026/i)).toBeInTheDocument();
    expect(screen.getByText('$11,390.55')).toBeInTheDocument();
    expect(screen.getByText('$0.00')).toBeInTheDocument();
  });

  it('renders summary KPI balances and transaction categories', () => {
    render(<BosoCoolStatementView statement={mockTestStatement} />);

    expect(screen.getByText('-$10,145.53')).toBeInTheDocument();
    expect(screen.getByText('-$1,062.77')).toBeInTheDocument();
    expect(screen.getByText('+$563.13')).toBeInTheDocument();
    expect(screen.getAllByText('-$745.38').length).toBeGreaterThan(0);
  });

  it('filters transactions when switching category tabs', () => {
    render(<BosoCoolStatementView statement={mockTestStatement} />);

    // Click Debits tab
    const debitsBtn = screen.getByRole('button', { name: /Debits/i });
    fireEvent.click(debitsBtn);

    expect(screen.getAllByText('MCMASTER-CARR S').length).toBeGreaterThan(0);
    expect(screen.getByText('EUROS')).toBeInTheDocument();
    expect(screen.queryByText('Underground Printing')).not.toBeInTheDocument();

    // Click Payments tab
    const paymentsBtn = screen.getByRole('button', { name: /Payments/i });
    fireEvent.click(paymentsBtn);

    expect(screen.getByText('Underground Printing')).toBeInTheDocument();
    expect(screen.getAllByText('Brendon Hayes').length).toBeGreaterThan(0);
    expect(screen.queryByText('MCMASTER-CARR S')).not.toBeInTheDocument();
  });

  it('searches across transactions in real time', () => {
    render(<BosoCoolStatementView statement={mockTestStatement} />);

    const searchInput = screen.getByPlaceholderText('Search vendor, check #, code...');
    fireEvent.change(searchInput, { target: { value: 'Brendon' } });

    expect(screen.getAllByText('Brendon Hayes').length).toBeGreaterThan(0);
    expect(screen.queryByText('Underground Printing')).not.toBeInTheDocument();
  });

  it('copies statement summary to clipboard', () => {
    const writeTextSpy = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: { writeText: writeTextSpy },
    });

    render(<BosoCoolStatementView statement={mockTestStatement} />);

    const copyBtn = screen.getByRole('button', { name: /Copy Statement Summary/i });
    fireEvent.click(copyBtn);

    expect(writeTextSpy).toHaveBeenCalled();
    expect(writeTextSpy.mock.calls[0][0]).toContain('SOA #04612');
    expect(writeTextSpy.mock.calls[0][0]).toContain('$11,390.55');
  });
});

