"use client";

import { useState } from "react";
import { CloudinaryImage } from "@/components/ui/cloudinary-image";
import { getCloudinaryPublicId, isCloudinaryId } from "@/lib/image-utils";
import { cn } from "@/lib/utils";
import { type MenuItem } from "@/types/menu";
import { OrderForm } from "@/components/ui/order-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { trackOrderClick } from "@/lib/analytics";

interface MenuItemCardProps {
  item: MenuItem;
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [selectedPriceIndex, setSelectedPriceIndex] = useState(0);

  const openOrderDialog = (priceIndex?: number) => {
    trackOrderClick(item.name);
    if (priceIndex !== undefined) setSelectedPriceIndex(priceIndex);
    setIsOrderDialogOpen(true);
  };
  
  return (
    <div 
      className="bg-card/50 border border-border/50 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer relative flex flex-col h-full"
      onClick={() => openOrderDialog()}
    >
      {/* Item Image */}
      {item.image && (
        <div className="relative aspect-[4/3] w-full">
          <CloudinaryImage
            publicId={isCloudinaryId(item.image) ? item.image : getCloudinaryPublicId(item.image)}
            alt={item.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
            transformations="f_auto,q_auto,c_fill"
          />
        </div>
      )}

      <div className="p-4 sm:p-6 flex flex-col flex-1 gap-3 sm:gap-4">
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

        {/* Description & Flavor — grows to fill available space */}
        <div className="flex-1">
          {item.description && (
            <p className="text-muted-foreground font-body mb-2">{item.description}</p>
          )}
          {item.flavor && (
            <p className="text-sm font-body text-muted-foreground italic">
              Available flavors: {item.flavor}
            </p>
          )}
        </div>

        {/* Prices */}
        <div className="space-y-2">
          {item.prices.map((price, priceIndex) => (
            <div 
              key={priceIndex}
              onClick={(e) => {
                e.stopPropagation();
                openOrderDialog(priceIndex);
              }}
              className={cn(
                "w-full flex justify-between items-center py-2 px-1 hover:bg-primary/5 rounded transition-colors cursor-pointer",
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
              <div className="font-display text-lg text-primary">
                ₱{price.price.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
        
        {/* Order Now Button */}
        <div className="pt-4 mt-2 border-t border-border/30 relative z-10">
          <Button 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold border-2 border-primary-foreground/20 rounded-full py-2.5 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
            onClick={(e) => {
              e.stopPropagation();
              openOrderDialog();
            }}
            variant="default"
            size="default"
          >
            Order Now
          </Button>
        </div>
      </div>

    
      {/* Order Dialog */}
      <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
        <DialogContent 
          className="w-[95vw] max-h-[90vh] overflow-y-auto sm:max-w-md bg-white border-primary/20 p-4 sm:p-6"
          onPointerDownOutside={(e) => {
            e.preventDefault();
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <DialogHeader className="pb-2 border-b border-primary/10">
            <DialogTitle className="text-xl sm:text-2xl font-display text-foreground flex items-center gap-2">
              {item.emoji && <span className="text-xl sm:text-2xl">{item.emoji}</span>}
              Order {item.name}
            </DialogTitle>
          </DialogHeader>
          <OrderForm 
            item={item} 
            selectedPriceIndex={selectedPriceIndex} 
            onClose={() => setIsOrderDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
