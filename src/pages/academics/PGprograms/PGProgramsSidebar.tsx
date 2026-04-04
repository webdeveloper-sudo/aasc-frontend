import React from "react";
import GlobalSidebar from "@/components/sidebar/GlobalSidebar";

const menuItems = [
  {
    id: "existing",
    label: "Existing PG Programs",
    url: "/academics/pg-programs/existing",
  },
  // {
  //   id: "proposed",
  //   label: "Proposed PG Programs",
  //   url: "/academics/pg-programs/proposed",
  // },
];

const PGProgramsSidebar = () => {
  return (
    <div>
      <GlobalSidebar title="PG Programs" type="none" menu={menuItems} />
      
    </div>
  );
};

export default PGProgramsSidebar;
