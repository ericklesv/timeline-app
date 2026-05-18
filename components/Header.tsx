"use client";

import { Plus, Search, CalendarDays, LayoutList } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface HeaderProps {
  view: "timeline" | "calendar";
  onChangeView: (v: "timeline" | "calendar") => void;
  onNew: () => void;
  query: string;
  onQuery: (q: string) => void;
}

export function Header({ view, onChangeView, onNew, query, onQuery }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 px-5 sm:px-8 py-4 flex items-center gap-3 border-b border-line/60 glass">
      <div className="hidden md:flex items-center gap-2 flex-1 max-w-md">
        <div className="relative flex-1">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-mute"
          />
          <input
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Buscar compromisso…"
            className="w-full h-9 pl-9 pr-3 rounded-lg bg-bg-elev/60 border border-line text-sm placeholder:text-text-mute focus-ring focus:border-accent/60"
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-1 p-1 rounded-xl bg-bg-elev/60 border border-line">
        <ToggleBtn
          active={view === "timeline"}
          onClick={() => onChangeView("timeline")}
          icon={<LayoutList size={14} />}
          label="Timeline"
        />
        <ToggleBtn
          active={view === "calendar"}
          onClick={() => onChangeView("calendar")}
          icon={<CalendarDays size={14} />}
          label="Calendário"
        />
      </div>

      <Button onClick={onNew} className="hidden sm:inline-flex">
        <Plus size={15} /> Novo
      </Button>
      <Button onClick={onNew} size="sm" className="sm:hidden">
        <Plus size={14} />
      </Button>
    </header>
  );
}

function ToggleBtn({
  active,
  onClick,
  icon,
  label,
}: {
  active?: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 h-7 px-2.5 rounded-lg text-xs font-medium transition-all",
        active
          ? "bg-bg-elev text-text shadow-[0_1px_0_rgba(255,255,255,0.04)_inset,0_1px_2px_rgba(0,0,0,0.4)]"
          : "text-text-dim hover:text-text"
      )}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
