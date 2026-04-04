import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import BannerAndBreadCrumb from "@/components/BannerAndBreadCrumb";
import campus from "@/assets/images/aasc_building.webp";
import CommitteesSidebar from "./CommittiesSidebar";
import CommitteeSection from "./CommittiesSection";
import { committeeDataMapper } from "@/data/commitees/committiesdata.js";

interface CommitteeDataProps {
  overrideData?: any[];
}

const Committees: React.FC<CommitteeDataProps> = ({ overrideData }) => {
  const { slug: urlSlug } = useParams();

  // Determine data source: override (preview) or static
  const sourceData = overrideData || Object.values(committeeDataMapper);

  // Build mapper from array if override data
  const dataMapper = overrideData
    ? overrideData.reduce((acc, item) => {
        const slug = item.exportName?.toLowerCase().replace(/\s+/g, "-");
        acc[slug] = item.data;
        return acc;
      }, {})
    : committeeDataMapper;

  const isPreview = Boolean(overrideData);

  // Get all slugs
  const allSlugs = Object.keys(dataMapper);

  // Public mode: use URL slug, fallback to first slug
  // Preview mode: use local state
  const [activeSlug, setActiveSlug] = useState(() => {
    if (isPreview) return allSlugs[0];
    return urlSlug || allSlugs[0];
  });

  // Sync with URL changes (public mode only)
  useEffect(() => {
    if (!isPreview && urlSlug) {
      setActiveSlug(urlSlug);
    }
  }, [urlSlug, isPreview]);

  const committeeData = dataMapper[activeSlug] || dataMapper[allSlugs[0]];

  return (
    <div>
      <div className="md:mt-0 mt-14">
        <BannerAndBreadCrumb img={campus} title="Committees" />
      </div>
      <div className=" min-h-screen  2xl:container flex flex-col md:flex-row  bg-gray-50">
        <CommitteesSidebar
          committees={overrideData || sourceData}
          dataMapper={dataMapper}
          activeSlug={isPreview ? activeSlug : urlSlug}
          onSlugChange={isPreview ? setActiveSlug : undefined}
        />
        <CommitteeSection
          slug={activeSlug}
          committeeData={committeeData}
          overrideData={overrideData}
        />
      </div>
    </div>
  );
};

export default Committees;
