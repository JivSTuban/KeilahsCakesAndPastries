"use client";

import { useScroll, useTransform, MotionValue, easeInOut } from "framer-motion";
import { useRef } from "react";

interface UseParallaxProps {
  offset?: number;
}

export function useParallax({ offset = 50 }: UseParallaxProps = {}) {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [-offset/2, offset/2], {
    ease: easeInOut
  });

  return { ref, y };
}
