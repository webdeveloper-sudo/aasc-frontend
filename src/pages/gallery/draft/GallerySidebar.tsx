import React from "react";
import GlobalSidebar from "@/components/sidebar/GlobalSidebar";
import { galleryData } from "@/data/gallery/gallerydata.js";

const GallerySidebar = () => {
  const categories = Object.keys(galleryData);

  const menuItems = categories.map((cat) => ({
    id: cat,
    label: cat.replace(/([A-Z])/g, " $1").trim(),
    url: `/gallery/${cat}`,
  }));

  return (
    <div>
      <GlobalSidebar title="Gallery Categories" type="none" menu={menuItems} />
    </div>
  );
};

export default GallerySidebar;
