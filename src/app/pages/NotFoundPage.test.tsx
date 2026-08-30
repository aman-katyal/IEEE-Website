import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { NotFoundPage } from './NotFoundPage';
import { MemoryRouter } from 'react-router';

describe('NotFoundPage', () => {
  it('renders 404 page correctly', () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    expect(screen.getByText(/We couldn't find the page you were looking for/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Back to Home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Back to Home/i })).toHaveAttribute('href', '/');
  });
});
