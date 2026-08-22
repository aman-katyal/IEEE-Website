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

  it('falls back to error placeholder on error', () => {
    render(<ImageWithFallback src="test.jpg" alt="test image" />)
    const img = screen.getByAltText('test image')

    fireEvent.error(img)

    const fallback = screen.getByTestId('image-fallback')
    expect(fallback).toBeInTheDocument()
    expect(fallback).toHaveAttribute('data-original-url', 'test.jpg')
  })

  it('renders aspect-ratio inline style to eliminate layout shift', () => {
    render(<ImageWithFallback src="banner.jpg" alt="banner" aspectRatio="16/9" />)
    const img = screen.getByAltText('banner')
    expect(img).toHaveStyle({ aspectRatio: '16/9' })
  })

  it('renders LQIP blur container when lqip prop is provided', () => {
    render(
      <ImageWithFallback
        src="banner.jpg"
        alt="banner"
        lqip="data:image/jpeg;base64,/9j/4AAQSkZJRg=="
      />
    )
    const container = screen.getByTestId('lqip-container')
    expect(container).toBeInTheDocument()
    const fullImg = screen.getByAltText('banner')
    expect(fullImg).toBeInTheDocument()

    // Trigger full image load
    fireEvent.load(fullImg)
    expect(fullImg).toHaveClass('opacity-100')
  })
})
