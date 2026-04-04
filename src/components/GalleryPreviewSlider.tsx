import React from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { galleryData } from "@/data/gallery/gallerydata";
import Heading from "./reusable/Heading";
import HeadingUnderline from "./reusable/HeadingUnderline";

const GalleryPreviewSlider = () => {
  // Multiply the gallery array to ensure seamless infinite scrolling
  // Taking first 10-15 images for preview slider to avoid loading too many
  const previewImages = galleryData.slice(0, 15);
  const tripleImages = [...previewImages, ...previewImages, ...previewImages];

  const navigate = useNavigate();

  const handleGalleryClick = () => {
    navigate("/campus-life/gallery");
  };

  return (
    <div className="relative w-full overflow-hidden  ">
      {/* Header */}
      <div className="container mx-auto px-4 mb-8">
        <div>
          <Heading title="Our Gallery Preview" size="lg" align="center" />
          <HeadingUnderline width={180} align="center" />
        </div>
      </div>

      {/* Infinite Scroll Container */}
      <div className="relative w-full">
        <div className="flex gap-4 sm:gap-5 md:gap-6 animate-scroll-gallery">
          {tripleImages.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="relative flex-shrink-0 w-[200px] h-[160px] sm:w-[240px] sm:h-[180px] md:w-[300px] md:h-[220px] lg:w-[350px] lg:h-[250px] rounded-lg overflow-hidden shadow-lg cursor-pointer group"
              onClick={handleGalleryClick}
            >
              {/* Image */}
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />

              {/* Hover Overlay with Button */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center items-center">
                <div className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-shadow">
                  <span className="text-sm">View Gallery</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Animation Styles */}
      <style>{`
  @keyframes scroll-gallery {
    from {
      transform: translateX(0);
    }
    to {
      /* Move exactly one full image set width */
      transform: translateX(-50%);
    }
  }

  .animate-scroll-gallery {
    display: flex;
    width: max-content;
    animation: scroll-gallery 60s linear infinite;
    will-change: transform;
  }

  /* Slower on large screens, smoother feel */
  @media (min-width: 1024px) {
    .animate-scroll-gallery {
      animation-duration: 90s;
    }
  }

  /* Faster on small screens */
  @media (max-width: 768px) {
    .animate-scroll-gallery {
      animation-duration: 25s;
    }
  }

  /* Pause on hover */
  .animate-scroll-gallery:hover {
    animation-play-state: paused;
  }
`}</style>
    </div>
  );
};

export default GalleryPreviewSlider;
