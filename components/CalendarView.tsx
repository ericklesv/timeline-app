"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import type { EventItem } from "@/types";
import { cn } from "@/lib/utils";
import { getCategory } from "@/lib/categories";
import { toDateTime } from "@/lib/date";

interface CalendarViewProps {
  events: EventItem[];
  onSelectDay: (date: Date) => void;
}

export function CalendarView({ events, onSelectDay }: CalendarViewProps) {
  const [cursor, setCursor] = useState(() => new Date());

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(cursor), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(cursor), { weekStartsOn: 0 });
    const arr: Date[] = [];
    const cur = new Date(start);
    while (cur <= end) {
      arr.push(new Date(cur));
      cur.setDate(cur.getDate() + 1);
    }
    return arr;
  }, [cursor]);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, EventItem[]>();
    for (const ev of events) {
      if (!map.has(ev.date)) map.set(ev.date, []);
      map.get(ev.date)!.push(ev);
    }
    return map;
  }, [events]);

  const monthLabel = format(cursor, "MMMM yyyy", { locale: ptBR });

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="card p-4 sm:p-6"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-text-dim">
            Calendário
          </div>
          <div className="text-lg font-semibold tracking-tight capitalize">
            {monthLabel}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <NavBtn
            onClick={() => setCursor((d) => addMonths(d, -1))}
            icon={<ChevronLeft size={16} />}
          />
          <button
            onClick={() => setCursor(new Date())}
            className="h-9 px-3 rounded-lg text-xs font-medium text-text-dim hover:text-text hover:bg-white/[0.04] transition-colors"
          >
            Hoje
          </button>
          <NavBtn
            onClick={() => setCursor((d) => addMonths(d, 1))}
            icon={<ChevronRight size={16} />}
          />
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5 mb-2">
        {["D", "S", "T", "Q", "Q", "S", "S"].map((d, i) => (
          <div
            key={i}
            className="text-[10px] uppercase tracking-wider text-text-mute text-center"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {days.map((d) => {
          const key = format(d, "yyyy-MM-dd");
          const dayEvents = eventsByDay.get(key) ?? [];
          const inMonth = isSameMonth(d, cursor);
          const today = isToday(d);
          return (
            <button
              key={key}
              onClick={() => onSelectDay(d)}
              className={cn(
                "relative aspect-square min-h-[64px] rounded-xl border p-2 text-left transition-all",
                inMonth
                  ? "border-line/70 bg-bg-card hover:border-line hover:-translate-y-[1px]"
                  : "border-transparent bg-transparent text-text-mute",
                today && "border-accent/40 bg-accent/[0.06]"
              )}
            >
              <div
                className={cn(
                  "text-[12px] font-medium",
                  today ? "text-accent" : inMonth ? "text-text" : "text-text-mute"
                )}
              >
                {format(d, "d")}
              </div>
              <div className="absolute bottom-1.5 left-2 right-2 flex gap-1 flex-wrap">
                {dayEvents.slice(0, 3).map((ev) => {
                  const c = getCategory(ev.category);
                  return (
                    <span
                      key={ev.id}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: c.color }}
                    />
                  );
                })}
                {dayEvents.length > 3 && (
                  <span className="text-[9px] text-text-mute leading-none">
                    +{dayEvents.length - 3}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

function NavBtn({
  onClick,
  icon,
}: {
  onClick: () => void;
  icon: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="w-9 h-9 rounded-lg flex items-center justify-center text-text-dim hover:text-text hover:bg-white/[0.04] transition-colors"
    >
      {icon}
    </button>
  );
}
