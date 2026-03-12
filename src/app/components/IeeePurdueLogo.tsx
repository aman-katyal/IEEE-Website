import React from 'react';

interface IeeePurdueLogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  className?: string;
}

/**
 * IEEE Purdue Logo Component
 * - Temporarily using processed PNG for better stability
 */
export const IeeePurdueLogo: React.FC<IeeePurdueLogoProps> = (props) => {
  return (
    <img 
      src="/images/logo/logo_clean.png" 
      alt="IEEE Purdue Logo" 
      {...props}
      style={{
        display: 'block',
        ...props.style
      }}
    />
  );
};

export default IeeePurdueLogo;
