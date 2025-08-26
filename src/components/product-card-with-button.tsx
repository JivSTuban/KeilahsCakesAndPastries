"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";

interface ProductCardProps {
  name: string;
  image: string;
  emoji: string;
  sizes: Array<{
    size: string;
    price: number;
  }>;
  onClick?: () => void;
}

export function ProductCardWithButton({ name, image, emoji, sizes, onClick }: ProductCardProps) {
  return (
    <div className="bg-card/50 border border-border/50 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative aspect-[4/3] w-full">
        <div className="relative w-full h-full" style={{ position: 'relative' }}>
          <Image 
            alt={name}
            src={image}
            fill
            className="transition-opacity duration-300 opacity-100 object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </div>
      <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl" role="img" aria-label="emoji">{emoji}</span>
            <h4 className="text-2xl font-display text-foreground">{name}</h4>
          </div>
        </div>
        <div className="space-y-2">
          {sizes.map((item, index) => (
            <div 
              key={index} 
              className={`w-full flex justify-between items-center py-2 px-1 hover:bg-primary/5 rounded transition-colors cursor-pointer ${
                index !== 0 ? "border-t border-border/30" : ""
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-body text-muted-foreground">{item.size}</span>
              </div>
              <div className="font-display text-lg text-primary">₱{item.price.toLocaleString()}</div>
            </div>
          ))}
        </div>
        
        {/* Order Now Button - Added with z-index and position to ensure visibility */}
        <div className="pt-4 mt-2 border-t border-border/30 relative z-10">
          <Button 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
            onClick={onClick}
            variant="default"
            size="default"
          >
            Order Now
          </Button>
        </div>
      </div>
    </div>
  );
}
