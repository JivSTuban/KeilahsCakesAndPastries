"use client";

import { ImageWithLoading } from "@/components/ui/image-with-loading";
import { cn } from "@/lib/utils";
import { type MenuItem } from "@/types/menu";

interface MenuItemCardProps {
  item: MenuItem;
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  return (
    <div className="bg-card/50 border border-border/50 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg">
      {/* Item Image */}
      {item.image && (
        <div className="relative aspect-[4/3] w-full">
          <ImageWithLoading
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
            quality={90}
          />
        </div>
      )}

      <div className="p-6 space-y-4">
        {/* Item Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {item.emoji && (
              <span className="text-2xl" role="img" aria-label="emoji">
                {item.emoji}
              </span>
            )}
            <h4 className="text-2xl font-display text-foreground">{item.name}</h4>
          </div>
        </div>

        {/* Description & Flavor */}
        {(item.description || item.flavor) && (
          <div>
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

    </div>
  );
}
