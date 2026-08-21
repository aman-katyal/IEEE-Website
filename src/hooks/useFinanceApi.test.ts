import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFinanceApi } from './useFinanceApi';

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('useFinanceApi Hook Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });
  });

  it('initializes with default data and no active session', () => {
    const { result } = renderHook(() => useFinanceApi());

    expect(result.current.session).toBeNull();
    expect(result.current.purchases.length).toBeGreaterThan(0);
    expect(result.current.committees.length).toBeGreaterThan(0);
    expect(result.current.memberDues.length).toBeGreaterThan(0);
    expect(result.current.fundingInflows.length).toBeGreaterThan(0);
  });

  it('handles committee login and logout', async () => {
    const { result } = renderHook(() => useFinanceApi());

    await act(async () => {
      const auth = await result.current.loginWithPin('1903', 'COMMITTEE_LEAD', 'rov');
      expect(auth.success).toBe(true);
      expect(auth.session?.role).toBe('COMMITTEE_LEAD');
      expect(auth.session?.committeeId).toBe('rov');
    });

    expect(result.current.session?.committeeId).toBe('rov');

    act(() => {
      result.current.logout();
    });

    expect(result.current.session).toBeNull();
  });

  it('handles treasurer login', async () => {
    const { result } = renderHook(() => useFinanceApi());

    await act(async () => {
      const auth = await result.current.loginWithPin('1903', 'TREASURER');
      expect(auth.success).toBe(true);
      expect(auth.session?.role).toBe('TREASURER');
    });

    expect(result.current.session?.role).toBe('TREASURER');
  });

  it('rejects invalid PIN', async () => {
    const { result } = renderHook(() => useFinanceApi());

    await act(async () => {
      const auth = await result.current.loginWithPin('0000', 'COMMITTEE_LEAD', 'rov');
      expect(auth.success).toBe(false);
    });

    expect(result.current.session).toBeNull();
  });

  it('adds a purchase request optimistically', async () => {
    const { result } = renderHook(() => useFinanceApi());
    const initialCount = result.current.purchases.length;

    const newPurchase = {
      id: 'PR-TEST-001',
      committeeId: 'rov',
      committeeName: 'ROV',
      requesterName: 'Test Requester',
      requesterEmail: 'test@purdue.edu',
      vendorName: 'DigiKey',
      category: 'Electronics',
      totalAmount: 150.0,
      description: 'Sensor modules',
      status: 'PENDING' as const,
      submittedAt: new Date().toISOString(),
    };

    await act(async () => {
      await result.current.addPurchase(newPurchase);
    });

    expect(result.current.purchases.length).toBe(initialCount + 1);
    expect(result.current.purchases[0].id).toBe('PR-TEST-001');
  });

  it('updates purchase request status', async () => {
    const { result } = renderHook(() => useFinanceApi());
    const target = result.current.purchases[0];

    await act(async () => {
      await result.current.updatePurchaseStatus(target.id, 'APPROVED', 'Approved by treasurer', 'COOL-1234');
    });

    const updated = result.current.purchases.find((p) => p.id === target.id);
    expect(updated?.status).toBe('APPROVED');
    expect(updated?.treasurerNotes).toBe('Approved by treasurer');
    expect(updated?.coolAccountNumber).toBe('COOL-1234');
  });

  it('adds and deletes funding inflows', async () => {
    const { result } = renderHook(() => useFinanceApi());
    const initialCount = result.current.fundingInflows.length;

    const newInflow = {
      id: 'inflow-test-123',
      committeeId: 'rov',
      sourceType: 'SFAB Grant' as const,
      title: 'Spring SFAB Capital Equipment Grant',
      amount: 4000.0,
      receivedDate: '2026-03-01',
    };

    await act(async () => {
      await result.current.addFundingInflow(newInflow);
    });

    expect(result.current.fundingInflows.length).toBe(initialCount + 1);

    await act(async () => {
      await result.current.deleteFundingInflow('inflow-test-123');
    });

    expect(result.current.fundingInflows.length).toBe(initialCount);
  });
});
