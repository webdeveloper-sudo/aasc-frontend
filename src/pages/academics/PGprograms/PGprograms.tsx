import React from "react";
import PGProgramsSidebar from "./PGProgramsSidebar";
import PGProgramsSection from "./PGProgramsSection";
import BannerAndBreadCrumb from "@/components/BannerAndBreadCrumb";
import campus from '@/assets/images/aasc_building.webp'

const PGPrograms = () => {
  return (
    <>      <BannerAndBreadCrumb title="PG Programs" img={campus} />
    <div className="min-h-screen 2xl:container  flex flex-col md:flex-row bg-gray-50">
      <PGProgramsSidebar />
      <PGProgramsSection />
    </div>
    </>
  );
};

export default PGPrograms;
