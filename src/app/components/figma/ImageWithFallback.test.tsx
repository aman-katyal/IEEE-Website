import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ImageWithFallback } from './ImageWithFallback'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

describe('ImageWithFallback', () => {
  it('renders the provided image correctly', () => {
    render(<ImageWithFallback src="test.jpg" alt="test image" />)
    const img = screen.getByAltText('test image')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', 'test.jpg')
  })

  it('falls back to error image on error', () => {
    render(<ImageWithFallback src="test.jpg" alt="test image" />)
    const img = screen.getByAltText('test image')

    fireEvent.error(img)

    const fallbackImg = screen.getByAltText('Error loading image')
    expect(fallbackImg).toBeInTheDocument()
    expect(fallbackImg).toHaveAttribute('src', ERROR_IMG_SRC)
    expect(fallbackImg).toHaveAttribute('data-original-url', 'test.jpg')
  })
})
