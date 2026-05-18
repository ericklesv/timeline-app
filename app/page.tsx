"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarPlus } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Greeting } from "@/components/Greeting";
import { DaySummary } from "@/components/DaySummary";
import { NextEventCard } from "@/components/NextEventCard";
import { PriorityToday } from "@/components/PriorityToday";
import { Timeline } from "@/components/Timeline";
import { CalendarView } from "@/components/CalendarView";
import { EventModal } from "@/components/EventModal";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { useEvents } from "@/hooks/useEvents";
import { useNow } from "@/hooks/useNow";
import {
  compareEvents,
  eventIsToday,
  isOverdue,
  toDateTime,
} from "@/lib/date";
import type { EventItem, ViewMode } from "@/types";

export default function Page() {
  const { events, loading, create, update, remove, toggleDone } = useEvents();
  const now = useNow();

  const [view, setView] = useState<ViewMode>("timeline");
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<EventItem | null>(null);
  const [defaultDate, setDefaultDate] = useState<string | undefined>();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return events;
    return events.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.description?.toLowerCase().includes(q) ||
        e.location?.toLowerCase().includes(q)
    );
  }, [events, query]);

  const todayEvents = useMemo(
    () =>
      filtered.filter((e) => eventIsToday(e)).sort((a, b) => {
        if (a.priority === "urgent" && b.priority !== "urgent") return -1;
        if (a.priority !== "urgent" && b.priority === "urgent") return 1;
        return compareEvents(a, b);
      }),
    [filtered]
  );

  const upcomingNext = useMemo(() => {
    const future = filtered
      .filter((e) => !e.done && toDateTime(e).getTime() >= now.getTime())
      .sort(compareEvents);
    return future[0] ?? null;
  }, [filtered, now]);

  const pendingToday = todayEvents.filter((e) => !e.done).length;

  function openNew(date?: string) {
    setEditing(null);
    setDefaultDate(date);
    setModalOpen(true);
  }

  function openEdit(ev: EventItem) {
    setEditing(ev);
    setDefaultDate(undefined);
    setModalOpen(true);
  }

  async function handleSubmit(data: Omit<EventItem, "id" | "createdAt">) {
    if (editing) {
      await update(editing.id, data);
    } else {
      await create(data);
    }
  }

  return (
    <div className="flex">
      <Sidebar view={view} onChangeView={setView} />
      <div className="flex-1 min-w-0">
        <Header
          view={view}
          onChangeView={setView}
          onNew={() => openNew()}
          query={query}
          onQuery={setQuery}
        />
        <main className="px-4 sm:px-8 py-6 sm:py-10 max-w-[1100px] mx-auto space-y-8">
          <section className="space-y-5">
            <Greeting count={todayEvents.length} />
            <DaySummary total={todayEvents.length} pending={pendingToday} />
            <div className="grid lg:grid-cols-2 gap-4">
              <NextEventCard event={upcomingNext} />
              <PriorityToday items={todayEvents.filter((e) => !e.done)} />
            </div>
          </section>

          <AnimatePresence mode="wait">
            {view === "timeline" ? (
              <motion.section
                key="timeline"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <SectionTitle title="Timeline" subtitle="Próximos compromissos" />
                {loading ? (
                  <Skeleton />
                ) : filtered.length === 0 ? (
                  <EmptyState
                    title="Sua timeline está limpa"
                    description="Crie seu primeiro compromisso para começar a organizar seu dia."
                    icon={<CalendarPlus size={18} />}
                  />
                ) : (
                  <Timeline
                    events={filtered}
                    onToggleDone={toggleDone}
                    onRemove={remove}
                    onEdit={openEdit}
                  />
                )}
              </motion.section>
            ) : (
              <motion.section
                key="calendar"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <SectionTitle title="Calendário" subtitle="Visão mensal" />
                <CalendarView
                  events={filtered}
                  onSelectDay={(d) => {
                    const iso = `${d.getFullYear()}-${String(
                      d.getMonth() + 1
                    ).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
                    openNew(iso);
                  }}
                />
              </motion.section>
            )}
          </AnimatePresence>

          {/* Mobile FAB */}
          <button
            onClick={() => openNew()}
            className="sm:hidden fixed bottom-5 right-5 z-30 w-14 h-14 rounded-2xl bg-accent text-white shadow-glow active:scale-95 transition-transform flex items-center justify-center"
            aria-label="Novo compromisso"
          >
            <CalendarPlus size={20} />
          </button>
        </main>
      </div>

      <EventModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initial={editing}
        defaultDate={defaultDate}
        onSubmit={handleSubmit}
        onDelete={remove}
      />
    </div>
  );
}

function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-end justify-between">
      <div>
        <div className="text-[11px] uppercase tracking-[0.18em] text-text-dim">
          {subtitle}
        </div>
        <h2 className="text-base font-semibold tracking-tight">{title}</h2>
      </div>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-3">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-20 card animate-pulse"
          style={{ opacity: 0.6 - i * 0.15 }}
        />
      ))}
    </div>
  );
}
