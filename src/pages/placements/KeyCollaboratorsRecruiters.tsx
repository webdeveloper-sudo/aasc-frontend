import React from "react";
import { FileText } from "lucide-react";
import HeadingUnderline from "@/components/reusable/HeadingUnderline";
import { placementRecords } from "@/data/placdements/PlacementRecords.js";
import BannerAndBreadCrumb from "@/components/BannerAndBreadCrumb";
import campus from "@/assets/images/aasc_building.webp";
import OurRecruiters from "@/components/OurRecruiters";
import homeData from "@/data/home/allhomedata";

const KeyCollaboratorsRecruiters = () => {
  return (
    <>
      <BannerAndBreadCrumb img={campus} title="Key Collaborators Recruiters" />
      <section className="bg-background py-10 ">
        <div className="container mx-auto px-4">
          <OurRecruiters
            title={homeData.recruiters.title}
            logos={homeData.recruiters.logos}
          />
        </div>
      </section>
    </>
  );
};

export default KeyCollaboratorsRecruiters;
