import React from "react";
import OurTeamSidebar from "./OurTeamSidebar";
import OurTeamFacultySection from "./OurTeamFacultySection";
import BannerAndBreadCrumb from "@/components/BannerAndBreadCrumb";
import campus from "@/assets/images/aasc_building.webp";

interface TeamMember {
  name: string;
  designation: string;
  email: string;
  department?: string;
  image?: string;
  phone?: string;
}

interface OurTeamData {
  faculty: TeamMember[];
  administrative: TeamMember[];
  media: TeamMember[];
}

interface OurTeamProps {
  overrideData?: OurTeamData;
}

const OurTeam: React.FC<OurTeamProps> = ({ overrideData }) => {
  // Local state for preview navigation (bypass URL routing)
  const [activeTab, setActiveTab] = React.useState("faculty");

  const isPreview = Boolean(overrideData);

  return (
    <>
      <BannerAndBreadCrumb title="Our Team" img={campus} />

      <div className=" min-h-screen 2xl:container flex flex-col md:flex-row bg-gray-50">
        <OurTeamSidebar
          activeTab={isPreview ? activeTab : undefined}
          onTabChange={isPreview ? setActiveTab : undefined}
        />
        <OurTeamFacultySection
          overrideData={overrideData}
          activeTab={isPreview ? activeTab : undefined}
        />
      </div>
    </>
  );
};

export default OurTeam;
