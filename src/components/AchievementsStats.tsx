import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import statsData from "@/data/home/achievementsstatsdata";

interface AchievementsStatsProps {
  overrideData?: {
    items: Array<{
      label: string;
      startValue: number;
      endValue: number;
      suffix: string;
    }>;
  };
}

// 🔥 Custom hook moved to top
const useCountUp = (
  start: number,
  end: number,
  duration = 3000,
  trigger?: boolean
) => {
  const [count, setCount] = useState(start);

  useEffect(() => {
    if (!trigger) return;

    let startTime: number | null = null;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime!) / duration, 1);
      const current = Math.floor(start + (end - start) * progress);
      setCount(current);

      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [start, end, duration, trigger]);

  return count;
};

const AchievementsStats: React.FC<AchievementsStatsProps> = ({
  overrideData,
}) => {
  // 🔥 ICONS ALWAYS STATIC from data file
  const staticIcons = statsData.items;

  // 🔥 STATS: dynamic ONLY in preview, static otherwise
  const staticDataObj = statsData;
  const dynamicData = overrideData || staticDataObj;
  const { items: dynamicStatsData } = dynamicData;

  // Detect admin live preview mode
  const isPreview = Boolean(overrideData);

  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  // 🔥 NOW SAFE: useCountUp is declared above
  const stats = dynamicStatsData.map((stat, index) => ({
    ...stat,
    icons: staticIcons[index % staticIcons.length].icons, // Use static icons
    value: useCountUp(stat.startValue, stat.endValue, 1500, isInView),
  }));

  // Universal image URL resolver for icons (preview only)
  const resolveImageUrl = (img: string): string => {
    if (!img) return "";

    // ✅ already absolute (vite or http)
    if (img.startsWith("http") || img.startsWith("/")) {
      return img;
    }

    // ✅ ONLY temp-uploaded images reach here
    return `${import.meta.env.VITE_API_URL}/assets/images/temp/${img}`;
  };

  if (!dynamicStatsData || dynamicStatsData.length === 0) {
    return (
      <section className="w-full py-8 flex items-center justify-center">
        <div className="text-gray-400 text-lg">No stats available</div>
      </section>
    );
  }

  return (
    <section ref={ref} className="w-full py-8 flex items-center justify-center">
      <div className="w-full max-w-7xl px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-4 sm:gap-6 justify-items-center place-items-center">
          {stats.map((item, i) => (
            <motion.div
              key={i}
              className="rounded py-4 sm:py-6 sm:px-6 bg-white shadow w-full h-full flex flex-col items-center justify-center min-h-[200px]"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 120 }}
            >
              {/* Rotating circles with STATIC icons */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 mx-auto mb-3 sm:mb-4 flex-shrink-0">
                <div className="outer-circle absolute inset-0 rounded-full p-[2px] bg-gradient-to-br from-[#ff4d4d] via-[#ffc5c5] to-[#ffffff] animate-rotateForward">
                  <div className="inner-circle rounded-full w-full h-full bg-white flex items-center justify-center animate-rotateReverse">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center">
                      <img
                        src={
                          isPreview ? resolveImageUrl(item.icons) : item.icons
                        }
                        alt={item.label}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic numbers */}
              <motion.p
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#16611C] text-center flex  items-center"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <span>{item.value.toLocaleString()}</span>
                <span className="text-base sm:text-lg md:text-xl mt-1">
                  {item.suffix}
                </span>
              </motion.p>

              {/* Dynamic labels */}
              <p className="text-gray-600 mt-2 text-xs sm:text-sm md:text-base text-center px-2">
                {item.label}
              </p>
            </motion.div>
          ))}
        </div>

        <style>{`
          @keyframes rotateForward {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes rotateReverse {
            0% { transform: rotate(360deg); }
            100% { transform: rotate(0deg); }
          }
          .animate-rotateForward {
            animation: rotateForward 3s linear infinite;
          }
          .animate-rotateReverse {
            animation: rotateReverse 3s linear infinite;
          }
        `}</style>
      </div>
    </section>
  );
};

export default AchievementsStats;
