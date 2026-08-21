import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { CommitteePage } from './CommitteePage';
import { vi, describe, it, expect } from 'vitest';
import * as useSanityData from '../../hooks/useSanityData';

// Mock the hook
vi.mock('../../hooks/useSanityData', () => ({
  useCommittee: vi.fn(),
}));

// Mock next-themes
vi.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'dark' }),
}));

describe('CommitteePage Rendering', () => {
  it('should render content sections from Sanity', () => {
    const mockCommittee = {
      id: 'test-committee',
      name: 'Test Committee',
      tagline: 'Testing tagline',
      description: 'Short description',
      longDescription: 'Long description',
      status: 'Active',
      statusColor: '#000',
      statusBg: '#fff',
      image: 'test-image.jpg',
      tags: ['test'],
      chair: 'Test Chair',
      email: 'test@example.com',
      metrics: [{ label: 'Members', value: '10' }],
      sections: [
        {
          type: 'text',
          title: 'Section Title',
          content: 'This is test content that should be visible.',
        }
      ]
    };

    (useSanityData.useCommittee as any).mockReturnValue({
      committee: mockCommittee,
      loading: false,
      error: null,
    });

    render(
      <MemoryRouter initialEntries={['/committee/test-committee']}>
        <Routes>
          <Route path="/committee/:id" element={<CommitteePage />} />
        </Routes>
      </MemoryRouter>
    );

    // Verify header renders
    expect(screen.getByRole('heading', { name: 'Test Committee' })).toBeInTheDocument();

    // Verify 'Active' status badge is not rendered
    expect(screen.queryByText(/^Active/i)).not.toBeInTheDocument();

    // Verify section renders
    expect(screen.getByText(/Section Title/)).toBeInTheDocument();
    expect(screen.getByText(/This is test content/)).toBeInTheDocument();
  });

  it('should render non-active status badge when committee status is not Active', () => {
    const mockArchivedCommittee = {
      id: 'archived-committee',
      name: 'Archived Committee',
      tagline: 'Legacy tagline',
      description: 'Legacy description',
      longDescription: 'Legacy long description',
      status: 'Archived',
      statusColor: '#ff0000',
      statusBg: '#330000',
      image: 'test-image.jpg',
      tags: ['legacy'],
      chair: 'Legacy Chair',
      email: 'legacy@example.com',
      metrics: [],
      sections: [],
    };

    (useSanityData.useCommittee as any).mockReturnValue({
      committee: mockArchivedCommittee,
      loading: false,
      error: null,
    });

    render(
      <MemoryRouter initialEntries={['/committee/archived-committee']}>
        <Routes>
          <Route path="/committee/:id" element={<CommitteePage />} />
        </Routes>
      </MemoryRouter>
    );

    // Verify non-active status is displayed
    expect(screen.getByText('Archived')).toBeInTheDocument();
  });

  it('should not display the Flagship tag for the first project if flagship is false or undefined', () => {
    const mockCommitteeWithProjects = {
      id: 'projects-committee',
      name: 'Projects Committee',
      tagline: 'Projects tagline',
      description: 'Projects description',
      longDescription: 'Projects long description',
      status: 'Active',
      statusColor: '#000',
      statusBg: '#fff',
      image: 'test-image.jpg',
      tags: ['projects'],
      chair: 'Projects Chair',
      email: 'projects@example.com',
      metrics: [],
      sections: [
        {
          type: 'projects',
          title: 'Featured Projects',
          items: [
            {
              name: 'First Standard Project',
              description: 'Standard project without flagship tag',
            },
            {
              name: 'Second Standard Project',
              description: 'Another standard project',
            },
          ],
        },
      ],
    };

    (useSanityData.useCommittee as any).mockReturnValue({
      committee: mockCommitteeWithProjects,
      loading: false,
      error: null,
    });

    render(
      <MemoryRouter initialEntries={['/committee/projects-committee']}>
        <Routes>
          <Route path="/committee/:id" element={<CommitteePage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('First Standard Project')).toBeInTheDocument();
    expect(screen.queryByText(/★ Flagship/i)).not.toBeInTheDocument();
  });

  it('should display the Flagship tag when flagship is true', () => {
    const mockCommitteeWithFlagship = {
      id: 'flagship-committee',
      name: 'Flagship Committee',
      tagline: 'Flagship tagline',
      description: 'Flagship description',
      longDescription: 'Flagship long description',
      status: 'Active',
      statusColor: '#000',
      statusBg: '#fff',
      image: 'test-image.jpg',
      tags: ['flagship'],
      chair: 'Flagship Chair',
      email: 'flagship@example.com',
      metrics: [],
      sections: [
        {
          type: 'projects',
          title: 'Flagship Projects',
          items: [
            {
              name: 'Standard Project',
              description: 'Not a flagship project',
              flagship: false,
            },
            {
              name: 'Flagship Project',
              description: 'A genuine flagship project',
              flagship: true,
            },
          ],
        },
      ],
    };

    (useSanityData.useCommittee as any).mockReturnValue({
      committee: mockCommitteeWithFlagship,
      loading: false,
      error: null,
    });

    render(
      <MemoryRouter initialEntries={['/committee/flagship-committee']}>
        <Routes>
          <Route path="/committee/:id" element={<CommitteePage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Flagship Project')).toBeInTheDocument();
    expect(screen.getByText(/★ Flagship/i)).toBeInTheDocument();
  });
});

