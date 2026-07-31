import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PageTransition } from './PageTransition';
import * as reactRouter from 'react-router';

vi.mock('react-router', () => ({
  useLocation: vi.fn(),
}));

describe('PageTransition', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (reactRouter.useLocation as any).mockReturnValue({
      pathname: '/test-path',
    });
  });

  it('renders children correctly', () => {
    render(
      <PageTransition>
        <div data-testid="test-child">Test Child Content</div>
      </PageTransition>
    );

    const child = screen.getByTestId('test-child');
    expect(child).toBeInTheDocument();
    expect(child).toHaveTextContent('Test Child Content');
  });
});
