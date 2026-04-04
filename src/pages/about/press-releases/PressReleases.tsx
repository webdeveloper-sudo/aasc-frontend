import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import pressReleases from "@/data/about/PressReleasesData.js";
import PressReleasesSidebar from "./PressReleasesSidebar";
import PressReleasesGallery from "./PressReleasesGallery";
import BannerAndBreadCrumb from "@/components/BannerAndBreadCrumb";
import campus from "@/assets/images/aasc_building.webp";

interface PressReleasesData {
  [year: string]: string[];
}

interface PressReleasesProps {
  overrideData?: PressReleasesData;
}

const PressReleases: React.FC<PressReleasesProps> = ({ overrideData }) => {
  const { year: urlYear } = useParams();

  // Determine data source: override (preview) or static
  const sourceData = overrideData || pressReleases;
  const years = Object.keys(sourceData).sort((a: any, b: any) => b - a);

  const isPreview = Boolean(overrideData);

  // Public mode: use URL year, fallback to first year
  // Preview mode: use local state
  const [activeYear, setActiveYear] = useState(() => {
    if (isPreview) return years[0];
    return urlYear || years[0];
  });

  // Sync with URL changes (public mode only)
  useEffect(() => {
    if (!isPreview && urlYear && years.includes(urlYear)) {
      setActiveYear(urlYear);
    }
  }, [urlYear, years, isPreview]);

  return (
    <>
      <BannerAndBreadCrumb title="Press Releases" img={campus} />

      <section className="mx-auto 2xl:container">
        <div className="flex">
          <PressReleasesSidebar
            years={years}
            activeYear={isPreview ? activeYear : urlYear}
            onYearChange={isPreview ? setActiveYear : undefined}
          />

          <PressReleasesGallery
            year={activeYear}
            images={sourceData[activeYear] || []}
            overrideData={overrideData}
          />
        </div>
      </section>
    </>
  );
};

export default PressReleases;
