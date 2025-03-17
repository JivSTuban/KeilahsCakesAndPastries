"use client"

import * as React from "react";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuroraButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: React.ReactNode;
  glowClassName?: string;
}

export function AuroraButton({
  className,
  children,
  glowClassName,
  ...props
}: AuroraButtonProps) {
  return (
    <div className="relative">
      {/* Gradient border container */}
      <div
        className={cn(
          "absolute -inset-[2px] rounded-lg bg-gradient-to-r from-purple-500 via-cyan-300 to-emerald-400 opacity-75 blur-lg transition-all",
          "group-hover:opacity-100 group-hover:blur-xl",
          glowClassName
        )}
      />

      {/* Button */}
      <button
        className={cn(
          "relative rounded-lg bg-slate-900 px-4 py-2",
          "text-slate-50 shadow-xl",
          "transition-all duration-300 hover:bg-slate-800",
          "group border border-slate-800",
          "cursor-pointer disabled:cursor-not-allowed",
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-center gap-2 w-full">
          {props.disabled && <Lock className="h-4 w-4" />}
          {children}
        </div>
      </button>
    </div>
  );
}
