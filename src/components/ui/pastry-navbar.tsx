"use client";

import * as React from "react";
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
  { label: "Collections", href: "/collections" },
  { label: "Feedback", href: "/feedback" }
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
                  src={getCloudinaryUrl("/keilahs-logo.jpg")}
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
          <NavList />
        </nav>
      </div>
    </motion.header>
  );
}

const { useState, useRef, useEffect } = React;
import { usePathname } from "next/navigation";
import { getCloudinaryUrl } from "@/lib/cloudinary-url";

const NavList = () => {
  const pathname = usePathname();
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

  useEffect(() => {
    const activeItem = document.querySelector(`[data-href="${pathname}"]`);
    if (activeItem) {
      const { width, left } = activeItem.getBoundingClientRect();
      const parentLeft = activeItem.parentElement?.getBoundingClientRect().left || 0;
      setPosition({
        width,
        opacity: 1,
        left: left - parentLeft,
      });
    }
  }, [pathname]);

  return (
    <motion.ul
      className="relative mx-auto flex w-fit rounded-full border border-black bg-white p-1"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      onMouseLeave={() => {
        const activeItem = document.querySelector(`[data-href="${pathname}"]`);
        if (activeItem) {
          const { width, left } = activeItem.getBoundingClientRect();
          const parentLeft = activeItem.parentElement?.getBoundingClientRect().left || 0;
          setPosition({
            width,
            opacity: 1,
            left: left - parentLeft,
          });
        }
      }}
    >
      {NAV_ITEMS.map((item) => (
        <NavItem
          key={item.href}
          href={item.href}
          setPosition={setPosition}
          isActive={pathname === item.href}
          data-href={item.href}
        >
          {item.label}
        </NavItem>
      ))}
      <NavCursor position={position} />
    </motion.ul>
  );
};

const NavItem = ({
  children,
  href,
  setPosition,
  isActive,
  ...props
}: {
  children: React.ReactNode;
  href: string;
  setPosition: React.Dispatch<React.SetStateAction<{
    left: number;
    width: number;
    opacity: number;
  }>>;
  isActive?: boolean;
}) => {
  const ref = useRef<HTMLLIElement>(null);
  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref.current) return;
        const { width } = ref.current.getBoundingClientRect();
        setPosition({
          width,
          opacity: 1,
          left: ref.current.offsetLeft,
        });
      }}
      className="relative z-10 block px-3 py-1.5 text-sm uppercase text-white mix-blend-difference"
      {...props}
    >
      <Link href={href} className="block cursor-pointer w-full h-full">{children}</Link>
    </li>
  );
};

const NavCursor = ({ position }: { 
  position: {
    left: number;
    width: number;
    opacity: number;
  }
}) => {
  return (
    <motion.li
      animate={position}
      className="absolute z-0 h-8 rounded-full bg-black"
    />
  );
}
