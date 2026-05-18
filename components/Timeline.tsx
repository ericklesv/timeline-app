"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Clock, MapPin, MoreHorizontal, Trash2 } from "lucide-react";
import type { EventItem } from "@/types";
import { cn } from "@/lib/utils";
import { getCategory } from "@/lib/categories";
import {
  compareEvents,
  countdown,
  eventIsToday,
  fmtDayLabel,
  fmtTime,
  isOverdue,
  toDateTime,
} from "@/lib/date";
import { useNow } from "@/hooks/useNow";
import { useState } from "react";

interface TimelineProps {
  events: EventItem[];
  onToggleDone: (id: string) => void;
  onRemove: (id: string) => void;
  onEdit: (ev: EventItem) => void;
}

export function Timeline({ events, onToggleDone, onRemove, onEdit }: TimelineProps) {
  const now = useNow();
  const groups = groupForTimeline(events);

  if (groups.length === 0) return null;

  return (
    <div className="relative pl-1">
      {groups.map((g, gi) => (
        <section key={g.key} className="relative">
          <div className="flex items-center gap-3 mb-3 mt-1">
            <span
              className={cn(
                "w-2.5 h-2.5 rounded-full",
                g.isToday
                  ? "bg-accent shadow-[0_0_0_4px_rgba(108,99,255,0.18)]"
                  : "bg-line"
              )}
            />
            <div
              className={cn(
                "text-[11px] uppercase tracking-[0.18em] font-medium",
                g.isToday ? "text-accent" : "text-text-dim"
              )}
            >
              {g.label}
            </div>
            <div className="hairline flex-1" />
            <div className="text-[11px] text-text-mute">
              {g.items.length} {g.items.length === 1 ? "item" : "itens"}
            </div>
          </div>

          <div className="relative ml-[5px] border-l border-line/70 pl-6 pb-6 space-y-3">
            <AnimatePresence initial={false}>
              {g.items.map((ev, i) => (
                <TimelineRow
                  key={ev.id}
                  index={i}
                  event={ev}
                  now={now}
                  onToggleDone={onToggleDone}
                  onRemove={onRemove}
                  onEdit={onEdit}
                />
              ))}
            </AnimatePresence>
            {gi === groups.length - 1 && (
              <div className="absolute -bottom-1 -left-[5px] w-2.5 h-2.5 rounded-full bg-bg border border-line" />
            )}
          </div>
        </section>
      ))}
    </div>
  );
}

function TimelineRow({
  event,
  index,
  now,
  onToggleDone,
  onRemove,
  onEdit,
}: {
  event: EventItem;
  index: number;
  now: Date;
  onToggleDone: (id: string) => void;
  onRemove: (id: string) => void;
  onEdit: (ev: EventItem) => void;
}) {
  const cat = getCategory(event.category);
  const today = eventIsToday(event);
  const overdue = isOverdue(event, now);
  const urgent = event.priority === "urgent" && !event.done;
  const target = toDateTime(event);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.28, delay: index * 0.03 }}
      className="relative"
    >
      {/* node */}
      <span
        className={cn(
          "absolute -left-[28px] top-4 w-2.5 h-2.5 rounded-full border",
          today
            ? "bg-accent border-accent shadow-[0_0_0_4px_rgba(108,99,255,0.18)]"
            : overdue
            ? "bg-danger/80 border-danger"
            : "bg-bg-elev border-line"
        )}
      />
      <div
        onClick={() => onEdit(event)}
        className={cn(
          "group card p-3.5 sm:p-4 cursor-pointer transition-all duration-200",
          "hover:-translate-y-[1px] hover:border-line",
          today && "border-accent/30 shadow-glow",
          overdue && "border-danger/30",
          event.done && "opacity-60",
          urgent && "animate-pulseGlow"
        )}
      >
        <div className="flex items-start gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleDone(event.id);
            }}
            aria-label="Concluir"
            className={cn(
              "mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0",
              event.done
                ? "bg-accent border-accent text-white"
                : "border-line hover:border-accent/60 text-transparent hover:text-accent"
            )}
          >
            <Check size={12} />
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3
                    className={cn(
                      "text-[14.5px] font-medium tracking-tight truncate",
                      event.done && "line-through text-text-dim"
                    )}
                  >
                    {event.title}
                  </h3>
                  {urgent && (
                    <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-md bg-danger/15 text-danger border border-danger/25">
                      Urgente
                    </span>
                  )}
                  {event.priority === "important" && !urgent && (
                    <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-md bg-warn/15 text-warn border border-warn/25">
                      Importante
                    </span>
                  )}
                  {overdue && (
                    <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-md bg-danger/10 text-danger border border-danger/25">
                      Atrasado
                    </span>
                  )}
                </div>

                <div className="mt-1 flex items-center gap-3 text-[12px] text-text-dim flex-wrap">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock size={12} />
                    {fmtTime(event.time)}
                  </span>
                  {event.location && (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin size={12} />
                      {event.location}
                    </span>
                  )}
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
                  {today && event.time && (
                    <span className="text-accent">{countdown(target, now)}</span>
                  )}
                </div>

                {event.description && (
                  <p className="text-[12.5px] text-text-dim mt-2 leading-relaxed line-clamp-2">
                    {event.description}
                  </p>
                )}
              </div>

              <RowMenu onRemove={() => onRemove(event.id)} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function RowMenu({ onRemove }: { onRemove: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative shrink-0">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className="p-1.5 rounded-lg text-text-mute hover:text-text hover:bg-white/[0.05] opacity-0 group-hover:opacity-100 transition-all"
        aria-label="Mais opções"
      >
        <MoreHorizontal size={15} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
            onMouseLeave={() => setOpen(false)}
            className="absolute right-0 top-8 z-10 w-36 card glass p-1"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
                onRemove();
              }}
              className="w-full text-left text-[13px] px-2.5 py-1.5 rounded-md flex items-center gap-2 text-danger hover:bg-danger/10"
            >
              <Trash2 size={13} /> Excluir
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function groupForTimeline(events: EventItem[]) {
  const sorted = [...events].sort(compareEvents);
  // urgent + today first
  const today = sorted.filter((e) => eventIsToday(e));
  const upcoming = sorted.filter((e) => !eventIsToday(e));

  // sort today: urgent first, then by time
  today.sort((a, b) => {
    if (a.priority === "urgent" && b.priority !== "urgent") return -1;
    if (a.priority !== "urgent" && b.priority === "urgent") return 1;
    return compareEvents(a, b);
  });

  const map = new Map<string, EventItem[]>();
  for (const e of upcoming) {
    if (!map.has(e.date)) map.set(e.date, []);
    map.get(e.date)!.push(e);
  }
  const groups: {
    key: string;
    label: string;
    isToday: boolean;
    items: EventItem[];
  }[] = [];

  if (today.length > 0) {
    groups.push({
      key: "today",
      label: "HOJE",
      isToday: true,
      items: today,
    });
  }

  for (const [date, items] of map) {
    const d = toDateTime(items[0]);
    groups.push({
      key: date,
      label: fmtDayLabel(d),
      isToday: false,
      items,
    });
  }

  return groups;
}
