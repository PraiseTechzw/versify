import React from 'react'

interface VersifyLogoProps {
  size?: number
  className?: string
  animated?: boolean
  theme?: 'light' | 'dark' | 'auto'
}

export function VersifyLogo({ size = 32, className = "", animated = true, theme = 'auto' }: VersifyLogoProps) {
  const logoColor = theme === 'light' ? '#000000' : theme === 'dark' ? '#FFFFFF' : 'currentColor'
  
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background Gradient Circle */}
      <circle
        cx="50"
        cy="50"
        r="46"
        fill={theme === 'auto' ? "url(#bgGradient)" : logoColor}
        opacity="0.15"
      />
      
      {/* Outer Ring */}
      <circle
        cx="50"
        cy="50"
        r="46"
        stroke={theme === 'auto' ? "url(#ringGradient)" : logoColor}
        strokeWidth="2"
        fill="none"
        opacity="0.6"
      />
      
      {/* Inner Glow Circle */}
      <circle
        cx="50"
        cy="50"
        r="40"
        fill={theme === 'auto' ? "url(#glowGradient)" : logoColor}
        opacity="0.1"
      />
      
      {/* Main Feather/Quill - Enhanced */}
      <g transform="translate(35, 25)">
        {/* Quill Shaft */}
        <path
          d="M15 5 L8 45 L10 47 L17 7 Z"
          fill={theme === 'auto' ? "url(#quillGradient)" : logoColor}
          stroke={logoColor}
          strokeWidth="1"
          opacity="0.9"
        />
        
        {/* Feather Vanes - Left Side */}
        <path
          d="M15 10 Q10 12 8 15 L10 16 Q12 13 15 12 Z"
          fill={logoColor}
          opacity="0.3"
        />
        <path
          d="M15 18 Q9 20 7 24 L9 25 Q11 21 15 20 Z"
          fill={logoColor}
          opacity="0.25"
        />
        <path
          d="M14 26 Q8 28 6 33 L8 34 Q10 29 14 28 Z"
          fill={logoColor}
          opacity="0.2"
        />
        
        {/* Feather Vanes - Right Side */}
        <path
          d="M17 12 Q22 14 24 17 L22 18 Q20 15 17 14 Z"
          fill={logoColor}
          opacity="0.3"
        />
        <path
          d="M17 20 Q23 22 25 26 L23 27 Q21 23 17 22 Z"
          fill={logoColor}
          opacity="0.25"
        />
        <path
          d="M16 28 Q22 30 24 35 L22 36 Q20 31 16 30 Z"
          fill={logoColor}
          opacity="0.2"
        />
        
        {/* Quill Tip - Sharp Point */}
        <path
          d="M8 45 L10 47 L9 50 Z"
          fill={theme === 'auto' ? "url(#tipGradient)" : logoColor}
        />
        
        {/* Feather Top - Decorative */}
        <ellipse
          cx="16"
          cy="7"
          rx="6"
          ry="4"
          fill={logoColor}
          opacity="0.4"
        />
      </g>
      
      {/* Poetry Lines - Flowing */}
      <g opacity="0.6">
        <path
          d="M20 65 Q30 63 40 65 T60 65"
          stroke={theme === 'auto' ? "url(#lineGradient1)" : logoColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M20 72 Q28 70 38 72 T55 72"
          stroke={theme === 'auto' ? "url(#lineGradient2)" : logoColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M20 79 Q26 77 35 79 T50 79"
          stroke={theme === 'auto' ? "url(#lineGradient3)" : logoColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
      </g>
      
      {/* AI Sparkles - Enhanced */}
      <g opacity="0.9">
        {/* Large Sparkle */}
        <g transform="translate(70, 30)">
          <path
            d="M0 -6 L1 -1 L6 0 L1 1 L0 6 L-1 1 L-6 0 L-1 -1 Z"
            fill={logoColor}
          >
            {animated && (
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 0 0"
                to="360 0 0"
                dur="8s"
                repeatCount="indefinite"
              />
            )}
          </path>
          {animated && (
            <animate
              attributeName="opacity"
              values="0.5;1;0.5"
              dur="2s"
              repeatCount="indefinite"
            />
          )}
        </g>
        
        {/* Medium Sparkle */}
        <g transform="translate(78, 22)">
          <path
            d="M0 -4 L0.7 -0.7 L4 0 L0.7 0.7 L0 4 L-0.7 0.7 L-4 0 L-0.7 -0.7 Z"
            fill={logoColor}
          >
            {animated && (
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 0 0"
                to="-360 0 0"
                dur="6s"
                repeatCount="indefinite"
              />
            )}
          </path>
          {animated && (
            <animate
              attributeName="opacity"
              values="0.4;0.9;0.4"
              dur="2.5s"
              repeatCount="indefinite"
            />
          )}
        </g>
        
        {/* Small Sparkle */}
        <g transform="translate(75, 40)">
          <circle r="2" fill={logoColor}>
            {animated && (
              <animate
                attributeName="r"
                values="1.5;2.5;1.5"
                dur="3s"
                repeatCount="indefinite"
              />
            )}
            {animated && (
              <animate
                attributeName="opacity"
                values="0.3;0.8;0.3"
                dur="3s"
                repeatCount="indefinite"
              />
            )}
          </circle>
        </g>
      </g>
      
      {/* Image/Photo Icon - Bottom Right */}
      <g transform="translate(62, 62)" opacity="0.5">
        <rect
          width="14"
          height="12"
          rx="2"
          stroke={logoColor}
          strokeWidth="1.5"
          fill="none"
        />
        <circle cx="5" cy="4" r="1.5" fill={logoColor} />
        <path
          d="M2 10 L5 7 L8 9 L12 5"
          stroke={logoColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>
      
      {/* Gradient Definitions */}
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={logoColor} stopOpacity="0.2" />
          <stop offset="100%" stopColor={logoColor} stopOpacity="0.05" />
        </linearGradient>
        
        <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={logoColor} stopOpacity="0.8" />
          <stop offset="100%" stopColor={logoColor} stopOpacity="0.3" />
        </linearGradient>
        
        <radialGradient id="glowGradient" cx="50%" cy="50%">
          <stop offset="0%" stopColor={logoColor} stopOpacity="0.3" />
          <stop offset="100%" stopColor={logoColor} stopOpacity="0" />
        </radialGradient>
        
        <linearGradient id="quillGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={logoColor} stopOpacity="0.9" />
          <stop offset="100%" stopColor={logoColor} stopOpacity="0.6" />
        </linearGradient>
        
        <linearGradient id="tipGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={logoColor} stopOpacity="0.8" />
          <stop offset="100%" stopColor={logoColor} stopOpacity="1" />
        </linearGradient>
        
        <linearGradient id="lineGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={logoColor} stopOpacity="0.7" />
          <stop offset="100%" stopColor={logoColor} stopOpacity="0.1" />
        </linearGradient>
        
        <linearGradient id="lineGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={logoColor} stopOpacity="0.6" />
          <stop offset="100%" stopColor={logoColor} stopOpacity="0.1" />
        </linearGradient>
        
        <linearGradient id="lineGradient3" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={logoColor} stopOpacity="0.5" />
          <stop offset="100%" stopColor={logoColor} stopOpacity="0.1" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default VersifyLogo