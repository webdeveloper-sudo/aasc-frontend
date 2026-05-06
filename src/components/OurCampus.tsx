import React from "react";
import { Play } from "lucide-react";
import HeadingUnderline from "./reusable/HeadingUnderline";
import VideoPopup from "./reusable/VideoPopup";
import Heading from "./reusable/Heading";
import ourCampusData from "@/data/home/ourcampusdata.js"; // ✅ Static fallback

interface OurCampusProps {
  overrideData?: any; // ✅ Only overrideData like MissionVision
}

const OurCampus: React.FC<OurCampusProps> = ({ overrideData }) => {
  // ✅ CAROUSEL/MISSIONVISION PATTERN: Static fallback + dynamic override
  const staticData = ourCampusData;
  const dynamicData = overrideData || staticData;

  // ✅ SAFE MERGE (MissionVision-style)
  const safeData = {
    title: "Our Campus",
    image: "",
    videoUrl: "",
    paragraphs: [],
    ...dynamicData,
  };

  // ✅ MISSIONVISION PATTERN: resolveImageUrl for temp files
  const resolveImageUrl = (img: string) => {
    if (!img) return "https://via.placeholder.com/600x400/f3f4f6/6b7280?text=No+Image";
    if (img.startsWith("http") || img.includes("assets/")) return img;
    
    return `${import.meta.env.VITE_API_URL}/assets/images/temp/${img}`;
  };

  const thumbnailUrl = resolveImageUrl(safeData.image);

  // ✅ Preview detection like MissionVision
  const isPreview = Boolean(overrideData);

  console.log("OurCampus data flow:", {
    overrideData,
    staticData,
    safeData,
    thumbnailUrl,
  });

  return (
    <section className=" px-4 md:px-0">
      <div className="flex flex-col md:flex-row gap-6 md:gap-10">
        {/* {mobile screen heading} */}
        <div className="md:hidden block">
          <Heading title={safeData.title} size="lg" align="left" />
          <HeadingUnderline width={150} align="left" />
        </div>

        {/* Thumbnail + Play (THIS MUST TRIGGER POPUP) */}
        <div className="relative w-full md:w-1/2 aspect-video overflow-hidden shadow-lg">
          <VideoPopup thumbnail={thumbnailUrl} videoUrl={safeData.videoUrl} />
        </div>

        {/* Text */}
        <div className="md:w-1/2 text-center md:text-left">
          {/* {large screen heading} */}
          <div className="md:block hidden">
            <Heading title={safeData.title} size="lg" align="left" />
            <HeadingUnderline width={150} align="left" />
          </div>
          <div className="mb-7">
            {safeData.paragraphs.map((p, i) => (
              <p key={i} className="leading-relaxed text-justify mb-3">
                {p}
              </p>
            ))}
          </div>

          <a href="#contact" className="red-btn">
            For Admissions
          </a>
        </div>
      </div>
    </section>
  );
};

export default OurCampus;
