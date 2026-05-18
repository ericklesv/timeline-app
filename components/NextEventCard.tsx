"use client";

import { motion } from "framer-motion";
import { CalendarClock, ChevronRight } from "lucide-react";
import type { EventItem } from "@/types";
import { useNow } from "@/hooks/useNow";
import { countdown, toDateTime, fmtDayLabel, fmtTime } from "@/lib/date";
import { getCategory } from "@/lib/categories";

export function NextEventCard({ event }: { event: EventItem | null }) {
  const now = useNow(30_000);
  if (!event) {
    return (
      <div className="card p-5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-bg-elev border border-line flex items-center justify-center text-text-dim">
          <CalendarClock size={18} />
        </div>
        <div>
          <p className="text-sm font-medium">Sem próximos eventos</p>
          <p className="text-xs text-text-dim mt-0.5">
            Crie um compromisso para começar.
          </p>
        </div>
      </div>
    );
  }

  const target = toDateTime(event);
  const cat = getCategory(event.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
      className="relative card p-5 overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, rgba(108,99,255,0.10), rgba(108,99,255,0.02) 50%, rgba(24,27,34,1))",
      }}
    >
      <div
        aria-hidden
        className="absolute -top-16 -right-16 w-56 h-56 rounded-full blur-3xl opacity-40"
        style={{ background: cat.color }}
      />
      <div className="relative flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-bg-elev border border-line flex items-center justify-center text-accent">
          <CalendarClock size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] uppercase tracking-wider text-text-dim">
            Próximo evento
          </div>
          <div className="text-lg sm:text-xl font-semibold tracking-tight truncate">
            {event.title}
          </div>
          <div className="text-xs text-text-dim mt-1 flex items-center gap-2 flex-wrap">
            <span>{fmtDayLabel(target)}</span>
            <span className="text-text-mute">•</span>
            <span>{fmtTime(event.time)}</span>
            <span className="text-text-mute">•</span>
            <span
              className="inline-flex items-center gap-1.5"
              style={{ color: cat.color }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: cat.color }}
              />
              {cat.label}
            </span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-[11px] uppercase tracking-wider text-text-dim">
            countdown
          </div>
          <div className="text-base font-semibold text-accent">
            {countdown(target, now)}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
