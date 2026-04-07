// ✅ OurRecruiters.tsx (FIRST BLOCK UI + SECOND BLOCK FUNCTIONALITY)
import React, { useMemo } from "react";
import HeadingUnderline from "./reusable/HeadingUnderline";
import Heading from "./reusable/Heading";
import recruitersData from "@/data/home/recruitersdata";

interface OurRecruitersProps {
  overrideData?: {
    title?: string;
    logos?: string[];
  };
}

const OurRecruiters: React.FC<OurRecruitersProps> = ({ overrideData }) => {
  const isPreview = Boolean(overrideData);

  // 🔒 PUBLIC: always static data file | 🔓 PREVIEW: overrideData
  const sourceData = overrideData ?? recruitersData;

  // --------------------------------------------------
  // UNIVERSAL IMAGE URL RESOLVER (PREVIEW ONLY)
  // --------------------------------------------------
  const resolveImageUrl = (img: string) => {
    if (!img) return "";
    if (img.startsWith("http")) return img;

    // TEMP images only exist in preview
    if (isPreview) {
      return `${import.meta.env.VITE_API_URL}/assets/images/temp/${img}`;
    }

    // Public images already resolved by Vite
    return img;
  };

  // 🧠 CRITICAL: memoize logos array to prevent animation reset
  const logos = useMemo(
    () => (sourceData.logos || []).map(resolveImageUrl),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isPreview, sourceData.logos?.join("|")]
  );

  const rowCountMobile = 2;
  const rowCountDesktop = 4;

  const logosPerMobileRow = Math.ceil(logos.length / rowCountMobile);
  const logosPerDesktopRow = Math.ceil(logos.length / rowCountDesktop);

  const desktopRows = Array.from({ length: rowCountDesktop }, (_, i) =>
    logos.slice(i * logosPerDesktopRow, (i + 1) * logosPerDesktopRow)
  );

  // Mobile: 2 rows with all logos distributed (FIRST BLOCK UI)
  const mobileRows = [
    logos.slice(0, logosPerMobileRow),
    logos.slice(logosPerMobileRow),
  ];

  return (
    <div className="w-full">

      {/* FIRST BLOCK: Smooth Infinite Marquee CSS */}
      <style>{`
        .marquee {
          animation: marquee 29s linear infinite;
        }
        .marquee-reverse {
          animation: marquee-reverse 29s linear infinite;
        }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @keyframes marquee-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>

      <div>
        <Heading title={sourceData.title} size="lg" align="center" />
        <HeadingUnderline width={200} align="center" />
      </div>

      {/* MOBILE — 2 rows (FIRST BLOCK UI) */}
      <div className="flex flex-col gap-7 px-4 md:hidden">
        <RowScroller logos={mobileRows[0]} direction="ltr" />
        <RowScroller logos={mobileRows[1]} direction="rtl" />
      </div>

      {/* DESKTOP — 4 rows (FIRST BLOCK UI) */}
      <div className="hidden md:flex flex-col gap-7 px-4 md:px-0">
        {desktopRows.map((rowLogos, idx) => (
          <RowScroller
            key={idx}
            logos={rowLogos}
            direction={idx % 2 === 0 ? "ltr" : "rtl"}
          />
        ))}
      </div>
    </div>
  );
};

const RowScroller = ({ logos, direction = "ltr" }) => {
  const animationClass = direction === "ltr" ? "marquee" : "marquee-reverse";

  return (
    <div className="overflow-hidden w-full">
      <div className={`flex items-center gap-6 min-w-max ${animationClass}`}>
        {[...logos, ...logos].map((logo, i) => (
          <div
            key={i}
            className="
              flex-shrink-0 
              flex items-center justify-center
              h-[60px] w-[120px]
              sm:h-[80px] sm:w-[160px]
              md:h-[110px] md:w-[220px]
              lg:h-[140px] lg:w-[260px]
              xl:h-[160px] xl:w-[300px]
            "
          >
            <img
              src={logo}
              alt={`Recruiter ${(i % logos.length) + 1}`}
              className="max-w-full max-h-full object-contain mx-auto"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/images/fallback-logo.png";
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurRecruiters;
