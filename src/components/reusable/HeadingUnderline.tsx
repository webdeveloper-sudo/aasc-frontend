import React from "react";
import underline from "@/assets/images/underline/decorative-line-divider-design.webp";

const HeadingUnderline = ({ width = 300, className = "", align = "center" }) => {
  // Map align prop to Tailwind classes
  const alignClass =
    align === "left"
      ? "md:ml-0 md:mr-auto"
      : align === "right"
      ? "md:ml-auto md:mr-0"
      : "md:mx-auto"; 

  return (
    <img
      src={underline}
      width={width}
      className={`mx-auto ${alignClass} md:mb-4 mb-2 py-2 ${className}`}
      alt="underline"
    />
  );
};

export default HeadingUnderline;
