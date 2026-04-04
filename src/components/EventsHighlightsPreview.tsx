import React from "react";
import { ArrowUpRight } from "lucide-react";
import HeadingUnderline from "./reusable/HeadingUnderline";
import Heading from "./reusable/Heading";
import { useNavigate } from "react-router-dom";

const EventsHighlightsPreview = ({  events: galleryEvents }) => {
  // Triple the events array for seamless infinite loop
  const tripleEvents = [...galleryEvents, ...galleryEvents, ...galleryEvents];

  const navigate = useNavigate();

  const handleEventClick = (eventId) => {
    console.log(`Navigate to event: ${eventId}`);
    navigate(`/campus-life/events/${eventId}`);
  };

  return (
    <div className="relative w-full overflow-hidden">
      {/* Header */}
      <div className="container mx-auto px-4 mb-8">
        <div>
          <Heading title="Our Events Highlights" size="lg" align="center" />
          <HeadingUnderline width={200} align="center" />
        </div>
      </div>

      {/* Infinite Scroll Container */}
      <div className="relative w-full">
        <div className="flex gap-4 sm:gap-5 md:gap-6 animate-scroll">
          {tripleEvents.map((event, index) => (
            <div
              key={`${event.id}-${index}`}
              className="relative flex-shrink-0 w-[200px] h-[160px] sm:w-[240px] sm:h-[180px] md:w-[300px] md:h-[220px] lg:w-[350px] lg:h-[250px] rounded-lg overflow-hidden shadow-lg cursor-pointer group"
              onClick={() => handleEventClick(event.id)}
            >
              {/* Image */}
              <img
                src={event.images[0]}
                alt={event.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />

              {/* Default Title Overlay (Bottom) */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent px-3 py-3 sm:py-4 transition-opacity duration-300 group-hover:opacity-0">
                <p className="text-white font-semibold text-sm sm:text-base md:text-lg line-clamp-2">
                  {event.title}
                </p>
              </div>

              {/* Hover Overlay (Full) */}
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-center px-4">
                <p className="text-white font-semibold text-base sm:text-lg md:text-xl mb-4">
                  {event.title}
                </p>
                <div className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-shadow">
                  <span className="text-xs sm:text-sm font-medium">
                    Click to view
                  </span>
                  <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Animation Styles */}
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-100% / 3));
          }
        }

        .animate-scroll {
          display: flex;
          animation: scroll 5s linear infinite;
        }

        /* Faster on tablets */
        @media (max-width: 1024px) {
          .animate-scroll {
            animation: scroll 10s linear infinite;
          }
        }

        /* Even faster on mobile */
        @media (max-width: 768px) {
          .animate-scroll {
            animation: scroll 10s linear infinite;
          }
        }

        /* Extra fast on small mobile */
        @media (max-width: 480px) {
          .animate-scroll {
            animation: scroll 5s linear infinite;
          }
        }

        /* Pause on hover */
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default EventsHighlightsPreview;
