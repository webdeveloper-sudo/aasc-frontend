import HeadingUnderline from "@/components/reusable/HeadingUnderline";
import ImagePopup from "@/components/reusable/ImagePopup";
import React, { useState, useEffect } from "react";

interface PressReleasesData {
  [year: string]: string[];
}

interface PressReleasesGalleryProps {
  images: string[];
  year: string;
  overrideData?: PressReleasesData;
}

const PressReleasesGallery: React.FC<PressReleasesGalleryProps> = ({
  images,
  year,
  overrideData,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

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

  // Map images with resolved URLs
  const formattedImages = images.map((img, index) => ({
    image: resolveImageUrl(img),
    imgTitle: `Press Release ${year} - ${index + 1}`,
  }));

  const handleNext = () => {
    setSelectedIndex((prev) =>
      prev === formattedImages.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrev = () => {
    setSelectedIndex((prev) =>
      prev === 0 ? formattedImages.length - 1 : prev - 1
    );
  };

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
    <div className="flex-1 p-6 bg-background ">
      <h1 className="text-2xl font-bold text-purple text-center md:text-left ">
        {year} Press Releases
      </h1>
      <HeadingUnderline width={150} align="left"/>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
        {formattedImages.map((img, index) => (
          <div
            key={index}
            className="rounded-lg overflow-hidden shadow hover:scale-105 transition cursor-pointer"
            onClick={() => setSelectedIndex(index)}
          >
            <img
              src={img.image}
              alt={img.imgTitle}
              className="w-full h-auto object-cover border border-gray-300"
            />
          </div>
        ))}
      </div>

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

export default PressReleasesGallery;
