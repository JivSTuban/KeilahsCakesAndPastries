"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { ImageWithLoading } from "@/components/ui/image-with-loading";

interface LightboxProps {
  images: string[];
  initialIndex?: number;
  onClose: () => void;
}

export function Lightbox({ images, initialIndex = 0, onClose }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        navigate("prev");
      } else if (e.key === "ArrowRight") {
        navigate("next");
      }
    };

    document.addEventListener("keydown", handleKeyboard);
    return () => document.removeEventListener("keydown", handleKeyboard);
  }, [onClose]);

  const navigate = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    } else {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
      >
        <div className="fixed inset-4 md:inset-10 z-50">
          <div 
            className="h-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Main Image */}
            <div className="relative w-full h-full">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", damping: 25 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="relative w-full h-full">
                  <ImageWithLoading
                    src={images[currentIndex]}
                    alt={`Image ${currentIndex + 1}`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 80vw"
                    priority
                    overlayClassName="bg-background/50"
                  />
                </div>
              </motion.div>
            </div>

            {/* Navigation Controls */}
            <div className="absolute inset-y-0 left-4 flex items-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("prev");
                }}
                className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            </div>
            <div className="absolute inset-y-0 right-4 flex items-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("next");
                }}
                className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
              <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-body">
                {currentIndex + 1} / {images.length}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
