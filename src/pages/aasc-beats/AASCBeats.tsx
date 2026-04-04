import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import campus from "@/assets/images/aasc_building.webp";
import BannerAndBreadCrumb from "@/components/BannerAndBreadCrumb";
import { aascbeatsdata } from "@/data/aasc-beats/aasc-beatsdata.ts";
import AASCBeatsSidebar from "./AASCBeatsSidebar";
import AASCBeatsSection from "./AASCBeatsSection";

interface Entry {
  title: string;
  images: string[];
}

interface MonthSection {
  sectiontitle: string;
  entries: Entry[];
}

interface AASCBeatsData {
  [month: string]: MonthSection;
}

interface AASCBeatsProps {
  overrideData?: AASCBeatsData;
}

const AASCBeats: React.FC<AASCBeatsProps> = ({ overrideData }) => {
  const { month: urlMonth } = useParams();

  // Determine data source: override (preview) or static
  const sourceData = overrideData || aascbeatsdata;
  const months = Object.keys(sourceData);

  const isPreview = Boolean(overrideData);

  // Public mode: use URL month, fallback to first month
  // Preview mode: use local state
  const [activeMonth, setActiveMonth] = useState(() => {
    if (isPreview) return months[0];
    return urlMonth || months[0];
  });

  // Sync with URL changes (public mode only)
  useEffect(() => {
    if (!isPreview && urlMonth && months.includes(urlMonth)) {
      setActiveMonth(urlMonth);
    }
  }, [urlMonth, months, isPreview]);

  return (
    <>
      <BannerAndBreadCrumb img={campus} title="AASC Beats" />

      <div className="2xl:container min-h-screen flex flex-col md:flex-row bg-gray-50">
        <AASCBeatsSidebar
          months={months}
          sourceData={sourceData}
          activeMonth={isPreview ? activeMonth : urlMonth}
          onMonthChange={isPreview ? setActiveMonth : undefined}
        />
        <AASCBeatsSection
          month={activeMonth}
          section={sourceData[activeMonth]}
          overrideData={overrideData}
        />
      </div>
    </>
  );
};

export default AASCBeats;
