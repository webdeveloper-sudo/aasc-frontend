import OurCampus from "@/components/OurCampus";
import OurRecruiters from "@/components/OurRecruiters";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Play, X } from "lucide-react";
import campus from "@/assets/images/aasc_building.webp";
import trainingandplacementsimg1 from "@/assets/images/training-and-placements/training-and-placementimg1.webp";
import { Head } from "react-day-picker";
import HeadingUnderline from "@/components/reusable/HeadingUnderline";
import BannerAndBreadCrumb from "@/components/BannerAndBreadCrumb";
import FacultyProfile from "@/components/FacultyProfile";
import TrainingAndPlacementsData from "@/data/placdements/TrainingAndPlacementsData.js";
import { homeData } from "@/data/home/allhomedata";
import Heading from "@/components/reusable/Heading";
import ForAdmission from "@/components/ForAdmission";
import ImagePopup from "@/components/reusable/ImagePopup";

interface Faculty {
  name: string;
  designation: string;
  email: string;
  department?: string;
  phone?: string;
  image?: string;
}

interface Activity {
  id: number;
  text: string;
}

interface TrainingDataOverride {
  TrainingAndPlacementsFacultyData: Faculty[];
  activities: Activity[];
  supportImages: string[];
}

interface TrainingAndPlacementsCellProps {
  overrideData?: TrainingDataOverride;
}

