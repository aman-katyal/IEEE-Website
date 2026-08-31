import { describe, it, expect } from 'vitest';
import { getLegacyRedirectTarget, LEGACY_REDIRECTS } from './legacyRedirects';

describe('Legacy Redirects Resolver', () => {
  it('redirects root committee paths with or without trailing slashes', () => {
    expect(getLegacyRedirectTarget('/rov/')).toBe('/committee/rov');
    expect(getLegacyRedirectTarget('/rov')).toBe('/committee/rov');
    expect(getLegacyRedirectTarget('/racing/')).toBe('/committee/racing');
    expect(getLegacyRedirectTarget('/racing')).toBe('/committee/racing');
    expect(getLegacyRedirectTarget('/embs/')).toBe('/committee/embs');
    expect(getLegacyRedirectTarget('/mtts/')).toBe('/committee/mtts');
    expect(getLegacyRedirectTarget('/software-saturdays/')).toBe('/committee/software-saturdays');
  });

  it('handles case-insensitivity and legacy file extensions', () => {
    expect(getLegacyRedirectTarget('/ROV/')).toBe('/committee/rov');
    expect(getLegacyRedirectTarget('/rov/index.html')).toBe('/committee/rov');
    expect(getLegacyRedirectTarget('/racing/index.php')).toBe('/committee/racing');
    expect(getLegacyRedirectTarget('/cs/index.php')).toBe('/committee/computer-society');
  });

  it('redirects aliases to canonical committee destinations', () => {
    expect(getLegacyRedirectTarget('/cs')).toBe('/committee/computer-society');
    expect(getLegacyRedirectTarget('/csociety')).toBe('/committee/computer-society');
    expect(getLegacyRedirectTarget('/aerial')).toBe('/committee/aerial-robotics');
    expect(getLegacyRedirectTarget('/part')).toBe('/committee/aerial-robotics');
    expect(getLegacyRedirectTarget('/aesc')).toBe('/committee/aerial-robotics');
    expect(getLegacyRedirectTarget('/mtt-s')).toBe('/committee/mtts');
    expect(getLegacyRedirectTarget('/software')).toBe('/committee/software-saturdays');
  });

  it('redirects legacy static top-level pages', () => {
    expect(getLegacyRedirectTarget('/sponsors')).toBe('/partners');
    expect(getLegacyRedirectTarget('/sponsorship/')).toBe('/partners');
    expect(getLegacyRedirectTarget('/bylaws')).toBe('/constitution');
    expect(getLegacyRedirectTarget('/history')).toBe('/about');
    expect(getLegacyRedirectTarget('/dues')).toBe('/join');
    expect(getLegacyRedirectTarget('/events')).toBe('/calendar');
    expect(getLegacyRedirectTarget('/leadership')).toBe('/officers');
  });

  it('redirects nested legacy subpaths', () => {
    expect(getLegacyRedirectTarget('/rov/team/index.html')).toBe('/committee/rov');
    expect(getLegacyRedirectTarget('/racing/schedule')).toBe('/committee/racing');
  });

  it('returns null for non-legacy or already canonical paths', () => {
    expect(getLegacyRedirectTarget('/')).toBeNull();
    expect(getLegacyRedirectTarget('/committee/rov')).toBeNull();
    expect(getLegacyRedirectTarget('/about')).toBeNull();
    expect(getLegacyRedirectTarget('/non-existent-page-xyz')).toBeNull();
  });
});
