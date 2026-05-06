import React, { useState, useEffect } from "react";
import ImagePopup from "@/components/reusable/ImagePopup";
import HeadingUnderline from "@/components/reusable/HeadingUnderline";

interface Entry {
  title: string;
  images: string[];
}

interface MonthSection {
  sectiontitle: string;
  entries: Entry[];
}

interface AASCBeatsSectionProps {
  month: string;
  section: MonthSection;
  overrideData?: any;
}

const AASCBeatsSection: React.FC<AASCBeatsSectionProps> = ({
  month,
  section,
  overrideData,
}) => {
  const [selectedEntryIndex, setSelectedEntryIndex] = useState<number | null>(
    null
  );
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const [zoom, setZoom] = useState(1);

  // Detect preview mode
  const isPreview = Boolean(overrideData);

  /**
   * Universal image resolver
   * Handles both static assets and preview temp files
   */
  const resolveImageUrl = (img: string) => {
    if (!img) return "";

    // Already full URL
    if (img.startsWith("http://") || img.startsWith("https://")) {
      return img;
    }

    // Temp file during preview (newly uploaded)
    if (isPreview && !img.includes("/assets/images/")) {
      return `${import.meta.env.VITE_API_URL}/assets/images/temp/${img}`;
    }

    // Static asset path
    return img;
  };

  if (!section) {
    return (
      <div className="flex-1 p-6 text-center text-gray-500">
        Month not found.
      </div>
    );
  }

  const openPopup = (entryIdx: number, imgIdx: number) => {
    setSelectedEntryIndex(entryIdx);
    setSelectedImageIndex(imgIdx);
    setZoom(1);
  };

  const closePopup = () => {
    setSelectedEntryIndex(null);
    setSelectedImageIndex(null);
    setZoom(1);
  };

  const currentImages =
    selectedEntryIndex !== null
      ? section.entries[selectedEntryIndex].images
      : [];

  const nextImage = () => {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex((prev) => ((prev ?? 0) + 1) % currentImages.length);
    setZoom(1);
  };

  const prevImage = () => {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex((prev) =>
      (prev ?? 0) === 0 ? currentImages.length - 1 : (prev ?? 0) - 1
    );
    setZoom(1);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (selectedEntryIndex === null || selectedImageIndex === null) return;

      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "Escape") closePopup();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedEntryIndex, selectedImageIndex, currentImages.length]);

  return (
    <div className="flex-1 p-6 ">
      {/* MAIN MONTH TITLE */}
      <h1 className="text-4xl font-bold text-purple text-center">
        AASC Beats {section.sectiontitle}
      </h1>
      <HeadingUnderline width={180} align="center" />

      {/* ENTRIES LOOP */}
      <div className="mt-8 space-y-14">
        {section.entries.map((entry, entryIdx) => (
          <React.Fragment key={entryIdx}>
            <div>
              {/* ENTRY TITLE */}
              <h2 className="text-3xl font-semibold text-purple text-center">
                {entry.title}
              </h2>
              <div className="flex justify-center">
                <HeadingUnderline width={120} align="center" />
              </div>

              {/* GRID IMAGES */}
              <div className="flex flex-wrap justify-center gap-4 mt-6">
                {entry.images.map((img, imgIdx) => (
                  <div
                    key={imgIdx}
                    className="overflow-hidden rounded-lg cursor-pointer group
                   w-full sm:w-[48%] md:w-[48%] mb-4"
                    onClick={() => openPopup(entryIdx, imgIdx)}
                  >
                    <img
                      src={resolveImageUrl(img)}
                      alt={entry.title}
                      className="w-full h-auto rounded-lg border border-gray-200 p-2 transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </div>
            <hr />
          </React.Fragment>
        ))}
      </div>

      {/* IMAGE POPUP */}
      <ImagePopup
        images={currentImages.map((i) => ({
          image: resolveImageUrl(i),
          imgTitle: "",
        }))}
        selectedIndex={selectedImageIndex}
        onClose={closePopup}
        onNext={nextImage}
        onPrev={prevImage}
      />
    </div>
  );
};

export default AASCBeatsSection;
