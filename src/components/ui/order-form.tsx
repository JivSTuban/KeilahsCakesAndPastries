"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { type MenuItem } from "@/types/menu";
import { initEmailService, sendOrderEmail } from "@/lib/email-service";
import { X } from "lucide-react";

interface OrderFormProps {
  item: MenuItem;
  selectedPriceIndex: number;
  onClose: () => void;
}

export function OrderForm({ item, selectedPriceIndex, onClose }: OrderFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPriceIndex, setCurrentPriceIndex] = useState(selectedPriceIndex);
  const formRef = useRef<HTMLFormElement>(null);
  
  // Initialize EmailJS on client-side only
  useEffect(() => {
    initEmailService();
  }, []);
  
  const selectedPrice = item.prices[currentPriceIndex];
  const priceDetails = selectedPrice.size 
    ? `${selectedPrice.size}${selectedPrice.details ? ` - ${selectedPrice.details}` : ''}`
    : selectedPrice.details || '';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formRef.current) return;
    
    setIsSubmitting(true);
    
    try {
      const result = await sendOrderEmail(formRef.current);
      
      if (result.status === 200) {
        toast.success("Order submitted successfully! We'll contact you soon.");
        onClose();
      } else {
        throw new Error("Failed to submit order");
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      toast.error("Failed to submit order. Please try again or contact us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5 w-full mx-auto">
      
      {/* Product Details Section */}
      <div className="p-3 sm:p-4 rounded-xl bg-purple-50 space-y-3">
        <div className="flex items-start gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
            <span className="text-purple-600 text-base sm:text-xl">📦</span>
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-sm sm:text-base">{item.name}</h3>
            {item.description && <p className="text-xs sm:text-sm text-gray-600 mt-1">{item.description}</p>}
            
            <input type="hidden" name="product_name" value={item.name} />
            <input type="hidden" name="size" value={priceDetails} />
            <input type="hidden" name="price" value={`₱${selectedPrice.price.toLocaleString()}`} />
          </div>
        </div>
        
        {/* Size Selection */}
        {item.prices.length > 1 && (
          <div className="mt-2">
            <Label htmlFor="size_selection" className="block text-xs sm:text-sm mb-2">Select Size/Option <span className="text-red-500">*</span></Label>
            <div className="grid gap-2">
              {item.prices.map((price, index) => {
                const sizeText = price.size 
                  ? `${price.size}${price.details ? ` - ${price.details}` : ''}`
                  : price.details || 'Standard';
                  
                return (
                  <div 
                    key={index}
                    onClick={() => setCurrentPriceIndex(index)}
                    className={`
                      p-2 sm:p-3 border rounded-lg flex justify-between items-center cursor-pointer transition-all
                      ${currentPriceIndex === index 
                        ? 'border-purple-500 bg-purple-50 shadow-sm' 
                        : 'border-gray-200 hover:border-purple-300'}
                    `}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full border ${currentPriceIndex === index ? 'border-purple-500 bg-purple-500' : 'border-gray-300'}`}>
                        {currentPriceIndex === index && (
                          <div className="w-2 h-2 bg-white rounded-full m-[3px]" />
                        )}
                      </div>
                      <span className="text-xs sm:text-sm">{sizeText}</span>
                    </div>
                    <span className="font-medium text-purple-600 text-sm sm:text-base">₱{price.price.toLocaleString()}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      
      {/* Customer Information Section */}
      <div className="space-y-3 sm:space-y-4">
        <div>
          <h3 className="text-sm sm:text-base font-medium">Customer Information</h3>
        </div>
      
        <div className="space-y-3 sm:space-y-4">
          <div>
            <Label htmlFor="customer_name" className="block text-xs sm:text-sm mb-1">Full Name <span className="text-red-500">*</span></Label>
            <Input 
              id="customer_name" 
              name="customer_name" 
              placeholder="Enter your full name" 
              required
              className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500 text-sm"
            />
          </div>
          
          <div>
            <Label htmlFor="phone_number" className="block text-xs sm:text-sm mb-1">Phone Number <span className="text-red-500">*</span></Label>
            <Input 
              id="phone_number" 
              name="phone_number" 
              placeholder="Enter your active phone number" 
              required
              type="tel"
              className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500 text-sm"
            />
          </div>
          
          <div>
            <Label htmlFor="email" className="block text-xs sm:text-sm mb-1">Email <span className="text-gray-500">(Optional)</span></Label>
            <Input 
              id="email" 
              name="email" 
              placeholder="Enter your email address" 
              type="email"
              className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500 text-sm"
            />
          </div>
          
          <div>
            <Label htmlFor="order_for_date" className="block text-xs sm:text-sm mb-1">Order For <span className="text-red-500">*</span></Label>
            <Input 
              id="order_for_date" 
              name="order_for_date" 
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500 cursor-pointer text-sm"
              onClick={(e) => {
                // Ensure the calendar opens when clicking anywhere in the input
                const input = e.target as HTMLInputElement;
                input.showPicker();
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Special Instructions */}
      <div className="space-y-2">
        <div>
          <h3 className="text-sm sm:text-base font-medium">Special Instructions</h3>
        </div>
        <Textarea 
          id="notes" 
          name="notes" 
          placeholder="Any special requests, delivery instructions, or notes..." 
          className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500 min-h-[80px] sm:min-h-[100px] text-sm"
        />
      </div>
      
      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 mt-4 sm:mt-6">
        <Button 
          type="button" 
          variant="outline" 
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }} 
          className="w-full py-1.5 sm:py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-xs sm:text-sm"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting} 
          className="w-full py-1.5 sm:py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-xs sm:text-sm"
        >
          {isSubmitting ? "Submitting..." : "Place Order"}
        </Button>
      </div>
    </form>
  );
}
