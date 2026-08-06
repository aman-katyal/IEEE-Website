import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ImageWithFallback } from './ImageWithFallback';

describe('ImageWithFallback', () => {
  it('renders correctly with initial src and alt', () => {
    render(<ImageWithFallback src="test-image.jpg" alt="Test Image" />);

    const img = screen.getByAltText('Test Image');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'test-image.jpg');
  });

  it('passes style, className, and other props to the standard image', () => {
    render(
      <ImageWithFallback
        src="test-image.jpg"
        alt="Test Image"
        className="custom-class"
        style={{ color: 'red' }}
        data-testid="standard-image"
      />
    );

    const img = screen.getByTestId('standard-image');
    expect(img).toHaveClass('custom-class');
    expect(img).toHaveStyle({ color: 'rgb(255, 0, 0)' }); // style in jsdom is computed
  });

  it('renders fallback image on error with ERROR_IMG_SRC and passes style and className', () => {
    render(
      <ImageWithFallback
        src="bad-image.jpg"
        alt="Test Image"
        className="test-class"
        style={{ width: '100px' }}
      />
    );

    const initialImg = screen.getByAltText('Test Image');
    fireEvent.error(initialImg); // Trigger error

    const fallbackImg = screen.getByAltText('Error loading image');
    expect(fallbackImg).toBeInTheDocument();
    expect(fallbackImg).toHaveAttribute(
      'src',
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='
    );
    expect(fallbackImg).toHaveAttribute('data-original-url', 'bad-image.jpg');

    // The fallback wrapper div should have the class and style
    const fallbackWrapper = fallbackImg.closest('div.inline-block');
    expect(fallbackWrapper).toBeInTheDocument();
    expect(fallbackWrapper).toHaveClass('inline-block', 'bg-gray-100', 'text-center', 'align-middle', 'test-class');
    expect(fallbackWrapper).toHaveStyle({ width: '100px' });
  });

  it('passes other props (like aria-labels) to fallback image', () => {
    render(
      <ImageWithFallback
        src="bad-image.jpg"
        alt="Test Image"
        aria-label="custom-aria-label"
      />
    );

    const initialImg = screen.getByAltText('Test Image');
    fireEvent.error(initialImg);

    const fallbackImg = screen.getByAltText('Error loading image');
    expect(fallbackImg).toHaveAttribute('aria-label', 'custom-aria-label');
  });
});
