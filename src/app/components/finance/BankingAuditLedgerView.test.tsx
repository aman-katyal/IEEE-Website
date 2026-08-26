import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { BankingAuditLedgerView } from './BankingAuditLedgerView';
import type { FinancialAuditLedgerEntry } from './financeData';

const mockAuditLogs: FinancialAuditLedgerEntry[] = [
  {
    id: 'audit-1',
    fiscalYearId: 'fy25-26',
    committeeId: 'rov',
    committeeName: 'Remotely Operated Vehicles',
    actionType: 'BUDGET_ALLOCATION',
    actorRole: 'TREASURER',
    actorName: 'Executive Treasurer',
    description: 'Base allocated budget increased to $3,500.00 (+3,500.00)',
    previousValue: '0',
    newValue: '3500',
    amountDelta: 3500,
    createdAt: '2026-08-26T17:00:00Z',
  },
  {
    id: 'audit-2',
    fiscalYearId: 'fy25-26',
    committeeId: 'rov',
    committeeName: 'Remotely Operated Vehicles',
    actionType: 'FUNDING_INFLOW',
    actorRole: 'TREASURER',
    actorName: 'Executive Treasurer',
    description: 'Recorded funding inflow of $500.00 from SFAB Grant',
    previousValue: null,
    newValue: '500',
    amountDelta: 500,
    createdAt: '2026-08-26T17:15:00Z',
  },
  {
    id: 'audit-3',
    fiscalYearId: 'fy25-26',
    committeeId: 'racing',
    committeeName: 'Purdue Electric Racing',
    actionType: 'PURCHASE_APPROVED',
    actorRole: 'TREASURER',
    actorName: 'Executive Treasurer',
    description: 'Approved purchase PR-2026-102 for $150.00',
    previousValue: 'PENDING',
    newValue: 'APPROVED',
    amountDelta: -150,
    createdAt: '2026-08-26T17:30:00Z',
  },
];

describe('BankingAuditLedgerView', () => {
  it('renders all audit log entries when viewed by Treasurer', () => {
    render(<BankingAuditLedgerView entries={mockAuditLogs} isTreasurer={true} />);

    expect(screen.getByText(/Immutable Financial Audit Ledger/i)).toBeInTheDocument();
    expect(screen.getByText(/Base allocated budget increased to \$3,500.00/i)).toBeInTheDocument();
    expect(screen.getByText(/Recorded funding inflow of \$500.00/i)).toBeInTheDocument();
    expect(screen.getByText(/Approved purchase PR-2026-102 for \$150.00/i)).toBeInTheDocument();
  });

  it('scopes audit log entries to specific committee when currentCommitteeId is set', () => {
    render(
      <BankingAuditLedgerView
        entries={mockAuditLogs}
        currentCommitteeId="rov"
        isTreasurer={false}
      />
    );

    expect(screen.getByText(/Base allocated budget increased to \$3,500.00/i)).toBeInTheDocument();
    expect(screen.getByText(/Recorded funding inflow of \$500.00/i)).toBeInTheDocument();
    expect(screen.queryByText(/Approved purchase PR-2026-102 for \$150.00/i)).not.toBeInTheDocument();
  });

  it('filters audit entries when searching text', () => {
    render(<BankingAuditLedgerView entries={mockAuditLogs} isTreasurer={true} />);

    const searchInput = screen.getByPlaceholderText(/Search audit trail/i);
    fireEvent.change(searchInput, { target: { value: 'SFAB' } });

    expect(screen.getByText(/Recorded funding inflow of \$500.00/i)).toBeInTheDocument();
    expect(screen.queryByText(/Base allocated budget increased to \$3,500.00/i)).not.toBeInTheDocument();
  });
});
