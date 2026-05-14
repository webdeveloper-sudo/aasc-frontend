import React from "react";
import { GraduationCap, FileText, Mail } from "lucide-react";
import HeadingUnderline from "@/components/reusable/HeadingUnderline";
import Heading from "@/components/reusable/Heading";
import placeholder from "@/assets/images/17122.webp";

interface CommitteeSectionProps {
  slug?: string;
  committeeData?: any;
  overrideData?: any;
}

const CommitteeSection: React.FC<CommitteeSectionProps> = ({
  slug,
  committeeData,
  overrideData,
}) => {
  const isPreview = Boolean(overrideData);

  // ----------------------------------------------------
  // UNIVERSAL IMAGE/FILE URL RESOLVER
  // ----------------------------------------------------
  function resolveImageUrl(img: string) {
    if (!img) return placeholder;

    if (img.startsWith("http://") || img.startsWith("https://")) {
      return img;
    }

    if (!img.includes("/assets/images/")) {
      return `${import.meta.env.VITE_API_URL}/assets/images/temp/${img}`;
    }

    return `${import.meta.env.VITE_API_URL}${img}`;
  }

  function resolveFileUrl(file: string) {
    if (!file) return "";

    if (file.startsWith("http://") || file.startsWith("https://")) {
      return file;
    }

    if (!file.includes("/assets/documents/")) {
      return `${import.meta.env.VITE_API_URL}/assets/documents/temp/${file}`;
    }

    return file;
  }

  if (!committeeData) {
    return (
      <div className="flex-1 md:p-6 p-4 ">
        <Heading
          title="Committee Not Found"
          size="sm"
          align="left"
          className="text-red-600 font-semibold"
        />
        <p className="text-gray-600">Please choose a valid committee.</p>
      </div>
    );
  }

  const {
    objectives = [],
    members = [],
    circulars = [],
    photogallery = [],
  } = committeeData;

  // ✅ CHECK EMPTY SECTIONS LOGIC
  const allSectionsEmpty =
    objectives.length === 0 &&
    members.length === 0 &&
    circulars.length === 0 &&
    photogallery.length === 0;

  // Create a friendly title from slug
  const title = slug
    ? slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
    : "Committee";

  return (
    <div className="flex-1 px-6 py-4">
      {/* ===== TOP JUMP MENU ===== */}
      {/* <div className=" mb-6 py-4  sticky md:sticky-none md:top-auto md:text-left text-center top-[130px] bg-white z-[100] md:z-0">
        <Heading title={title} size="md" align="left" />
        <div className="flex items-center border-b  border-gray-300 py-3">
          <a
            href="#objectives"
            className="px-4 py-2 border-r border-gray-200 hover:underline"
          >
            Objectives
          </a>

          <a
            href="#members"
            className="px-4 py-2 border-r border-gray-200 hover:underline"
          >
            Members
          </a>

          <a href="#circulars" className="px-4 py-2 hover:underline">
            Circulars
          </a>
        </div>
      </div> */}

      {/* ✅ DYNAMIC SECTIONS - Hide if empty */}
      {!allSectionsEmpty && (
        <>
          {/* OBJECTIVES - HIDE IF EMPTY */}
          {objectives.length > 0 && (
            <section id="objectives" className="mb-12">
              <Heading title={`${title} - Objectives`} size="md" align="left" />
              <HeadingUnderline width={150} align="left" />
              <ul className="space-y-3">
                {objectives.map((item) => (
                  <li key={item.id} className="flex gap-3">
                    <GraduationCap className="w-5 h-5 text-purple/80 mt-1 flex-shrink-0" />
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* MEMBERS - HIDE IF EMPTY */}
          {members.length > 0 && (
            <section id="members" className="mb-12">
              <Heading title={`${title} - Members`} size="md" align="left" />
              <HeadingUnderline width={120} align="left" />
              <div className="space-y-6">
                {members.map((m) => (
                  <div
                    key={m.id}
                    className="grid grid-cols-3 md:grid-cols-3 bg-white rounded-lg  md:border border-gray-200"
                  >
                    <div className="flex items-center justify-center col-span-1 p-6 md:border-r md:border-b-0 border-b border-gray-300">
                      <div className="w-20 h-20 md:w-32 md:h-32 rounded-full overflow-hidden ring-1 ring-gray-300">
                        <img
                          src={
                            isPreview
                              ? resolveImageUrl(m.image)
                              : m.image || placeholder
                          }
                          alt={m.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col justify-center col-span-2 md:col-span-1 p-6 border-b md:border-b-0 md:border-r border-gray-300 text-left">
                      <h3 className="text-lg md:text-xl font-semibold">
                        {m.name}
                      </h3>
                      <p className="text-sm text-gray-700">{m.designation}</p>
                      <p className="flex md:hidden gap-2 items-center text-sm text-gray-700 mt-2 break-all">
                        <Mail size={16} />
                        <a
                          href={`mailto:${m.email}`}
                          className="hover:text-purple/80 hover:underline"
                        >
                          {m.email}
                        </a>
                      </p>
                    </div>

                    <div className="hidden md:flex flex-col justify-center p-6">
                      <Heading
                        title="Contact"
                        size="sm"
                        align="left"
                        className="mb-2 font-semibold"
                      />
                      <p className="flex gap-2 items-center text-sm text-gray-700 break-all">
                        <Mail size={17} />
                        <a
                          href={`mailto:${m.email}`}
                          className="hover:text-purple/80 hover:underline"
                        >
                          {m.email}
                        </a>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* CIRCULARS - HIDE IF EMPTY */}
          {circulars.length > 0 && (
            <section id="circulars">
              <Heading title={`${title} - Circulars`} size="md" align="left" />
              <HeadingUnderline width={120} align="left" />
              <ul className="space-y-4">
                {circulars.map((c, idx) => (
                  <li key={c.id || idx} className="flex gap-3 text-purple/80">
                    <FileText size={20} className="flex-shrink-0 mt-1" />
                    <a
                      href={isPreview ? resolveFileUrl(c.file) : c.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {c.title}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* PHOTO GALLERY - HIDE IF EMPTY */}
          {photogallery.length > 0 && (
            <section id="gallery" className="mt-12 mb-12">
              <Heading title={`${title} - Photo Gallery`} size="md" align="left" />
              <HeadingUnderline width={150} align="left" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {photogallery.map((img, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
                  >
                    <img
                      src={img}
                      alt={`Gallery Image ${idx + 1}`}
                      className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* ✅ ALL EMPTY MESSAGE */}
      {allSectionsEmpty && (
        <div className="mt-12 text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-600 mb-4">
              📚 Content Coming Soon!
            </h2>
            <p className="text-gray-500 text-lg mb-6">
              Objectives, members, and circulars will be updated shortly.
            </p>
            <p className="text-sm text-gray-400">
              Check back later for complete committee information ✨
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommitteeSection;
