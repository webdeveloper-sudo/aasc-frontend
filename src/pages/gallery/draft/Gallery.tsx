import React from "react";
import campus from "@/assets/images/aasc_building.webp";
import BannerAndBreadCrumb from "@/components/BannerAndBreadCrumb";

import GallerySidebar from "./GallerySidebar";
import GallerySection from "./GallerySection";

const Gallery = () => {
  return (
    <>
      <div>
        <BannerAndBreadCrumb img={campus} title="Gallery" />
      </div>

      <div className="2xl:container min-h-screen flex  flex-col md:flex-row bg-gray-50">
        <GallerySidebar />
        <GallerySection />
      </div>
    </>
  );
};

export default Gallery;
