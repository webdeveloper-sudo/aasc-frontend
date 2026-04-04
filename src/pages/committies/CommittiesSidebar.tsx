import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { committiesdatasidebarMenu } from "@/data/commitees/committiesdata";
import GlobalSidebar from "@/components/sidebar/GlobalSidebar";

interface CommitteesSidebarProps {
  committees?: any[];
  dataMapper?: any;
  activeSlug?: string;
  onSlugChange?: (slug: string) => void;
}

const CommitteesSidebar: React.FC<CommitteesSidebarProps> = ({
  committees,
  dataMapper,
  activeSlug,
  onSlugChange,
}) => {
  const { slug: urlSlug } = useParams();
  const location = useLocation();
  const isPreview = Boolean(onSlugChange);

  // Use provided menu or static menu
  const menu =
    isPreview && committees
      ? buildMenuFromCommittees(
          committees,
          dataMapper,
          activeSlug,
          onSlugChange
        )
      : committiesdatasidebarMenu;

  // Which MAIN menu should be open based on URL?
  const findActiveMain = () => {
    for (let main of committiesdatasidebarMenu) {
      if (location.pathname.startsWith(main.url)) return main.id;
    }
    return committiesdatasidebarMenu[0].id;
  };

  const [activeMain, setActiveMain] = useState(findActiveMain());

  useEffect(() => {
    setActiveMain(findActiveMain());
  }, [location.pathname]);

  return (
    <div>
      <GlobalSidebar title="Committees" type="dropdown" menu={menu} />
    </div>
  );
};

// Helper to build menu from committees array
function buildMenuFromCommittees(
  committees,
  dataMapper,
  activeSlug,
  onSlugChange
) {
  // Group committees by type
  const grouped = {
    Committees: [],
    Cells: [],
    Clubs: [],
  };

  committees.forEach((item) => {
    const name = item.exportName || "";
    const slug = name.toLowerCase().replace(/\s+/g, "-");

    const menuItem = {
      id: slug,
      label: name,
      onClick: () => onSlugChange(slug),
      isActive: activeSlug === slug,
      url: undefined, // Prevent navigation in preview
    };

    if (name.toLowerCase().includes("cell")) {
      grouped.Cells.push(menuItem);
    } else if (name.toLowerCase().includes("club")) {
      grouped.Clubs.push(menuItem);
    } else {
      grouped.Committees.push(menuItem);
    }
  });

  // Build hierarchical menu structure
  return [
    {
      id: "committees",
      label: "Committees",
      children: grouped.Committees,
    },
    {
      id: "cells",
      label: "Cells",
      children: grouped.Cells,
    },
    {
      id: "clubs",
      label: "Clubs",
      children: grouped.Clubs,
    },
  ];
}

export default CommitteesSidebar;
