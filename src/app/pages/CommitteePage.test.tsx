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
    expect(screen.getByText('Test Committee')).toBeInTheDocument();

    // Verify section renders
    expect(screen.getByText(/Section Title/)).toBeInTheDocument();
    expect(screen.getByText(/This is test content/)).toBeInTheDocument();
  });
});
