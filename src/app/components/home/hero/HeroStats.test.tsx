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
          highlightText="Top Robotics & Cellular Destinations"
        />
      </MemoryRouter>
    );

    expect(screen.getByText('// Where Our Engineers Go')).toBeInTheDocument();
    expect(screen.getByText('TOP DESTINATIONS')).toBeInTheDocument();
    expect(screen.getByText('NASA JPL')).toBeInTheDocument();
    expect(screen.getByText('Tesla Motors')).toBeInTheDocument();
    expect(screen.getByText('Qualcomm')).toBeInTheDocument();
    expect(screen.getByText('Top Robotics & Cellular Destinations')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^Partners$/i })).toHaveAttribute('href', '/partners');
    expect(screen.getByRole('link', { name: /View All Partners/i })).toHaveAttribute('href', '/partners');
  });

  it('renders default high-profile engineering destinations when CMS list is empty', () => {
    render(
      <MemoryRouter>
        <BranchTelemetryCard companies={[]} />
      </MemoryRouter>
    );

    expect(screen.getByText('// Where Our Engineers Go')).toBeInTheDocument();
    expect(screen.getByText('TOP DESTINATIONS')).toBeInTheDocument();
    expect(screen.getByText('SpaceX')).toBeInTheDocument();
    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('Tesla')).toBeInTheDocument();
    expect(screen.getByText('Texas Instruments')).toBeInTheDocument();
    expect(screen.getByText('Top Tech, Aerospace & Semiconductor Destinations')).toBeInTheDocument();
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
