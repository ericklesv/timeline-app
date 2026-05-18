"use client";

import Link from "next/link";
import { CalendarDays, LayoutList, Send, Settings, Sparkles, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/lib/categories";

interface SidebarProps {
  view: "timeline" | "calendar";
  onChangeView: (v: "timeline" | "calendar") => void;
}

export function Sidebar({ view, onChangeView }: SidebarProps) {
  return (
    <aside className="hidden lg:flex flex-col w-[240px] shrink-0 h-screen sticky top-0 px-5 py-6 border-r border-line/70 bg-bg-soft/60 backdrop-blur-sm">
      <div className="flex items-center gap-2.5 mb-9">
        <div className="w-8 h-8 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center">
          <Sparkles size={16} className="text-accent" />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold tracking-tight">Timeline</div>
          <div className="text-[10px] uppercase tracking-wider text-text-mute">
            sua agenda
          </div>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        <SideItem
          active={view === "timeline"}
          onClick={() => onChangeView("timeline")}
          icon={<LayoutList size={16} />}
          label="Timeline"
        />
        <SideItem
          active={view === "calendar"}
          onClick={() => onChangeView("calendar")}
          icon={<CalendarDays size={16} />}
          label="Calendário"
        />
      </nav>

      <div className="mt-8">
        <div className="text-[10px] uppercase tracking-wider text-text-mute px-2 mb-2 flex items-center gap-1.5">
          <Tag size={11} /> Categorias
        </div>
        <div className="flex flex-col">
          {CATEGORIES.map((c) => (
            <div
              key={c.id}
              className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-[13px] text-text-dim hover:text-text hover:bg-white/[0.03] transition-colors cursor-default"
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: c.color }}
              />
              {c.label}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto pt-6">
        <Link
          href="/settings"
          className="w-full inline-flex items-center gap-2.5 px-2 py-2 rounded-lg text-[13px] text-text-dim hover:text-text hover:bg-white/[0.03] transition-colors"
        >
          <Send size={14} className="text-accent" /> Telegram
        </Link>
        <Link
          href="/settings"
          className="w-full inline-flex items-center gap-2.5 px-2 py-2 rounded-lg text-[13px] text-text-dim hover:text-text hover:bg-white/[0.03] transition-colors"
        >
          <Settings size={15} /> Configurações
        </Link>
        <div className="text-[10px] text-text-mute px-2 mt-2">
          v0.2 • bot ativo
        </div>
      </div>
    </aside>
  );
}

function SideItem({
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
        "group flex items-center gap-2.5 px-3 h-9 rounded-xl text-[13px] font-medium transition-all",
        active
          ? "bg-accent/12 text-text border border-accent/25 shadow-[inset_0_0_0_1px_rgba(108,99,255,0.05)]"
          : "text-text-dim hover:text-text hover:bg-white/[0.03] border border-transparent"
      )}
    >
      <span className={cn(active ? "text-accent" : "text-text-dim")}>{icon}</span>
      {label}
    </button>
  );
}
