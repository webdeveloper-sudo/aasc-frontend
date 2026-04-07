import React from "react";
import HeadingUnderline from "./reusable/HeadingUnderline";
import VideoPopup from "@/components/reusable/VideoPopup";
import Heading from "./reusable/Heading";
import missionVisionData from "@/data/home/missionvissiondata.js"; // ✅ Static fallback

interface MissionVisionProps {
  overrideData?: any; // ✅ Only overrideData like Carousel
}

const MissionVision: React.FC<MissionVisionProps> = ({ overrideData }) => {
  // ✅ CAROUSEL PATTERN: Static fallback + dynamic override
  const staticData = missionVisionData;
  const dynamicData = overrideData || staticData;
  
  // ✅ SAFE MERGE (Carousel-style)
  const safeData = {
    mission: { title: 'Mission', description: '' },
    vision: { title: 'Vision', description: '' },
    image: '',
    videoUrl: '',
    ctaText: 'Learn More',
    ctaLink: '#',
    ...dynamicData
  };

  // ✅ CAROUSEL PATTERN: resolveImageUrl for temp files
  const resolveImageUrl = (img: string) => {
    if (!img) return 'https://via.placeholder.com/600x400/f3f4f6/6b7280?text=No+Image';
    if (img.startsWith('http')) return img;
    if (img.startsWith('temp_') || !img.includes('/assets/')) {
      return `${import.meta.env.VITE_API_URL}/assets/images/temp/${img}`;
    }
    return img;
  };

  const thumbnailUrl = resolveImageUrl(safeData.image);

  // ✅ Preview detection like Carousel
  const isPreview = Boolean(overrideData);

  console.log('MissionVision data flow:', { overrideData, staticData, safeData, thumbnailUrl });

  return (
    <section className=" px-4 md:px-0">
      <div className="flex flex-col md:flex-row gap-6 md:gap-10">
        <div className="md:w-1/2 text-center md:text-left">
          <Heading title={safeData.mission.title} size="lg" align="left" />
          <HeadingUnderline width={150} align="left" />
          <p className="leading-relaxed mb-4 text-justify">{safeData.mission.description}</p>

          <div className="md:w-1/2 md:hidden py-6 block">
            <VideoPopup thumbnail={thumbnailUrl} videoUrl={safeData.videoUrl} />
          </div>
          
          <Heading title={safeData.vision.title} size="lg" align="left" />
          <HeadingUnderline width={150} align="left" />
          <p className="leading-relaxed text-justify mb-6">{safeData.vision.description}</p>

          <a href={safeData.ctaLink} className="red-btn">
            {safeData.ctaText}
          </a>
        </div>

        <div className="md:w-1/2 md:block hidden">
          <VideoPopup thumbnail={thumbnailUrl} videoUrl={safeData.videoUrl} />
        </div>
      </div>
    </section>
  );
};

export default MissionVision;
