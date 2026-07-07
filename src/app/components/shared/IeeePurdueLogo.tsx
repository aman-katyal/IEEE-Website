import React from 'react';
import { useTheme } from 'next-themes';

interface IeeePurdueLogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  className?: string;
}

/**
 * IEEE Purdue Logo Component
 * - Uses the transparent PNG logo asset
 * - Responsive to light/dark modes with subtle filters
 */
export const IeeePurdueLogo: React.FC<IeeePurdueLogoProps> = (props) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <img
      src="/images/logo/logo_clean.png"
      alt="IEEE Purdue Logo"
      {...props}
      style={{
        display: 'block',
        filter: isLight 
          ? 'drop-shadow(0 2px 4px rgba(0, 90, 135, 0.15)) brightness(0.9)' 
          : 'none',
        transition: 'filter 0.3s ease',
        ...props.style
      }}
    />
  );
};

export default IeeePurdueLogo;
