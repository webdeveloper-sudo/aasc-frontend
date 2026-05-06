import React, { useState } from "react";
import IQACSidebar from "./IQACSidebar";
import IQACSection from "./IQACSection";
import BannerAndBreadCrumb from "@/components/BannerAndBreadCrumb";

const AboutIQAC = () => {
  const [activeTab, setActiveTab] = useState("mission-vision");

  return (
    <div>
      <BannerAndBreadCrumb title="About IQAC" />
      {/* Main Content Wrapper */}
      <div className="min-h-screen 2xl:container flex flex-col md:flex-row mx-auto">
        {/* Sidebar Component */}
        <IQACSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Right Side Section Component */}
        <IQACSection activeTab={activeTab} hideBanner={true} />
      </div>
    </div>
  );
};

export default AboutIQAC;

