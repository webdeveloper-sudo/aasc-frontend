import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const HomeTabs = () => {
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  const tabs = [
    {
      label: "Research",
      path: "/research",
      subTabs: [
        { label: "Publications", path: "/research/publications" },
        { label: "Seminars", path: "/research/seminars" },
        { label: "Workshops", path: "/research/workshops" },
        { label: "Conferences", path: "/research/conferences" },
        { label: "Symposium", path: "/research/symposium" },
      ],
    },
    { label: "Placements", path: "/placements-home" },
    { label: "MoU", path: "/mou" },
    { label: "Attainment", path: "/attainment" },
    { label: "Gold Medalists", path: "/gold-medalists" },
    { label: "Policy", path: "/policy" },
    {
      label: "IPR",
      path: "/ipr",
      subTabs: [
        { label: "Start Ups", path: "/ipr/start-ups" },
        { label: "Patents", path: "/ipr/patents" },
      ],
    },
    { label: "Feedback", path: "/feedback" },
    { label: "Gender Equality", path: "/gender-equality" },
    { label: "Sports", path: "/sports-home" },
  ];

  return (
    <div className="w-full bg-purple border-y border-white/10 relative">
      {/* Shimmer Effect Layer */}
      <div className="absolute inset-0 shimmer-effect pointer-events-none"></div>
      <div className="container mx-auto px-2 relative z-10">
        <div className="flex flex-wrap md:flex-nowrap items-center justify-center md:justify-between">
          {tabs.map((tab, index) => (
            <div
              key={index}
              className="relative group flex-1 text-center"
              onMouseEnter={() => setActiveSubmenu(tab.label)}
              onMouseLeave={() => setActiveSubmenu(null)}
            >
              <Link
                to={tab.subTabs ? "#" : tab.path}
                className={`flex items-center justify-center gap-1 py-2 md:py-4 px-2 text-[10px] lg:text-[13px] font-bold uppercase transition-all duration-300 border-b-2 border-transparent hover:text-white hover:border-white ${
                  activeSubmenu === tab.label ? "text-white border-white bg-white/10" : "text-white/90"
                }`}
              >
                {tab.label}
                {tab.subTabs && (
                  <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${activeSubmenu === tab.label ? "rotate-180" : ""}`} />
                )}
              </Link>

              {/* Submenu Dropdown */}
              {tab.subTabs && (
                <div 
                  className={`absolute top-full left-0 w-full min-w-[160px] bg-white shadow-xl border-x border-b border-purple/10 transition-all duration-300 origin-top ${
                    activeSubmenu === tab.label ? "opacity-100 scale-y-100 visible" : "opacity-0 scale-y-0 invisible"
                  }`}
                >
                  <ul className="py-2">
                    {tab.subTabs.map((sub, subIndex) => (
                      <li key={subIndex}>
                        <Link
                          to={sub.path}
                          className="block px-4 py-2.5 text-[12px] text-gray-600 hover:bg-purple hover:text-white transition-colors duration-200 text-left font-semibold"
                        >
                          {sub.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeTabs;
