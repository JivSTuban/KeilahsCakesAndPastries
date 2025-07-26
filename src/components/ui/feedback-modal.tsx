"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase";
import type { FeedbackInsert } from "@/types/feedback";

export function FeedbackModal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const resetForm = () => {
    setName("");
    setMessage("");
    setRating(null);
    setHoveredRating(null);
    setError("");
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const feedback: FeedbackInsert = {
        customer_name: name || null,
        message: message || null,
        rating,
        status: "approved" // Auto-approve all feedback
      };

      const { error: submitError } = await supabase
        .from("feedback")
        .insert([feedback]);

      if (submitError) throw submitError;

      setSuccess(true);
      // Keep the success message visible for 2 seconds before closing
      setTimeout(() => {
        setIsOpen(false);
        router.refresh();
        resetForm();
      }, 2000);
    } catch (err) {
      console.error("Error submitting feedback:", err);
      setError("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) {
        resetForm();
      }
    }}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-[600px] max-h-[90vh] overflow-hidden bg-white rounded-lg">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-semibold">
            Share Your Experience
          </DialogTitle>
          <DialogDescription>
            Your feedback helps us improve our service
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {success ? (
              <div className="text-center py-8">
                <div className="text-green-600 text-lg mb-2">✓ Thank you for your feedback!</div>
                <p className="text-gray-600">Your feedback has been posted successfully.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Your Name <span className="text-gray-500">(required)</span></Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    className="mt-1"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                </div>

                <div>
                  <Label>Rating <span className="text-gray-500">(required)</span></Label>
                  <div className="flex gap-1 py-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setRating(value)}
                        onMouseEnter={() => setHoveredRating(value)}
                        onMouseLeave={() => setHoveredRating(null)}
                        className={cn(
                          "transition-colors",
                          (hoveredRating && value <= hoveredRating) || (!hoveredRating && rating && value <= rating)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        )}
                        disabled={isSubmitting}
                      >
                        <Star className="h-6 w-6 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="message">Your Experience <span className="text-gray-500">(required)</span></Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us about your experience..."
                    className="min-h-[100px] mt-1"
                    value={message}
                    onChange={(e) => {
                      if (e.target.value.length <= 500) {
                        setMessage(e.target.value);
                      }
                    }}
                    disabled={isSubmitting}
                    required
                    maxLength={500}
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-400 ml-auto">
                      {message.length}/500
                    </p>
                  </div>
                </div>

                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-800">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || !rating || !message || !name}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Feedback"}
                  </Button>
                </div>
              </form>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
