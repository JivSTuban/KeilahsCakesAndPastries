"use client";

import { cn } from "@/lib/utils";

export function MenuItemSkeleton() {
  return (
    <div className="w-full animate-pulse">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          {/* Title */}
          <div className="h-6 w-1/3 bg-muted rounded" />
          {/* Description */}
          <div className="space-y-2">
            <div className="h-4 w-full bg-muted rounded" />
            <div className="h-4 w-2/3 bg-muted rounded" />
          </div>
        </div>
        {/* Price */}
        <div className="h-6 w-16 bg-muted rounded" />
      </div>
    </div>
  );
}