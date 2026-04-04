import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { galleryData } from "@/data/gallery/gallerydata.js";
import ImagePopup from "@/components/reusable/ImagePopup";
import HeadingUnderline from "@/components/reusable/HeadingUnderline";

const GallerySection = () => {
  const { slug } = useParams();

  const categories = Object.keys(galleryData);
  const activeSlug = slug || categories[0];

  const images = galleryData[activeSlug] || [];

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [zoom, setZoom] = useState(1);

  const openPopup = (index) => {
    setSelectedIndex(index);
    setZoom(1);
  };

  const closePopup = () => {
    setSelectedIndex(null);
    setZoom(1);
  };

  const nextImage = () => {
    setSelectedIndex((prev) => (prev + 1) % images.length);
    setZoom(1);
  };

  const prevImage = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setZoom(1);
  };

  if (!images.length) {
    return (
      <div className="flex-1 p-6 text-center text-gray-500">
        No images available for this category.
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 border-r  border-gray-300">
      <h1 className="text-2xl font-bold text-purple text-center md:text-left capitalize">
        {activeSlug.replace(/([A-Z])/g, " $1")}
      </h1>
      <HeadingUnderline width={150} align="left"/>

      {/* Masonry Grid */}
      <div className="mt-6 columns-2 sm:columns-2 md:columns-3 md:gap-4 md:space-y-4 gap-2 space-y-2">
        {images.map((img, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-lg cursor-pointer group"
            onClick={() => openPopup(index)}
          >
            <img
              src={img.image}
              alt={img.imgTitle}
              className="w-full mb-4 rounded-lg transition-transform duration-300 group-hover:scale-105"
            />

            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-40 text-white text-sm p-2 opacity-0 group-hover:opacity-100 transition">
              {img.imgTitle}
            </div>
          </div>
        ))}
      </div>

      {/* Popup Component */}
      <ImagePopup
        images={images}
        selectedIndex={selectedIndex}
        onClose={closePopup}
        onNext={nextImage}
        onPrev={prevImage}
      />
    </div>
  );
};

export default GallerySection;
