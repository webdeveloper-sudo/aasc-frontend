import React, { useMemo } from "react";
import HeadingUnderline from "./reusable/HeadingUnderline";
import Heading from "./reusable/Heading";
import ourschoolscollegesdata from "@/data/home/ourschoolscollegesdata";

/* ================= TYPES ================= */
interface AchariyaSchoolsAndCollegesProps {
  overrideData?: {
    title?: string;
    logos?: string[];
  };
}

/* ================= COMPONENT ================= */
const AchariyaSchoolsAndColleges: React.FC<
  AchariyaSchoolsAndCollegesProps
> = ({ overrideData }) => {
  const isPreview = Boolean(overrideData);

  // 🔒 PUBLIC: always static data file
  // 🔓 PREVIEW: overrideData
  const sourceData = overrideData ?? ourschoolscollegesdata;

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

  // 🧠 CRITICAL FIX: memoize logos array
  const logos = useMemo(
    () => (sourceData.logos || []).map(resolveImageUrl),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isPreview, sourceData.logos?.join("|")]
  );

  return (
    <section className="w-full py-12 bg-white">
      <Heading title={sourceData.title} size="lg" align="center" />
      <HeadingUnderline width={200} align="center" />

      <div className="mt-8">
        <RowScroller logos={logos} speed="10s" />
      </div>
    </section>
  );
};

/* ================= SCROLLER (UNCHANGED UI) ================= */
const RowScroller = ({
  logos,
  speed,
}: {
  logos: string[];
  speed?: string;
}) => {
  if (!logos.length) return null;

  return (
    <div className="overflow-hidden w-full">
      <div
        className="flex gap-10 items-center whitespace-nowrap animate-marquee-ltr"
        style={{ animationDuration: speed }}
      >
        {[...logos, ...logos].map((logo, i) => (
          <img
            key={i}
            src={logo}
            alt="school/college"
            className="w-[300px] h-32 object-contain"
            loading="lazy"
          />
        ))}
      </div>
    </div>
  );
};

export default AchariyaSchoolsAndColleges;
