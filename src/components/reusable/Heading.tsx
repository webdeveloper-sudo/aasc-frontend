import React from "react";

interface HeadingProps {
  title: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  align?: "left" | "center" | "right";
  className?: string;
}

const Heading: React.FC<HeadingProps> = ({
  title,
  size = "md",
  align = "center",
  className = "",
}) => {
  // Font size mapping for mobile + desktop
  const sizeMap = {
    sm: "text-xl md:text-xl",
    md: "text-2xl md:text-2xl",
    lg: "text-2xl md:text-3xl",
    xl: "text-3xl md:text-4xl",
  };

  // Alignment (mobile always centered)
  const alignMap = {
    left: "text-center md:text-left",
    center: "text-center md:text-center",
    right: "text-center md:text-right",
  };

  // Dynamic tag mapping
  const tagMap = {
    xl: "h1",
    lg: "h2",
    md: "h3",
    sm: "h4",
  } as const;

  const Tag = tagMap[size];

  return (
    <Tag
      className={`${sizeMap[size]} ${alignMap[align]} font-bold text-purple capitalize ${className}`}
    >
      {title}
    </Tag>
  );
};

export default Heading;
