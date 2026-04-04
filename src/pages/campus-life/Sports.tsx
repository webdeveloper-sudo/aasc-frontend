import React, { useState, useEffect } from "react";
import { sportsdata } from "@/data/campus-life/sports.ts";
import ImagePopup from "@/components/reusable/ImagePopup";
import BannerAndBreadCrumb from "@/components/BannerAndBreadCrumb";

const Sports = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Format images same as PressReleasesGallery pattern
  const formattedImages = sportsdata.map((item, index) => ({
    image: item.src,
    imgTitle: item.alt || `Gallery Image ${index + 1}`,
  }));

  const handleNext = () => {
    setSelectedIndex((prev) =>
      prev === null || prev === formattedImages.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrev = () => {
    setSelectedIndex((prev) =>
      prev === null || prev === 0 ? formattedImages.length - 1 : prev - 1
    );
  };

  // Keyboard navigation (same as PressReleasesGallery)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;

      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "Escape") setSelectedIndex(null);
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedIndex, formattedImages.length]);

  return (
    <div className=" mx-auto">
      <BannerAndBreadCrumb title="Sports" />
      {/* <Heading title="Our Gallery" size="lg" align="center" className="mb-8" /> */}

      <div className="container  border border-gray-300 px-4 py-8 mb-24 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {formattedImages.map((img, index) => (
          <div
            key={index}
            className="relative group overflow-hidden rounded-lg shadow-lg md:aspect-w-4 md:aspect-h-3 cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={() => setSelectedIndex(index)}
          >
            <img
              src={img.image}
              alt={img.imgTitle}
              className="w-full md:h-64 h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        ))}
      </div>

      {/* Single ImagePopup instance - same as PressReleasesGallery */}
      <ImagePopup
        images={formattedImages}
        selectedIndex={selectedIndex}
        onClose={() => setSelectedIndex(null)}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </div>
  );
};

export default Sports;
