import React from "react";
import { Phone, Mail } from "lucide-react";
import placeholder from "@/assets/images/17122.webp";
import Heading from "../reusable/Heading";

const OurTeamFacultyProfile = ({
  image,
  name,
  department,
  designation,
  phone,
  email,
}) => {
  return (
    <section className="w-full mx-auto border-b border-gray-300 py-6">
      {/* GRID: small = 2 columns, md+ = 3 columns */}
      <div className="grid grid-cols-3 md:grid-cols-3">
        {/* LEFT — IMAGE (1/3 mobile) */}
        <div className="flex items-center justify-center col-span-1 md:border-r border-gray-300 px-4 pb-4 md:pb-0">
          <div className="w-20 h-20 md:w-32 md:h-32 rounded-full ring-1 ring-gray-300 overflow-hidden">
            <img
              src={image || placeholder}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* MIDDLE — INFO (2/3 mobile) */}
        <div className="flex flex-col justify-center text-left px-4 gap-1 col-span-2 md:col-span-1 md:border-r border-gray-300 pb-4 md:pb-0">
          <h4 className="md:text-xl text-md font-semibold text-[#03016A]">{name}</h4>

          {department ? (
            <p className="text-sm font-semibold text-gray-600">{department}</p>
          ) : (
            <p className="text-sm font-semibold text-gray-600 md:hidden block"> </p>
          )}

          <p className="text-sm text-gray-700 md:block hidden">
            {designation !== "Principal" && designation !== "Vice Principal"
              ? designation
              : ""}
          </p>

          {/* Email visible on mobile */}
          <p className="flex items-start md:hidden text-[13px] text-gray-700 break-all">
            <a
              href={`mailto:${email}`}
              className="hover:text-black duration-200"
            >
              {email}
            </a>
          </p>
        </div>

        {/* RIGHT — CONTACT (hidden on mobile, visible on md+) */}
        <div className="hidden md:flex flex-col justify-center px-4 gap-1">
          <Heading
            title="Contact"
            size="sm"
            align="left"
            className="tracking-wide font-semibold"
          />

          <p className="flex items-center gap-2 text-gray-700 text-sm">
            <Mail size={17} />
            <a
              href={`mailto:${email}`}
              className="hover:text-black duration-200 break-all"
            >
              {email}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default OurTeamFacultyProfile;
