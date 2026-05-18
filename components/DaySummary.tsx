"use client";

import { motion } from "framer-motion";
import type { EventItem } from "@/types";
import { cn } from "@/lib/utils";

interface DaySummaryProps {
  total: number;
  pending: number;
  next?: EventItem | null;
}

export function DaySummary({ total, pending }: DaySummaryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.05 }}
      className="grid grid-cols-2 sm:grid-cols-3 gap-3"
    >
      <Stat label="Compromissos hoje" value={total} />
      <Stat label="Pendentes" value={pending} tone={pending > 0 ? "accent" : "neutral"} />
      <Stat
        label="Concluídos"
        value={Math.max(total - pending, 0)}
        tone="ok"
        className="col-span-2 sm:col-span-1"
      />
    </motion.div>
  );
}

function Stat({
  label,
  value,
  tone = "neutral",
  className,
}: {
  label: string;
  value: number;
  tone?: "neutral" | "accent" | "ok";
  className?: string;
}) {
  return (
    <div className={cn("card p-4 flex flex-col gap-1", className)}>
      <div className="text-[11px] uppercase tracking-wider text-text-dim">
        {label}
      </div>
      <div
        className={cn(
          "text-2xl font-semibold tracking-tight",
          tone === "accent" && "text-accent",
          tone === "ok" && "text-ok",
          tone === "neutral" && "text-text"
        )}
      >
        {value}
      </div>
    </div>
  );
}
