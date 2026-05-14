import React, { useState, useEffect } from "react";
import { NavLink, Link, useLocation, useParams } from "react-router-dom";
import { Menu, X, ChevronDown, ChevronUp, ChevronRight } from "lucide-react";

const GlobalSidebar = ({ title, menu = [], type = "simple" }) => {
  const [open, setOpen] = useState(false); // mobile menu
  const [activeMain, setActiveMain] = useState(null); // dropdown state

  const { slug } = useParams();
  const location = useLocation();

  // Auto-open correct dropdown on load
  useEffect(() => {
    menu.forEach((m) => {
      if (m.url && location.pathname.startsWith(m.url)) {
        setActiveMain(m.id);
      }
    });
  }, [location.pathname, menu]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  return (
    <>
      {/* MOBILE TOP HAMBURGER BAR - Now positioned independently */}
      <div
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-[140px] left-0 right-0 w-full bg-gray-200   md:p-4 py-3 px-4 flex items-center gap-3 shadow-md z-[110]"
      
      >
        <button aria-label="Open menu">
          <Menu size={26} />
        </button>
        <span className="font-medium text-md">{title} Menu</span>
      </div>

      {/* Add spacing for the fixed header on mobile */}
      <div className="md:hidden " />

      {/* ---------------- SIDEBAR MAIN ---------------- */}
      <aside
        className={`fixed md:sticky top-0 md:top-[110px] left-0 h-full w-72  border-r border-gray-300 md:h-[calc(100vh-110px)] md:overflow-y-auto bg-white p-4 shadow-xl md:shadow-none transition-transform z-[1000] md:z-0
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* CLOSE Button */}
        <div className="flex justify-between items-center md:hidden mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={() => setOpen(false)} aria-label="Close menu">
            <X size={28} />
          </button>
        </div>
        {/* Desktop Heading */}
        <h2 className="hidden md:block text-lg font-semibold mb-4 border-b border-purple-800 pb-2">
          {title}
        </h2>
        {/* ---------------- SIMPLE SIDEBAR (Events) ---------------- */}
        {type === "none" && (
          <ul className="space-y-2">
            {menu.map((item) => (
              <li key={item.id || item.key}>
                {item.onClick ? (
                  <button
                    onClick={() => {
                      item.onClick();
                      setOpen(false);
                    }}
                    className={`block w-full text-left px-3 py-2 rounded-md transition ${
                      item.isActive
                        ? "bg-[#03016A]/10 text-black"
                        : "hover:bg-[#03016A]/10 hover:text-black"
                    }`}
                  >
                    {item.title || item.label}
                  </button>
                ) : (
                  <NavLink
                    to={item.url || item || `/campus-life/events/${item.id}`}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-md transition ${
                        isActive || item.isActive
                          ? "bg-[#03016A]/10 text-black"
                          : "hover:bg-[#03016A]/10 hover:text-black"
                      }`
                    }
                  >
                    {item.title || item.label}
                  </NavLink>
                )}
                <hr className="border-gray-200" />
              </li>
            ))}
          </ul>
        )}
        {/* ---------------- DROPDOWN SIDEBAR (Committees) ---------------- */}
        {type === "dropdown" && (
          <ul className="space-y-4">
            {menu.map((main) => (
              <React.Fragment key={main.id || main.key}>
                <li>
                  {/* MAIN DROPDOWN BUTTON */}
                  <button
                    onClick={() =>
                      setActiveMain((prev) =>
                        prev === (main.id || main.key)
                          ? null
                          : main.id || main.key
                      )
                    }
                    className={`w-full flex justify-between items-center px-3 py-2 rounded-md transition font-medium ${
                      activeMain === (main.id || main.key)
                        ? "bg-[#03016A]/10"
                        : "hover:bg-[#03016A]/10"
                    }`}
                  >
                    {main.label || main.title}
                    {activeMain === (main.id || main.key) ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </button>

                  {/* SUBMENU */}
                  {activeMain === (main.id || main.key) && (
                    <ul className="mt-2 ml-3 space-y-2">
                      {(main.children || main.items)?.map((sub) => {
                        const hasDeep = sub.children && sub.children.length > 0;
                        return (
                          <li key={sub.id || sub.key}>
                            {hasDeep ? (
                              <ul className="ml-3 space-y-2">
                                {sub.children.map((child) => {
                                  const childSlug = child.url?.split("/").pop();
                                  return (
                                    <li key={child.id || child.key}>
                                      {child.onClick ? (
                                        <button
                                          onClick={() => {
                                            child.onClick();
                                            setOpen(false);
                                          }}
                                          className={`block w-full text-left px-3 py-2 text-sm flex items-center gap-2 rounded-md transition ${
                                            child.isActive
                                              ? "bg-[#03016A]/10"
                                              : "hover:bg-[#03016A]/10"
                                          }`}
                                        >
                                          <ChevronRight className="w-4 h-4" />
                                          {child.label}
                                        </button>
                                      ) : (
                                        <Link
                                          to={child.url}
                                          onClick={() => setOpen(false)}
                                          className={`block px-3 py-2 text-sm flex items-center gap-2 rounded-md transition ${
                                            slug === childSlug || child.isActive
                                              ? "bg-[#03016A]/10"
                                              : "hover:bg-[#03016A]/10"
                                          }`}
                                        >
                                          <ChevronRight className="w-4 h-4" />
                                          {child.label}
                                        </Link>
                                      )}
                                      <hr className="border-gray-200" />
                                    </li>
                                  );
                                })}
                              </ul>
                            ) : (
                              <>
                                {sub.onClick ? (
                                  <button
                                    onClick={() => {
                                      sub.onClick();
                                      setOpen(false);
                                    }}
                                    className={`block w-full text-left px-3 py-2 gap-2 rounded-md flex items-center transition ${
                                      sub.isActive
                                        ? "bg-[#03016A]/10"
                                        : "hover:bg-[#03016A]/10"
                                    }`}
                                  >
                                    <ChevronRight className="w-4 h-4" />
                                    {sub.label}
                                  </button>
                                ) : (
                                  <Link
                                    to={sub.url}
                                    onClick={() => setOpen(false)}
                                    className={`block px-3 py-2 gap-2 rounded-md flex items-center transition ${
                                      location.pathname === sub.url ||
                                      sub.isActive
                                        ? "bg-[#03016A]/10"
                                        : "hover:bg-[#03016A]/10"
                                    }`}
                                  >
                                    <ChevronRight className="w-4 h-4" />
                                    {sub.label}
                                  </Link>
                                )}
                              </>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
                <hr />
              </React.Fragment>
            ))}
          </ul>
        )}
          {/* // In the SIMPLE SIDEBAR section (type === "none"), replace the
          menu.map: */}
        {type === "placementgallery" && (
          <ul className="space-y-2">
            {menu.map((item, index) => (
              <li key={`${item.id || item.key}-${index}`}>
                {" "}
                {/* Stable key with index */}
                {/* Preserve ORIGINAL data order - NO SORTING */}
                {item.onClick ? (
                  <button
                    onClick={() => {
                      item.onClick();
                      setOpen(false);
                    }}
                    className={`block w-full text-left px-3 py-2 rounded-md transition ${
                      item.isActive
                        ? "bg-[#03016A]/10 text-black"
                        : "hover:bg-[#03016A]/10 hover:text-black"
                    }`}
                  >
                    {item.title || item.label}
                  </button>
                ) : (
                  <NavLink
                    to={item.url || item || `/campus-life/events/${item.id}`}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-md transition ${
                        isActive || item.isActive
                          ? "bg-[#03016A]/10 text-black"
                          : "hover:bg-[#03016A]/10 hover:text-black"
                      }`
                    }
                  >
                    {item.title || item.label}
                  </NavLink>
                )}
                <hr className="border-gray-200" />
              </li>
            ))}
          </ul>
        )}
      </aside>

      {/* Overlay for mobile menu */}
      {open && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-[999]"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default GlobalSidebar;
