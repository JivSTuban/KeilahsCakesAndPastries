"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Cake, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AuroraButton } from "@/components/ui/aurora-button";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import type { FeedbackInsert } from "@/types/feedback";

export function FeedbackModal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const feedback: FeedbackInsert = {
        customer_name: name || null,
        message: message || null,
        rating,
        status: "pending"
      };

      const { error: submitError } = await supabase
        .from("feedback")
        .insert([feedback]);

      if (submitError) throw submitError;

      setSuccess(true);
      // Keep the success message visible for 3 seconds before closing
      setTimeout(() => {
        setIsOpen(false);
        router.refresh();
        // Reset form state
        setName("");
        setMessage("");
        setRating(null);
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Error submitting feedback:", err);
      setError("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-white backdrop-blur supports-[backdrop-filter]:bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center gap-3 text-2xl text-foreground">
            Share Your Experience
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Your feedback helps us improve and deliver better experiences to our customers
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="min-h-[300px] flex items-center justify-center"
            >
              <div className="text-center space-y-1">
                <p className="text-xl text-green-600 dark:text-green-500 font-medium">
                  Thank you for your feedback!
                </p>
                <p className="text-lg text-muted-foreground">
                  Your feedback is awaiting approval before being displayed on the site.
                </p>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Your Name
                  </label>
                  <Input
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Rating
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setRating(value)}
                        className={cn(
                          "p-2 rounded-lg transition-colors cursor-pointer",
                          rating && rating >= value
                            ? "text-yellow-400 hover:text-yellow-500"
                            : "text-gray-300 hover:text-yellow-400"
                        )}
                        disabled={isSubmitting}
                      >
                        <Star className="h-6 w-6 fill-current" />
                      </button>
                    ))}
                  </div>
                  {!rating && <p className="text-sm text-destructive">Please select a rating</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Your Message 
                  </label>
                  <Textarea
                    placeholder="Share your thoughts about our products and services..."
                    className="min-h-[120px]"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                  {!message && <p className="text-sm text-destructive">Please enter your message</p>}
                </div>
              </div>

              {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
              )}

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="min-w-[100px] cursor-pointer disabled:cursor-not-allowed"
                  onClick={() => setIsOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <AuroraButton
                  type="submit"
                  className="min-w-[100px]"
                  glowClassName={cn(
                    "opacity-0 transition-opacity duration-300",
                    rating && message && name ? "opacity-75" : "opacity-0"
                  )}
                  disabled={isSubmitting || !rating || !message || !name}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Submitting...
                    </div>
                  ) : (
                    "Submit"
                  )}
                </AuroraButton>
              </div>
            </form>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
