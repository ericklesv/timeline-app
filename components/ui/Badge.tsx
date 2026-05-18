"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({
  children,
  color,
  className,
}: {
  children: React.ReactNode;
  color?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium",
        "border border-line bg-bg-elev/60 text-text-dim",
        className
      )}
    >
      {color && (
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }}
        />
      )}
      {children}
    </span>
  );
}
