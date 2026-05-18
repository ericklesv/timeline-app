"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "w-full h-10 px-3.5 rounded-xl bg-bg-elev/70 border border-line text-text text-sm",
      "placeholder:text-text-mute transition-colors duration-200",
      "hover:border-line focus:border-accent/60 focus:bg-bg-elev focus-ring",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full min-h-[88px] p-3.5 rounded-xl bg-bg-elev/70 border border-line text-text text-sm leading-relaxed",
      "placeholder:text-text-mute transition-colors duration-200 resize-none",
      "hover:border-line focus:border-accent/60 focus:bg-bg-elev focus-ring",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "w-full h-10 px-3 rounded-xl bg-bg-elev/70 border border-line text-text text-sm",
      "transition-colors duration-200 appearance-none",
      "hover:border-line focus:border-accent/60 focus:bg-bg-elev focus-ring",
      className
    )}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = "Select";

export function Label({
  children,
  className,
  htmlFor,
}: {
  children: React.ReactNode;
  className?: string;
  htmlFor?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "text-[11px] font-medium uppercase tracking-wider text-text-dim mb-1.5 block",
        className
      )}
    >
      {children}
    </label>
  );
}
