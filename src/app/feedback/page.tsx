"use client";

import { motion } from "framer-motion";
import { Star, MessageCircle, Heart, ThumbsUp } from "lucide-react";
import { ReviewModal } from "@/components/ui/review-modal";
import { FeedbackProvider, useFeedback } from "@/contexts/feedback-context";
import { useRealtimeReviews } from "@/hooks/use-realtime-reviews";
import { useState, useEffect } from "react";
import { type Review } from "@/lib/supabase";
import { cn } from "@/lib/utils";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          className={`h-4 w-4 ${
            index < rating ? "text-primary fill-primary" : "text-muted-foreground"
          }`}
        />
      ))}
    </div>
  );
}

function TestimonialCard({ review, isNew }: { review: Review; isNew?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: isNew ? 0.95 : 1 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6 }}
      className={cn(
        "bg-card/50 border border-border/50 rounded-xl p-6 hover:shadow-lg transition-all duration-300",
        isNew && "ring-2 ring-primary/20"
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-display text-lg text-foreground mb-1">
            {review.name}
          </h3>
          <p className="text-sm font-body text-muted-foreground">
            {new Date(review.created_at!).toLocaleDateString()}
          </p>
        </div>
        <StarRating rating={review.rating} />
      </div>
      <p className="font-body text-muted-foreground mb-4">
        {review.comment}
      </p>
      {review.occasion && (
        <div className="inline-block bg-secondary/50 px-3 py-1 rounded-full">
          <p className="text-sm font-body text-primary">
            {review.occasion}
          </p>
        </div>
      )}
    </motion.div>
  );
}

function FeedbackContent() {
  const { reviews, isLoading } = useFeedback();
  const [newReviewIds, setNewReviewIds] = useState<Set<number>>(new Set());
  useRealtimeReviews();

  // Track new reviews for animation
  useEffect(() => {
    const latestReviewId = reviews[0]?.id;
    if (latestReviewId && !newReviewIds.has(latestReviewId)) {
      setNewReviewIds(prev => new Set(prev).add(latestReviewId));
      // Remove the "new" status after animation
      setTimeout(() => {
        setNewReviewIds(prev => {
          const next = new Set(prev);
          next.delete(latestReviewId);
          return next;
        });
      }, 5000);
    }
  }, [reviews]);

  return (
    <div className="min-h-screen bg-background">
      {/* Feedback Hero Section */}
      <section className="relative py-20 overflow-hidden bg-primary/5">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center gap-3 mb-6">
              <MessageCircle className="h-8 w-8 text-primary" />
              <h1 className="text-5xl md:text-6xl font-display text-foreground">Testimonials</h1>
            </div>
            <p className="text-xl font-body text-muted-foreground leading-relaxed">
              What our customers say about their experience with us
            </p>
          </div>
        </div>

        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/60 via-primary to-primary/60" />
      </section>

      {/* Testimonials Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
              {[
                { icon: ThumbsUp, value: "500+", label: "Happy Customers" },
                { icon: Heart, value: "100%", label: "Satisfaction" },
                { icon: Star, value: "5.0", label: "Average Rating" },
                { icon: MessageCircle, value: reviews.length + "+", label: "Reviews" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <stat.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                  <p className="text-2xl font-display text-foreground mb-1">{stat.value}</p>
                  <p className="text-sm font-body text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Testimonials */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {isLoading ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">Loading reviews...</p>
                </div>
              ) : reviews.length > 0 ? (
                reviews.map((review) => (
                  <TestimonialCard
                    key={review.id}
                    review={review}
                    isNew={newReviewIds.has(review.id!)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">No reviews yet. Be the first to share your experience!</p>
                </div>
              )}
            </div>

            {/* Leave Feedback Section */}
            <div className="mt-20 text-center">
              <h2 className="text-3xl font-display text-foreground mb-4">Share Your Experience</h2>
              <p className="text-lg font-body text-muted-foreground mb-8">
                We'd love to hear about your experience with Keilah's Cakes & Pastries
              </p>
              <ReviewModal />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function FeedbackPage() {
  return (
    <FeedbackProvider>
      <FeedbackContent />
    </FeedbackProvider>
  );
}
