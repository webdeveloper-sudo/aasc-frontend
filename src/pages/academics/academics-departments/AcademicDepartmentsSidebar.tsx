import React from "react";
import GlobalSidebar from "@/components/sidebar/GlobalSidebar";
import { departmentsSidebarMenu } from "@/data/academics/departmentsdata.js";

const AcademicDepartmentsSidebar = () => {
  return (
    <div>
      <GlobalSidebar
        title="Departments"
        type="none"
        menu={departmentsSidebarMenu}
      />
    </div>
  );
};

export default AcademicDepartmentsSidebar;
