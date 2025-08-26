"use client";

import { ProductCardWithButton } from "./product-card-with-button";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { OrderForm } from "@/components/ui/order-form";

// Example product data
const exampleProduct = {
  name: "Mango Chiffon Cake",
  image: "https://res.cloudinary.com/denm8lsia/image/upload/f_auto,q_auto,w_auto,c_fill/v1/keilahs-pastries/keilahclassics/img_3085",
  emoji: "💛",
  sizes: [
    { size: "6x3", price: 650 },
    { size: "8x3", price: 900 },
    { size: "10x3", price: 1150 }
  ]
};

export function ProductCardExample() {
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  
  // This would be replaced with your actual product data in a real implementation
  const item = {
    name: exampleProduct.name,
    emoji: exampleProduct.emoji,
    image: exampleProduct.image,
    prices: exampleProduct.sizes.map(size => ({
      size: size.size,
      price: size.price,
      details: ""
    }))
  };
  
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Product Card Example</h2>
      
      <div className="max-w-sm">
        <ProductCardWithButton 
          name={exampleProduct.name}
          image={exampleProduct.image}
          emoji={exampleProduct.emoji}
          sizes={exampleProduct.sizes}
          onClick={() => setIsOrderDialogOpen(true)}
        />
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
            selectedPriceIndex={0} 
            onClose={() => setIsOrderDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
