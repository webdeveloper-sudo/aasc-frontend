import React from "react";
import campus from "@/assets/images/aasc_building.webp";
import BannerAndBreadCrumb from "@/components/BannerAndBreadCrumb";
import Heading from "@/components/reusable/Heading";
import HeadingUnderline from "@/components/reusable/HeadingUnderline";
import { GraduationCap, Target } from "lucide-react";
import { iqacInfo, iqacVision, iqacMission } from "@/data/iqac/iqacdata.js";
import iqac1 from "@/assets/images/gallery/feb9bd30-be26-4439-a323-e07c33c046d5.webp"

const AboutIQAC = () => {
  return (
    <div>
      {/* Banner */}
      <BannerAndBreadCrumb img={campus} title="About IQAC" />

      {/* IQAC Info Section */}
      <section className="bg-background container md:pt-12 pt-8 pb-10">
        <div className="flex flex-col md:flex-row gap-10">
        

          {/* Content Section */}
          <div className="md:w-1/2 text-center md:text-left space-y-4">
            <div>
              <Heading
                title="Internal Quality Assurance Cell (IQAC)"
                size="lg"
                align="left"
              />
              <HeadingUnderline width={200} align="left" />
            </div>

            {/* Info List */}
            <ul className="space-y-4">
              {iqacInfo.map((item) => (
                <li key={item.id} className="flex text-start gap-3">
                  <div className="w-5 h-5 flex items-start justify-center pt-1">
                    <GraduationCap className="w-4 h-4 text-purple-700" />
                  </div>
                  <span className="text-justify">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
            {/* Image Section */}
          <div className="relative w-full md:w-1/2 aspect-video overflow-hidden">
            <img
              src={campus}
              alt="IQAC"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Vision Section - IMAGE LEFT */}
      <section className="bg-background container py-8">
        <div className="flex flex-col md:flex-row gap-6">
       

          {/* Content Section - RIGHT */}
          <div className="md:w-1/2 text-center md:text-left space-y-4">
           

             <div className="pt-4">
              <Heading title="Mission of IQAC" size="lg" align="left" />
              <HeadingUnderline width={120} align="left" />
            </div>

            {/* Mission List */}
            <ul className="space-y-4">
              {iqacMission.map((item) => (
                <li key={item.id} className="flex text-start gap-3">
                  <div className="w-5 h-5 flex items-start justify-center pt-1">
                    <Target className="w-4 h-4 text-[#16611C]" />
                  </div>
                  <span className="text-justify">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
             {/* Image Section - LEFT */}
          <div className="relative w-full md:w-1/2 aspect-video overflow-hidden">
            {/* <img
              src={iqac1}
              alt="IQAC Vision"
              className="w-full h-full object-cover"
            /> */}
             <div>
              <Heading title="Vision of IQAC" size="lg" align="left" />
              <HeadingUnderline width={120} align="left" />
            </div>

            {/* Vision List */}
            <ul className="space-y-4">
              {iqacVision.map((item) => (
                <li key={item.id} className="flex text-start gap-3">
                  <div className="w-5 h-5 flex items-start justify-center pt-1">
                    <Target className="w-4 h-4 text-[#16611C]" />
                  </div>
                  <span className="text-justify">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Mission Section - IMAGE RIGHT */}
      {/* <section className="bg-background container py-10">
        <div className="flex flex-col-reverse md:flex-row-reverse gap-10">
  
          <div className="md:w-1/2 text-center md:text-left space-y-4">
            <div>
              <Heading title="Mission of IQAC" size="lg" align="left" />
              <HeadingUnderline width={120} align="left" />
            </div>

            <ul className="space-y-4">
              {iqacMission.map((item) => (
                <li key={item.id} className="flex text-start gap-3">
                  <div className="w-5 h-5 flex items-start justify-center pt-1">
                    <Target className="w-4 h-4 text-[#16611C]" />
                  </div>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative w-full md:w-1/2 aspect-video overflow-hidden">
            <img
              src={campus}
              alt="IQAC Mission"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default AboutIQAC;
