"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "subtle" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-white hover:bg-accent-soft shadow-[0_8px_24px_-8px_rgba(108,99,255,0.6)]",
  ghost:
    "bg-transparent text-text hover:bg-white/[0.04] border border-transparent",
  subtle:
    "bg-bg-elev text-text hover:bg-[#252a35] border border-line",
  danger:
    "bg-danger/15 text-danger hover:bg-danger/20 border border-danger/30",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-xs rounded-lg",
  md: "h-10 px-4 text-sm rounded-xl",
  lg: "h-11 px-5 text-sm rounded-xl",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 active:scale-[0.98] focus-ring disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
