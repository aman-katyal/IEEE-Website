import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Layout } from './Layout';
import { MemoryRouter, Routes, Route, useNavigate } from 'react-router';
import userEvent from '@testing-library/user-event';

vi.mock('./Navigation', () => ({
  Navigation: () => <div data-testid="mock-navigation">Mock Navigation</div>,
}));

vi.mock('./Footer', () => ({
  Footer: () => <div data-testid="mock-footer">Mock Footer</div>,
}));

const TestComponent = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div data-testid="mock-outlet">Mock Outlet</div>
      <button onClick={() => navigate('/other')}>Go to other page</button>
    </div>
  );
};

const OtherComponent = () => {
  return <div data-testid="mock-other">Other Component</div>;
};

describe('Layout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('scrollTo', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders Navigation, Footer, and Outlet correctly', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<TestComponent />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('mock-navigation')).toBeInTheDocument();
    expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
    expect(screen.getByTestId('mock-outlet')).toBeInTheDocument();
  });

  it('scrolls to top on route change', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<TestComponent />} />
            <Route path="/other" element={<OtherComponent />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    // Should scroll on initial render
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);

    // Clear initial call
    (window.scrollTo as any).mockClear();

    // Navigate to other page
    const button = screen.getByText('Go to other page');
    await act(async () => {
      await user.click(button);
    });

    // Should render other component and scroll to top again
    expect(screen.getByTestId('mock-other')).toBeInTheDocument();
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });
});
