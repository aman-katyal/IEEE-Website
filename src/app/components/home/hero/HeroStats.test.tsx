import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router';
import { BranchTelemetryCard, HeroAboutCard } from './HeroStats';

describe('BranchTelemetryCard (Where Our Engineers Go)', () => {
  it('renders custom alumni companies provided from Sanity CMS', () => {
    const customCompanies = [
      { name: 'NASA JPL', domain: 'jpl.nasa.gov', roleOrField: 'Space Robotics' },
      { name: 'Tesla Motors', domain: 'tesla.com', roleOrField: 'Vehicle Autonomy' },
      { name: 'Qualcomm', domain: 'qualcomm.com', roleOrField: 'Cellular RF' },
    ];

    render(
      <MemoryRouter>
        <BranchTelemetryCard
          companies={customCompanies}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('// Where Our Engineers Intern')).toBeInTheDocument();
    expect(screen.getByText('NASA JPL')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Join a Project/i })).toHaveAttribute('href', '/committees');
    expect(screen.getByRole('link', { name: /9 Committees/i })).toHaveAttribute('href', '/committees');
  });

  it('renders nothing when CMS companies list is empty (zero hardcoding)', () => {
    const { container } = render(
      <MemoryRouter>
        <BranchTelemetryCard companies={[]} />
      </MemoryRouter>
    );

    expect(container.firstChild).toBeNull();
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
