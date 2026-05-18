import type { EventItem } from "@/types";
import { CATEGORIES } from "@/lib/categories";

const TG_API = "https://api.telegram.org";

export interface TelegramSendResult {
  ok: boolean;
  status?: number;
  error?: string;
  description?: string;
}

export async function sendTelegram(
  botToken: string,
  chatId: string,
  text: string
): Promise<TelegramSendResult> {
  if (!botToken || !chatId) {
    return { ok: false, error: "missing_credentials" };
  }
  try {
    const res = await fetch(`${TG_API}/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });
    const data = (await res.json().catch(() => ({}))) as {
      ok?: boolean;
      description?: string;
    };
    if (!res.ok || data?.ok === false) {
      return {
        ok: false,
        status: res.status,
        description: data?.description ?? "request_failed",
      };
    }
    return { ok: true, status: res.status };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "unknown" };
  }
}

// ----- Templates -----

function categoryLabel(id: string) {
  return CATEGORIES.find((c) => c.id === id)?.label ?? "Outros";
}

function emojiFor(ev: EventItem) {
  if (ev.priority === "urgent") return "🚨";
  switch (ev.category) {
    case "work":
      return "💼";
    case "personal":
      return "🧘";
    case "finance":
      return "💰";
    case "events":
      return "🎉";
    case "studies":
      return "📚";
    default:
      return "📌";
  }
}

function fmtTime(time?: string) {
  return time ?? "Dia inteiro";
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function buildDailyDigest(events: EventItem[], now = new Date()): string {
  const sorted = [...events].sort((a, b) => {
    const at = a.time ?? "99:99";
    const bt = b.time ?? "99:99";
    return at.localeCompare(bt);
  });
  const dateLabel = now.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });

  if (sorted.length === 0) {
    return [
      "📅 <b>DEMANDAS DE HOJE</b>",
      `<i>${escapeHtml(dateLabel)}</i>`,
      "",
      "Você não tem compromissos hoje. Aproveite o dia. ✨",
    ].join("\n");
  }

  const lines = sorted.map((ev) => {
    const time = fmtTime(ev.time);
    const ico = emojiFor(ev);
    const title = escapeHtml(ev.title);
    const tag =
      ev.priority === "urgent"
        ? "  <b>[URGENTE]</b>"
        : ev.priority === "important"
        ? "  <i>[importante]</i>"
        : "";
    return `${ico} <b>${time}</b> — ${title}${tag}`;
  });

  return [
    "📅 <b>DEMANDAS DE HOJE</b>",
    `<i>${escapeHtml(dateLabel)}</i>`,
    "",
    ...lines,
    "",
    `Total de compromissos hoje: <b>${sorted.length}</b>`,
  ].join("\n");
}

export function buildReminder(ev: EventItem, minutesUntil: number): string {
  const ico = emojiFor(ev);
  const cat = categoryLabel(ev.category);
  const lines = [
    "⏰ <b>LEMBRETE</b>",
    "",
    `Sua tarefa começa em <b>${minutesUntil} minutos</b>.`,
    "",
    `${ico} <b>${escapeHtml(ev.title)}</b>`,
    `🕑 ${fmtTime(ev.time)}`,
    `🏷 ${escapeHtml(cat)}`,
  ];
  if (ev.location) lines.push(`📍 ${escapeHtml(ev.location)}`);
  if (ev.description) lines.push("", `<i>${escapeHtml(ev.description)}</i>`);
  return lines.join("\n");
}

export function buildImportantAlert(ev: EventItem): string {
  const isUrgent = ev.priority === "urgent";
  const head = isUrgent ? "🚨 <b>EVENTO URGENTE</b>" : "⭐ <b>EVENTO IMPORTANTE</b>";
  const lines = [
    head,
    "",
    `<b>${escapeHtml(ev.title)}</b>`,
    `🕑 ${fmtTime(ev.time)}`,
    `🏷 ${escapeHtml(categoryLabel(ev.category))}`,
  ];
  if (ev.location) lines.push(`📍 ${escapeHtml(ev.location)}`);
  if (ev.description) lines.push("", `<i>${escapeHtml(ev.description)}</i>`);
  return lines.join("\n");
}

export function buildTestMessage(): string {
  return [
    "✅ <b>Telegram conectado</b>",
    "",
    "Sua conta foi vinculada ao Timeline com sucesso.",
    "Você receberá:",
    "• Resumo diário de compromissos",
    "• Lembretes 30 min antes",
    "• Alertas de eventos importantes",
  ].join("\n");
}
