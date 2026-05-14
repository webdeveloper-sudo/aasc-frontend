import React, { useState, useEffect } from "react";
import BannerAndBreadCrumb from "@/components/BannerAndBreadCrumb";
import HeadingUnderline from "@/components/reusable/HeadingUnderline";
import Heading from "@/components/reusable/Heading";
import campus from "@/assets/images/aasc_building.webp";
import { prospectusData } from "@/data/academics/prospectusdata";
import {
  Download,
  ChevronLeft,
  ChevronRight,
  FileTextIcon,
} from "lucide-react";

interface ProspectusItem {
  year: string;
  doc: string;
}

interface ProspectusProps {
  overrideData?: ProspectusItem[];
}

const Prospectus: React.FC<ProspectusProps> = ({ overrideData }) => {
  // STATIC → same rule as Academic Calendar
  const data = overrideData || prospectusData;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedItem, setSelectedItem] = useState<ProspectusItem>(data[0]);

  const [visibleCount, setVisibleCount] = useState(4);

  /* RESPONSIVE BUTTON COUNT */
  useEffect(() => {
    const updateCount = () => {
      if (window.innerWidth < 640) setVisibleCount(2);
      else if (window.innerWidth < 768) setVisibleCount(3);
      else setVisibleCount(4);
    };

    updateCount();
    window.addEventListener("resize", updateCount);
    return () => window.removeEventListener("resize", updateCount);
  }, []);

  /* RESET ON DATA CHANGE */
  useEffect(() => {
    if (data.length > 0) {
      setSelectedItem(data[0]);
      setCurrentIndex(0);
    }
  }, [overrideData]);

  const visibleYears = data.slice(currentIndex, currentIndex + visibleCount);

  return (
    <div>
      <BannerAndBreadCrumb img={campus} title="Prospectus" />

      <section className="bg-background md:container md:py-16 py-6 px-4">
        {/* HEADER */}
        <div className="text-center">
          <Heading title="Prospectus" size="lg" align="center" />
          <HeadingUnderline width={200} align="center" />
        </div>

        {/* YEAR SELECTOR */}
        <div className="max-w-3xl mx-auto mt-10 mb-6 flex items-center justify-center gap-3">
          <button
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="p-2 border rounded-full disabled:opacity-30"
          >
            <ChevronLeft />
          </button>

          <div className="flex-1 flex justify-center bg-white rounded-lg overflow-hidden">
            {visibleYears.map((item) => (
              <button
                key={item.year}
                onClick={() => setSelectedItem(item)}
                className={`px-6 py-3 text-sm font-medium transition
                  ${
                    selectedItem.year === item.year
                      ? "bg-purple text-white"
                      : "bg-[#03016A]/10 text-gray-700 hover:bg-purple hover:text-white"
                  }
                `}
              >
                {item.year}
              </button>
            ))}
          </div>

          <button
            onClick={() =>
              setCurrentIndex(
                Math.min(data.length - visibleCount, currentIndex + 1)
              )
            }
            disabled={currentIndex >= data.length - visibleCount}
            className="p-2 border rounded-full disabled:opacity-30"
          >
            <ChevronRight />
          </button>
        </div>

        {/* PDF PREVIEW */}
        <div className="w-full mx-auto bg-white shadow-md rounded-xl md:p-10 space-y-8">
          <div className="flex items-center justify-center gap-2">
            <FileTextIcon className="w-7 h-7 text-purple/80" />
            <h3 className="text-xl font-semibold">{selectedItem.year}</h3>
          </div>

          <div className="w-full h-[80vh] border rounded-xl overflow-hidden bg-gray-50">
            <iframe
              src={selectedItem.doc}
              title="Prospectus Preview"
              className="w-full h-full"
            />
          </div>

          {/* DOWNLOAD */}
          <div className="flex justify-center">
            <a
              href={selectedItem.doc}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="flex items-center red-btn px-6 py-3 text-lg font-medium"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Prospectus
            </a>
          </div>

          {/* METADATA */}
          <div className="text-right">
            <em className="text-gray-600 text-sm">
              Uploaded By: Office of the Principal
            </em>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Prospectus;
