"use client";

import { Cake } from "lucide-react";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import Image from "next/image";
import { getCloudinaryUrl } from "@/lib/cloudinary-url";

// Helper function to repeat arrays for smooth infinite scrolling
const repeatArray = <T,>(arr: T[], minLength: number = 8): T[] => {
  if (arr.length >= minLength) return arr;
  return [...arr, ...arr.slice(0, Math.min(3, arr.length))];
};

const getDescription = (categoryName: string): string => {
  switch (categoryName) {
    case "Wedding Cakes":
      return "Elegant multi-tiered masterpieces perfect for your special day";
    case "Customized 1 Tier":
      return "Personalized single-tier cakes for any occasion";
    case "Customized 2 Tier":
      return "Elegant double-tier cakes with custom designs";
    case "Customized 3 Tier":
      return "Grand three-tier cakes for special celebrations";
    case "Number and Letter":
      return "Personalized cakes shaped as numbers or letters for unique celebrations";
    case "Baby Dedication":
      return "Sweet creations to celebrate your little one's special milestone";
    case "All in One Package":
      return "Complete celebration packages with cake, cupcakes, and number designs";
    case "Debut Cakes":
      return "Stunning cakes for the perfect 18th birthday celebration";
    case "Bento and Combos":
      return "Special cake and treat combinations for sharing";
    default:
      return "";
  }
};

