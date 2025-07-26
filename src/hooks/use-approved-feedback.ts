import { useEffect, useState } from 'react';
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

export function useApprovedFeedback(props: UsePaginatedFeedbackProps = {}): PaginatedFeedbackResult {
  const { pageSize = 6 } = props;
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const totalPages = Math.ceil(totalCount / pageSize);
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  async function loadFeedback(page: number = 1) {
    try {
      setIsLoading(true);
      setError("");
      
      // Get total count
      const { count } = await supabase
        .from("feedback")
        .select("*", { count: 'exact', head: true })
        .eq("status", "approved");
      
      setTotalCount(count || 0);
      
      // Get paginated data
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      
      const { data, error: fetchError } = await supabase
        .from("feedback")
        .select("*")
        .eq("status", "approved")
        .order("rating", { ascending: false })
        .order("created_at", { ascending: false })
        .range(from, to);

      if (fetchError) throw fetchError;
      setFeedback(data || []);
      setCurrentPage(page);
    } catch (err) {
      console.error("Error loading approved feedback:", err);
      setError("Failed to load testimonials");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadFeedback(1);
  }, [pageSize]);

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
