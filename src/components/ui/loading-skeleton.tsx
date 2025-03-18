"use client";

import { cn } from "@/lib/utils";

export function MenuItemSkeleton() {
  return (
    <div className="bg-card/50 border border-border/50 rounded-lg overflow-hidden animate-pulse">
      {/* Image Placeholder */}
      <div className="relative aspect-[4/3] w-full bg-muted" />

      <div className="p-6 space-y-4">
        {/* Title */}
        <div className="flex items-center justify-between">
          <div className="h-8 w-2/3 bg-muted rounded" />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-muted rounded" />
          <div className="h-4 w-3/4 bg-muted rounded" />
        </div>

        {/* Prices */}
        <div className="space-y-2 pt-2">
          <div className="flex justify-between items-center py-1">
            <div className="h-4 w-1/3 bg-muted rounded" />
            <div className="h-6 w-20 bg-muted rounded" />
          </div>
          <div className="flex justify-between items-center py-1 border-t border-border/30">
            <div className="h-4 w-1/2 bg-muted rounded" />
            <div className="h-6 w-20 bg-muted rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
