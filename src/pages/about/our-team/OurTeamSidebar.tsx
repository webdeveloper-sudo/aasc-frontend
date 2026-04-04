import React from "react";
import GlobalSidebar from "@/components/sidebar/GlobalSidebar";

const menuItems = [
  { id: "faculty", label: "Faculty", url: "/about/our-team/faculty" },
  {
    id: "administrative",
    label: "Administrative Team",
    url: "/about/our-team/administrative",
  },
  // { id: "media", label: "Media Team", url: "/about/our-team/media" },
];

interface OurTeamSidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const OurTeamSidebar: React.FC<OurTeamSidebarProps> = ({
  activeTab,
  onTabChange,
}) => {
  // If handling tab change manually (Preview Mode), transform items to have onClick
  const displayMenu = onTabChange
    ? menuItems.map((item) => ({
        ...item,
        onClick: () => onTabChange(item.id),
        isActive: activeTab === item.id,
        url: undefined, // Remove URL to prevent Link usage in GlobalSidebar
      }))
    : menuItems;

  return (
    <div>
      <GlobalSidebar title="Our Team" type="none" menu={displayMenu} />
    </div>
  );
};

export default OurTeamSidebar;
