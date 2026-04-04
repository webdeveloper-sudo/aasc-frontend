import React from "react";
import { FileText } from "lucide-react";
import HeadingUnderline from "@/components/reusable/HeadingUnderline";
import Heading from "@/components/reusable/Heading";
import { placementRecords } from "@/data/placdements/PlacementRecords.js";
import BannerAndBreadCrumb from "@/components/BannerAndBreadCrumb";
import campus from "@/assets/images/aasc_building.webp";

interface PlacementRecordItem {
  _id?: string;
  data: {
    label: string;
    file: string;
  };
}

interface PlacementRecordsProps {
  overrideData?: PlacementRecordItem[];
}

const PlacementRecords: React.FC<PlacementRecordsProps> = ({
  overrideData,
}) => {
  // STATIC data → always from data file (public view)
  const staticData = placementRecords;

  // Normalize static data to match override data structure
  const normalizedStaticData = staticData.map((item) => ({
    _id: item._id || item.label,
    data: item.data || { label: item.label, file: item.file },
  }));

  // DYNAMIC data = overrideData in preview, normalizedStaticData in public view
  const dynamicData = overrideData || normalizedStaticData;

  // detect admin live preview mode
  const isPreview = Boolean(overrideData);

  // ----------------------------------------------------
  // UNIVERSAL FILE URL RESOLVER
  // ----------------------------------------------------
  function resolveFileUrl(file: string) {
    if (!file) return "";

    // CASE 1 — Already full URL (after save)
    if (file.startsWith("http://") || file.startsWith("https://")) {
      return file;
    }

    // CASE 2 — Temp file (filename only)
    if (!file.includes("/assets/documents/")) {
      return `${import.meta.env.VITE_API_URL}/assets/documents/temp/${file}`;
    }

    // CASE 3 — A backend-built final path already
    return file;
  }

  return (
    <>
      <BannerAndBreadCrumb
        img={campus}
        title=" Training And Placements - Records"
      />
      <section className="bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="mb-6  md:text-left">
            <Heading
              title="Training And Placements - Records"
              size="lg"
              align="center"
            />
            <HeadingUnderline width={150} align="center" />
          </div>

          {/* Grid of PDF Year Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3  md:grid-cols-4 lg:grid-cols-5 gap-5 mt-8">
            {dynamicData.map((item, index) => (
              <a
                key={index}
                href={
                  isPreview ? resolveFileUrl(item.data.file) : item.data.file
                }
                target="_blank"
                rel="noopener noreferrer"
                className="
                bg-white border border-gray-300 
                rounded-lg p-4 text-center 
                hover:bg-purple/10 hover:border-purple 
                cursor-pointer transition-all
                flex flex-col items-center justify-center gap-2
              "
              >
                <FileText className="w-6 h-6 text-purple-700" />

                <span className="font-medium text-gray-700">
                  {item.data.label}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default PlacementRecords;
