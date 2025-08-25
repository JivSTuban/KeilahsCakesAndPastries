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
  const formRef = useRef<HTMLFormElement>(null);
  
  // Initialize EmailJS on client-side only
  useEffect(() => {
    initEmailService();
  }, []);
  
  const selectedPrice = item.prices[selectedPriceIndex];
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
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6  w-full max-w-md mx-auto">
      
      {/* Product Details Section */}
      <div className="p-4 rounded-xl bg-purple-50 space-y-1">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <span className="text-purple-600">📦</span>
          </div>
          <div className="flex-1">
            <h3 className="font-medium">{item.name}</h3>
            <div className="flex items-center gap-2 text-sm">
              <span>{priceDetails}</span>
              <span className="text-xs">•</span>
              <span className="text-purple-600 font-medium">₱{selectedPrice.price.toLocaleString()}</span>
            </div>
            {item.description && <p className="text-sm text-gray-600 mt-1">{item.description}</p>}
            
            <input type="hidden" name="product_name" value={item.name} />
            <input type="hidden" name="size" value={priceDetails} />
            <input type="hidden" name="price" value={`₱${selectedPrice.price.toLocaleString()}`} />
          </div>
        </div>
      </div>
      
      {/* Customer Information Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-medium">Customer Information</h3>
        </div>
      
        <div className="space-y-4">
          <div>
            <Label htmlFor="customer_name" className="block text-sm mb-1">Full Name <span className="text-red-500">*</span></Label>
            <Input 
              id="customer_name" 
              name="customer_name" 
              placeholder="Enter your full name" 
              required
              className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
          
          <div>
            <Label htmlFor="phone_number" className="block text-sm mb-1">Phone Number <span className="text-red-500">*</span></Label>
            <Input 
              id="phone_number" 
              name="phone_number" 
              placeholder="Enter your active phone number" 
              required
              type="tel"
              className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
          
          <div>
            <Label htmlFor="email" className="block text-sm mb-1">Email <span className="text-gray-500">(Optional)</span></Label>
            <Input 
              id="email" 
              name="email" 
              placeholder="Enter your email address" 
              type="email"
              className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
          
          <div>
            <Label htmlFor="order_for_date" className="block text-sm mb-1">Order For <span className="text-red-500">*</span></Label>
            <Input 
              id="order_for_date" 
              name="order_for_date" 
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>
      
      {/* Special Instructions */}
      <div className="space-y-2">
        <div>
          <h3 className="text-base font-medium">Special Instructions</h3>
        </div>
        <Textarea 
          id="notes" 
          name="notes" 
          placeholder="Any special requests, delivery instructions, or notes..." 
          className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500 min-h-[100px]"
        />
      </div>
      
      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onClose} 
          className="w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting} 
          className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          {isSubmitting ? "Submitting..." : "Place Order"}
        </Button>
      </div>
    </form>
  );
}
