import React from "react";
import { useLocation, Link } from "react-router-dom";
import defaultBanner from "@/assets/images/aasc_building.webp";

const BannerAndBreadCrumb = ({ title = "Page Title", img }) => {
  const location = useLocation();

  // Safe image handling (imported images are NOT strings)
  const safeImage = img || defaultBanner;

  // List of valid navigable routes (add your actual routes here)
  const validRoutes = new Set([
    "/", 
    "/home", 
    "/admissions", 
    "/courses", 
    "/faculty",
    // Add other actual routes from your App router
  ]);

  // Breadcrumb path segments
  const pathnames = location.pathname.split("/").filter(Boolean);

  // Check if route exists and is navigable
  const isValidRoute = (routePath) => validRoutes.has(routePath);

  return (
    <section
      className="
        w-full 
        h-[300px] sm:h-[150px] md:h-[300px] lg:h-[300px] xl:h-[300px]
        relative flex items-center justify-center text-white
      "
      style={{
        backgroundImage: `url(${safeImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Breadcrumb */}
      <div
        className="
          absolute top-3 left-4 sm:top-4 sm:left-6 md:top-6 md:left-10
          text-xs sm:text-[11px] md:text-base font-medium
          flex flex-wrap gap-1 sm:gap-2 z-10
        "
      >
        <Link to="/" className="hover:underline">Home</Link>

        {pathnames.length > 0 && <span>/</span>}

        {pathnames.map((name, index) => {
          const isLast = index === pathnames.length - 1;
          const routePath = "/" + pathnames.slice(0, index + 1).join("/");

          return isLast ? (
            <span key={name} className="capitalize opacity-80">
              {name.replace(/-/g, " ")}
            </span>
          ) : (
            <span key={name} className="flex gap-1 sm:gap-2">
              {isValidRoute(routePath) ? (
                <Link to={routePath} className="capitalize hover:underline">
                  {name.replace(/-/g, " ")}
                </Link>
              ) : (
                <span className="capitalize opacity-60 pointer-events-none">
                  {name.replace(/-/g, " ")}
                </span>
              )}
              /
            </span>
          );
        })}
      </div>

      {/* Title */}
      <h1
        className="
          text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl
          font-bold z-10 text-center drop-shadow-lg px-4
        "
        style={{
          color: "#fff",
          textShadow: "0 0 10px rgba(0,0,0,0.6)"
        }}
      >
        {title}
      </h1>
    </section>
  );
};

export default BannerAndBreadCrumb;
