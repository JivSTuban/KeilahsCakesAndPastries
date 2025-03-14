"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { cn } from "@/lib/utils";
import { NavLink } from "@/components/ui/nav-link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Menu", href: "/menu" },
  { label: "Featured", href: "/featured" },
  { label: "Feedback", href: "/feedback" },
  { label: "About", href: "/about" },
];

export function PastryNavbar() {
  const { isScrolled, isScrollingUp } = useScrollDirection();

  return (
    <motion.header 
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        "transition-all duration-300",
        isScrolled ? "h-16" : "h-24",
        !isScrollingUp && "translate-y-[-100%]"
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className={cn(
        "container mx-auto flex items-center justify-between px-4 transition-all duration-300",
        isScrolled ? "h-16" : "h-24"
      )}>
        <div className="flex items-center gap-6">
          <div className="flex items-center">
            {/* Home Logo */}
            <Link href="https://www.facebook.com/keilahspastriesndesserts" className="flex items-center gap-3 group">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative"
              >
                <Image
                  src="/keilahs-logo.jpg"
                  alt="Keilah's Pastries"
                  width={48}
                  height={48}
                  quality={95}
                  priority
                  className={cn(
                    "rounded-full transition-all duration-300 object-cover transform",
                    "group-hover:scale-105",
                    isScrolled ? "h-10 w-10" : "h-12 w-12"
                  )}
                />
                <motion.div 
                  className="absolute inset-0 rounded-full bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={false}
                  animate={isScrolled ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </motion.div>
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn(
                  "font-serif text-2xl transition-all duration-300",
                  isScrolled ? "text-primary scale-95" : "text-foreground scale-100"
                )}
              >
                Keilah&apos;s
              </motion.span>
            </Link>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <motion.ul 
            className="relative flex items-center gap-1 rounded-full border border-border/50 bg-card/50 px-3 py-1.5 shadow-sm"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {NAV_ITEMS.map((item) => (
              <li key={item.href} className="relative">
                <NavLink href={item.href}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </motion.ul>
        </nav>
      </div>
    </motion.header>
  );
}
