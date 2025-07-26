import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Feedback } from '@/types/feedback';

interface UsePaginatedFeedbackProps {
  pageSize?: number;
}

interface PaginatedFeedbackResult {
  feedback: Feedback[];
  isLoading: boolean;
  error: string;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  refresh: () => void;
}

export function useFeedback(props: UsePaginatedFeedbackProps = {}): PaginatedFeedbackResult {
  const { pageSize = 6 } = props;
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const totalPages = Math.ceil(totalCount / pageSize);
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  const loadFeedback = useCallback(async (page: number = 1) => {
    try {
      setIsLoading(true);
      setError("");
      
      // Get total count - show all feedback except rejected ones
      const { count } = await supabase
        .from("feedback")
        .select("*", { count: 'exact', head: true })
        .neq("status", "rejected");
      
      setTotalCount(count || 0);
      
      // Get paginated data
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      
      const { data, error: fetchError } = await supabase
        .from("feedback")
        .select("*")
        .neq("status", "rejected")
        .order("rating", { ascending: false })
        .order("created_at", { ascending: false })
        .range(from, to);

      if (fetchError) throw fetchError;
      setFeedback(data || []);
      setCurrentPage(page);
    } catch (err) {
      console.error("Error loading feedback:", err);
      setError("Failed to load testimonials");
    } finally {
      setIsLoading(false);
    }
  }, [pageSize]);

  useEffect(() => {
    loadFeedback(1);

    // Set up realtime subscription for immediate updates
    const subscription = supabase
      .channel('feedback-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all changes (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'feedback',
          filter: 'status=neq.rejected' // Only listen to non-rejected feedback
        },
        (payload) => {
          console.log('Realtime feedback update:', payload);
          
          // Refresh the current page when there's any change
          loadFeedback(currentPage);
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [loadFeedback, currentPage]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      loadFeedback(page);
    }
  };

  const nextPage = () => {
    if (hasNextPage) {
      goToPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (hasPreviousPage) {
      goToPage(currentPage - 1);
    }
  };

  const refresh = () => {
    loadFeedback(currentPage);
  };

  return { 
    feedback, 
    isLoading, 
    error, 
    currentPage,
    totalPages,
    totalCount,
    hasNextPage,
    hasPreviousPage,
    goToPage,
    nextPage,
    previousPage,
    refresh 
  };
}

// Keep the old function name for backward compatibility
export const useApprovedFeedback = useFeedback;
