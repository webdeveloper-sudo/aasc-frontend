import React from "react";
import UGProgramsSidebar from "./UGProgramsSidebar";
import UGProgramsSection from "./UGProgramsSection";
import BannerAndBreadCrumb from "@/components/BannerAndBreadCrumb";
import campus from '@/assets/images/aasc_building.webp'

const UGPrograms = () => {
  return (
    <>      <BannerAndBreadCrumb title="UG Programs" img={campus} />
    <div className="min-h-screen 2xl:container flex flex-col md:flex-row bg-gray-50">
      <UGProgramsSidebar />
      <UGProgramsSection />
    </div>
    </>
  );
};

export default UGPrograms;