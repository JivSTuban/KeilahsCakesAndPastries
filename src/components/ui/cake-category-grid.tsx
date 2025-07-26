"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Cake, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useParallax } from "@/hooks/use-parallax";
import { Button } from "@/components/ui/button";
import { getCloudinaryUrl } from "@/lib/cloudinary-url";

const CAKE_CATEGORIES = [
  {
    id: 1,
    title: "Wedding Cakes",
    description: "Elegant and beautifully crafted wedding cakes for your special day",
    image: getCloudinaryUrl("/WeddingCakes/IMG_3113.JPG"),
    href: "/collections#wedding"
  },
  {
    id: 2,
    title: "Birthday Cakes",
    description: "Delightful cakes to make your birthday celebration extra special",
    image: getCloudinaryUrl("/CustomizedCakes/2TierCakes/IMG_3235.JPG"),
    href: "/collections#birthday"
  },
  {
    id: 3,
    title: "Baby Dedication",
    description: "Sweet celebrations for your little one's special milestone",
    image: getCloudinaryUrl("/BabyDedicationCakes/IMG_3149.JPG"),
    href: "/collections#baby-dedication"
  },
  {
    id: 4,
    title: "Number Cakes",
    description: "Personalized number and letter cakes for any occasion",
    image: getCloudinaryUrl("/NumberandLetterCakes/IMG_3151.JPG"),
    href: "/collections#number-cakes"
  },
  {
    id: 5,
    title: "All in One Package",
    description: "Complete celebration packages with cake, cupcakes, and number designs",
    image: getCloudinaryUrl("/ALLINONEPACKAGE/IMG_3086.JPG"),
    href: "/collections#cup-cakes"
  },
  {
    id: 6,
    title: "Bento Cakes",
    description: "Adorable mini cakes perfect for intimate celebrations",
    image: getCloudinaryUrl("/BentoandCombos/IMG_3119.JPG"),
    href: "/collections#bento"
  }
];

interface CategoryCardProps {
  category: typeof CAKE_CATEGORIES[0];
  index: number;
  isHovered: boolean;
  onHover: (index: number | null) => void;
}

function CategoryCard({ category, index, isHovered, onHover }: CategoryCardProps) {
  const { ref: imageRef, y } = useParallax({ offset: 40 });

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.15 }}
      className="relative"
    >
      <Link
        href={category.href}
        className="group block relative rounded-xl overflow-hidden bg-card transition-all duration-500 hover:shadow-2xl"
        onMouseEnter={() => onHover(index)}
        onMouseLeave={() => onHover(null)}
      >
        <div className="aspect-[5/4] relative overflow-hidden">
          <motion.div
            ref={imageRef}
            style={{ y }}
            className="absolute inset-0 w-full h-[140%] -top-[20%]"
          >
            <Image
              src={category.image}
              alt={category.title}
              fill
              className={cn(
                "object-cover transition-all duration-700 ease-out",
                isHovered ? "scale-110 blur-[1px]" : "scale-100"
              )}
            />
          </motion.div>
          
          {/* White gradient overlay for mobile */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white to-transparent"></div>
          
          {/* Desktop hover overlay */}
          <motion.div 
            className="absolute inset-0 hidden md:block"
            initial={false}
            animate={isHovered ? {
              background: "linear-gradient(to top, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0))"
            } : {
              background: "linear-gradient(to top, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0), transparent)"
            }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Mobile-visible content (always visible) */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="text-base font-display text-foreground font-medium mb-0.5">
              {category.title}
            </h3>
            <div className="flex items-center">
              <span className="text-xs font-body text-primary font-medium">View Collection</span>
              <ChevronRight className="h-3 w-3 ml-1 text-primary" />
            </div>
          </div>
          
          {/* Desktop hover content - hidden on all devices */}
          <div className={cn(
            "absolute inset-0 p-4 flex flex-col justify-end transform transition-all duration-500 hidden", 
            isHovered ? "translate-y-0 opacity-100 scale-100" : "translate-y-4 opacity-0 scale-95"
          )}>
            <h3 className="text-xl font-display text-foreground mb-2 font-medium">
              {category.title}
            </h3>
            <p className="font-body text-muted-foreground text-sm line-clamp-2 mb-4">
              {category.description}
            </p>
            <motion.div
              initial={false}
              animate={isHovered ? {
                x: [null, 5, 0],
                transition: { duration: 0.3 }
              } : {}}
            >
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "w-fit transition-all duration-500 bg-white border-primary text-primary hover:bg-primary hover:text-white cursor-pointer",
                  "shadow-sm hover:shadow-md"
                )}
              >
                View Collection
                <motion.span
                  animate={isHovered ? {
                    x: [0, 4, 0],
                    transition: {
                      duration: 1,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }
                  } : {}}
                >
                  <ChevronRight className="h-4 w-4 ml-1" />
                </motion.span>
              </Button>
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function CakeCategoryGrid() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-16 md:py-24 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12 md:mb-16"
      >
        <div className="flex items-center justify-center mb-4">
          <Cake className="h-8 w-8 text-primary mr-3 md:h-10 md:w-10 md:mr-4" />
          <h2 className="text-3xl md:text-5xl font-display text-foreground">Our Specialties</h2>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg font-body leading-relaxed">
          Discover our handcrafted cakes made with love for every special moment
        </p>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 xs:gap-4 sm:gap-6 md:gap-8 perspective-1000 relative z-10 max-w-4xl mx-auto">
        {CAKE_CATEGORIES.map((category, index) => (
          <CategoryCard 
            key={category.id}
            category={category}
            index={index}
            isHovered={hoveredIndex === index}
            onHover={setHoveredIndex}
          />
        ))}
      </div>
    </section>
  );
}
