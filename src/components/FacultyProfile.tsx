import React from "react";
import { Phone, Mail } from "lucide-react";
import Heading from "./reusable/Heading";

const FacultyProfile = ({
  image,
  name,
  department,
  designation,
  email,
}) => {
  return (
    <section className="w-full mx-auto">

      {/* GRID: small = 2 columns, md+ = 3 columns */}
      <div className="grid grid-cols-3 md:grid-cols-3 border-b border-gray-300 py-6">

        {/* LEFT — IMAGE (1/3 on mobile, 1/3 on md+) */}
        <div className="flex items-center justify-center col-span-1 md:border-r border-gray-300 px-4 pb-4 md:pb-0">
          <div className="w-20 h-20 md:w-40 md:h-40 rounded-full ring-1 ring-gray-300 overflow-hidden">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* MIDDLE — NAME + DEPT + DESIGNATION + EMAIL (2/3 on mobile, middle column on md+) */}
        <div className="flex flex-col justify-center text-left px-4 gap-1 col-span-2 md:col-span-1 md:border-r border-gray-300 pb-4 md:pb-0">

          <h4 className="md:text-xl text-md font-semibold">{name}</h4>

          {department && (
            <p className="text-sm text-gray-600">{department}</p>
          )}

          <p className="text-sm text-gray-700 md:block hidden">{designation}</p>

          {/* Email visible on small device only */}
          <p className="flex items-start md:hidden gap-2 text-gray-700 text-[13px] break-all">
            <a
              href={`mailto:${email}`}
              className="hover:text-black duration-200"
            >
              {email}
            </a>
          </p>
        </div>

        {/* RIGHT — CONTACT (hidden on mobile, visible on md+) */}
        <div className="hidden md:flex flex-col justify-center px-4 gap-2">

          <Heading
            title="Contact"
            size="sm"
            align="left"
            className="tracking-wide font-semibold"
          />

          {/* Phone */}
          {/* <p className="flex items-center gap-2 text-gray-700 text-sm">
            <Phone size={17} />
            <a href={`tel:${phone}`} className="hover:text-black duration-200">
              {phone}
            </a>
          </p> */}

          {/* Email */}
          <p className="flex items-center gap-2 text-gray-700 text-sm break-all">
            <Mail size={17} />
            <a
              href={`mailto:${email}`}
              className="hover:text-black duration-200"
            >
              {email}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default FacultyProfile;
