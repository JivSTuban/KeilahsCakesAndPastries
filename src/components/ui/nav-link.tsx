"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  scrollToId?: string;
  className?: string;
}

export function NavLink({ href, children, scrollToId, className }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLAnchorElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (scrollToId) {
      e.preventDefault();
      const element = document.getElementById(scrollToId);
      if (element) {
        const offset = 80; // Height of fixed navbar
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <Link
      ref={ref}
      href={href}
      className={cn(
        "relative px-4 py-2 text-sm font-medium transition-all duration-300 select-none",
        isActive 
          ? "text-primary font-semibold" 
          : "text-foreground/80 hover:text-primary",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Text Content */}
      <span className="relative z-20">{children}</span>

      {/* Background Glow for Active State */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            className="absolute inset-0 -z-10 overflow-hidden rounded-full"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0.3, 0.5, 0.3],
              scale: [1, 1.03, 1]
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-md" />
            <div className="absolute inset-[-4px] bg-primary/15 rounded-full blur-xl" />
            <div 
              className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0"
              style={{
                animation: "shine 3s ease-in-out infinite"
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hover Effect */}
      <AnimatePresence>
        {isHovered && !isActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 -z-10 rounded-full bg-primary/10"
          />
        )}
      </AnimatePresence>

      {/* Active Indicator */}
      {isActive && (
        <motion.div
          layoutId="nav-indicator"
          className="absolute left-2 right-2 bottom-1 h-0.5 z-10"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
          <div className="h-full w-full bg-primary rounded-full" />
          <div className="absolute inset-0 bg-primary blur-sm rounded-full opacity-50" />
        </motion.div>
      )}
    </Link>
  );
}
