import React, { useState } from "react";
import campus from "@/assets/images/aasc_building.webp";
import BannerAndBreadCrumb from "@/components/BannerAndBreadCrumb";
import HeadingUnderline from "@/components/reusable/HeadingUnderline";
import Heading from "@/components/reusable/Heading";

import postercampaigndata from "@/data/iqac/best-practices/postercampaigndata";
import ImagePopup from "@/components/reusable/ImagePopup";

const PosterCampaign = () => {
  const posters = postercampaigndata.posters;

  const [selectedIndex, setSelectedIndex] = useState(null);

  const openPopup = (index) => setSelectedIndex(index);
  const closePopup = () => setSelectedIndex(null);

  const nextImage = () =>
    setSelectedIndex((prev) => (prev + 1) % posters.length);

  const prevImage = () =>
    setSelectedIndex((prev) =>
      prev === 0 ? posters.length - 1 : prev - 1
    );

  return (
    <section className="bg-background">
      <BannerAndBreadCrumb img={campus} title="Poster Campaign" />

      <div className="container mx-auto md:py-16 py-10">
        {/* 🔹 Page Title */}
        <div className="text-center mb-3">
          <Heading title="Poster Campaign" size="lg" align="center" />
          <div className="flex justify-center">
            <HeadingUnderline width={180} align="center" />
          </div>
        </div>

        {/* 🔹 Masonry Grid Gallery */}
        <section className="py-6">
          <div
            className="
              columns-1 
              sm:columns-2 
              lg:columns-3 
              gap-5 
              space-y-5
            "
          >
            {posters.map((item, index) => (
              <div
                key={index}
                className="
                  break-inside-avoid 
                  overflow-hidden 
                  rounded-xl 
                  shadow-md 
                  hover:shadow-lg 
                  transition 
                  bg-white 
                  cursor-pointer
                "
                onClick={() => openPopup(index)}
              >
                <img
                  src={item.image}
                  alt={item.label}
                  className="w-full rounded-xl"
                />

                <p className="p-3 text-center text-gray-700 font-medium">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* 🔹 IMAGE POPUP */}
      <ImagePopup
        images={posters}
        selectedIndex={selectedIndex}
        onClose={closePopup}
        onNext={nextImage}
        onPrev={prevImage}
      />
    </section>
  );
};

export default PosterCampaign;
