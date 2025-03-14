"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

const GRID_IMAGES = [
  "/CakeinCups/IMG_3122.JPG",
  "/BridalShowerCakes/IMG_2723.JPG",
  "/BentoandCombos/IMG_3139.JPG",
  "/BabyDedicationCakes/IMG_3154.JPG",
  "/ALLINONEPACKAGE/IMG_3090.JPG",
  "/CustomizedCakes/1TierCakes/IMG_3115.JPG",
  "/CustomizedCakes/2TierCakes/IMG_3236.JPG",
  "/CustomizedCakes/3TierCakes/IMG_3180.JPG",
  "/NumberandLetterCakes/IMG_3232.JPG",
];

export function PastryHero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-background">
      {/* Grid Background */}
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-1 p-1">
        {GRID_IMAGES.map((image, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 1.2 }}
            animate={{ 
              opacity: mounted ? 0.5 : 0,
              scale: mounted ? 1 : 1.2,
            }}
            transition={{
              duration: 0.8,
              delay: index * 0.1,
              ease: [0, 0.71, 0.2, 1.01]
            }}
            className="relative w-full h-full overflow-hidden"
          >
            <Image
              src={image}
              alt="Pastry Grid"
              fill
              className="object-cover brightness-75 hover:scale-110 hover:brightness-100 transition-all duration-500"
            />
            <div className="absolute inset-0 bg-background/20 backdrop-blur-[1px]" />
          </motion.div>
        ))}
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background/80" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full max-w-6xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="space-y-6"
        >
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-display text-black leading-[1.1] mb-6">
            Crafting Sweet{" "}
            <span className="text-primary relative inline-block">
              Moments
              <motion.span
                className="absolute -z-10 bottom-0 left-0 h-3 bg-primary/20 w-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: mounted ? 1 : 0 }}
                transition={{ duration: 1, delay: 1 }}
              />
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-black/90 font-body font-light leading-relaxed">
            Experience the artistry of our handcrafted cakes and pastries, where every creation tells a unique story of flavor and beauty.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Button 
              size="lg" 
              className="bg-white hover:bg-white/90 text-primary px-8 py-6 text-lg group mt-8
                shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]"
              asChild
            >
              <Link href="/menu" className="flex items-center gap-2">
                Explore Our Menu
                <motion.span
                  animate={{
                    x: [0, 4, 0],
                    transition: {
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }}
                >
                  <ArrowRightIcon className="w-5 h-5" />
                </motion.span>
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Moving Gradient Border */}
      <div className="absolute bottom-0 left-0 right-0 h-1">
        <div className="h-full bg-gradient-to-r from-primary/0 via-primary to-primary/0 animate-[shimmer_2s_ease-in-out_infinite]" />
      </div>
    </section>
  );
}
