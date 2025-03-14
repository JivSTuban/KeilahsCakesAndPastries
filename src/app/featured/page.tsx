"use client";

import Image from "next/image";
import { Cake } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const FEATURED_CATEGORIES = [
  {
    title: "Wedding Cakes",
    description: "Elegant multi-tiered masterpieces for your special day",
    images: [
      "/WeddingCakes/IMG_3113.JPG",
      "/WeddingCakes/IMG_3131.JPG",
      "/WeddingCakes/IMG_3132.JPG"
    ]
  },
  {
    title: "Birthday Celebrations",
    description: "Custom designs for memorable birthday moments",
    images: [
      "/NumberandLetterCakes/IMG_3151.JPG",
      "/NumberandLetterCakes/IMG_3220.JPG",
      "/NumberandLetterCakes/IMG_3221.JPG"
    ]
  },
  {
    title: "Baby Dedication",
    description: "Sweet creations for your little one's special day",
    images: [
      "/BabyDedicationCakes/IMG_3149.JPG",
      "/BabyDedicationCakes/IMG_3154.JPG",
      "/BabyDedicationCakes/IMG_3155.JPG"
    ]
  }
];

export default function FeaturedPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Featured Hero Section */}
      <section className="relative py-20 overflow-hidden bg-primary/5">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center gap-3 mb-6">
              <Cake className="h-8 w-8 text-primary" />
              <h1 className="text-5xl md:text-6xl font-display text-foreground">Featured Works</h1>
            </div>
            <p className="text-xl font-body text-muted-foreground leading-relaxed">
              Browse through our collection of custom-made cakes and pastries
            </p>
          </div>
        </div>

        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/60 via-primary to-primary/60" />
      </section>

      {/* Featured Categories */}
      <div className="container mx-auto px-4 py-16">
        <div className="space-y-24">
          {FEATURED_CATEGORIES.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="text-center mb-12">
                <h2 className="text-4xl font-display text-foreground mb-4">{category.title}</h2>
                <p className="text-lg font-body text-muted-foreground">{category.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {category.images.map((src, imageIndex) => (
                  <motion.div
                    key={imageIndex}
                    whileHover={{ scale: 1.02 }}
                    className="relative aspect-square rounded-lg overflow-hidden shadow-lg"
                    style={{ position: 'relative', height: '300px' }}
                  >
                    <Image
                      src={src}
                      alt={`${category.title} example ${imageIndex + 1}`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                  </motion.div>
                ))}
              </div>

              {index !== FEATURED_CATEGORIES.length - 1 && (
                <div className="w-24 h-1 bg-primary/20 mx-auto mt-24 rounded-full" />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <section className="bg-secondary/30 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-display text-foreground mb-6">Create Your Dream Cake</h2>
            <p className="text-lg font-body text-muted-foreground mb-8">
              Let us help you design the perfect cake for your special occasion. Contact us to discuss your vision.
            </p>
            <div className="p-6 bg-card/50 rounded-xl border border-border/50">
              <p className="font-display text-xl text-foreground mb-2">Get in Touch</p>
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
