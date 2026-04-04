import React from "react";
import GlobalSidebar from "@/components/sidebar/GlobalSidebar";

const menuItems = [
  {
    id: "existing",
    label: "Existing Programs",
    url: "/academics/ug-programs/existing",
  },
  {
    id: "proposed",
    label: "Proposed Programs",
    url: "/academics/ug-programs/proposed",
  },
];

const UGProgramsSidebar = () => {
  return (
    <div>
      <GlobalSidebar title="UG Programs" type="none" menu={menuItems} />
    </div>
  );
};

export default UGProgramsSidebar;
