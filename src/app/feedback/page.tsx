"use client";

import { Cake, Star } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { HoverButton } from "@/components/ui/hover-button";
import { FeedbackModal } from "@/components/ui/feedback-modal";
import { FeedbackGridSkeleton } from "@/components/ui/feedback-skeleton";
import { useApprovedFeedback } from "@/hooks/use-approved-feedback";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import type { Feedback } from "@/types/feedback";

function FeedbackCard({ feedback }: { feedback: Feedback }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 sm:p-6 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      <div className="space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0">
          <div className="min-w-0 flex-1">
            <p className="font-medium text-sm sm:text-base truncate">
              {feedback.customer_name || "Anonymous Customer"}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {new Date(feedback.created_at).toLocaleDateString("en-PH", {
                year: "numeric",
                month: "long",
                day: "numeric"
              })}
            </p>
          </div>
          {feedback.rating && (
            <div className="flex gap-0.5 flex-shrink-0">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-3 w-3 sm:h-4 sm:w-4",
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
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed line-clamp-4">
            {feedback.message}
          </p>
        )}
      </div>
    </motion.div>
  );
}

function PaginationComponent({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  return (
    <Pagination className="mt-8 sm:mt-12">
      <PaginationContent className="flex-wrap gap-1 sm:gap-2">
        <PaginationItem>
          <PaginationPrevious
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            className={cn(
              "text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2",
              currentPage <= 1 && "pointer-events-none opacity-50"
            )}
          />
        </PaginationItem>

        {getVisiblePages().map((page, index) => (
          <PaginationItem key={index}>
            {page === "..." ? (
              <PaginationEllipsis className="h-8 w-8 sm:h-9 sm:w-9" />
            ) : (
              <PaginationLink
                onClick={() => onPageChange(page as number)}
                isActive={currentPage === page}
                className="h-8 w-8 sm:h-9 sm:w-9 text-xs sm:text-sm cursor-pointer"
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
            className={cn(
              "text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2",
              currentPage >= totalPages && "pointer-events-none opacity-50"
            )}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export default function FeedbackPage() {
  const { 
    feedback, 
    isLoading, 
    error, 
    currentPage, 
    totalPages, 
    totalCount,
    goToPage 
  } = useApprovedFeedback({ pageSize: 6 });

  return (
    <div className="min-h-screen bg-background py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8 sm:space-y-12"
        >
          {/* Header */}
          <div className="text-center space-y-4 sm:space-y-6">
            <div className="inline-flex items-center justify-center gap-2 sm:gap-3">
              <Cake className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-display">
                Customer Feedback
              </h1>
            </div>
            <p className="text-base sm:text-lg text-muted-foreground max-w-lg mx-auto px-4">
              See what our customers are saying about us
            </p>
            {totalCount > 0 && (
              <p className="text-sm text-muted-foreground">
                Showing {feedback.length} of {totalCount} reviews
              </p>
            )}
            <FeedbackModal>
              <HoverButton 
                className="text-black font-body tracking-wide text-sm sm:text-base lg:text-lg px-4 sm:px-6 py-2 sm:py-3"
                style={{
                  "--circle-start": "#a0d9f8",
                  "--circle-end": "#3a5bbf",
                  background: "white"
                } as React.CSSProperties}
              >
                <span className="flex items-center gap-2">
                  Share Your Experience
                </span>
              </HoverButton>
            </FeedbackModal>
          </div>

          {/* Feedback Grid */}
          <div className="mt-8 sm:mt-12">
            {isLoading ? (
              <FeedbackGridSkeleton />
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">{error}</p>
              </div>
            ) : !feedback.length ? (
              <div className="text-center py-12 px-4">
                <Cake className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground text-sm sm:text-base">
                  No feedback yet. Be the first to share your experience!
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {feedback.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <FeedbackCard feedback={item} />
                    </motion.div>
                  ))}
                </div>
                
                <PaginationComponent
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={goToPage}
                />
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
