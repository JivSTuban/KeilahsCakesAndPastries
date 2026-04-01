"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { getCloudinaryUrl } from "@/lib/cloudinary-url";

export function PastryHero({ 
  displayMode = 'slideshow',
  heroImageUrl,
  heroImages 
}: { 
  displayMode?: string,
  heroImageUrl?: string | null,
  heroImages?: string[] | null 
}) {
  const defaultImages = [
    getCloudinaryUrl("/CakeinCups/IMG_3122.JPG"),
    getCloudinaryUrl("/BridalShowerCakes/IMG_2723.JPG"),
    getCloudinaryUrl("/BentoandCombos/IMG_3139.JPG"),
    getCloudinaryUrl("/BabyDedicationCakes/IMG_3154.JPG"),
    getCloudinaryUrl("/ALLINONEPACKAGE/IMG_3090.JPG"),
    getCloudinaryUrl("/CustomizedCakes/1TierCakes/IMG_3115.JPG")
  ];
  
  const displayImages = heroImages && heroImages.length > 0 ? heroImages : defaultImages;
  const singleImage = heroImageUrl || getCloudinaryUrl("/CakeinCups/IMG_3122.JPG");
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance slideshow every 4 seconds
  useEffect(() => {
    if (displayMode === 'single') return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % displayImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [displayImages.length, displayMode]);

  return (
    <div className="relative w-full h-[70vh] sm:h-[80vh] lg:h-screen overflow-hidden">
      {/* Background Image */}
      {displayMode === 'single' ? (
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <Image
            src={singleImage}
            alt="Keilah's Cakes and Pastries Hero Image"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </motion.div>
      ) : (
        <motion.div
          key={currentSlide}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <Image
            src={displayImages[currentSlide]}
            alt={`Keilah's Cakes and Pastries Hero Image ${currentSlide + 1}`}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </motion.div>
      )}

      {/* Black Mask Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content Overlay - Upper left positioned */}
      <div className="relative z-10 flex flex-col justify-start pt-12 sm:pt-20 lg:pt-32 xl:pt-40 h-full px-4 sm:px-8 lg:px-16 xl:px-20 max-w-5xl xl:max-w-6xl">
        <motion.h1
          className="text-3xl sm:text-5xl lg:text-7xl xl:text-8xl font-display text-white tracking-tight leading-[1.1] mb-4 sm:mb-6 lg:mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Crafting Sweet{" "}
          <span className="text-primary relative inline-block">
            Moments
            <motion.span
              className="absolute -z-10 bottom-1 left-0 h-1 sm:h-2 lg:h-3 xl:h-4 bg-primary/30 w-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            />
          </span>
        </motion.h1>

        <motion.p
          className="max-w-2xl lg:max-w-3xl xl:max-w-4xl text-sm sm:text-lg lg:text-2xl xl:text-3xl text-white/90 font-body font-light leading-relaxed tracking-wide mb-6 sm:mb-10 lg:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          Experience the artistry of our handcrafted cakes and pastries, where every creation tells a unique story of flavor and beauty.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-4 sm:px-8 sm:py-6 lg:px-12 lg:py-8 xl:px-16 xl:py-10 text-base sm:text-lg lg:text-xl xl:text-2xl font-medium tracking-wide group transition-colors duration-300"
            asChild
          >
            <Link href="/menu" className="flex items-center gap-2 sm:gap-3 lg:gap-4 text-white">
              Explore Our Menu
              <motion.span
                animate={{
                  x: [0, 4, 0],
                  transition: {
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
              >
                <ArrowRightIcon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 xl:w-10 xl:h-10" />
              </motion.span>
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
