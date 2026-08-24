import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BosoCoolStatementView } from './BosoCoolStatementView';
import { OFFICIAL_BOSO_STATEMENT_SFAB_2026 } from './financeData';

describe('BosoCoolStatementView Component', () => {
  it('renders official account statement header with SOA number and account details', () => {
    render(<BosoCoolStatementView />);

    expect(screen.getByText('INST ELECTR ELECTN ENGR SFAB')).toBeInTheDocument();
    expect(screen.getByText('SOA #04612')).toBeInTheDocument();
    expect(screen.getByText(/From 6\/1\/2026 thru 8\/31\/2026/i)).toBeInTheDocument();
    expect(screen.getByText('$11,390.55')).toBeInTheDocument();
    expect(screen.getByText('$0.00')).toBeInTheDocument();
  });

  it('renders summary KPI balances and transaction categories', () => {
    render(<BosoCoolStatementView />);

    expect(screen.getByText('-$10,145.53')).toBeInTheDocument();
    expect(screen.getByText('-$1,062.77')).toBeInTheDocument();
    expect(screen.getByText('+$563.13')).toBeInTheDocument();
    expect(screen.getAllByText('-$745.38').length).toBeGreaterThan(0);
  });

  it('filters transactions when switching category tabs', () => {
    render(<BosoCoolStatementView />);

    // Click Debits tab
    const debitsBtn = screen.getByRole('button', { name: /Debits/i });
    fireEvent.click(debitsBtn);

    expect(screen.getByText('MCMASTER-CARR S')).toBeInTheDocument();
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
    render(<BosoCoolStatementView />);

    const searchInput = screen.getByPlaceholderText('Search vendor, check #, code...');
    fireEvent.change(searchInput, { target: { value: 'Tai Hsu' } });

    expect(screen.getAllByText('Tai Hsu').length).toBeGreaterThan(0);
    expect(screen.queryByText('Underground Printing')).not.toBeInTheDocument();
  });

  it('copies statement summary to clipboard', () => {
    const writeTextSpy = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: { writeText: writeTextSpy },
    });

    render(<BosoCoolStatementView />);

    const copyBtn = screen.getByRole('button', { name: /Copy Statement Summary/i });
    fireEvent.click(copyBtn);

    expect(writeTextSpy).toHaveBeenCalled();
    expect(writeTextSpy.mock.calls[0][0]).toContain('SOA #04612');
    expect(writeTextSpy.mock.calls[0][0]).toContain('$11,390.55');
  });
});
