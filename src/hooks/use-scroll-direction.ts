"use client";

import { useState, useEffect } from "react";

export function useScrollDirection() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isScrollingUp, setIsScrollingUp] = useState(true);

  useEffect(() => {
    let lastScrollY = 0;
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          
          // Add hysteresis: different thresholds for scrolling down vs up
          const scrollDownThreshold = 50;
          const scrollUpThreshold = 30;
          
          if (!isScrolled && currentScrollY > scrollDownThreshold) {
            setIsScrolled(true);
          } else if (isScrolled && currentScrollY < scrollUpThreshold) {
            setIsScrolled(false);
          }
          
          // Only update direction if there's a significant change
          if (Math.abs(currentScrollY - lastScrollY) > 10) {
            setIsScrollingUp(currentScrollY < lastScrollY);
            lastScrollY = currentScrollY;
          }
          
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isScrolled]);

  return { isScrolled, isScrollingUp };
}
