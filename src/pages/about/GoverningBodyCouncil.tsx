import BannerAndBreadCrumb from "@/components/BannerAndBreadCrumb";
import React from "react";
import campus from "@/assets/images/aasc_building.webp";
import { governingBodyMembersData } from "@/data/about/governingbodycouncildata";
import HeadingUnderline from "@/components/reusable/HeadingUnderline";
import Heading from "@/components/reusable/Heading";

/* ========================= TYPES ========================= */

interface GoverningBodyMember {
  _id?: string;
  image: string;
  name: string;
  department: string;
  designation: string;
  phone?: string;
  email?: string;
}

interface GoverningBodyCouncilProps {
  overrideData?: GoverningBodyMember | GoverningBodyMember[];
}

/* ========================= COMPONENT ========================= */

const GoverningBodyCouncil: React.FC<GoverningBodyCouncilProps> = ({
  overrideData,
}) => {
  /**
   * STATIC banner — EXACTLY like ProfileOfCollege
   */
  const bannerTitle = "Governing Body Council";
  const bannerImage = campus;

  /**
   * Normalize data:
   * - Preview → single object → convert to array
   * - Public → static array
   */
  const staticData = governingBodyMembersData;
  const dynamicData = overrideData
    ? Array.isArray(overrideData)
      ? overrideData
      : [overrideData]
    : staticData;

  /**
   * Detect preview mode
   */
  const isPreview = Boolean(overrideData);

  /**
   * Universal image resolver (same philosophy as ProfileOfCollege)
   */
  const resolveImageUrl = (img: string) => {
    if (!img) return "";

    // Already final URL
    if (img.startsWith("http://") || img.startsWith("https://")) {
      return img;
    }

    // Temp file during preview
    if (isPreview && !img.includes("/assets/images/")) {
      return `${import.meta.env.VITE_API_URL}/assets/images/temp/${img}`;
    }

    // Static asset path
    return img;
  };

  return (
    <div>
      {/* ================= BANNER (STATIC) ================= */}
      <BannerAndBreadCrumb title={bannerTitle} img={bannerImage} />

      {/* ================= PAGE HEADING ================= */}
      <div className="text-center py-10">
        <Heading
          title="Governing Body Council - Members"
          size="lg"
          align="center"
        />
        <HeadingUnderline width={200} align="center" />
      </div>

      {/* ================= MEMBERS ================= */}
      <div className="container space-y-3">
        {dynamicData.map((member, index) => {
          const imageUrl = resolveImageUrl(member.image);

          return (
            <section
              key={member._id || index}
              className="border-b border-gray-300 py-6 grid grid-cols-3 md:grid-cols-3 rounded-md overflow-hidden"
            >
              {/* IMAGE */}
              <div className="flex items-center justify-center col-span-1 md:border-r border-gray-300 px-4 pb-4 md:pb-0">
                <div className="w-24 h-24 md:w-40 md:h-40 rounded-full ring-1 ring-gray-300 overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* NAME + DEPT */}
              <div className="flex flex-col justify-center text-left px-4 gap-1 col-span-2 md:col-span-1 md:border-r border-gray-300 pb-4 md:pb-0">
                <h4 className="md:text-xl text-md font-semibold">
                  {member.name}
                </h4>

                {member.department && (
                  <p className="text-sm text-gray-600">{member.department}</p>
                )}

                {/* Mobile designation */}
                <p className="text-sm text-gray-700 md:hidden mt-1">
                  {member.designation}
                </p>
              </div>

              {/* DESIGNATION (MD+) */}
              <div className="hidden md:flex flex-col justify-center p-6">
                <Heading
                  title="Designation"
                  size="sm"
                  align="left"
                  className="tracking-wide font-semibold mb-2"
                />
                <p className="text-gray-700">{member.designation}</p>
              </div>
            </section>
          );
        })}

        {dynamicData.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No members available
          </div>
        )}
      </div>
    </div>
  );
};

export default GoverningBodyCouncil;
