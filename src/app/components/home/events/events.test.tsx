import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EventCard } from './EventCard';
import { NextEventSidebar } from './NextEventSidebar';
import { EventSkeleton } from './EventSkeleton';
import { MemoryRouter } from 'react-router';
import type { CalendarEvent } from '../../../../hooks/useGoogleCalendarEvents';

describe('EventCard', () => {
  const mockEvent: CalendarEvent = {
    id: 'e1',
    title: 'PCB Design Workshop',
    description: 'Learn schematic capture & PCB layout.',
    location: 'EE 206',
    start: new Date('2026-03-20T18:00:00'),
    end: new Date('2026-03-20T20:00:00'),
    isAllDay: false,
    addToCalendarUrl: 'https://calendar.google.com/event?eid=123',
    htmlLink: 'https://example.com/event',
  };

  it('renders event details correctly', () => {
    render(<EventCard event={mockEvent} isFirst={true} isLight={false} />);

    expect(screen.getByText('PCB Design Workshop')).toBeInTheDocument();
    expect(screen.getByText('Learn schematic capture & PCB layout.')).toBeInTheDocument();
    expect(screen.getByText('EE 206')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Add PCB Design Workshop to calendar/i })).toBeInTheDocument();
  });
});

describe('NextEventSidebar', () => {
  const mockEvent: CalendarEvent = {
    id: 'e2',
    title: 'Spring Showcase 2026',
    description: 'Showcasing our committee achievements.',
    location: 'MSEE Atrium',
    start: new Date('2026-04-10T14:00:00'),
    end: new Date('2026-04-10T17:00:00'),
    isAllDay: false,
    addToCalendarUrl: 'https://calendar.google.com/event?eid=456',
  };

  it('renders next event sidebar with links', () => {
    render(
      <MemoryRouter>
        <NextEventSidebar nextEvent={mockEvent} />
      </MemoryRouter>
    );

    expect(screen.getByText('// Next Event')).toBeInTheDocument();
    expect(screen.getByText('Spring Showcase 2026')).toBeInTheDocument();
    expect(screen.getByText('MSEE Atrium')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Add Spring Showcase 2026 to Google Calendar/i })).toBeInTheDocument();
    expect(screen.getByText('View Full Calendar')).toBeInTheDocument();
  });
});

describe('EventSkeleton', () => {
  it('renders skeleton element with event-card class', () => {
    const { container } = render(<EventSkeleton />);
    expect(container.querySelector('.event-card')).toBeInTheDocument();
  });
});
