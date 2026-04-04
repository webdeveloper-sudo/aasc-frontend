import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import GlobalSidebar from "@/components/sidebar/GlobalSidebar";

interface PressReleasesSidebarProps {
  years: string[];
  activeYear?: string;
  onYearChange?: (year: string) => void;
}

const PressReleasesSidebar: React.FC<PressReleasesSidebarProps> = ({
  years,
  activeYear,
  onYearChange,
}) => {
  const { year: urlYear } = useParams();
  const navigate = useNavigate();

  // If handling year change manually (Preview Mode), transform items to have onClick
  // Otherwise use URL navigation for public display
  const menuItems = onYearChange
    ? years.map((year) => ({
        id: year,
        label: `Year - ${year}`,
        onClick: () => onYearChange(year),
        isActive: activeYear === year,
        url: undefined, // Remove URL to prevent Link usage in GlobalSidebar
      }))
    : years.map((year) => ({
        id: year,
        label: `Year - ${year}`,
        url: `/about/press-releases/${year}`,
        isActive: urlYear === year || (!urlYear && year === years[0]),
      }));

  return (
    <div>
      <GlobalSidebar title="Press Releases" type="none" menu={menuItems} />
    </div>
  );
};

export default PressReleasesSidebar;