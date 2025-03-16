import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Feedback } from '@/types/feedback';

export function useApprovedFeedback() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadFeedback() {
    try {
      const { data, error: fetchError } = await supabase
        .from("feedback")
        .select("*")
        .eq("status", "approved")
        .order("rating", { ascending: false })
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setFeedback(data || []);
    } catch (err) {
      console.error("Error loading approved feedback:", err);
      setError("Failed to load testimonials");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadFeedback();
  }, []);

  const refresh = () => {
    setIsLoading(true);
    loadFeedback();
  };

  return { feedback, isLoading, error, refresh };
}
