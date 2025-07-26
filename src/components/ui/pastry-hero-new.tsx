"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { getCloudinaryUrl } from "@/lib/cloudinary-url";

const pastryProducts = [
  {
    title: "Cake in Cups",
    link: "/menu",
    thumbnail: getCloudinaryUrl("/CakeinCups/IMG_3122.JPG"),
  },
  {
    title: "Bridal Shower Cakes",
    link: "/menu",
    thumbnail: getCloudinaryUrl("/BridalShowerCakes/IMG_2723.JPG"),
  },
  {
    title: "Bento and Combos",
    link: "/menu",
    thumbnail: getCloudinaryUrl("/BentoandCombos/IMG_3139.JPG"),
  },
  {
    title: "Baby Dedication Cakes",
    link: "/menu",
    thumbnail: getCloudinaryUrl("/BabyDedicationCakes/IMG_3154.JPG"),
  },
  {
    title: "All in One Package",
    link: "/menu",
    thumbnail: getCloudinaryUrl("/ALLINONEPACKAGE/IMG_3090.JPG"),
  },
  {
    title: "1 Tier Cakes",
    link: "/menu",
    thumbnail: getCloudinaryUrl("/CustomizedCakes/1TierCakes/IMG_3115.JPG"),
  }
] as const;

export function PastryHero() {
  const productsToShow = pastryProducts.slice(0, 6);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance slideshow every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % productsToShow.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [productsToShow.length]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Slideshow */}
      <motion.div
        key={currentSlide}
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Image
          src={productsToShow[currentSlide].thumbnail}
          alt={productsToShow[currentSlide].title}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      </motion.div>

      {/* Black Mask Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content Overlay - Left aligned like original */}
      <div className="relative z-10 flex flex-col justify-center h-full px-4 sm:px-8 lg:px-16 max-w-4xl">
        <motion.h1
          className="text-4xl sm:text-5xl lg:text-6xl font-display text-white tracking-tight leading-[1.1] mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Crafting Sweet{" "}
          <span className="text-primary relative inline-block">
            Moments
            <motion.span
              className="absolute -z-10 bottom-1 left-0 h-2 bg-primary/30 w-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            />
          </span>
        </motion.h1>

        <motion.p
          className="max-w-2xl text-lg sm:text-xl text-white/90 font-body font-light leading-relaxed tracking-wide mb-10"
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
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-medium tracking-wide group transition-colors duration-300"
            asChild
          >
            <Link href="/menu" className="flex items-center gap-3 text-white">
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
                <ArrowRightIcon className="w-6 h-6" />
              </motion.span>
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