const CAKE_CATEGORIES = [
  // 30 images
  { name: "Customized 1 Tier", path: "/CustomizedCakes/1TierCakes", images: [
    getCloudinaryUrl("/CustomizedCakes/1TierCakes/IMG_2126.JPG"),
    getCloudinaryUrl("/CustomizedCakes/1TierCakes/IMG_3104.JPG"),
    getCloudinaryUrl("/CustomizedCakes/1TierCakes/IMG_3114.JPG"),
    getCloudinaryUrl("/CustomizedCakes/1TierCakes/IMG_3115.JPG"),
    getCloudinaryUrl("/CustomizedCakes/1TierCakes/IMG_3116.JPG"),
    getCloudinaryUrl("/CustomizedCakes/1TierCakes/IMG_3127.JPG"),
    getCloudinaryUrl("/CustomizedCakes/1TierCakes/IMG_3135.JPG"),
    getCloudinaryUrl("/CustomizedCakes/1TierCakes/IMG_3136.JPG"),
    getCloudinaryUrl("/CustomizedCakes/1TierCakes/IMG_3141.JPG"),
    getCloudinaryUrl("/CustomizedCakes/1TierCakes/IMG_3145.JPG"),
    getCloudinaryUrl("/CustomizedCakes/1TierCakes/IMG_3146.JPG"),
    getCloudinaryUrl("/CustomizedCakes/1TierCakes/IMG_3147.JPG"),
    getCloudinaryUrl("/CustomizedCakes/1TierCakes/IMG_3152.JPG"),
    getCloudinaryUrl("/CustomizedCakes/1TierCakes/IMG_3153.JPG"),
    getCloudinaryUrl("/CustomizedCakes/1TierCakes/IMG_3160.JPG"),
    getCloudinaryUrl("/CustomizedCakes/1TierCakes/IMG_3161.JPG"),
    getCloudinaryUrl("/CustomizedCakes/1TierCakes/IMG_3202.JPG"),
    getCloudinaryUrl("/CustomizedCakes/1TierCakes/IMG_3203.JPG"),
    getCloudinaryUrl("/CustomizedCakes/1TierCakes/IMG_3204.JPG"),
    getCloudinaryUrl("/CustomizedCakes/1TierCakes/IMG_3206.JPG"),
    getCloudinaryUrl("/CustomizedCakes/1TierCakes/IMG_3207.JPG"),
    getCloudinaryUrl("/CustomizedCakes/1TierCakes/IMG_3212.JPG"),
    getCloudinaryUrl("/CustomizedCakes/1TierCakes/IMG_3213.JPG"),
    getCloudinaryUrl("/CustomizedCakes/1TierCakes/IMG_3214.JPG"),
    getCloudinaryUrl("/CustomizedCakes/1TierCakes/IMG_3216.JPG"),
    getCloudinaryUrl("/CustomizedCakes/1TierCakes/IMG_3217.JPG"),
    getCloudinaryUrl("/CustomizedCakes/1TierCakes/IMG_3227.JPG"),
    getCloudinaryUrl("/CustomizedCakes/1TierCakes/IMG_3238.JPG"),
    getCloudinaryUrl("/CustomizedCakes/1TierCakes/IMG_3239.JPG"),
    getCloudinaryUrl("/CustomizedCakes/1TierCakes/IMG_3241.JPG")
  ]},
  // 16 images
  { name: "Customized 2 Tier", path: "/CustomizedCakes/2TierCakes", images: [
    getCloudinaryUrl("/CustomizedCakes/2TierCakes/IMG_3108.JPG"),
    getCloudinaryUrl("/CustomizedCakes/2TierCakes/IMG_3109.JPG"),
    getCloudinaryUrl("/CustomizedCakes/2TierCakes/IMG_3134.JPG"),
    getCloudinaryUrl("/CustomizedCakes/2TierCakes/IMG_3150.JPG"),
    getCloudinaryUrl("/CustomizedCakes/2TierCakes/IMG_3177.JPG"),
    getCloudinaryUrl("/CustomizedCakes/2TierCakes/IMG_3187.JPG"),
    getCloudinaryUrl("/CustomizedCakes/2TierCakes/IMG_3195.JPG"),
    getCloudinaryUrl("/CustomizedCakes/2TierCakes/IMG_3225.JPG"),
    getCloudinaryUrl("/CustomizedCakes/2TierCakes/IMG_3226.JPG"),
    getCloudinaryUrl("/CustomizedCakes/2TierCakes/IMG_3228.JPG"),
    getCloudinaryUrl("/CustomizedCakes/2TierCakes/IMG_3230.JPG"),
    getCloudinaryUrl("/CustomizedCakes/2TierCakes/IMG_3234.JPG"),
    getCloudinaryUrl("/CustomizedCakes/2TierCakes/IMG_3235.JPG"),
    getCloudinaryUrl("/CustomizedCakes/2TierCakes/IMG_3236.JPG"),
    getCloudinaryUrl("/CustomizedCakes/2TierCakes/IMG_3237.JPG"),
    getCloudinaryUrl("/CustomizedCakes/2TierCakes/IMG_6094.JPG")
  ]},
  // 13 images
  { name: "Bento and Combos", path: "/BentoandCombos", images: [
    getCloudinaryUrl("/BentoandCombos/IMG_3118.JPG"),
    getCloudinaryUrl("/BentoandCombos/IMG_3119.JPG"),
    getCloudinaryUrl("/BentoandCombos/IMG_3139.JPG"),
    getCloudinaryUrl("/BentoandCombos/IMG_3140.JPG"),
    getCloudinaryUrl("/BentoandCombos/IMG_3142.JPG"),
    getCloudinaryUrl("/BentoandCombos/IMG_3156.JPG"),
    getCloudinaryUrl("/BentoandCombos/IMG_3198.JPG"),
    getCloudinaryUrl("/BentoandCombos/IMG_3200.JPG"),
    getCloudinaryUrl("/BentoandCombos/IMG_3201.JPG"),
    getCloudinaryUrl("/BentoandCombos/IMG_3208.JPG"),
    getCloudinaryUrl("/BentoandCombos/IMG_3209.JPG"),
    getCloudinaryUrl("/BentoandCombos/IMG_3210.JPG"),
    getCloudinaryUrl("/BentoandCombos/IMG_3211.JPG")
  ]},
  // 8 images
  { name: "Debut Cakes", path: "/DebutCakes", images: [
    getCloudinaryUrl("/DebutCakes/IMG_3105.JPG"),
    getCloudinaryUrl("/DebutCakes/IMG_3111.JPG"),
    getCloudinaryUrl("/DebutCakes/IMG_3112.JPG"),
    getCloudinaryUrl("/DebutCakes/IMG_3173.JPG"),
    getCloudinaryUrl("/DebutCakes/IMG_3179.JPG"),
    getCloudinaryUrl("/DebutCakes/IMG_3185.JPG"),
    getCloudinaryUrl("/DebutCakes/IMG_3189.JPG"),
    getCloudinaryUrl("/DebutCakes/IMG_3194.JPG")
  ]},
  // 7 images
  { name: "Baby Dedication", path: "/BabyDedicationCakes", images: [
    getCloudinaryUrl("/BabyDedicationCakes/IMG_3149.JPG"),
    getCloudinaryUrl("/BabyDedicationCakes/IMG_3154.JPG"),
    getCloudinaryUrl("/BabyDedicationCakes/IMG_3155.JPG"),
    getCloudinaryUrl("/BabyDedicationCakes/IMG_3192.JPG"),
    getCloudinaryUrl("/BabyDedicationCakes/IMG_3193.JPG"),
    getCloudinaryUrl("/BabyDedicationCakes/IMG_3196.JPG"),
    getCloudinaryUrl("/BabyDedicationCakes/IMG_3229.JPG")
  ]},
  // 7 images
  { name: "Customized 3 Tier", path: "/CustomizedCakes/3TierCakes", images: [
    getCloudinaryUrl("/CustomizedCakes/3TierCakes/IMG_3107.JPG"),
    getCloudinaryUrl("/CustomizedCakes/3TierCakes/IMG_3168.JPG"),
    getCloudinaryUrl("/CustomizedCakes/3TierCakes/IMG_3170.JPG"),
    getCloudinaryUrl("/CustomizedCakes/3TierCakes/IMG_3176.JPG"),
    getCloudinaryUrl("/CustomizedCakes/3TierCakes/IMG_3180.JPG"),
    getCloudinaryUrl("/CustomizedCakes/3TierCakes/IMG_3182.JPG"),
    getCloudinaryUrl("/CustomizedCakes/3TierCakes/IMG_3183.JPG")
  ]},
  // 12 images
  { name: "All in One Package", path: "/ALLINONEPACKAGE", images: [
    getCloudinaryUrl("/ALLINONEPACKAGE/IMG_3086.JPG"),
    getCloudinaryUrl("/ALLINONEPACKAGE/IMG_3087.JPG"),
    getCloudinaryUrl("/ALLINONEPACKAGE/IMG_3088.JPG"),
    getCloudinaryUrl("/ALLINONEPACKAGE/IMG_3089.JPG"),
    getCloudinaryUrl("/ALLINONEPACKAGE/IMG_3090.JPG"),
    getCloudinaryUrl("/ALLINONEPACKAGE/IMG_3091.JPG"),
    getCloudinaryUrl("/ALLINONEPACKAGE/IMG_3092.JPG"),
    getCloudinaryUrl("/ALLINONEPACKAGE/IMG_3093.JPG"),
    getCloudinaryUrl("/ALLINONEPACKAGE/IMG_3094.JPG"),
    getCloudinaryUrl("/ALLINONEPACKAGE/IMG_3095.JPG"),
    getCloudinaryUrl("/ALLINONEPACKAGE/IMG_3096.JPG"),
    getCloudinaryUrl("/ALLINONEPACKAGE/IMG_3097.JPG")
  ]},
  // 11 images
  { name: "Number and Letter", path: "/NumberandLetterCakes", images: [
    getCloudinaryUrl("/NumberandLetterCakes/IMG_3133.JPG"),
    getCloudinaryUrl("/NumberandLetterCakes/IMG_3151.JPG"),
    getCloudinaryUrl("/NumberandLetterCakes/IMG_3197.JPG"),
    getCloudinaryUrl("/NumberandLetterCakes/IMG_3220.JPG"),
    getCloudinaryUrl("/NumberandLetterCakes/IMG_3221.JPG"),
    getCloudinaryUrl("/NumberandLetterCakes/IMG_3222.JPG"),
    getCloudinaryUrl("/NumberandLetterCakes/IMG_3223.JPG"),
    getCloudinaryUrl("/NumberandLetterCakes/IMG_3224.JPG"),
    getCloudinaryUrl("/NumberandLetterCakes/IMG_3231.JPG"),
    getCloudinaryUrl("/NumberandLetterCakes/IMG_3232.JPG"),
    getCloudinaryUrl("/NumberandLetterCakes/IMG_3233.JPG")
  ]}
];

