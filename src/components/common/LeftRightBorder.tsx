import React from "react";
import bgLeft from "@/assets/images/bg/bg-pattern-1.webp";
import bgRight from "@/assets/images/bg/bg-pattern-2.webp";

interface BorderWrapperProps {
  children: React.ReactNode;
  className?: string;
}

const LeftRightBorder: React.FC<BorderWrapperProps> = ({ children, className }) => {
  return (
    <div className={`relative w-full ${className || ""}`}>
      {/* LEFT BORDER */}
      <img
        src={bgLeft}
        alt="Left Border"
        className="
          absolute top-0 left-0
          h-full
          w-[40px] sm:w-[80px] md:w-[150px] lg:w-[220px]
          object-cover
          opacity-15
          pointer-events-none
          mix-blend-multiply
        "
      />

      {/* RIGHT BORDER */}
      <img
        src={bgRight}
        alt="Right Border"
        className="
          absolute top-0 right-0
          h-full
          w-[40px] sm:w-[80px] md:w-[150px] lg:w-[220px]
          object-cover
          opacity-15
          pointer-events-none
          mix-blend-multiply
        "
      />

      {/* MAIN CONTENT */}
      <div className="relative z-[2]">
        {children}
      </div>
    </div>
  );
};

export default LeftRightBorder;
