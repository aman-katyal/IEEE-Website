import { describe, it, expect } from 'vitest';
import { parseQueryParams, buildQueryString } from './queryParams';

describe('queryParams', () => {
  it('parses URL search strings correctly', () => {
    expect(parseQueryParams('?tab=statement&view=all')).toEqual({
      tab: 'statement',
      view: 'all',
    });
    expect(parseQueryParams('tab=reimbursements')).toEqual({
      tab: 'reimbursements',
    });
    expect(parseQueryParams('')).toEqual({});
  });

  it('builds query strings filtering out null and undefined values', () => {
    const params = { tab: 'budget', category: 'tools', page: 1, filter: null, search: undefined };
    expect(buildQueryString(params)).toBe('?tab=budget&category=tools&page=1');
    expect(buildQueryString({})).toBe('');
  });
});
