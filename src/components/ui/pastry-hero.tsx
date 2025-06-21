"use client";

import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { getCloudinaryUrl } from "@/lib/cloudinary-url";
import { useIsMobile } from "@/hooks/use-mobile"; // Import useIsMobile

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
  },
  {
    title: "2 Tier Cakes",
    link: "/menu",
    thumbnail: getCloudinaryUrl("/CustomizedCakes/2TierCakes/IMG_3236.JPG"),
  },
  {
    title: "3 Tier Cakes",
    link: "/menu",
    thumbnail: getCloudinaryUrl("/CustomizedCakes/3TierCakes/IMG_3107.JPG"),
  },
  {
    title: "Number and Letter Cakes",
    link: "/menu",
    thumbnail: getCloudinaryUrl("/NumberandLetterCakes/IMG_3232.JPG"),
  },
  {
    title: "Wedding Cakes",
    link: "/menu",
    thumbnail: getCloudinaryUrl("/WeddingCakes/IMG_3113.JPG"),
  },
  {
    title: "Debut Cakes",
    link: "/menu",
    thumbnail: getCloudinaryUrl("/DebutCakes/IMG_3105.JPG"),
  },
  {
    title: "Gender Reveal Cakes",
    link: "/menu",
    thumbnail: getCloudinaryUrl("/GenderRevealCakes/IMG_3166.JPG"),
  },
  {
    title: "Custom Creations",
    link: "/menu",
    thumbnail: getCloudinaryUrl("/CustomizedCakes/1TierCakes/IMG_3114.JPG"),
  },
  {
    title: "Special Occasions",
    link: "/menu",
    thumbnail: getCloudinaryUrl("/CustomizedCakes/2TierCakes/IMG_3234.JPG"),
  },
  {
    title: "Celebration Cakes",
    link: "/menu",
    thumbnail: getCloudinaryUrl("/CustomizedCakes/1TierCakes/IMG_3135.JPG"),
  },
  {
    title: "Keilah Classics",
    link: "/menu",
    thumbnail: getCloudinaryUrl("/KeilahClassics/IMG_3082.JPG"),
  },
  {
    title: "All in One Package v2",
    link: "/menu",
    thumbnail: getCloudinaryUrl("/ALLINONEPACKAGE/IMG_3086.JPG"),
  },
  {
    title: "Baby Dedication Cakes v2",
    link: "/menu",
    thumbnail: getCloudinaryUrl("/BabyDedicationCakes/IMG_3149.JPG"),
  },
  {
    title: "Bento and Combos v2",
    link: "/menu",
    thumbnail: getCloudinaryUrl("/BentoandCombos/IMG_3118.JPG"),
  },
  {
    title: "Bridal Shower Cakes v2",
    link: "/menu",
    thumbnail: getCloudinaryUrl("/BridalShowerCakes/IMG_2722.JPG"),
  },
  {
    title: "Cake in Cups v2",
    link: "/menu",
    thumbnail: getCloudinaryUrl("/CakeinCups/IMG_3121.JPG"),
  },
  {
    title: "Customized Cakes 1 Tier v2",
    link: "/menu",
    thumbnail: getCloudinaryUrl("/CustomizedCakes/1TierCakes/IMG_2126.JPG"),
  },
  {
    title: "Debut Cakes v2",
    link: "/menu",
    thumbnail: getCloudinaryUrl("/DebutCakes/IMG_3111.JPG"),
  },
  {
    title: "Wedding Cakes v2",
    link: "/menu",
    thumbnail: getCloudinaryUrl("/WeddingCakes/IMG_3131.JPG"),
  },
  {
    title: "Debut Cakes v3",
    link: "/menu",
    thumbnail: getCloudinaryUrl("/DebutCakes/IMG_3173.JPG"),
  },
  {
    title: "Gender Reveal Cakes v2",
    link: "/menu",
    thumbnail: getCloudinaryUrl("/GenderRevealCakes/IMG_3172.JPG"),
  },
  {
    title: "Number and Letter Cakes v3",
    link: "/menu",
    thumbnail: getCloudinaryUrl("/NumberandLetterCakes/IMG_3133.JPG"),
  },
   {
    title: "Wedding Cakes v3",
    link: "/menu",
    thumbnail: getCloudinaryUrl("/WeddingCakes/IMG_3132.JPG"),
  }
] as const;

type PastryProduct = (typeof pastryProducts)[number];

interface ProductCardProps {
  product: PastryProduct;
  translate: MotionValue<number>;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, translate }) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
        transition: {
          duration: 0.3,
          ease: "easeOut"
        }
      }}
      key={product.title}
      className="group/product h-[500px] w-[600px] relative flex-shrink-0"
    >
      <Link
        href={product.link}
        className="block group-hover/product:shadow-2xl transition-shadow duration-300"
      >
        <Image
          src={product.thumbnail}
          height={600}
          width={600}
          className="object-cover object-left-top absolute h-full w-full inset-0 rounded-lg transition-transform duration-300 group-hover/product:scale-[1.02]"
          alt={product.title}
          priority
        />
      </Link>
      <motion.div 
        className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-90 bg-background/90 pointer-events-none rounded-lg"
        transition={{ duration: 0.3, ease: "easeOut" }}
      />
      <motion.h2 
        className="absolute bottom-6 left-6 opacity-0 group-hover/product:opacity-100 text-xl font-display tracking-wide"
        transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
      >
        {product.title}
      </motion.h2>
    </motion.div>
  );
};

