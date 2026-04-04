import React from "react";
import NIRFlogo from "@/assets/images/NIRF/NIRF.webp";
import BannerAndBreadCrumb from "@/components/BannerAndBreadCrumb";
import campus from "@/assets/images/aasc_building.webp";
import HeadingUnderline from "@/components/reusable/HeadingUnderline";
import { nirfInfo, nirfdoc } from "@/data/iqac/nirfdata.js";
import { GraduationCap, FileText, MoveRight } from "lucide-react";
import Heading from "@/components/reusable/Heading";

const NIRF = () => {
  return (
    <div>
      <div>
        <BannerAndBreadCrumb img={campus} title="NIRF" />
      </div>

      <section className="bg-background container py-10">
        <div className="flex flex-col md:flex-row gap-10">
          {/* Image Section */}
          <div className="relative w-full md:w-1/2 aspect-video overflow-hidden">
            <img
              src={NIRFlogo}
              alt="NIRF"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content Section */}
          <div className="md:w-1/2 text-center md:text-left space-y-4">
            <div>
              <Heading title="National Institutional Ranking Framework (NIRF)" size="lg" align="left" />
              <HeadingUnderline width={150} align="left" />
            </div>

            <ul className="space-y-3">
              {nirfInfo.map((item) => (
                <li key={item.id} className="flex text-start gap-3">
                  <div className="w-5 h-5 flex items-start justify-center pt-1">
                    <GraduationCap className="w-4 h-4 text-purple-700" />
                  </div>
                  <span className="text-justify">{item.text}</span>
                </li>
              ))}
            </ul>
            <hr />
            <div>
              <ul className="mt-5 space-y-3">
                {nirfdoc.map((doc, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-7 h-7  flex items-center justify-center">
                      <FileText className="w-7 h-7 border rounded-full p-1 text-purple-700" />
                    </div>

                    <a
                      href={doc.doc}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      {doc.label}
                    </a>
                    <div className="w-5 h-5 flex items-center justify-center">
                      <MoveRight className="w-5 h-5 p-1 text-purple-700" />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NIRF;
