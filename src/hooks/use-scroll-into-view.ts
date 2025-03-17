"use client";

import { useEffect, useRef } from "react";

interface ScrollIntoViewOptions {
  behavior?: ScrollBehavior;
  block?: ScrollLogicalPosition;
  inline?: ScrollLogicalPosition;
}

export const useScrollIntoView = (
  elementId: string,
  options: ScrollIntoViewOptions = { behavior: "smooth", block: "start" }
) => {
  const scrollTimeoutRef = useRef<number | null>(null);

  const scrollIntoView = () => {
    // Clear any existing timeout
    if (scrollTimeoutRef.current) {
      window.clearTimeout(scrollTimeoutRef.current);
    }

    // Set a small timeout to ensure the DOM is ready
    scrollTimeoutRef.current = window.setTimeout(() => {
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView(options);
      }
    }, 100);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return scrollIntoView;
};

export const scrollToSection = (sectionId: string) => {
  const section = document.getElementById(sectionId);
  if (section) {
    const offset = 80; // Height of fixed navbar
    const elementPosition = section.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }
};
