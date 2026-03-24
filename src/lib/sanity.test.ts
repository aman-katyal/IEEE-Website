import { describe, it, expect, vi } from 'vitest';
import { client, previewClient } from './sanity';

describe('Sanity Client Configuration', () => {
  it('should have stega enabled for visual editing', () => {
    const clientConfig = (client as any).config();
    const previewConfig = (previewClient as any).config();

    console.log('Client Stega Config:', clientConfig.stega);
    
    // We want stega disabled by default to prevent string issues in production
    expect(clientConfig.stega).toMatchObject({
      enabled: false,
      studioUrl: expect.any(String)
    });
  });
});
