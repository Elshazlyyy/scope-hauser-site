// src/components/icons.tsx
import * as React from 'react';

export type IconProps = React.SVGProps<SVGSVGElement> & {
  /** width & height (defaults to 24) */
  size?: number | string;
};

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export function ChevronLeft({ size = 24, className, ...props }: IconProps) {
  return (
    <svg width={size} height={size} className={className} {...base} {...props}>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

export function ChevronRight({ size = 24, className, ...props }: IconProps) {
  return (
    <svg width={size} height={size} className={className} {...base} {...props}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export function ChevronDown({ size = 24, className, ...props }: IconProps) {
  return (
    <svg width={size} height={size} className={className} {...base} {...props}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export function Search({ size = 24, className, ...props }: IconProps) {
  return (
    <svg width={size} height={size} className={className} {...base} {...props}>
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export function Bed({ size = 24, className, ...props }: IconProps) {
  return (
    <svg width={size} height={size} className={className} {...base} {...props}>
      {/* headboard */}
      <line x1="3" y1="7" x2="3" y2="19" />
      {/* mattress / frame */}
      <rect x="7" y="11" width="14" height="6" rx="2" />
      {/* pillow/lead-in */}
      <path d="M7 11V9a3 3 0 0 1 3-3h2" />
      {/* feet */}
      <line x1="3" y1="19" x2="21" y2="19" />
    </svg>
  );
}

export function Bath({ size = 24, className, ...props }: IconProps) {
  return (
    <svg width={size} height={size} className={className} {...base} {...props}>
      {/* tub */}
      <path d="M3 10h18v3a6 6 0 0 1-6 6H9a6 6 0 0 1-6-6v-3z" />
      {/* faucet & riser */}
      <path d="M7 10V7a3 3 0 0 1 6 0v3" />
      <line x1="5" y1="19" x2="5" y2="21" />
      <line x1="19" y1="19" x2="19" y2="21" />
    </svg>
  );
}

export function Pin({ size = 24, className, ...props }: IconProps) {
  return (
    <svg width={size} height={size} className={className} {...base} {...props}>
      <path d="M12 21s-6-4.35-6-9a6 6 0 1 1 12 0c0 4.65-6 9-6 9z" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

export function Ruler({ size = 24, className, ...props }: IconProps) {
  return (
    <svg width={size} height={size} className={className} {...base} {...props}>
      <rect x="3" y="7" width="18" height="10" rx="2" />
      {/* tick marks */}
      <line x1="7" y1="7" x2="7" y2="10" />
      <line x1="11" y1="7" x2="11" y2="10" />
      <line x1="15" y1="7" x2="15" y2="10" />
      <line x1="19" y1="10" x2="16" y2="10" />
      <line x1="19" y1="14" x2="16" y2="14" />
    </svg>
  );
}
