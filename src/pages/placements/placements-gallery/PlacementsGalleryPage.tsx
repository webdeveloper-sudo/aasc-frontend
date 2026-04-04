import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import placementsGalleryData from "@/data/placdements/PlacementsGalleryData";
import { PlacementsGallerySidebardata } from "@/data/placdements/PlacementsGalleryData";

import PlacementsGallerySidebar from "./PlacementsGallerySidebar";
import PlacementsGallery from "./PlacementsGallery";

import BannerAndBreadCrumb from "@/components/BannerAndBreadCrumb";
import campus from "@/assets/images/aasc_building.webp";

/* ========================= TYPES ========================= */

interface PlacementsGalleryDataMap {
  [label: string]: string[];
}

interface PlacementsGalleryPageProps {
  overrideData?: PlacementsGalleryDataMap;
}

/* ========================= COMPONENT ========================= */

const PlacementsGalleryPage: React.FC<PlacementsGalleryPageProps> = ({
  overrideData,
}) => {
  const { galleryId: urlLabel } = useParams();

  const isPreview = Boolean(overrideData);

  /**
   * Data source
   * - Preview → overrideData
   * - Public → static file
   */
  const sourceData = overrideData || placementsGalleryData;

  /**
   * 🔐 ORDER IS LOCKED HERE
   * - NEVER Object.keys()
   * - NEVER sort()
   */
  const labels = PlacementsGallerySidebardata.filter(
    (label) => sourceData[label]
  );

  const decodedUrlLabel = urlLabel
    ? decodeURIComponent(urlLabel)
    : undefined;

  /**
   * Active label logic
   * - Preview → local state
   * - Public → URL-driven
   */
  const [activeLabel, setActiveLabel] = useState<string>(() => {
    if (isPreview) return labels[0];
    return decodedUrlLabel && labels.includes(decodedUrlLabel)
      ? decodedUrlLabel
      : labels[0];
  });

  /**
   * Sync URL → state (PUBLIC MODE ONLY)
   */
  useEffect(() => {
    if (isPreview) return;

    if (decodedUrlLabel && labels.includes(decodedUrlLabel)) {
      setActiveLabel(decodedUrlLabel);
    } else if (!decodedUrlLabel && labels.length > 0) {
      setActiveLabel(labels[0]);
    }
  }, [decodedUrlLabel, labels, isPreview]);

  return (
    <>
      <BannerAndBreadCrumb title="Placements Gallery" img={campus} />

      <section className="mx-auto 2xl:container">
        <div className="flex flex-col md:flex-row">
          {/* SIDEBAR */}
          <PlacementsGallerySidebar
            labels={labels}
            activeLabel={activeLabel}
            onLabelChange={isPreview ? setActiveLabel : undefined}
          />

          {/* GALLERY */}
          <PlacementsGallery
            label={activeLabel}
            images={sourceData[activeLabel] || []}
            overrideData={overrideData}
          />
        </div>
      </section>
    </>
  );
};

export default PlacementsGalleryPage;
