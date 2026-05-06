import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Construction, Home } from "lucide-react";
import BannerAndBreadCrumb from "../BannerAndBreadCrumb";
import Heading from "../reusable/Heading";
import HeadingUnderline from "../reusable/HeadingUnderline";
import campus from "@/assets/images/aasc_building.webp";

const UnderConstruction = ({ hideBanner = false }: { hideBanner?: boolean }) => {
  const location = useLocation();
  const pathParts = location.pathname.split("/").filter(Boolean);
  const pageTitle = pathParts.length > 0 
    ? pathParts[pathParts.length - 1].replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())
    : "Under Construction";

  return (
    <div className="bg-white">
      {!hideBanner && <BannerAndBreadCrumb img={campus} title={pageTitle} />}
      
      <section className="bg-hat-pattern md:container md:py-20 py-10 min-h-[60vh] flex flex-col items-center justify-center">
        <div className="max-w-2xl w-full text-center space-y-10 px-4">
          {/* HEADER */}
          <div className="text-center space-y-2">
            <Heading title="Page Under Construction" size="lg" align="center" />
            <HeadingUnderline width={200} align="center" />
            <p className="text-lg md:text-xl text-gray-600 font-medium">
              We're building something great for you!
            </p>
          </div>

          {/* Animated Icon Container */}
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-purple/10 rounded-full animate-ping scale-150 opacity-20"></div>
            <div className="relative bg-white p-8 rounded-full shadow-2xl border-4 border-purple/5">
              <Construction className="w-24 h-24 text-purple animate-bounce" />
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-6">
            <p className="text-lg text-gray-600 leading-relaxed max-w-lg mx-auto">
              This page ({pageTitle}) is currently being developed by our team. 
              We'll have it ready for you very soon. Thank you for your patience!
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="max-w-md mx-auto">
            <div className="flex justify-between mb-2 text-sm font-semibold text-purple">
              <span>Development Progress</span>
              <span>75%</span>
            </div>
            <div className="relative h-3 w-full bg-gray-200 rounded-full overflow-hidden shadow-inner">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple via-purple-600 to-purple rounded-full transition-all duration-1000 ease-out"
                style={{ width: '75%' }}
              ></div>
            </div>
          </div>

          {/* Back to Home Button */}
          <div className="pt-4">
            <Link
              to="/"
              className="inline-flex items-center gap-3 bg-purple hover:bg-purple-700 text-white font-bold py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl uppercase tracking-wider text-sm"
            >
              <Home className="w-5 h-5" />
              Return to Homepage
            </Link>
          </div>

          {/* Decorative Pattern */}
          <div className="flex justify-center gap-2 pt-10">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={`h-1.5 rounded-full bg-purple/${i * 10}`} style={{ width: `${i * 15}px` }}></div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default UnderConstruction;

