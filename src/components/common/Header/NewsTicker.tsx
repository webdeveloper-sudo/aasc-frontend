import React from "react";
import { ChevronRight } from "lucide-react";
import newsTickerData from "@/data/home/newstickerdata.js"; // ✅ Static fallback

interface NewsTickerProps {
  overrideData?: any; // ✅ Only overrideData like MissionVision
}

const NewsTicker: React.FC<NewsTickerProps> = ({ overrideData }) => {
  // ✅ CAROUSEL/MISSIONVISION PATTERN: Static fallback + dynamic override
  const staticData = newsTickerData;
  const dynamicData = overrideData || staticData;
  
  // ✅ SAFE MERGE (MissionVision-style)
  const safeData = {
    items: [],
    ...dynamicData
  };

  // ✅ Preview detection like MissionVision
  const isPreview = Boolean(overrideData);
  const items = safeData.items || [];

  console.log('NewsTicker data flow:', { overrideData, staticData, safeData, items, isPreview });

  return (
    <div className="px-4 md:px-8 bg-[#E8A824] overflow-hidden relative border-b border-[#fdfdfd]">
      <div className="flex items-center">
        {/* Scrolling Content */}
        <div className="flex-1 overflow-hidden py-2">
          <div className="animate-scroll flex items-center gap-8 whitespace-nowrap">
            {/* First set of items */}
            {items.map((item, index) => (
              <div key={`first-${index}`} className="flex items-center gap-2">
                <span className="text-gray-800 p-1 rounded-full bg-white">
                  <ChevronRight />
                </span>
                <span className="text-gray-800 text-sm">{item}</span>
              </div>
            ))}
            {/* Duplicate set for seamless loop */}
            {items.map((item, index) => (
              <div key={`second-${index}`} className="flex items-center gap-2">
                <span className="text-purple rounded-full bg-white">
                  <ChevronRight />
                </span>
                <span className="text-gray-800 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 20s linear infinite;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default NewsTicker;
