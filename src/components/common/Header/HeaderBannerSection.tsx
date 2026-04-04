import React from "react";
import Heading from "../../reusable/Heading";

const HeaderBannerSection = () => {
  return (
    <div className="bg-[#F5F5DC] py-8 h-[20vh] flex items-center justify-center border-b-4 border-purple">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="text-center">
          <Heading
            title="ACHARIYA ARTS AND SCIENCE COLLEGE"
            size="xl"
            align="center"
            className="mb-2 tracking-wide"
          />
          <p className="text-black/70 text-lg">[College Banner Placeholder]</p>
        </div>
      </div>
    </div>
  );
};

export default HeaderBannerSection;
