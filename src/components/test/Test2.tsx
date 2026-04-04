// FloatingPwrdBadge.jsx
// Tailwind CSS + React

import React from "react";
import { ChevronUp } from "lucide-react";

const POSITIONS = {
  br: "bottom-6 right-6",
  bl: "bottom-6 left-6",
  tr: "top-6 right-6",
  tl: "top-6 left-6",
};

export default function FloatingPwrdBadge({
  href = "#",
  size = "sm", // sm | md | lg
  position = "br",
  ariaLabel = "Scroll to top",
  showPulse = true,
}) {
  const sizes = {
    sm: "w-10 h-10",
    md: "w-14 h-14",
    lg: "w-16 h-16",
  };

  return (
    <div className={`fixed ${POSITIONS[position]} z-50 pointer-events-auto`}>
      <a
        href={href}
        aria-label={ariaLabel}
        className="group block focus:outline-none"
      >
        <div
          className={`relative flex items-center justify-center bg-[#EB1E36] text-white rounded shadow-xl ring-1 ring-black/10 ${sizes[size]}`}
        >
          {/* pulse effect
          {showPulse && (
            <span className="absolute -inset-1 rounded-full opacity-30 animate-ping bg-[#EB1E36]" />
          )} */}

          {/* MAIN ICON (ChevronUp inside the badge) */}
          <ChevronUp
            size={size === "lg" ? 30 : size === "md" ? 26 : 22}
            strokeWidth={2}
            className="z-10"
          />
        </div>
      </a>

      <span className="sr-only">Opens test site</span>
    </div>
  );
}
