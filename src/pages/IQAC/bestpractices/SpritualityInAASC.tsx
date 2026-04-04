import React from "react";
import campus from "@/assets/images/aasc_building.webp";
import BannerAndBreadCrumb from "@/components/BannerAndBreadCrumb";
import HeadingUnderline from "@/components/reusable/HeadingUnderline";
import { seedData } from "@/data/campus-life/seeddata";
import Heading from "@/components/reusable/Heading";

const SpritualityInAASC = () => {
  return (
    <section className="bg-background">
      <BannerAndBreadCrumb img={campus} title="Sprituality In AASC" />

      <div className="container mx-auto md:py-16 py-10">
        {/* 🔹 Page Title */}
        <div className="text-center mb-3">
          <Heading
            title="Sprituality In AASC"
            size="lg"
            align="center"
          />
          <div className="flex justify-center">
            <HeadingUnderline width={180} align="center" />
          </div>
        </div>

        <section>
            
        </section>
      </div>
    </section>
  );
};

export default SpritualityInAASC;
