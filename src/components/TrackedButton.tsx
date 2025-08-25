'use client';

import { ReactNode } from 'react';
import { trackCTA } from '@/lib/gtag';

interface TrackedButtonProps {
  children: ReactNode;
  ctaName: string;
  location: string;
  onClick?: () => void;
  className?: string;
  href?: string;
}

export default function TrackedButton({ 
  children, 
  ctaName, 
  location, 
  onClick, 
  className,
  href 
}: TrackedButtonProps) {
  const handleClick = () => {
    trackCTA(ctaName, location);
    if (onClick) onClick();
  };

  if (href) {
    return (
      <a href={href} onClick={handleClick} className={className}>
        {children}
      </a>
    );
  }

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  );
}