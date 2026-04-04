import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play } from "lucide-react";

const VideoPopup = ({ thumbnail, videoUrl }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // ESC close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") closePopup();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const openPopup = () => {
    setIsOpen(true);
    setShowVideo(true);
    setIsLoading(true);
  };

  const closePopup = () => {
    setIsOpen(false);
    setShowVideo(false);
  };

  return (
    <>
      {/* ---------- THUMBNAIL & PLAY BUTTON (Outside Popup) ---------- */}
      <div className="relative w-full h-full aspect-video overflow-hidden shadow-lg cursor-pointer ">
        <img
          src={thumbnail}
          alt="thumbnail"
          className="w-full h-full object-cover"
        />

        {/* Animated ring */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-24 h-24 rounded-full border-4 border-white/50"></div>
        </motion.div>

        {/* Play button */}
        <motion.button
          onClick={openPopup}
          className="absolute inset-0 flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="bg-white/90 p-5 rounded-full shadow-lg">
            <Play className="w-10 h-10 text-purple-700" />
          </div>
        </motion.button>
      </div>

      {/* ---------- POPUP OVERLAY ---------- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[9999]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePopup}
          >
            <button
              onClick={closePopup}
              className="absolute top-10 right-10 text-white hover:text-purple-400 transition z-[10000]"
            >
              <X className="w-10 h-10" />
            </button>

            {/* ---------- POPUP BOX ---------- */}
            <motion.div
              className="w-full max-w-4xl aspect-video relative rounded-lg overflow-hidden"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* THUMBNAIL INSIDE POPUP BEFORE PLAY */}
              {!showVideo && (
                <div
                  className="absolute inset-0 bg-cover bg-center flex items-center justify-center"
                  style={{ backgroundImage: `url(${thumbnail})` }}
                >
                  <motion.button
                    className="relative bg-white/90 rounded-full p-5 shadow-lg"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Play className="w-10 h-10 text-purple-700" />
                  </motion.button>
                </div>
              )}

              {/* Loader */}
              {showVideo && isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-10">
                  <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-white mt-3">Loading video...</p>
                </div>
              )}

              {/* Actual Video */}
              {showVideo && (
                <iframe
                  className="w-full h-full"
                  src={videoUrl}
                  title="video"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  onLoad={() => setIsLoading(false)}
                ></iframe>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VideoPopup;
