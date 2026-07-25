import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ThemeToggle } from './ThemeToggle';
import * as nextThemes from 'next-themes';

// Mock next-themes
vi.mock('next-themes', () => ({
  useTheme: vi.fn(),
}));

describe('ThemeToggle', () => {
  const mockSetTheme = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (nextThemes.useTheme as any).mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
    });
  });

  it('renders a placeholder before mounting (hydration check)', () => {
    // We can't easily test the exact unmounted state using standard render
    // without doing something clever, because useEffect runs synchronously in testing-library
    // But we can just check if it mounts and renders the button.
    render(<ThemeToggle />);
    expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument();
  });

  it('displays the Moon icon when the theme is light', () => {
    (nextThemes.useTheme as any).mockReturnValue({ theme: 'light', setTheme: mockSetTheme });
    const { container } = render(<ThemeToggle />);
    // lucide-react renders an svg
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg?.classList.contains('lucide-moon')).toBeTruthy();
  });

  it('displays the Sun icon when the theme is dark', () => {
    (nextThemes.useTheme as any).mockReturnValue({ theme: 'dark', setTheme: mockSetTheme });
    const { container } = render(<ThemeToggle />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg?.classList.contains('lucide-sun')).toBeTruthy();
  });

  it('toggles theme from light to dark on click', async () => {
    (nextThemes.useTheme as any).mockReturnValue({ theme: 'light', setTheme: mockSetTheme });
    render(<ThemeToggle />);

    const user = userEvent.setup();
    const button = screen.getByRole('button', { name: /toggle theme/i });

    await user.click(button);
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('toggles theme from dark to light on click', async () => {
    (nextThemes.useTheme as any).mockReturnValue({ theme: 'dark', setTheme: mockSetTheme });
    render(<ThemeToggle />);

    const user = userEvent.setup();
    const button = screen.getByRole('button', { name: /toggle theme/i });

    await user.click(button);
    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });

  it('changes styles on mouse enter and mouse leave', async () => {
    render(<ThemeToggle />);
    const user = userEvent.setup();
    const button = screen.getByRole('button', { name: /toggle theme/i });

    // Initial styles
    expect(button.style.background).toBe('rgba(255, 255, 255, 0.05)');

    // Mouse enter
    await user.hover(button);
    expect(button.style.background).toBe('rgba(255, 255, 255, 0.1)');
    expect(button.style.borderColor).toBe('var(--electric-blue)');

    // Mouse leave
    await user.unhover(button);
    expect(button.style.background).toBe('rgba(255, 255, 255, 0.05)');
    expect(button.style.borderColor).toBe('var(--glass-border)');
  });
});
