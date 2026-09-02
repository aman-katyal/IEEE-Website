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
    sessionStorage.clear();
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });
  });

  it('initializes with default data and no active session', () => {
    const { result } = renderHook(() => useFinanceApi());

    expect(result.current.session).toBeNull();
    expect(result.current.purchases.length).toBe(0);
    expect(result.current.committees.length).toBeGreaterThan(0);
    expect(result.current.memberDues.length).toBe(0);
    expect(result.current.fundingInflows.length).toBe(0);
  });

  it('handles committee login and logout', async () => {
    mockFetch.mockImplementation(async (url: string) => {
      if (typeof url === 'string' && url.includes('/auth/verify-pin')) {
        return {
          ok: true,
          json: async () => ({
            authenticated: true,
            session: {
              role: 'COMMITTEE_LEAD',
              committeeId: 'rov',
              committeeName: 'Remotely Operated Vehicles',
              name: 'ROV Leadership',
              email: 'rov@purdueieee.org',
            },
          }),
        };
      }
      return { ok: true, json: async () => ({ success: true }) };
    });

    const { result } = renderHook(() => useFinanceApi());

    await act(async () => {
      const auth = await result.current.loginWithPin('ROV-6T5DB6&835-HNT', 'COMMITTEE_LEAD', 'rov');
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
    mockFetch.mockImplementation(async (url: string) => {
      if (typeof url === 'string' && url.includes('/auth/verify-pin')) {
        return {
          ok: true,
          json: async () => ({
            authenticated: true,
            session: {
              role: 'TREASURER',
              committeeId: 'treasurer',
              committeeName: 'Executive Treasurer Admin',
              name: 'Purdue IEEE Treasurer',
              email: 'treasurer@purdueieee.org',
            },
          }),
        };
      }
      return { ok: true, json: async () => ({ success: true }) };
    });

    const { result } = renderHook(() => useFinanceApi());

    await act(async () => {
      const auth = await result.current.loginWithPin('TREA-RAALQH@379-Z6B', 'TREASURER');
      expect(auth.success).toBe(true);
      expect(auth.session?.role).toBe('TREASURER');
    });

    expect(result.current.session?.role).toBe('TREASURER');
  });

  it('rejects invalid PIN', async () => {
    mockFetch.mockImplementation(async (url: string) => {
      if (typeof url === 'string' && url.includes('/auth/verify-pin')) {
        return {
          ok: false,
          status: 401,
          json: async () => ({
            authenticated: false,
            message: 'Invalid authentication passcode.',
          }),
        };
      }
      return { ok: true, json: async () => ({ success: true }) };
    });

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

    const newPurchase = {
      id: 'PR-TARGET-001',
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

    await act(async () => {
      await result.current.updatePurchaseStatus('PR-TARGET-001', 'APPROVED', 'Approved by treasurer', 'COOL-1234');
    });

    const updated = result.current.purchases.find((p) => p.id === 'PR-TARGET-001');
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

  it('rolls back purchases state when server returns error response', async () => {
    const { result } = renderHook(() => useFinanceApi());
    const initialCount = result.current.purchases.length;

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ error: 'Internal Server Error' }),
    });

    const newPurchase = {
      id: 'PR-FAIL-001',
      committeeId: 'rov',
      committeeName: 'ROV',
      requesterName: 'Test Requester',
      requesterEmail: 'test@purdue.edu',
      vendorName: 'Fail Vendor',
      category: 'Hardware',
      totalAmount: 99.0,
      description: 'Will fail',
      status: 'PENDING' as const,
      submittedAt: new Date().toISOString(),
    };

    let outcome: { success: boolean; error?: string } = { success: true };
    await act(async () => {
      outcome = await result.current.addPurchase(newPurchase);
    });

    expect(outcome.success).toBe(false);
    expect(result.current.purchases.length).toBe(initialCount);
    expect(result.current.error).toContain('500');
  });
});

