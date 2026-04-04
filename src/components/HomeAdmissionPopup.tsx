import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

import popupImage from "@/assets/images/home-popup/evensem25.webp";

const SESSION_KEY = "home_admission_popup_seen";

const HomeAdmissionPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Show popup ONLY on first tab open
  useEffect(() => {
    const hasSeen = sessionStorage.getItem(SESSION_KEY);

    if (!hasSeen) {
      setIsOpen(true);
      sessionStorage.setItem(SESSION_KEY, "true");
    }
  }, []);

  // ESC key close
  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="home-popup-bg"
          className="fixed inset-0 z-[1000] bg-black/90 m-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          {/* CLOSE BUTTON */}
          <motion.button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
          >
            <X size={34} />
          </motion.button>

          {/* IMAGE WRAPPER */}
          <motion.div
            className="relative flex items-center justify-center"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: "spring", stiffness: 160, damping: 18 }}
          >
            {/* 3:4 RATIO CONTAINER */}
            <div className="md:h-[90vh]   md:max-w-[90vw] overflow-hidden shadow-2xl">
              <img
                src={popupImage}
                alt="Admission Popup"
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HomeAdmissionPopup;
