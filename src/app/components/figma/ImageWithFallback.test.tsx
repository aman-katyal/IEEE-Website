import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ImageWithFallback } from './ImageWithFallback';

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==';

describe('ImageWithFallback', () => {
  it('renders the image normally when there is no error', () => {
    const testSrc = 'https://example.com/test-image.jpg';
    const testAlt = 'Test Image';

    render(<ImageWithFallback src={testSrc} alt={testAlt} className="custom-class" />);

    const imgElement = screen.getByRole('img');
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute('src', testSrc);
    expect(imgElement).toHaveAttribute('alt', testAlt);
    expect(imgElement).toHaveClass('custom-class');
  });

  it('renders the fallback image when an error occurs', () => {
    const testSrc = 'https://example.com/broken-image.jpg';
    const testAlt = 'Broken Image';

    render(<ImageWithFallback src={testSrc} alt={testAlt} className="custom-class" />);

    // Initially, it should be the normal image
    let imgElement = screen.getByRole('img');
    expect(imgElement).toHaveAttribute('src', testSrc);

    // Trigger error
    fireEvent.error(imgElement);

    // Now it should have rendered the fallback structure
    // Since the fallback structure replaces the original img tag with a new one
    // we need to query for the img again (it could have the same role but different attributes)

    // The fallback image has a specific alt text and src
    const fallbackImg = screen.getByAltText('Error loading image');
    expect(fallbackImg).toBeInTheDocument();
    expect(fallbackImg).toHaveAttribute('src', ERROR_IMG_SRC);
    expect(fallbackImg).toHaveAttribute('data-original-url', testSrc);

    // We can also verify the wrapper div is rendered correctly
    // Since the wrapper div applies className from props
    // We can find it by className or by testing the container
    const wrapperDiv = fallbackImg.parentElement?.parentElement;
    expect(wrapperDiv).toHaveClass('inline-block');
    expect(wrapperDiv).toHaveClass('bg-gray-100');
    expect(wrapperDiv).toHaveClass('custom-class');
  });
});
