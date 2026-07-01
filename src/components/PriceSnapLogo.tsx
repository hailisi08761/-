import React from 'react';

interface PriceSnapLogoProps {
  className?: string;
}

export function PriceSnapLogo({ className = "w-16 h-16" }: PriceSnapLogoProps) {
  return (
    <svg 
      className={className} 
      viewBox="31 51 410 410" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* 
          Mask for the rotated price tag:
          - White area (#FFFFFF) keeps the shapes visible.
          - Black area (#000000) creates transparent cutouts (lightning bolt gap and hole).
        */}
        <mask id="tag-mask">
          {/* Base shape of the tag: white to retain these pixels */}
          <rect 
            x="-135" 
            y="-75" 
            width="270" 
            height="150" 
            rx="38" 
            fill="#FFFFFF" 
          />
          
          {/* Circular hole cutout on the top-right of the tag */}
          <circle cx="80" cy="-35" r="13" fill="#000000" />
          
          {/* Lightning bolt cutout separating the two halves */}
          <path 
            d="M -150,22 L 5,22 L -20,-22 L 150,-22" 
            stroke="#000000" 
            strokeWidth="16" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            fill="none" 
          />
        </mask>
      </defs>

      {/* 
        Rotated Price Tag Group
        - Centered at (190, 256)
        - Rotated at -35 degrees for an elegant SaaS tilt
        - Uses the transparent mask to cut out the lightning bolt and the tag hole
      */}
      <g transform="translate(190, 256) rotate(-35)">
        <g mask="url(#tag-mask)">
          {/* Top-Left Half (Deep Navy #0F172A) */}
          <path 
            d="M -160,-110 L 160,-110 L 160,-22 L -20,-22 L 5,22 L -160,22 Z" 
            fill="#0F172A" 
          />
          
          {/* Bottom-Right Half (Electric Blue #3B82F6) */}
          <path 
            d="M -160,110 L 160,110 L 160,-22 L -20,-22 L 5,22 L -160,22 Z" 
            fill="#3B82F6" 
          />
        </g>
      </g>

      {/* Cyan Accent (#22D3EE) Data Pulse / Soundwave representing pricing intelligence */}
      <g>
        {/* Leftmost pointing caret */}
        <path 
          d="M 315,256 L 327,248 L 327,264 Z" 
          fill="#22D3EE" 
        />
        
        {/* Bar 1 (Small Pulse) */}
        <rect x="335" y="247" width="11" height="18" rx="5.5" fill="#22D3EE" />
        
        {/* Bar 2 (Medium Pulse) */}
        <rect x="353" y="222" width="11" height="68" rx="5.5" fill="#22D3EE" />
        
        {/* Bar 3 (Tallest Pulse - Central Peak) */}
        <rect x="371" y="190" width="11" height="132" rx="5.5" fill="#22D3EE" />
        
        {/* Bar 4 (Medium-Tall Pulse) */}
        <rect x="389" y="210" width="11" height="92" rx="5.5" fill="#22D3EE" />
        
        {/* Bar 5 (Medium Pulse) */}
        <rect x="407" y="228" width="11" height="56" rx="5.5" fill="#22D3EE" />
        
        {/* Bar 6 (Small Pulse) */}
        <rect x="425" y="247" width="11" height="18" rx="5.5" fill="#22D3EE" />
      </g>
    </svg>
  );
}

export default PriceSnapLogo;
