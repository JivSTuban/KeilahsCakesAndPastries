"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Review, getReviews } from "@/lib/supabase";

interface FeedbackContextType {
  reviews: Review[];
  isLoading: boolean;
  addReview: (review: Review) => void;
  refreshReviews: () => Promise<void>;
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshReviews = async () => {
    try {
      setIsLoading(true);
      const data = await getReviews();
      setReviews(data);
    } catch (error) {
      console.error('Failed to load reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshReviews();
  }, []);

  const addReview = (newReview: Review) => {
    setReviews((prev) => [newReview, ...prev]);
  };

  return (
    <FeedbackContext.Provider value={{ reviews, isLoading, addReview, refreshReviews }}>
      {children}
    </FeedbackContext.Provider>
  );
}

export function useFeedback() {
  const context = useContext(FeedbackContext);
  if (context === undefined) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  return context;
}
