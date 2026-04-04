import React from "react";
import { useParams } from "react-router-dom";
import BannerAndBreadCrumb from "@/components/BannerAndBreadCrumb";
import campus from "@/assets/images/aasc_building.webp";
import AcademicDepartmentsSidebar from "./AcademicDepartmentsSidebar";
import AcademicDepartmentsSection from "./AcademicDepartmentsSection";
import { departmentDataMapper } from "@/data/academics/departmentsdata.js";

const AcademicDepartments = () => {
  const { slug } = useParams();
  const departmentData = departmentDataMapper[slug] || null;

  return (
    <>
      <div className="md:mt-0 mt-14">
        <BannerAndBreadCrumb title="Departments" img={campus} />
      </div>
      <section className="mx-auto 2xl:container">
        <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
          <AcademicDepartmentsSidebar />
          <AcademicDepartmentsSection
            slug={slug}
            departmentData={departmentData}
          />
        </div>
      </section>
    </>
  );
};

export default AcademicDepartments;