const TrainingAndPlacementsCell: React.FC<TrainingAndPlacementsCellProps> = ({
  overrideData,
}) => {
  // STATIC data → always from data file (public view)
  const staticData = TrainingAndPlacementsData;

  // DYNAMIC data = overrideData in preview, staticData in public view
  const dynamicData = overrideData || staticData;
  const { TrainingAndPlacementsFacultyData, activities, supportImages } =
    dynamicData;

  const isPreview = Boolean(overrideData);

  // ----------------------------------------------------
  // UNIVERSAL IMAGE URL RESOLVER
  // ----------------------------------------------------
  function resolveImageUrl(img: string) {
    if (!img) return "";

    // CASE 1 — Already full URL (after save)
    if (img.startsWith("http://") || img.startsWith("https://")) {
      return img;
    }

    // CASE 2 — Temp file (filename only)
    if (!img.includes("/assets/images/")) {
      return `${import.meta.env.VITE_API_URL}/assets/images/temp/${img}`;
    }

    // CASE 3 — A backend-built final path already
    return `${import.meta.env.VITE_API_URL}${img}`;
  }

  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null,
  );

  const openPopup = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closePopup = () => {
    setSelectedImageIndex(null);
  };

  const nextImage = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((prev) =>
        prev === null ? null : (prev + 1) % supportImages.length,
      );
    }
  };

  const prevImage = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((prev) =>
        prev === null
          ? null
          : (prev - 1 + supportImages.length) % supportImages.length,
      );
    }
  };

  return (
    <>
      <section>
        <BannerAndBreadCrumb
          img={campus}
          title="Training And Placements Cell"
        />
      </section>
      <div className="container md:py-10 py-3">
        {/* <section className="bg-background py-10">
          <div className="md:hidden block ">
            <Heading
              title="Training and placements Cell"
              size="lg"
              align="left"
            />
            <HeadingUnderline width={150} align="left" />
          </div>

          <div className="flex flex-col md:flex-row gap-10">
            <div className="relative w-full md:w-1/2 aspect-video overflow-hidden shadow-lg">
              <img
                src={campus}
                alt="Our Campus"
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="absolute rounded-full border-4 border-white/40 w-20 h-20"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.4, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <motion.button
                  onClick={() => setIsOpen(true)}
                  className="relative bg-white/90 rounded-full p-4 shadow-md hover:scale-110 transition-transform"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-8 h-8 text-purple-700" />
                </motion.button>
              </div>
            </div>

            <div className="md:w-1/2 text-center md:text-left space-y-4">
              <div className="md:block hidden">
                <Heading
                  title="Training and placements Cell"
                  size="lg"
                  align="left"
                />
                <HeadingUnderline width={150} align="left" />
              </div>

              <p className=" leading-relaxed">
                The college has established a full-fledged and active Training
                and Placement Cell, which monitors the employment opportunities
                and arranges campus interviews for the pre-final year and final
                year students. Our college considers placement and training as
                its prime duty to every student who gets admission into the
                college. Placement cell edifies all the managerial traits, which
                are required for the students and prepare them according to the
                requirement of industry. The placement cell also facilitates to
                sign MOU with reputed organizations which are located in an
                around Pondicherry and Tamil Nadu.
              </p>
              <p className=" leading-relaxed">
                Achariya Arts and Science College, Puducherry, is one of the
                premier institutions under the Achariya Group of Educational
                Institutions. Established with a vision to provide holistic
                education and empower students with academic excellence, values,
                and skills, Achariya offers a wide range of undergraduate and
                postgraduate programs in arts, science, and commerce. The
                college fosters innovation, discipline, and leadership among its
                students.
              </p>
              <div>
                <a href="#contact" className="red-btn">
                  For Admissions
                </a>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-6 right-6 text-white hover:text-purple-400 transition"
                >
                  <X className="w-8 h-8" />
                </button>

                <motion.div
                  className="w-full max-w-4xl aspect-video"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* <iframe
                src="https://player.vimeo.com/video/996960549?autoplay=1&title=0&byline=0&portrait=0&controls=0"
                className="w-full h-full rounded-lg"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              ></iframe> 
                  <iframe
                    className="w-full h-full rounded-lg"
                    title="vimeo-player"
                    src="https://player.vimeo.com/video/996960549?h=83a2493a4d"
                    width="640"
                    height="360"
                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                    allowFullScreen
                  ></iframe>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </section> */}
        <section className="py-10">
          <div className="flex flex-col md:flex-row gap-10">
            {/* 🏫 Content Section */}
            <div className="md:w-1/2 text-center md:text-left space-y-5">
              <div>
                <Heading
                  title="Training and placements Cell - Activities"
                  size="lg"
                  align="left"
                />
                <HeadingUnderline width={150} align="left" />
              </div>
              <div className="relative md:hidden  block  w-full md:w-1/2 aspect-video overflow-hidden shadow-lg">
                {/* Placeholder thumbnail */}
                <img
                  src={trainingandplacementsimg1}
                  alt="trainingandplacementsimg1"
                  className="w-full h-full object-cover"
                />
              </div>
              <ul className="space-y-3 ">
                {activities.map((item) => (
                  <li
                    key={item.id}
                    className="flex gap-3 text-justify text-left"
                  >
                    <div className="w-5 h-5 flex items-start justify-center pt-1">
                      <GraduationCap className="w-4 h-4 text-purple-700" />
                    </div>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>

              {/* <div>
                <a href="#contact" className="red-btn">
                  For Admissions
                </a>
              </div> */}
            </div>
            <div className="relative md:block hidden w-full md:w-1/2 aspect-video overflow-hidden shadow-lg">
              {/* Placeholder thumbnail */}
              <img
                src={trainingandplacementsimg1}
                alt="Our Campus"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        <section className="py-10">
          <div className="grid md:grid-cols-4 gap-6">
            {supportImages.map((image, index) => (
              <img
                key={index}
                src={isPreview ? resolveImageUrl(image) : image}
                alt={`Support Image ${index + 1}`}
                className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => openPopup(index)}
              />
            ))}
          </div>
        </section>

        <section className="py-10">
          <div>
            <Heading title="Faculty" size="lg" align="center" />
            <HeadingUnderline width={150} align="center" />
          </div>
          {TrainingAndPlacementsFacultyData.map((faculty, index) => (
            <FacultyProfile
              key={index}
              image={isPreview ? resolveImageUrl(faculty.image) : faculty.image}
              name={faculty.name}
              department={faculty.department}
              designation={faculty.designation}
              email={faculty.email}
            />
          ))}{" "}
        </section>

        <section>
          <div className="py-10">
            <OurRecruiters
              title={homeData.recruiters.title}
              logos={homeData.recruiters.logos}
            />
          </div>
        </section>

        <section id="contact" className="py-6 md:py-12 container">
          <ForAdmission data={homeData.admission} />
        </section>
      </div>
      <ImagePopup
        images={supportImages.map((img) => ({
          image: isPreview ? resolveImageUrl(img) : img,
          imgTitle: "",
        }))}
        selectedIndex={selectedImageIndex}
        onClose={closePopup}
        onNext={nextImage}
        onPrev={prevImage}
      />
    </>
  );
};

export default TrainingAndPlacementsCell;
