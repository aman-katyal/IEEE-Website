import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router';
import { BranchTelemetryCard, HeroAboutCard } from './HeroStats';

describe('BranchTelemetryCard (Callout & Event Radar)', () => {
  const mockEvent = {
    id: 'evt-1',
    title: 'IEEE Fall 2026 General Callout',
    description: 'Come learn about our 9 technical committees and open project leadership roles!',
    location: 'EE 129 / WALC 1055',
    start: new Date('2026-09-03T18:30:00-04:00'),
    end: new Date('2026-09-03T20:00:00-04:00'),
    isAllDay: false,
    addToCalendarUrl: 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=IEEE+Callout',
    htmlLink: 'https://calendar.google.com/event?eid=123',
  };

  it('renders dynamic live event telemetry with Add to Cal link', () => {
    render(
      <MemoryRouter>
        <BranchTelemetryCard
          event={mockEvent}
          upcomingCount={5}
          hqLocation="EE 014"
        />
      </MemoryRouter>
    );

    expect(screen.getByText('// Callout & Event Radar')).toBeInTheDocument();
    expect(screen.getByText('RADAR')).toBeInTheDocument();
    expect(screen.getByText('IEEE Fall 2026 General Callout')).toBeInTheDocument();
    expect(screen.getByText('EE 129 / WALC 1055')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Add to Cal/i })).toHaveAttribute(
      'href',
      'https://calendar.google.com/calendar/render?action=TEMPLATE&text=IEEE+Callout'
    );
    expect(screen.getByRole('link', { name: /5 Events/i })).toHaveAttribute('href', '/calendar');
  });

  it('renders fallback radar view when no events are currently loaded', () => {
    render(
      <MemoryRouter>
        <BranchTelemetryCard
          event={null}
          upcomingCount={0}
          hqLocation="EE 014"
        />
      </MemoryRouter>
    );

    expect(screen.getByText('// Callout & Event Radar')).toBeInTheDocument();
    expect(screen.getByText('Upcoming Callouts & Workshops')).toBeInTheDocument();
    expect(screen.getByText(/HQ: EE 014/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Alerts/i })).toHaveAttribute(
      'href',
      'https://discord.gg/purdueieee'
    );
    expect(screen.getByRole('link', { name: /All Events/i })).toHaveAttribute('href', '/calendar');
  });
});

describe('HeroAboutCard', () => {
  it('renders about title and content', () => {
    render(
      <MemoryRouter>
        <HeroAboutCard
          aboutTitle="Premier Student Organization"
          aboutContent="Empowering students through technical leadership."
        />
      </MemoryRouter>
    );

    expect(screen.getByText('// Who we are')).toBeInTheDocument();
    expect(screen.getByText(/Premier/)).toBeInTheDocument();
    expect(screen.getByText('Empowering students through technical leadership.')).toBeInTheDocument();
    expect(screen.getByText('Read Our Heritage')).toBeInTheDocument();
  });
});
