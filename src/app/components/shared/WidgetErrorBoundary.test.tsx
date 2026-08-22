import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { WidgetErrorBoundary } from './WidgetErrorBoundary';

function BuggyComponent({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('Simulated widget render error');
  }
  return <div>Normal Content</div>;
}

describe('WidgetErrorBoundary', () => {
  it('renders children when no error occurs', () => {
    render(
      <WidgetErrorBoundary>
        <BuggyComponent shouldThrow={false} />
      </WidgetErrorBoundary>
    );

    expect(screen.getByText('Normal Content')).toBeInTheDocument();
  });

  it('renders fallback alert card and handles reset retry', () => {
    // Suppress console.warn/error output during intentional test error
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const onResetMock = vi.fn();

    const { rerender } = render(
      <WidgetErrorBoundary
        fallbackTitle="Custom Error Title"
        fallbackDescription="Custom error details"
        onReset={onResetMock}
      >
        <BuggyComponent shouldThrow={true} />
      </WidgetErrorBoundary>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Custom Error Title')).toBeInTheDocument();
    expect(screen.getByText('Custom error details')).toBeInTheDocument();

    // Click retry
    const retryBtn = screen.getByRole('button', { name: /retry loading/i });
    expect(retryBtn).toBeInTheDocument();
    fireEvent.click(retryBtn);

    expect(onResetMock).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });
});
