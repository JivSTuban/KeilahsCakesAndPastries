"use client";

import { MenuSection as MenuSectionType, MenuItem } from "@/types/menu";
import { cn } from "@/lib/utils";
import { MenuItemCard } from "@/components/ui/menu-item-card";
import { MenuItemSkeleton } from "@/components/ui/loading-skeleton";
import { useEffect, useState } from "react";

interface MenuSectionProps {
  section: MenuSectionType;
  isLoading?: boolean;
}

export function MenuSection({ section, isLoading }: MenuSectionProps) {
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Section Header */}
      <div className="mb-8 text-center">
        <h3 className="text-3xl font-display text-foreground mb-3">{section.title}</h3>
        {section.description && (
          <p className="text-lg font-body text-muted-foreground">{section.description}</p>
        )}
      </div>

      {/* Menu Items */}
      <div className="space-y-8">
        {isLoading ? (
          // Loading Skeleton
          Array.from({ length: 3 }).map((_: unknown, index: number) => (
            <MenuItemSkeleton key={index} />
          ))
        ) : (
          // Actual Menu Items
          section.items.map((item: MenuItem, index: number) => (
            <MenuItemCard 
              key={index}
              item={item}
            />
          ))
        )}
      </div>

      {/* Section Note */}
      {section.note && (
        <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
          <p className="text-sm font-body text-muted-foreground italic">
            Note: {section.note}
          </p>
        </div>
      )}
    </div>
  );
}