export default function FeaturedPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-primary/5">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center gap-3 mb-6">
              <Cake className="h-8 w-8 text-primary" />
              <h1 className="text-5xl md:text-6xl font-display text-foreground">Collections</h1>
            </div>
            <p className="text-xl font-body text-muted-foreground leading-relaxed">
              Explore our gallery of handcrafted cakes and pastries
            </p>
          </div>
        </div>

        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/60 via-primary to-primary/60" />
      </section>

      {/* Collections */}
      <div className="space-y-24 py-16">
        {CAKE_CATEGORIES.map((category, index) => (
          <div key={category.name} className="space-y-8">
            <div className="container mx-auto px-4">
              <h2 className="text-4xl font-display text-foreground text-center mb-3">{category.name}</h2>
              <p className="text-lg text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
                {getDescription(category.name)}
              </p>
            </div>
            
            <div className="relative">
              {/* Gradient Overlays */}
              <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
              
              <InfiniteSlider 
                duration={80} 
                durationOnHover={120} 
                gap={32}
                reverse={index % 2 === 1}
                className="py-4"
              >
                {category.images.map((src, imgIndex) => (
                  <div
                    key={imgIndex}
                    className="relative aspect-square w-[300px] rounded-xl overflow-hidden shadow-lg"
                  >
                    <Image
                      src={src}
                      alt={`${category.name} ${imgIndex + 1}`}
                      fill
                      className="object-cover hover:scale-110 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                  </div>
                ))}
              </InfiniteSlider>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <section className="bg-secondary/30 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-display text-foreground mb-6">Ready to Order?</h2>
            <p className="text-lg font-body text-muted-foreground mb-8">
              Let us create the perfect cake for your special occasion
            </p>
            <div className="p-6 bg-card/50 rounded-xl border border-border/50">
              <p className="font-display text-xl text-foreground mb-2">Contact Us</p>
              <p className="font-body text-muted-foreground">
                📞 +63 927 983 5826
              </p>
              <p className="font-body text-muted-foreground">
                📍 Basak, Lapu-Lapu City
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
