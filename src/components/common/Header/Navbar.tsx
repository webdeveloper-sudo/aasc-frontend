import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";
import TopHeaderBar from "./TopHeadBar";
import AASCLOGO from "@/assets/images/common/AASC-Logo.webp";
import AchariyaLOGO from "@/assets/images/FINAL ACHARIYA & 25th year ACHARIYA LOGO_FINAL-02 (1).webp";
import Heading from "../../reusable/Heading";

const Navbar = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSubmenu, setMobileSubmenu] = useState(null);
  const [mobileSubSubmenu, setMobileSubSubmenu] = useState(null);
  const navigate = useNavigate();

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "unset";
  }, [mobileOpen]);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (
        !e.target.closest("#mobileSidebar") &&
        !e.target.closest("#hamburgerBtn")
      ) {
        setMobileOpen(false);
        setMobileSubmenu(null);
        setMobileSubSubmenu(null);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // ---------------- NAV ITEMS ----------------
  const navItems = [
    { label: "Home", path: "/", dropdown: null },

    {
      label: "About Us",
      path: "/about",
      dropdown: [
        {
          label: "Profile Of The College",
          path: "/about/profile-of-the-college",
        },
        { label: "Chief Mentor's Desk", path: "/about/chief-mentors-desk" },
        { label: "Principal's Desk", path: "/about/principal-desk" },
        // {
        //   label: "Governing Body Council",
        //   path: "/about/governing-body-counsil",
        // },
        { label: "Organogram", path: "/about/organogram" },
        {
          label: "Our Team",
          path: "/about/our-team/faculty",
          // submenu: [
          //   { label: "Faculty", path: "/about/our-team/faculty" },
          //   {
          //     label: "Administrative Team",
          //     path: "/about/our-team/administrative",
          //   },
          //   // { label: "Media Team", path: "/about/our-team/media" },
          // ],
        },
        { label: "Press Releases", path: "/about/press-releases" },
        { label: "Media Talks", path: "/about/media-talks" },
      ],
    },

    {
      label: "Academics",
      path: "/academics",
      dropdown: [
        { label: "Admission Policy", path: "/academics/admission-policy" },
        { label: "Eligible Criteria", path: "/academics/eligible-criteria" },
        { label: "Academic Calendar", path: "/academics/academic-calendar" },
        { label: "UG Programmes", path: "/academics/ug-programmes" },
        { label: "PG Programmes", path: "/academics/pg-programmes" },
        { label: "Departments", path: "/academics/departments" },
        { label: "Prospectus", path: "/academics/prospectus" },
        { label: "VAC / Add-on Courses", path: "/academics/vac-add-on-courses" },
        { label: "Certificate Courses", path: "/academics/certificate-courses" },
        { label: "SWAYAM / MOOC Courses", path: "/academics/swayam-mooc-courses" },
      ],
    },

    {
      label: "Placements",
      path: "/placements",
      dropdown: [
        {
          label: "Training And Placement Cell",
          path: "/placements/training-and-placement-cell",
        },
        {
          label: "Key Collaborators/Recruiters",
          path: "/placements/key-collaborators-recruiters",
        },
        { label: "Placements Records", path: "/placements/records" },
        { label: "Placements Gallery", path: "/placements/gallery" },
      ],
    },

    {
      label: "Campus Life",
      path: "/campus-life",
      dropdown: [
        { label: "Gallery", path: "/campus-life/gallery" },
        {
          label: "Value-Added Courses",
          path: "/campus-life/value-added-courses",
        },
        { label: "Sports", path: "/campus-life/sports" },
        {
          label: "Extension Activities",
          path: "/campus-life/extension-activities",
          submenu: [
            { label: "NSS", path: "/cells/nss" },
            { label: "RRC", path: "/clubs/rrc" },
            { label: "YRC", path: "/campus-life/extension-activities/yrc" },
          ],
        },
        {
          label: "Clubs",
          path: "/campus-life/clubs",
          submenu: [
            { label: "RRC", path: "/clubs/rrc" },
            { label: "Womens Club", path: "/clubs/womens-club" },
            { label: "Achariya Code Club", path: "/clubs/code-club" },
          ],
        },
      ],
    },

    { label: "AASC Beats", path: "/aasc-beats", dropdown: null },

    {
      label: "IQAC & NIRF",
      path: "/iqac",
      dropdown: [
        { label: "NIRF", path: "/national-institutional-ranking-framework" },
        // { label: "NAAC", path: "/iqac/naac" },
        { label: "About IQAC", path: "/iqac/about-iqac" },

        {
          label: "Best Practices",
          path: "/iqac/best-practices/poster-campaign",
          submenu: [
            {
              label: "Poster Campaign",
              path: "/iqac/best-practices/poster-campaign",
            },
            // { label: "LMS", path: "/iqac/best-practices/lms" },
            // {
            //   label: "Spirituality in AASC",
            //   path: "/iqac/best-practices/spirituality-in-aasc",
            // },
            // { label: "Webinars", path: "/iqac/best-practices/webinars" },
          ],
        },
      ],
    },

    { label: "Committees", path: "/committees", dropdown: null },
  ];

  const handleClick = () => {
    navigate("/");

    setTimeout(() => {
      const el = document.getElementById("contact");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 200);
  };

  // ---------------- RETURN UI ----------------
  return (
    <>
      {/* -------- DESKTOP NAVBAR -------- */}

      <div className="hidden md:block sticky top-0 z-[200] bg-white shadow-lg">
        <TopHeaderBar />
        <nav className="relative flex items-center justify-between p-3 ps-5 bg-purple">
          {/* Shimmer Effect Layer */}
          <div className="absolute inset-0 shimmer-effect pointer-events-none"></div>
          <div className="relative z-10 flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
            <Link to="/">
              <img src={AASCLOGO} width={120} className="bg-white p-2" />
            </Link>
            <div className="ps-3">
              <h3 className="text-white text-xl font-bold uppercase">
                {" "}
                Achariya
              </h3>
              <h3 className="text-white text-md "> Arts and Science College</h3>
              <p className="text-[11px] text-gray-300">
                Affiliated with Pondicherry University
              </p>
            </div>
          </div>

          {/* -------- MENU ITEMS -------- */}
          <ul className="flex items-center gap-1">
            {navItems.map((item, idx) => (
              <li
                key={idx}
                className="relative group uppercase text-[13px] font-semibold"
                onMouseEnter={() => setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                {/* MAIN ITEM */}
                <div className="relative text-white text-[13px] py-4 px-3 cursor-pointer hover:bg-white/10 flex items-center gap-1 group">
                  {item.dropdown ? (
                    // 🚫 Not Clickable Label
                    <span className="pointer-events-none">{item.label}</span>
                  ) : (
                    // ✅ Clickable Link (Only if NO dropdown)
                    <Link to={item.path}>{item.label}</Link>
                  )}

                  {item.dropdown && <ChevronDown className="w-4 h-4" />}

                  {/* Center animated underline */}
                  <span className="absolute left-1/2 bottom-1 h-[2px] w-0 bg-white/80 -translate-x-1/2 group-hover:w-4/5 transition-all duration-300 ease-out" />
                </div>

                {/* ------------ FIRST DROPDOWN ------------ */}
                {item.dropdown && (
                  <div
                    className={`absolute top-full left-0 bg-white min-w-[240px] rounded-md shadow-xl border border-purple-300 transition-all duration-200 ${
                      openDropdown === item.label
                        ? "opacity-100 scale-100 visible"
                        : "opacity-0 scale-95 invisible"
                    }`}
                  >
                    <ul className="py-2">
                      {item.dropdown.map((sub, i) => (
                        <li key={i} className="relative group/submenu">
                          <Link
                            to={sub.path}
                            className="block px-4 py-2 text-[12px] text-gray-600 hover:bg-purple/10 hover:text-purple rounded transition"
                          >
                            {sub.label}
                          </Link>

                          {/* ------------ SUBMENU (THIRD LEVEL) ------------ */}
                          {sub.submenu && (
                            <div
                              className="
    absolute top-0 z-[999]
    min-w-[220px]
    max-w-[calc(100vw-24px)]
    bg-white rounded-md shadow-xl border border-purple-300

    opacity-0 scale-95 invisible
    transition-all duration-200

    group-hover/submenu:opacity-100
    group-hover/submenu:scale-100
    group-hover/submenu:visible

    /* DEFAULT: open right */
    left-full ml-1

    /* AUTO-FLIP when near right edge */
    md:group-hover/submenu:right-full
    md:group-hover/submenu:left-auto
    md:group-hover/submenu:mr-1
  "
                            >
                              <ul className="py-2 space-y-1">
                                {sub.submenu.map((ss, j) => (
                                  <li key={j}>
                                    <Link
                                      to={ss.path}
                                      className="
                                        block px-4 py-2 text-sm text-gray-700
                                        hover:bg-purple/10 hover:text-purple
                                        rounded transition
                                      "
                                    >
                                      {ss.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
            <li className="flex items-center gap-2">
              {/* For Admissions */}
              <div className="bg-white px-2 h-8 flex items-center justify-center">
                <button
                  onClick={handleClick}
                  className="text-purple text-xs font-bold"
                >
                  For Admissions
                </button>
              </div>
              <img className="ms-3" src={AchariyaLOGO} width={65} />
            </li>
          </ul>
          </div>
        </nav>
      </div>

      {/* -------- MOBILE NAV -------- */}
      <div className="md:hidden mb-[140px]">
        <div className="fixed top-0 left-0 right-0 z-[300]">
          <TopHeaderBar />
        </div>

        <div className="bg-purple fixed top-[55px] left-0 right-0 z-[300] p-3 flex justify-between items-center overflow-hidden">
           {/* Shimmer Effect Layer */}
           <div className="absolute inset-0 shimmer-effect pointer-events-none"></div>
           <div className="relative z-10 flex justify-between items-center w-full">
            <div className="flex items-center gap-2">
            <Link to="/">
              <img src={AASCLOGO} width={100} className="bg-white p-2" />
            </Link>
            <div className="ps-1">
              <h3 className="text-white text-lg md:text-xl font-bold uppercase">
                {" "}
                Achariya
              </h3>
              <h3 className="text-white text-[12px] md:text-md ">
                {" "}
                Arts and Science College
              </h3>
              <p className="text-[10px] text-gray-300 md:text-[11px]">
                Affilated with Pondicherry University
              </p>
            </div>
          </div>
          <button id="hamburgerBtn" onClick={() => setMobileOpen(true)}>
            <Menu size={28} className="text-white" />
          </button>
          </div>
        </div>
      </div>

      {/* OVERLAY */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[299]"
          onClick={() => setMobileOpen(false)}
        ></div>
      )}

      {/* -------- MOBILE SIDEBAR -------- */}
      <div
        id="mobileSidebar"
        className={`fixed top-0 right-0 h-full w-[300px] bg-white shadow-xl z-[300] p-4 transition-transform duration-300 overflow-y-auto ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <Heading title="MENU" size="sm" className="text-lg" />
          <button onClick={() => setMobileOpen(false)}>
            <X size={26} className="text-purple" />
          </button>
        </div>

        {/* MOBILE LIST */}
        <ul className="flex flex-col gap-1">
          {navItems.map((item, i) => {
            const hasDropdown = Boolean(item.dropdown);

            return (
              <li key={i}>
                {/* MAIN ITEM */}
                <div
                  className="flex justify-between items-center py-2 text-gray-800 font-medium cursor-pointer"
                  onClick={() => {
                    if (hasDropdown) {
                      setMobileSubmenu(
                        mobileSubmenu === item.label ? null : item.label,
                      );
                    } else {
                      setMobileOpen(false);
                    }
                  }}
                >
                  {hasDropdown ? (
                    <span>{item.label}</span>
                  ) : (
                    <Link to={item.path}>{item.label}</Link>
                  )}

                  {hasDropdown && <ChevronDown />}
                </div>

                {/* SUBMENU */}
                {hasDropdown && mobileSubmenu === item.label && (
                  <ul className="ml-4 border-l-2 pl-3">
                    {item.dropdown.map((sub, j) => {
                      const hasSubmenu = Boolean(sub.submenu);

                      return (
                        <li key={j}>
                          <div
                            className="flex justify-between items-center py-2 text-gray-700 cursor-pointer"
                            onClick={() => {
                              if (hasSubmenu) {
                                setMobileSubSubmenu(
                                  mobileSubSubmenu === sub.label
                                    ? null
                                    : sub.label,
                                );
                              } else {
                                setMobileOpen(false);
                              }
                            }}
                          >
                            {hasSubmenu ? (
                              <span>{sub.label}</span>
                            ) : (
                              <Link to={sub.path}>{sub.label}</Link>
                            )}

                            {hasSubmenu && <ChevronDown size={16} />}
                          </div>

                          {/* SUB-SUBMENU */}
                          {hasSubmenu && mobileSubSubmenu === sub.label && (
                            <ul className="ml-4 border-l-2 pl-3 text-sm space-y-1">
                              {sub.submenu.map((ss, k) => (
                                <li key={k}>
                                  <Link
                                    to={ss.path}
                                    className="block py-1"
                                    onClick={() => setMobileOpen(false)}
                                  >
                                    {ss.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default Navbar;
