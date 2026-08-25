import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router';
import { BranchTelemetryCard, HeroAboutCard } from './HeroStats';

describe('BranchTelemetryCard', () => {
  it('renders all provided telemetry data', () => {
    render(
      <MemoryRouter>
        <BranchTelemetryCard
          hqLocation="EE 115"
          committeesCount={8}
          discordMembers="1,500+ Members"
          campusLocation="Purdue University, West Lafayette"
        />
      </MemoryRouter>
    );

    expect(screen.getByText('// Branch Overview')).toBeInTheDocument();
    expect(screen.getByText('EE 115')).toBeInTheDocument();
    expect(screen.getByText('8 Committees')).toBeInTheDocument();
    expect(screen.getByText('Join Now →')).toBeInTheDocument();
    expect(screen.getByText('1,500+ Members')).toBeInTheDocument();
    expect(screen.getByText('Purdue University, West Lafayette')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Teams/i })).toHaveAttribute('href', '/committees');
    expect(screen.getByRole('link', { name: /Events/i })).toHaveAttribute('href', '/calendar');
    expect(screen.getByRole('link', { name: /Finance/i })).toHaveAttribute('href', '/finance');
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
