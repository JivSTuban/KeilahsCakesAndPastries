"use client";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { PageViewTracker } from "@/components/page-view-tracker";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageViewTracker />
      {children}
      <Toaster />
      <Sonner />
    </>
  );
}
