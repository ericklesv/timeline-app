"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import type { EventItem } from "@/types";

export function PriorityToday({ items }: { items: EventItem[] }) {
  const top = items[0];
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.05 }}
      className="card p-5 flex items-start gap-4"
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-accent/15 text-accent border border-accent/25">
        <Flame size={18} />
      </div>
      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-wider text-text-dim">
          Prioridade de hoje
        </div>
        <div className="text-base sm:text-lg font-semibold tracking-tight truncate">
          {top ? top.title : "Defina sua prioridade do dia"}
        </div>
        <p className="text-xs text-text-dim mt-0.5">
          {top
            ? "Concentre-se nisso antes de qualquer outra coisa."
            : "Marque um item como urgente para destacá-lo aqui."}
        </p>
      </div>
    </motion.div>
  );
}
