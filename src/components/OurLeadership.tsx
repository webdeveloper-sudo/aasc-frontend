import React from "react";
import cementbg from "@/assets/images/bg/2151890618.webp";
import HeadingUnderline from "./reusable/HeadingUnderline";
import Heading from "./reusable/Heading";
import { useNavigate } from "react-router-dom";
import { OurLeads } from "@/data/home/OurLeads.js";

const OurLeadership = () => {
  const navigate = useNavigate();

  return (
    <section className="py-8 ">
      <div className="container px-4">
        <div className="flex gap-4 flex-col md:flex-row justify-center">
          {OurLeads.map((lead, idx) => (
            <div
              key={idx}
              className="bg-card text-center rounded-lg p-2 hover:shadow-md hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              <div
                className="mx-auto mb-4 max-w-96 w-full aspect-square rounded overflow-hidden "
                style={{ backgroundImage: `url(${cementbg})` }}
                onClick={() => navigate(lead.path)}
              >
                <img
                  src={lead.img}
                  alt={lead.name}
                  loading="lazy"
                  className="object-cover w-full h-full"
                />
              </div>

              <Heading title={lead.name} size="sm" align="center" />
              <p className="text-sm text-gray-600 mb-2">{lead.role}</p>
              <HeadingUnderline width={170} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurLeadership;
