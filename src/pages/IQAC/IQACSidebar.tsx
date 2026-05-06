import React from "react";
import GlobalSidebar from "@/components/sidebar/GlobalSidebar";

const menuItems = [
  { id: "mission-vision", label: "Mission & Vision" },
  { id: "composition", label: "Composition" },
  { id: "mom", label: "MOM" },
  { id: "naac", label: "NAAC" },
  { id: "green-audit", label: "Green Audit" },
  { id: "aaa", label: "AAA" },
  { id: "best-practices", label: "Best Practices" },
  { id: "research-achievements", label: "Research Achievements" },
  { id: "events-iqac", label: "Events (IQAC)" },
  { id: "strategic-plan", label: "Strategic Plan" },
  { id: "short-term-plan", label: "Short Term Plan" },
  { id: "long-term-plan", label: "Long Term Plan" },
  { id: "iso", label: "ISO" },
];

interface IQACSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const IQACSidebar: React.FC<IQACSidebarProps> = ({ activeTab, onTabChange }) => {
  const displayMenu = menuItems.map((item) => ({
    ...item,
    onClick: () => onTabChange(item.id),
    isActive: activeTab === item.id,
  }));

  return (
    <div>
      <GlobalSidebar title="IQAC" type="none" menu={displayMenu} />
    </div>
  );
};

export default IQACSidebar;
