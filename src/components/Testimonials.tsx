import React, { useEffect, useMemo, useRef, useState } from "react";
import HeadingUnderline from "./reusable/HeadingUnderline";
import Heading from "./reusable/Heading";

interface TestimonialsProps {
  title: string;
  videos: string[];
}

const normalizeToEmbed = (url: string) => {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") {
      const id = u.pathname.replace("/", "");
      return `https://www.youtube.com/embed/${id}`;
    }
    if (u.hostname.includes("youtube.com")) {
      if (u.pathname.startsWith("/embed/")) return url;
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
  } catch {}
  return url;
};

const Testimonials: React.FC<TestimonialsProps> = ({
  title,
  videos: videosRaw,
}) => {
  const videos = useMemo(() => videosRaw.map((v) => normalizeToEmbed(v)), []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const GAP = 16; // Gap between items

  const [itemWidth, setItemWidth] = useState(360);

  // Responsive update
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;

      if (w < 640) {
        setItemsPerPage(1);
        setItemWidth(w - 48);
      } else if (w < 1024) {
        setItemsPerPage(2);
        setItemWidth(Math.min(360, w / 2 - 32));
      } else {
        setItemsPerPage(3);
        setItemWidth(Math.min(360, w / 3 - 32));
      }
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const maxIndex = Math.max(0, videos.length - itemsPerPage);

  const prev = () => setCurrentIndex((i) => (i <= 0 ? maxIndex : i - 1));
  const next = () => setCurrentIndex((i) => (i >= maxIndex ? 0 : i + 1));

  useEffect(() => {
    setCurrentIndex((i) => Math.min(i, maxIndex));
  }, [itemsPerPage, maxIndex]);

  // auto 16:9 height
  const itemHeight = (itemWidth * 9) / 16;

  const translateX = -(currentIndex * (itemWidth + GAP));

  return (
    <div className="w-full container">
      <div className="container mx-auto px-4">
        <Heading title={title} size="lg" align="center" />
        <HeadingUnderline width={200} align="center" />

        <div className="relative w-full flex justify-center mt-6">
          <div
            className="overflow-hidden"
            style={{
              width: itemsPerPage * (itemWidth + GAP) - GAP,
            }}
            ref={containerRef}
          >
            <div
              className="flex items-start gap-4 transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(${translateX}px)`,
              }}
            >
              {videos.map((src, idx) => (
                <div
                  key={idx}
                  className="flex-shrink-0 rounded-lg overflow-hidden shadow-md bg-black"
                  style={{ width: itemWidth, height: itemHeight }}
                >
                  <iframe
                    src={`${src}?rel=0&modestbranding=1`}
                    width={itemWidth}
                    height={itemHeight}
                    className="w-full h-full"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-3 h-3 rounded-full transition ${
                i === currentIndex ? "bg-purple" : "bg-muted-foreground/40"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
