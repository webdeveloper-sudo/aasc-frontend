import React from "react";
import campus from "@/assets/images/aasc_building.webp";
import BannerAndBreadCrumb from "@/components/BannerAndBreadCrumb";
import { CircularPreviewData } from "@/data/home/CircularPreviewData.js";
import HeadingUnderline from "@/components/reusable/HeadingUnderline";

interface CircularItem {
  _id?: string;
  title: string;
  path: string;
  file: string;
  description: string;
  date: string;
  postedBy: string;
}

interface CircularsProps {
  overrideData?: CircularItem[];
}

const Circular: React.FC<CircularsProps> = ({ overrideData }) => {
  // STATIC data → always from data file (public view)
  const staticData = CircularPreviewData;

  // DYNAMIC data = overrideData in preview, staticData in public view
  const dynamicData = overrideData || staticData;

  // detect admin live preview mode
  const isPreview = Boolean(overrideData);

  // ----------------------------------------------------
  // UNIVERSAL FILE URL RESOLVER
  // ----------------------------------------------------
  function resolveFileUrl(file: string) {
    if (!file) return "";

    // CASE 1 — Already full URL (after save)
    if (file.startsWith("http://") || file.startsWith("https://")) {
      return file;
    }

    // CASE 2 — Temp file (filename only)
    // e.g. "123123-document.pdf"
    if (!file.includes("/assets/documents/")) {
      return `${import.meta.env.VITE_API_URL}/assets/documents/temp/${file}`;
    }

    // CASE 3 — A backend-built final path already
    return file;
  }

  // Sort by latest date
  const sortedCirculars = [...dynamicData].sort((a, b) => {
    const dateA = new Date(a.date || 0).getTime();
    const dateB = new Date(b.date || 0).getTime();
    return dateB - dateA; // latest first
  });

  return (
    <>
      <BannerAndBreadCrumb img={campus} title="Prospectus" />

      <section className="bg-background py-10">
        <div className="container mx-auto px-4">
          {/* Title */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-purple">Latest Circulars</h2>
            <HeadingUnderline width={200} />
          </div>

          <div className="space-y-6">
            {sortedCirculars.map((item, idx) => (
              <div
                key={idx}
                className="bg-card p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200"
              >
                {/* Title + Date */}
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-semibold text-purple leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-sm text-gray-500 whitespace-nowrap">
                    {new Date(item.date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>

                {/* Description */}
                <p className="mt-3 text-gray-700 leading-relaxed">
                  {item.description}
                </p>

                {/* Posted By + File */}
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-gray-600 italic">
                    Posted by:{" "}
                    <span className="font-medium">{item.postedBy}</span>
                  </p>

                  <a
                    href={isPreview ? resolveFileUrl(item.file) : item.file}
                    target="_blank"
                    className="text-purple font-medium hover:underline"
                  >
                    View PDF →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Circular;
