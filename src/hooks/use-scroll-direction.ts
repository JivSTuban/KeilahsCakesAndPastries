"use client";

import { useState, useEffect } from "react";

export function useScrollDirection() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isScrollingUp, setIsScrollingUp] = useState(true);

  useEffect(() => {
    let lastScrollY = 0;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);
      
      // Only update direction if there's a significant change
      if (Math.abs(currentScrollY - lastScrollY) > 5) {
        setIsScrollingUp(currentScrollY < lastScrollY);
        lastScrollY = currentScrollY;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return { isScrolled, isScrollingUp };
}
