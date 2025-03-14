"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { submitReview } from "@/lib/supabase";
import { toast } from "sonner";
import { useFeedback } from "@/contexts/feedback-context";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function ReviewModal() {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    comment: "",
    occasion: ""
  });

  const handleStarClick = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleStarHover = (hoveredRating: number) => {
    setHoverRating(hoveredRating);
  };

  const { addReview } = useFeedback();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    try {
      setIsSubmitting(true);
      const newReview = await submitReview({
        ...formData,
        rating
      });
      if (newReview) {
        addReview(newReview);
        toast.success("Thank you for your review!");
        setOpen(false);
        setFormData({ name: "", comment: "", occasion: "" });
        setRating(0);
      }
    } catch (error) {
      toast.error("Failed to submit review. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          size="lg"
          className="bg-primary hover:bg-primary/90 text-white font-body text-lg px-8"
        >
          Leave a Review
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display text-foreground">Share Your Experience</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* Rating Stars */}
          <div className="space-y-2">
            <Label className="font-body">Your Rating</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="p-1 focus:outline-none"
                  onMouseEnter={() => handleStarHover(star)}
                  onMouseLeave={() => handleStarHover(0)}
                  onClick={() => handleStarClick(star)}
                  disabled={isSubmitting}
                >
                  <Star
                    className={cn(
                      "w-8 h-8 transition-colors",
                      (hoverRating || rating) >= star
                        ? "text-primary fill-primary"
                        : "text-muted-foreground",
                      isSubmitting && "opacity-50"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="name" className="font-body">Your Name</Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="font-body"
              disabled={isSubmitting}
            />
          </div>

          {/* Occasion Input */}
          <div className="space-y-2">
            <Label htmlFor="occasion" className="font-body">Occasion</Label>
            <Input
              id="occasion"
              placeholder="e.g., Wedding, Birthday, etc."
              value={formData.occasion}
              onChange={(e) => setFormData(prev => ({ ...prev, occasion: e.target.value }))}
              className="font-body"
              disabled={isSubmitting}
            />
          </div>

          {/* Comment Textarea */}
          <div className="space-y-2">
            <Label htmlFor="comment" className="font-body">Your Review</Label>
            <Textarea
              id="comment"
              required
              placeholder="Tell us about your experience..."
              value={formData.comment}
              onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
              className="font-body min-h-[100px]"
              disabled={isSubmitting}
            />
          </div>

          {/* Submit Button */}
          <Button 
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white font-body"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <LoadingSpinner className="h-5 w-5" />
                <span>Submitting...</span>
              </div>
            ) : (
              "Submit Review"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
