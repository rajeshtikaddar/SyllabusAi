import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: number;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ className = 'w-10 h-10', size = 40 }) => {
  return (
    <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 text-white shadow-lg border border-white/20 overflow-hidden flex-shrink-0 ${className}`}>
      <div className="absolute inset-0 bg-white/10 backdrop-blur-xs pointer-events-none" />
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="p-1 relative z-10"
      >
        {/* Book Left Page & Circuit Paths */}
        <path
          d="M20 22C20 22 28 20 45 28V80C28 72 20 74 20 74V22Z"
          stroke="white"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M27 35H37M27 47H40M27 59H35"
          stroke="white"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        
        {/* Brain Circuit Right Side */}
        <path
          d="M48 28C58 20 76 22 80 34C84 46 76 56 82 68C86 76 74 84 50 80V28"
          stroke="white"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Circuit Nodes */}
        <circle cx="62" cy="38" r="3.5" fill="white" />
        <circle cx="72" cy="50" r="3.5" fill="white" />
        <circle cx="64" cy="65" r="3.5" fill="white" />
        <circle cx="37" cy="35" r="3" fill="white" />
        <circle cx="40" cy="47" r="3" fill="white" />

        {/* Connecting Neural Lines */}
        <path
          d="M48 38H58L62 38M48 50H68L72 50M48 65H60L64 65"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Sparkle Star at Top Right */}
        <path
          d="M84 14L86 22L94 24L86 26L84 34L82 26L74 24L82 22L84 14Z"
          fill="#e0e7ff"
        />
      </svg>
    </div>
  );
};
