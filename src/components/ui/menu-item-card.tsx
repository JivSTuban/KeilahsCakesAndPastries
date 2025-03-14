"use client";

import { useState } from "react";
import { ImageWithLoading } from "@/components/ui/image-with-loading";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { type MenuItem } from "@/types/menu";
import { Lightbox } from "@/components/ui/lightbox";

interface MenuItemCardProps {
  item: MenuItem;
  images?: string[];
}

export function MenuItemCard({ item, images }: MenuItemCardProps) {
  const [showLightbox, setShowLightbox] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setShowLightbox(true);
  };

  return (
    <>
      <div className="bg-card/50 border border-border/50 rounded-lg p-6 transition-all duration-300 hover:shadow-md">
        {/* Item Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {item.emoji && (
              <span className="text-2xl" role="img" aria-label="emoji">
                {item.emoji}
              </span>
            )}
            <h4 className="text-xl font-display text-foreground">{item.name}</h4>
          </div>
        </div>

        {/* Image Gallery Preview */}
        {images && images.length > 0 && (
          <div className="mb-4 grid grid-cols-3 gap-2">
            {images.map((src, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative aspect-square rounded-lg overflow-hidden cursor-pointer"
                style={{ position: 'relative' }}
                onClick={() => handleImageClick(index)}
              >
                <ImageWithLoading
                  src={src}
                  alt={`${item.name} view ${index + 1}`}
                  fill
                  className="object-cover"
                  overlayClassName="bg-background/50"
                />
                <div className="absolute inset-0 bg-black/20 hover:bg-black/30 transition-colors" />
              </motion.div>
            ))}
          </div>
        )}

        {/* Description & Flavor */}
        {(item.description || item.flavor) && (
          <div className="mb-4">
            {item.description && (
              <p className="text-muted-foreground font-body mb-2">{item.description}</p>
            )}
            {item.flavor && (
              <p className="text-sm font-body text-muted-foreground italic">
                Available flavors: {item.flavor}
              </p>
            )}
          </div>
        )}

        {/* Prices */}
        <div className="space-y-2">
          {item.prices.map((price, priceIndex) => (
            <div 
              key={priceIndex}
              className={cn(
                "flex justify-between items-center py-1",
                priceIndex !== 0 && "border-t border-border/30"
              )}
            >
              <div className="flex items-center gap-2">
                {price.size && (
                  <span className="text-sm font-body text-muted-foreground">
                    {price.size}
                  </span>
                )}
                {price.details && (
                  <span className="text-sm font-body text-muted-foreground">
                    {price.details}
                  </span>
                )}
              </div>
              <span className="font-display text-lg text-primary">
                ₱{price.price.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {showLightbox && images && (
        <Lightbox
          images={images}
          initialIndex={selectedImageIndex}
          onClose={() => setShowLightbox(false)}
        />
      )}
    </>
  );
}