// New props for ProductRow to control layout and animation based on screen size
interface ProductRowProps {
  products: PastryProduct[];
  translate: MotionValue<number>;
  isReverse?: boolean;
  isMobile?: boolean;
}

const ProductRow: React.FC<ProductRowProps> = ({ products, translate, isReverse, isMobile }) => {
  const directionClass = isReverse ? "flex-row-reverse space-x-reverse" : "flex-row";
  const cardWidth = isMobile ? "w-[75vw]" : "w-[600px]"; // Smaller width for mobile
  const cardHeight = isMobile ? "h-[50vh]" : "h-[500px]"; // Smaller height for mobile

  return (
    <motion.div className={`flex ${directionClass} space-x-6 md:space-x-12 mb-6 md:mb-12`}>
      {products.map((product) => (
        <motion.div
          key={product.title}
          style={{ x: translate }}
          whileHover={!isMobile ? { y: -20, transition: { duration: 0.3, ease: "easeOut" } } : {}}
          className={`group/product ${cardHeight} ${cardWidth} relative flex-shrink-0`}
        >
          <Link
            href={product.link}
            className="block group-hover/product:shadow-2xl transition-shadow duration-300 h-full w-full"
          >
            <Image
              src={product.thumbnail}
              fill // Use fill and let parent control dimensions
              className="object-cover object-center absolute h-full w-full inset-0 rounded-lg transition-transform duration-300 group-hover/product:scale-[1.02]"
              alt={product.title}
              priority
              sizes={isMobile ? "75vw" : "600px"} // Adjust sizes prop
            />
          </Link>
          <motion.div
            className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-90 bg-background/90 pointer-events-none rounded-lg"
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
          <motion.h2
            className="absolute bottom-4 left-4 md:bottom-6 md:left-6 opacity-0 group-hover/product:opacity-100 text-base md:text-xl font-display tracking-wide text-foreground" // Adjusted text size and padding
            transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
          >
            {product.title}
          </motion.h2>
        </motion.div>
      ))}
    </motion.div>
  );
};


export function PastryHero() {
  const firstRowProducts = pastryProducts.slice(0, 5);
  const secondRowProducts = pastryProducts.slice(5, 10);
  const thirdRowProducts = pastryProducts.slice(10, 15);
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile(); // Use the hook

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end center"],
  });

  const springConfig = { stiffness: 70, damping: 30, mass: 1.5, restDelta: 0.001 };
  const smoothProgress = useSpring(scrollYProgress, springConfig);

  // Adjust translate values for mobile to be less extreme
  const translateDistance = isMobile ? 200 : 600;
  const translateX = useTransform(smoothProgress, [0, 0.8], [0, translateDistance]);
  const translateXReverse = useTransform(smoothProgress, [0, 0.8], [0, -translateDistance]);

  const rotateX = useTransform(smoothProgress, [0, 0.3], [8, 0]);
  const opacity = useTransform(smoothProgress, [0, 0.3], [0.3, 1]);
  const rotateZ = useTransform(smoothProgress, [0, 0.3], [8, 0]);
  const translateY = useTransform(smoothProgress, [0, 0.3], isMobile ? [-50, 20] : [-150, 50]); // Less extreme Y translate on mobile

  return (
    <div
      ref={ref}
      // Adjust height for mobile to be less extreme, or make it dynamic based on content if ProductRows wrap
      className="relative h-[120vh] md:h-[150vh] [perspective:1000px] [transform-style:preserve-3d]"
    >
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden md:overflow-visible"> {/* Allow horizontal scroll on mobile if needed */}
        <div className="max-w-7xl relative mx-auto py-8 sm:py-16 px-4 w-full left-0 top-0"> {/* Reduced py for mobile */}
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-7xl xl:text-8xl font-display text-foreground tracking-tight leading-[1.1] mb-6 sm:mb-8"
            initial={{ opacity: 0.5, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            Crafting Sweet{" "}
            <span className="text-primary relative inline-block">
              Moments
              <motion.span
                className="absolute -z-10 bottom-2 left-0 h-3 bg-primary/20 w-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
              />
            </span>
          </motion.h1>
          
          <motion.p 
            className="max-w-2xl text-lg md:text-xl xl:text-2xl mt-8 text-muted-foreground font-body font-light leading-relaxed tracking-wide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          >
            Experience the artistry of our handcrafted cakes and pastries, where every creation tells a unique story of flavor and beauty.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
            className="mt-12"
          >
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-4 sm:px-10 sm:py-8 text-base sm:text-xl font-medium tracking-wide group transition-colors duration-300" // Responsive padding and text size
              asChild
            >
              <Link href="/menu" className="flex items-center gap-2 sm:gap-3"> {/* Responsive gap */}
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
                  <ArrowRightIcon className="w-6 h-6" />
                </motion.span>
              </Link>
            </Button>
          </motion.div>
        </div>

        <motion.div
          style={{
            rotateX,
            rotateZ,
            translateY,
            opacity,
          }}
          // For mobile, ensure this container allows horizontal scrolling if content overflows
          className="mt-8 md:mt-12 overflow-x-auto md:overflow-x-visible"
        >
          <ProductRow products={firstRowProducts} translate={translateX} isReverse isMobile={isMobile} />
          <ProductRow products={secondRowProducts} translate={translateXReverse} isMobile={isMobile} />
          <ProductRow products={thirdRowProducts} translate={translateX} isReverse isMobile={isMobile} />
        </motion.div>
      </div>
    </div>
  );
}
