/**
 * Canonical legacy URL redirects mapping for legacy WordPress/Apache routes to new React routes.
 */

export const LEGACY_REDIRECTS: Record<string, string> = {
  // Direct technical committee slugs and legacy aliases
  'rov': '/committee/rov',
  'racing': '/committee/racing',
  'aesc': '/committee/aerial-robotics',
  'aerial': '/committee/aerial-robotics',
  'aerial-robotics': '/committee/aerial-robotics',
  'aerial_robotics': '/committee/aerial-robotics',
  'aess': '/committee/aerial-robotics',
  'part': '/committee/aerial-robotics',
  'cs': '/committee/computer-society',
  'csociety': '/committee/computer-society',
  'computer-society': '/committee/computer-society',
  'computersociety': '/committee/computer-society',
  'computer_society': '/committee/computer-society',
  'embs': '/committee/embs',
  'mtts': '/committee/mtts',
  'mtt-s': '/committee/mtts',
  'mtt_s': '/committee/mtts',
  'eds': '/committee/eds',
  'smc': '/committee/smc',
  'software-saturdays': '/committee/software-saturdays',
  'softwaresaturdays': '/committee/software-saturdays',
  'software_saturdays': '/committee/software-saturdays',
  'software': '/committee/software-saturdays',
  'social': '/committee/social',
  'growth': '/committee/growth',
  'learning': '/committee/learning',
  'workspace': '/committee/workspace',
  'infrastructure': '/committee/workspace',
  'general': '/committee/general',
  'hardware': '/committee/hardware',
  'assistive-tech': '/committee/assistive-tech',
  'assistivetech': '/committee/assistive-tech',
  'assistive_tech': '/committee/assistive-tech',

  // Static and organization legacy pages
  'sponsors': '/partners',
  'sponsorship': '/partners',
  'sponsor': '/partners',
  'bylaws': '/constitution',
  'by-laws': '/constitution',
  'constitution_and_bylaws': '/constitution',
  'history': '/about',
  'archive': '/about',
  'archives': '/about',
  'dues': '/join',
  'membership': '/join',
  'events': '/calendar',
  'leadership': '/officers',
  'exec': '/officers',
  'executive': '/officers',
  'boso': '/finance',
};

/**
 * Resolves a legacy path (e.g., "/rov/", "/rov", "/cs/index.php") to the canonical target URL, if any.
 */
export function getLegacyRedirectTarget(pathname: string): string | null {
  if (!pathname || typeof pathname !== 'string') return null;

  // Normalize pathname: remove leading/trailing slashes, index.html/index.php, query params, lowercase
  let normalized = pathname.trim().toLowerCase();
  // Strip query and hash if present
  normalized = normalized.split('?')[0].split('#')[0];
  normalized = normalized.replace(/^\/+|\/+$/g, '');
  normalized = normalized.replace(/\/(index\.(html?|php))?$/i, '');
  normalized = normalized.replace(/\.(html?|php)$/i, '');

  if (!normalized) return null;

  // Direct exact match
  if (LEGACY_REDIRECTS[normalized]) {
    return LEGACY_REDIRECTS[normalized];
  }

  // Check first path segment (e.g. "rov/team" -> "/committee/rov")
  const segments = normalized.split('/');
  const firstSegment = segments[0];
  if (firstSegment && LEGACY_REDIRECTS[firstSegment]) {
    return LEGACY_REDIRECTS[firstSegment];
  }

  return null;
}
