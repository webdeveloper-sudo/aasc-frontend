import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react";

const ImagePopup = ({
  images = [],
  selectedIndex,
  onClose,
  onNext,
  onPrev,
}) => {
  const isOpen = selectedIndex !== null;
  const item = images[selectedIndex];

  const [zoom, setZoom] = useState(1);

  // Reset zoom when image changes
  useEffect(() => {
    setZoom(1);
  }, [selectedIndex]);

  // Close / arrow keys
  useEffect(() => {
    const handle = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };

    if (isOpen) window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [isOpen]);

  // Mouse wheel zooming
  const handleWheel = (e) => {
    if (e.deltaY < 0) setZoom((z) => Math.min(z + 0.2, 4));
    else setZoom((z) => Math.max(z - 0.2, 1));
  };

  // Double-click / Double-tap zoom
  const handleDoubleClick = () => {
    setZoom((z) => (z === 1 ? 2 : 1));
  };

  return (
    <AnimatePresence>
      {isOpen && item && (
        <motion.div
          key="popup-bg"
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-[1000]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          {/* Close */}
          <motion.button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-400"
          >
            <X size={32} />
          </motion.button>

          {/* Prev */}
          <motion.button
            onClick={onPrev}
            className="absolute left-6 text-white hover:text-gray-300"
          >
            <ChevronLeft size={48} />
          </motion.button>

          {/* IMAGE WRAPPER */}
          <motion.div
            className="flex flex-col items-center gap-4 text-center select-none"
            onWheel={handleWheel}
            onDoubleClick={handleDoubleClick}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
          >
            <motion.img
              key={item.image}
              src={item.image}
              alt={item.imgTitle}
              className="max-h-[80vh] max-w-[85vw] object-contain"
              animate={{ scale: zoom }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            />

            {/* Image Title */}
            <p className="text-white text-lg font-medium">{item.imgTitle}</p>

            {/* ZOOM CONTROL BAR */}
            <div className="flex items-center gap-4 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-md">
              {/* ZOOM OUT */}
              <button
                onClick={() => setZoom((z) => Math.max(z - 0.2, 1))}
                className="text-white hover:text-gray-200"
              >
                <ZoomOut size={28} />
              </button>

              {/* RESET ZOOM */}
              <button
                onClick={() => setZoom(1)}
                className="text-white hover:text-gray-200"
              >
                <RotateCcw size={28} />
              </button>

              {/* ZOOM IN */}
              <button
                onClick={() => setZoom((z) => Math.min(z + 0.2, 4))}
                className="text-white hover:text-gray-200"
              >
                <ZoomIn size={28} />
              </button>
            </div>
          </motion.div>

          {/* Next */}
          <motion.button
            onClick={onNext}
            className="absolute right-6 text-white hover:text-gray-300"
          >
            <ChevronRight size={48} />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImagePopup;
