// pages/home/Carousel.tsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Static data import (like profileOfCollegeData)
import carouselData from "@/data/home/carouseldata";

interface CarouselProps {
  overrideData?: {
    images: string[];
  };
}

const Carousel: React.FC<CarouselProps> = ({ overrideData }) => {
  // 🔥 ALWAYS STATIC for public pages (like ProfileOfCollege banner)
  const staticImages = carouselData.images;

  // 🔥 DYNAMIC = overrideData ONLY in preview, static otherwise
  const staticData = { images: staticImages };
  const dynamicData = overrideData || staticData;
  const { images: displayImages } = dynamicData;

  // Detect admin live preview mode
  const isPreview = Boolean(overrideData);

  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  // Reset to first image when preview data changes
  useEffect(() => {
    setCurrent(0);
  }, [displayImages]);

  useEffect(() => {
    if (displayImages.length === 0) return;

    const interval = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [displayImages.length]);

  const nextSlide = () => {
    setDirection(1);
    setCurrent((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrent((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
    }),
    center: { x: 0 },
    exit: (direction: number) => ({
      x: direction > 0 ? "-100%" : "100%",
    }),
  };

  // Universal image URL resolver (like ProfileOfCollege)
  function resolveImageUrl(img: string) {
    if (!img) return "";
    if (img.startsWith("http://") || img.startsWith("https://")) {
      return img;
    }
    // Temp file in preview
    if (!img.includes("/assets/images/")) {
      return `${import.meta.env.VITE_API_URL}/assets/images/temp/${img}`;
    }
    return img;
  }

  if (!displayImages || displayImages.length === 0) {
    return (
      <div className="w-full h-[50vh] sm:h-[65vh] md:h-[70vh] lg:h-[75vh] bg-gray-100 flex items-center justify-center rounded-lg">
        <div className="text-gray-400 text-lg">No images available</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[50vh] sm:h-[65vh] md:h-[70vh] lg:h-[75vh] overflow-hidden bg-gray-900 rounded-lg">
      <div className="relative w-full h-full">
        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={current}
            src={
              isPreview
                ? resolveImageUrl(displayImages[current])
                : displayImages[current]
            }
            alt={`Slide ${current + 1}`}
            custom={direction}
            variants={slideVariants as any}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "tween", duration: 0.5, ease: "easeInOut" },
            }}
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent pointer-events-none" />

        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow-md transition z-10"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6 text-gray-700" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow-md transition z-10"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6 text-gray-700" />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
          {displayImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-3 h-3 rounded-full transition-all ${
                idx === current
                  ? "bg-white w-8"
                  : "bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
