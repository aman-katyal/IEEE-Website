import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CalendarPage } from './CalendarPage';
import { MemoryRouter } from 'react-router';
import * as useSanityData from '../../hooks/useSanityData';
import * as nextThemes from 'next-themes';

vi.mock('../../hooks/useSanityData', () => ({
  useSiteSettings: vi.fn(),
}));

vi.mock('next-themes', () => ({
  useTheme: vi.fn(),
}));

describe('CalendarPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (nextThemes.useTheme as any).mockReturnValue({
      theme: 'light',
    });
  });

  it('renders loading state', () => {
    (useSanityData.useSiteSettings as any).mockReturnValue({
      settings: null,
      loading: true,
    });

    render(
      <MemoryRouter>
        <CalendarPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders default calendar in light theme', () => {
    (useSanityData.useSiteSettings as any).mockReturnValue({
      settings: null,
      loading: false,
    });

    const { container } = render(
      <MemoryRouter>
        <CalendarPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Back to Home')).toBeInTheDocument();
    expect(screen.getByText('Subscribe to Calendar')).toBeInTheDocument();

    const subscribeLink = screen.getByRole('link', { name: /Subscribe to Calendar/i });
    expect(subscribeLink).toHaveAttribute('href', expect.stringContaining('7e80819a448e91ef81721772e0c6d9236076b45ad51343474265c1b7d4a363f1'));

    const iframes = container.querySelectorAll('iframe');
    expect(iframes.length).toBe(2);
    expect(iframes[0].src).toContain('mode=MONTH');
    expect(iframes[0]).toHaveAttribute('loading', 'lazy');
    expect(iframes[0]).toHaveAttribute('title', 'Purdue IEEE Monthly Events Calendar');
    expect(iframes[1].src).toContain('mode=AGENDA');
    expect(iframes[1]).toHaveAttribute('loading', 'lazy');
    expect(iframes[1]).toHaveAttribute('title', 'Purdue IEEE Agenda and Upcoming Overview');
    expect(iframes[0].style.filter).toBe('none');

    // Skeletons are visible initially
    expect(screen.getByTestId('month-calendar-skeleton')).toBeInTheDocument();
    expect(screen.getByTestId('agenda-calendar-skeleton')).toBeInTheDocument();
  });

  it('renders custom calendar from CMS and applies dark theme filter', () => {
    (nextThemes.useTheme as any).mockReturnValue({
      theme: 'dark',
    });

    (useSanityData.useSiteSettings as any).mockReturnValue({
      settings: {
        calendarId: 'custom-cal-id@group.calendar.google.com',
        calendarUrl: 'https://custom.calendar.url'
      },
      loading: false,
    });

    const { container } = render(
      <MemoryRouter>
        <CalendarPage />
      </MemoryRouter>
    );

    const subscribeLink = screen.getByRole('link', { name: /Subscribe to Calendar/i });
    expect(subscribeLink).toHaveAttribute('href', expect.stringContaining('custom-cal-id'));

    const iframes = container.querySelectorAll('iframe');
    expect(iframes.length).toBe(2);
    expect(iframes[0].src).toContain('https://custom.calendar.url');
    expect(iframes[0].style.filter).toContain('invert(90%)');
    expect(iframes[0]).toHaveAttribute('loading', 'lazy');
  });
});
