import React from 'react';

interface TernakLogoProps {
  className?: string;
  size?: number;
}

export const TernakLogo: React.FC<TernakLogoProps> = ({ className = 'w-10 h-10', size = 40 }) => {
  return (
    <div className={`relative flex items-center justify-center rounded-xl bg-[#23472a] text-white p-1.5 shadow-sm ${className}`} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 100 100"
        fill="currentColor"
        className="w-full h-full text-white"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Bull Horns */}
        <path
          d="M 12 35 C 10 22, 22 14, 34 22 C 30 25, 27 30, 26 36 Z"
          fill="currentColor"
        />
        <path
          d="M 88 35 C 90 22, 78 14, 66 22 C 70 25, 73 30, 74 36 Z"
          fill="currentColor"
        />
        
        {/* Bull Ears */}
        <ellipse cx="20" cy="42" rx="14" ry="7" transform="rotate(-15 20 42)" fill="currentColor" />
        <ellipse cx="80" cy="42" rx="14" ry="7" transform="rotate(15 80 42)" fill="currentColor" />
        
        {/* Bull Head Contour */}
        <path
          d="M 28 32 C 35 28, 65 28, 72 32 C 76 44, 75 58, 68 76 C 65 84, 57 88, 50 88 C 43 88, 35 84, 32 76 C 25 58, 24 44, 28 32 Z"
          fill="currentColor"
        />
        
        {/* Barcode on forehead (White stripes cut into the forehead) */}
        <g fill="#23472a">
          {/* We cut stripes using the background color or overlay */}
        </g>
        <rect x="36" y="36" width="3.5" height="18" fill="#ffffff" rx="1" />
        <rect x="42" y="36" width="2" height="18" fill="#ffffff" rx="0.5" />
        <rect x="46.5" y="36" width="4.5" height="18" fill="#ffffff" rx="1" />
        <rect x="53.5" y="36" width="2" height="18" fill="#ffffff" rx="0.5" />
        <rect x="57.5" y="36" width="4" height="18" fill="#ffffff" rx="1" />
        
        {/* Muzzle / Nose ring */}
        <circle cx="43" cy="74" r="2.5" fill="#ffffff" />
        <circle cx="57" cy="74" r="2.5" fill="#ffffff" />
      </svg>
    </div>
  );
};
