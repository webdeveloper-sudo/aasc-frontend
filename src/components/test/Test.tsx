// FloatingPwrdBadge.jsx
// Tailwind CSS + React component (single-file)
// Usage: import FloatingPwrdBadge from './FloatingPwrdBadge';
// <FloatingPwrdBadge label="PWRD Test" href="/test-site" position="br" size="md" />

import React from 'react';

const POSITIONS = {
  br: 'bottom-6 right-6',
  bl: 'bottom-6 left-6',
  tr: 'top-6 right-6',
  tl: 'top-6 left-6',
};

export default function FloatingPwrdBadge({
  label = ' Test',
  href = '#',
  size = 'md', // sm | md | lg
  position = 'bl', // br|bl|tr|tl
  ariaLabel = 'PWRD test badge — open test site',
  showPulse = true,
}) {
  const sizes = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-14 h-14 text-base',
    lg: 'w-16 h-16 text-lg',
  };

  return (
    <div
      className={`fixed ${POSITIONS[position] || POSITIONS.br} z-50 pointer-events-auto`}
      aria-hidden="false"
    >
      <a
        href={href}
        aria-label={ariaLabel}
        className="group focus:outline-none"
      >
        <div
          className={`relative flex items-center justify-center bg-gradient-to-tr from-indigo-600 to-violet-500 text-white rounded-full shadow-xl ring-1 ring-black/10 ${sizes[size]}`}
        >
          {/* pulse ring */}
          {showPulse && (
            <span className="absolute -inset-1 rounded-full opacity-30 animate-pulse" />
          )}

          {/* circle content */}
          <span className="z-10 font-semibold tracking-tight select-none">{label}</span>

          {/* small badge notch for 'test' label */}
          <span className="absolute -top-2 -right-2 bg-white text-indigo-600 rounded-full px-1.5 py-0.5 text-xs font-medium shadow-sm hidden group-hover:inline-block">
            test
          </span>
        </div>
      </a>

      {/* accessible visually-hidden description for screen readers */}
      <span className="sr-only">{label} — opens test site</span>
    </div>
  );
}

/* Notes & tips
 - This component is Tailwind-first. Ensure Tailwind is configured in your project.
 - Props:
    label: text inside the circle
    href: link to test site
    size: sm | md | lg
    position: br | bl | tr | tl
    showPulse: boolean to toggle subtle pulsing background
 - The small white "test" notch appears on hover for visual emphasis.
 - To make it clickable with client-side routing (React Router / Next.js), replace <a href> with <Link to={href}> or <NextLink> as needed.
 - For mobile, consider reducing size to `sm` and adjusting position to avoid covering content.
*/
