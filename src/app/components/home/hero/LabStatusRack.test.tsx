import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router';
import { LabStatusRack, makeDisplayTitle } from './LabStatusRack';

describe('LabStatusRack', () => {
  const mockCommittees = [
    {
      id: 'rov',
      shortName: 'ROV',
      name: 'Remotely Operated Vehicles (ROV)',
      description: 'Underwater robotics team',
      meetingSchedule: 'Wednesdays at 6 PM',
    },
    {
      id: 'aerial',
      shortName: 'AERIAL',
      name: 'Aerial Robotics',
      description: 'Autonomous drones',
    },
  ];

  it('correctly strips parenthetical suffixes in makeDisplayTitle', () => {
    expect(makeDisplayTitle('Remotely Operated Vehicles (ROV)')).toBe('Remotely Operated Vehicles');
    expect(makeDisplayTitle('Computer Society')).toBe('Computer Society');
  });

  it('renders committees in the rack grid', () => {
    render(
      <MemoryRouter>
        <LabStatusRack committees={mockCommittees} isLight={false} />
      </MemoryRouter>
    );

    expect(screen.getByText('ROV')).toBeInTheDocument();
    expect(screen.getByText('Remotely Operated Vehicles')).toBeInTheDocument();
    expect(screen.getByText('AERIAL')).toBeInTheDocument();
    expect(screen.getByText('Aerial Robotics')).toBeInTheDocument();
  });

  it('shows fallback empty message when no committees are given', () => {
    render(
      <MemoryRouter>
        <LabStatusRack committees={[]} isLight={false} />
      </MemoryRouter>
    );

    expect(screen.getByText(/NO_COMMITTEES_FOUND/)).toBeInTheDocument();
  });

  it('updates detail panel on committee hover', () => {
    render(
      <MemoryRouter>
        <LabStatusRack committees={mockCommittees} isLight={false} />
      </MemoryRouter>
    );

    const rovLink = screen.getByLabelText(/Inspect committee details for Remotely Operated Vehicles/i);
    fireEvent.mouseEnter(rovLink);

    expect(screen.getByText('Underwater robotics team')).toBeInTheDocument();
    expect(screen.getByText('Go to Team')).toBeInTheDocument();
  });
});
