"use client";

import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

export function EmptyState({
  title,
  description,
  icon,
  className,
}: {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-14 px-6 rounded-2xl border border-dashed border-line/80",
        className
      )}
    >
      <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-bg-elev border border-line text-accent mb-3">
        {icon ?? <Sparkles size={18} />}
      </div>
      <p className="text-sm font-medium text-text">{title}</p>
      {description && (
        <p className="text-xs text-text-dim mt-1 max-w-sm">{description}</p>
      )}
    </div>
  );
}
