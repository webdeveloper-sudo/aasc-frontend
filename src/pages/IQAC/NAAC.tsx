import React from "react";
import naacPlaceholder from "@/assets/images/NAAC/NAAC-Logo.webp"; // 🔁 Replace with actual NAAC image later
import BannerAndBreadCrumb from "@/components/BannerAndBreadCrumb";
import campus from "@/assets/images/aasc_building.webp";
import HeadingUnderline from "@/components/reusable/HeadingUnderline";
import Heading from "@/components/reusable/Heading";
import { GraduationCap } from "lucide-react";

// Example NAAC Info — replace or extend as needed
const naacInfo = [
  {
    id: 1,
    text: "The National Assessment and Accreditation Council (NAAC) is an autonomous body established by the UGC to assess and accredit higher education institutions in India.",
  },
  {
    id: 2,
    text: "NAAC promotes quality assurance, continuous improvement, and academic excellence in higher education.",
  },
  {
    id: 3,
    text: "The accreditation process evaluates institutions based on curricular aspects, teaching-learning processes, research, infrastructure, governance, and student support.",
  },
  {
  id: 4,
  text: "NAAC accreditation enhances institutional credibility and helps stakeholders—including students, parents, employers, and policymakers—assess the quality and performance of higher education institutions.",
},

];

const NAAC = () => {
  return (
    <div>
      {/* Banner */}
      <BannerAndBreadCrumb img={campus} title="NAAC" />

      {/* Main Content */}
      <section className="bg-background container pt-10">
        <div className="flex flex-col md:flex-row gap-10">
          
          {/* Image Section */}
          <div className="relative w-full md:w-1/2 aspect-video  overflow-hidden">
            <img
              src={naacPlaceholder}
              alt="NAAC"
              className="w-full h-full  object-cover"
            />
          </div>

          {/* Content Section */}
          <div className="md:w-1/2 text-center md:text-left space-y-4">
            <div>
              <Heading
                title="National Assessment and Accreditation Council (NAAC)"
                size="lg"
                align="left"
              />
              <HeadingUnderline width={200} align="left" />
            </div>

            {/* Info List */}
            <ul className="space-y-3">
              {naacInfo.map((item) => (
                <li key={item.id} className="flex text-start gap-3">
                  <div className="w-5 h-5 flex items-start justify-center pt-1">
                    <GraduationCap className="w-4 h-4 text-purple/80" />
                  </div>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>

            {/* No Document Section (as requested) */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default NAAC;
