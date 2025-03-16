"use client";

import { useEffect } from "react";
import { Star } from "lucide-react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { useApprovedFeedback } from "@/hooks/use-approved-feedback";
import type { Feedback } from "@/types/feedback";

function TestimonialCard({ feedback }: { feedback: Feedback }) {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, y: 0 });
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
      transition={{ duration: 0.5 }}
      className="w-[350px] p-6 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 shadow-lg"
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

export function TestimonialsSlider() {
  const { feedback, isLoading, error } = useApprovedFeedback();

  if (isLoading) {
    return <div className="h-[300px] flex items-center justify-center">
      <p className="text-muted-foreground">Loading testimonials...</p>
    </div>;
  }

  if (error) {
    return <div className="h-[300px] flex items-center justify-center">
      <p className="text-muted-foreground">{error}</p>
    </div>;
  }

  if (!feedback.length) {
    return <div className="h-[300px] flex items-center justify-center">
      <p className="text-muted-foreground">No testimonials yet</p>
    </div>;
  }

  return (
    <div className="relative w-full my-20">
      {/* Gradient Overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
      
      <InfiniteSlider 
        duration={25} 
        durationOnHover={100} 
        reverse
        gap={32}
      >
        {feedback.map((item) => (
          <TestimonialCard key={item.id} feedback={item} />
        ))}
      </InfiniteSlider>
    </div>
  );
}
