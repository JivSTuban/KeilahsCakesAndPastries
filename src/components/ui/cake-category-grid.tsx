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
        <div className="aspect-[4/3] relative overflow-hidden">
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
                isHovered ? "scale-110 blur-[2px]" : "scale-100"
              )}
            />
          </motion.div>
          <motion.div 
            className="absolute inset-0"
            initial={false}
            animate={isHovered ? {
              background: [
                "linear-gradient(to top, rgba(251, 146, 60, 0.95), rgba(251, 146, 60, 0.3), transparent)",
                "linear-gradient(to top, rgba(251, 146, 60, 0.95), rgba(251, 146, 60, 0.4), transparent)"
              ]
            } : {
              background: "linear-gradient(to top, rgba(251, 146, 60, 0), rgba(251, 146, 60, 0), transparent)"
            }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Content Overlay */}
          <div className={cn(
            "absolute inset-0 p-4 sm:p-6 md:p-8 flex flex-col justify-end transform transition-all duration-500", // Responsive padding
            isHovered ? "translate-y-0 opacity-100 scale-100" : "translate-y-4 opacity-0 scale-95"
          )}>
            <h3 className="text-2xl font-display text-white mb-3 drop-shadow-md">
              {category.title}
            </h3>
            <p className="font-body text-white/90 text-sm line-clamp-2 mb-6 drop-shadow">
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
                variant="secondary"
                className={cn(
                  "w-fit transition-all duration-500 bg-white/90 hover:bg-white cursor-pointer",
                  "shadow-lg hover:shadow-xl"
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
    <section className="w-full max-w-7xl mx-auto px-4 py-20 md:py-32 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-20"
      >
        <div className="flex items-center justify-center mb-4">
          <Cake className="h-10 w-10 text-primary mr-4" />
          <h2 className="text-4xl md:text-5xl font-display text-foreground">Our Specialties</h2>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg font-body leading-relaxed">
          Discover our handcrafted cakes made with love for every special moment
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 perspective-1000 relative z-10">
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
