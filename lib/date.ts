import {
  format,
  isToday,
  isTomorrow,
  isYesterday,
  isPast,
  parseISO,
  differenceInCalendarDays,
  differenceInHours,
  differenceInMinutes,
  startOfDay,
  addDays,
  isSameDay,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import type { EventItem } from "@/types";

export function toDateTime(ev: EventItem): Date {
  const [y, m, d] = ev.date.split("-").map(Number);
  if (ev.time) {
    const [hh, mm] = ev.time.split(":").map(Number);
    return new Date(y, (m ?? 1) - 1, d ?? 1, hh ?? 0, mm ?? 0);
  }
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export function fmtDayLabel(date: Date) {
  if (isToday(date)) return "HOJE";
  if (isTomorrow(date)) return "AMANHÃ";
  if (isYesterday(date)) return "ONTEM";
  return format(date, "EEEE • dd MMM", { locale: ptBR }).toUpperCase();
}

export function fmtLongDate(date: Date) {
  return format(date, "EEEE • dd MMMM", { locale: ptBR }).toUpperCase();
}

export function fmtTime(time?: string) {
  if (!time) return "Dia inteiro";
  return time;
}

export function greetingFor(date = new Date()) {
  const h = date.getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

export function isOverdue(ev: EventItem, now = new Date()) {
  if (ev.done) return false;
  const dt = toDateTime(ev);
  if (ev.time) return dt.getTime() < now.getTime();
  return isPast(dt) && !isToday(dt);
}

export function eventIsToday(ev: EventItem) {
  return isToday(toDateTime(ev));
}

export function isBeforeToday(ev: EventItem) {
  const d = toDateTime(ev);
  return startOfDay(d) < startOfDay(new Date());
}

export function compareEvents(a: EventItem, b: EventItem) {
  return toDateTime(a).getTime() - toDateTime(b).getTime();
}

export function countdown(target: Date, now = new Date()) {
  const days = differenceInCalendarDays(target, now);
  if (days > 1) return `Faltam ${days} dias`;
  if (days === 1) return `Falta 1 dia`;
  if (days === 0) {
    const hrs = differenceInHours(target, now);
    if (hrs > 1) return `Faltam ${hrs} horas`;
    if (hrs === 1) return `Falta 1 hora`;
    const mins = differenceInMinutes(target, now);
    if (mins > 1) return `Faltam ${mins} min`;
    if (mins >= 0) return `Agora`;
  }
  if (days < 0) return `Há ${Math.abs(days)} dia${Math.abs(days) > 1 ? "s" : ""}`;
  return "";
}

export function groupByDay(events: EventItem[]) {
  const sorted = [...events].sort(compareEvents);
  const map = new Map<string, EventItem[]>();
  for (const ev of sorted) {
    const key = ev.date;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(ev);
  }
  return Array.from(map.entries()).map(([date, items]) => {
    const [y, m, d] = date.split("-").map(Number);
    return { date, dateObj: new Date(y, (m ?? 1) - 1, d ?? 1), items };
  });
}

export { format, parseISO, isToday, isTomorrow, isSameDay, addDays, startOfDay };
