import img from "@/assets/images/aasc_building.webp";

export const galleryData = {
  DHTE: Array.from({ length: 15 }, (_, i) => ({
    image: img,
    imgTitle: `DHTE Sample Image ${i + 1}`,
  })),

  greenCampus: Array.from({ length: 15 }, (_, i) => ({
    image: img,
    imgTitle: `Green Campus Sample Image ${i + 1}`,
  })),

  hostelFacilities: Array.from({ length: 15 }, (_, i) => ({
    image: img,
    imgTitle: `Hostel Facility Sample Image ${i + 1}`,
  })),

  birdConservation: Array.from({ length: 15 }, (_, i) => ({
    image: img,
    imgTitle: `Bird Conservation Sample Image ${i + 1}`,
  })),
};
