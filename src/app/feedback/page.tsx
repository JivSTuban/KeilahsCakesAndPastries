"use client";

import { Cake, Star } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { FeedbackModal } from "@/components/ui/feedback-modal";
import { useApprovedFeedback } from "@/hooks/use-approved-feedback";
import type { Feedback } from "@/types/feedback";

function FeedbackCard({ feedback }: { feedback: Feedback }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-medium">
              {feedback.customer_name || "Anonymous Customer"}
            </p>
            <p className="text-sm text-muted-foreground">
              {new Date(feedback.created_at).toLocaleDateString("en-PH", {
                year: "numeric",
                month: "long",
                day: "numeric"
              })}
            </p>
          </div>
          {feedback.rating && (
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-4 w-4",
                    i < feedback.rating!
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  )}
                />
              ))}
            </div>
          )}
        </div>
        {feedback.message && (
          <p className="text-muted-foreground line-clamp-4">
            {feedback.message}
          </p>
        )}
      </div>
    </motion.div>
  );
}

export default function FeedbackPage() {
  const { feedback, isLoading, error } = useApprovedFeedback();

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          {/* Header */}
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center gap-3">
              <Cake className="h-8 w-8 text-primary" />
              <h1 className="text-4xl md:text-5xl font-display">Customer Feedback</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto">
              See what our customers are saying about us
            </p>
            <FeedbackModal />
          </div>

          {/* Feedback Grid */}
          <div className="mt-12">
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading feedback...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">{error}</p>
              </div>
            ) : !feedback.length ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No feedback yet. Be the first to share your experience!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {feedback.map((item) => (
                  <FeedbackCard key={item.id} feedback={item} />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
