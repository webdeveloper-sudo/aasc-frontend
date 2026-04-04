import React from "react";
import { useParams } from "react-router-dom";
import GlobalSidebar from "@/components/sidebar/GlobalSidebar";

interface MonthSection {
  sectiontitle: string;
  entries: any[];
}

interface AASCBeatsSidebarProps {
  months: string[];
  sourceData: { [month: string]: MonthSection };
  activeMonth?: string;
  onMonthChange?: (month: string) => void;
}

const AASCBeatsSidebar: React.FC<AASCBeatsSidebarProps> = ({
  months,
  sourceData,
  activeMonth,
  onMonthChange,
}) => {
  const { month: urlMonth } = useParams();

  // If handling month change manually (Preview Mode), transform items to have onClick
  // Otherwise use URL navigation for public display
  const menuItems = onMonthChange
    ? months.map((month) => ({
        id: month,
        label: sourceData[month].sectiontitle,
        onClick: () => onMonthChange(month),
        isActive: activeMonth === month,
        url: undefined, // Remove URL to prevent Link usage in GlobalSidebar
      }))
    : months.map((month) => ({
        id: month,
        label: sourceData[month].sectiontitle,
        url: `/aasc-beats/${month}`,
        isActive: urlMonth === month || (!urlMonth && month === months[0]),
      }));

  return <GlobalSidebar title="AASC Beats" type="none" menu={menuItems} />;
};

export default AASCBeatsSidebar;
