"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { type Review } from "@/lib/supabase";
import { useFeedback } from "@/contexts/feedback-context";

export function useRealtimeReviews() {
  const { addReview } = useFeedback();

  useEffect(() => {
    const channel = supabase
      .channel('reviews')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'reviews'
        },
        (payload) => {
          const newReview = payload.new as Review;
          addReview(newReview);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [addReview]);
}
