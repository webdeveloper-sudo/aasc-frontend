import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import GlobalSidebar from "@/components/sidebar/GlobalSidebar";

interface PlacementsGallerySidebarProps {
  labels: string[]; // Data file order preserved here
  activeLabel?: string;
  onLabelChange?: (label: string) => void;
}

const PlacementsGallerySidebar: React.FC<PlacementsGallerySidebarProps> = ({
  labels,
  activeLabel,
  onLabelChange,
}) => {
  const { galleryId: urlLabel } = useParams();

  // Decoding URL label because it might be encoded
  const decodedUrlLabel = urlLabel ? decodeURIComponent(urlLabel) : undefined;

  // Map in EXACT data file order using index to preserve sequence
  const menuItems = labels.map((label, index) => {
    const baseItem = {
      id: label,
      label: label,
    };

    if (onLabelChange) {
      // Preview Mode: Manual handler with exact order
      return {
        ...baseItem,
        onClick: () => onLabelChange(label),
        isActive: activeLabel === label,
        url: undefined,
      };
    } else {
      // Public Mode: URL navigation with exact order
      return {
        ...baseItem,
        url: `/placements/gallery/${encodeURIComponent(label)}`,
        isActive: decodedUrlLabel === label || (!decodedUrlLabel && index === 0),
        onClick: undefined,
      };
    }
  });

  return (
    <div>
      <GlobalSidebar title="Placements Gallery 2025" type="placementgallery" menu={menuItems} />
    </div>
  );
};

export default PlacementsGallerySidebar;
