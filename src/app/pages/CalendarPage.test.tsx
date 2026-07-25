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
  });

  it('renders loading state correctly', () => {
    (useSanityData.useSiteSettings as any).mockReturnValue({
      loading: true,
      settings: null,
    });
    (nextThemes.useTheme as any).mockReturnValue({
      theme: 'light',
    });

    render(<CalendarPage />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders correctly with light theme and default data', () => {
    (useSanityData.useSiteSettings as any).mockReturnValue({
      loading: false,
      settings: null,
    });
    (nextThemes.useTheme as any).mockReturnValue({
      theme: 'light',
    });

    render(
      <MemoryRouter>
        <CalendarPage />
      </MemoryRouter>
    );

    expect(screen.getByText('// Full Schedule')).toBeInTheDocument();

    const iframes = document.querySelectorAll('iframe');
    expect(iframes.length).toBe(2);

    const defaultCalendarId = "7e80819a448e91ef81721772e0c6d9236076b45ad51343474265c1b7d4a363f1%40group.calendar.google.com";
    iframes.forEach((iframe) => {
      expect(iframe.src).toContain(defaultCalendarId);
      expect(iframe.style.filter).toBe('none');
    });
  });

  it('renders correctly with dark theme and custom data', () => {
    const customUrl = "https://custom-url.com";
    (useSanityData.useSiteSettings as any).mockReturnValue({
      loading: false,
      settings: {
        calendarId: 'custom-id',
        calendarUrl: customUrl,
      },
    });
    (nextThemes.useTheme as any).mockReturnValue({
      theme: 'dark',
    });

    render(
      <MemoryRouter>
        <CalendarPage />
      </MemoryRouter>
    );

    const iframes = document.querySelectorAll('iframe');
    expect(iframes.length).toBe(2);

    const darkFilter = "invert(90%) hue-rotate(180deg) brightness(1.1) contrast(90%)";
    iframes.forEach((iframe) => {
      expect(iframe.src).toContain(customUrl);
      expect(iframe.style.filter).toBe(darkFilter);
    });
  });
});
