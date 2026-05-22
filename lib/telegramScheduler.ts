import {
  getNotifLog,
  getSettings,
  listEvents,
  saveNotifLog,
} from "@/lib/serverStore";
import {
  buildDailyDigest,
  buildImportantAlert,
  buildReminder,
  sendTelegram,
} from "@/lib/telegram";
import type { EventItem } from "@/types";

const TIMEZONE = "America/Sao_Paulo";

function getTZParts(d: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  // Some Node.js/V8 versions return "24" for midnight with hour12: false
  const rawHour = get("hour");
  const hour = rawHour === "24" ? "00" : rawHour;
  return {
    year: get("year"),
    month: get("month"),
    day: get("day"),
    hour,
    minute: get("minute"),
  };
}

function isoDay(d: Date) {
  const p = getTZParts(d);
  return `${p.year}-${p.month}-${p.day}`;
}

function toDateTime(ev: EventItem): Date {
  if (ev.time) {
    // Interpret event date+time in Brazil's timezone (UTC-3, no DST since 2019)
    return new Date(`${ev.date}T${ev.time}:00-03:00`);
  }
  return new Date(`${ev.date}T00:00:00-03:00`);
}

function hhmm(d: Date) {
  const p = getTZParts(d);
  return `${p.hour}:${p.minute}`;
}

function addMinutesHHMM(hhmmStr: string, mins: number) {
  const [h, m] = hhmmStr.split(":").map(Number);
  const total = (h ?? 0) * 60 + (m ?? 0) + mins;
  const nh = Math.floor((total / 60) % 24);
  const nm = total % 60;
  return `${String(nh).padStart(2, "0")}:${String(nm).padStart(2, "0")}`;
}

export interface RunResult {
  digestSent?: boolean;
  remindersSent: string[];
  alertsSent: string[];
  skipped?: string;
}

export async function runTick(now = new Date()): Promise<RunResult> {
  const settings = await getSettings();
  if (!settings.enabled || !settings.botToken || !settings.chatId) {
    return {
      remindersSent: [],
      alertsSent: [],
      skipped: "disabled_or_missing_credentials",
    };
  }

  const events = await listEvents();
  const log = await getNotifLog();
  const today = isoDay(now);
  const result: RunResult = { remindersSent: [], alertsSent: [] };

  const todayEvents = events.filter((e) => e.date === today && !e.done);

  // 1) DAILY DIGEST — once per day, within 60-min tolerance window after digestTime
  const nowHHMM = hhmm(now);
  if (
    log.lastDigestDate !== today &&
    nowHHMM >= settings.digestTime &&
    nowHHMM <= addMinutesHHMM(settings.digestTime, 60)
  ) {
    const text = buildDailyDigest(todayEvents, now);
    const r = await sendTelegram(settings.botToken, settings.chatId, text);
    if (r.ok) {
      log.lastDigestDate = today;
      log.sent[`digest:${today}`] = new Date().toISOString();
      result.digestSent = true;
    }
  }

  // 2) IMPORTANT / URGENT alerts — once per event per day, after digest time
  if (nowHHMM >= settings.digestTime) {
    for (const ev of todayEvents) {
      if (ev.priority === "urgent" && settings.notifyUrgent) {
        const key = `urgent:${ev.id}:${today}`;
        if (!log.sent[key]) {
          const r = await sendTelegram(
            settings.botToken,
            settings.chatId,
            buildImportantAlert(ev)
          );
          if (r.ok) {
            log.sent[key] = new Date().toISOString();
            result.alertsSent.push(ev.id);
          }
        }
      } else if (ev.priority === "important" && settings.notifyImportant) {
        const key = `important:${ev.id}:${today}`;
        if (!log.sent[key]) {
          const r = await sendTelegram(
            settings.botToken,
            settings.chatId,
            buildImportantAlert(ev)
          );
          if (r.ok) {
            log.sent[key] = new Date().toISOString();
            result.alertsSent.push(ev.id);
          }
        }
      }
    }
  }

  // 3) Reminders (configurable minutes-before)
  for (const ev of todayEvents) {
    if (!ev.time) continue;
    const evDate = toDateTime(ev);
    const diffMs = evDate.getTime() - now.getTime();
    const diffMin = Math.round(diffMs / 60000);
    if (diffMin > 0 && diffMin <= settings.reminderMinutes) {
      const key = `reminder:${ev.id}:${today}`;
      if (!log.sent[key]) {
        const r = await sendTelegram(
          settings.botToken,
          settings.chatId,
          buildReminder(ev, diffMin)
        );
        if (r.ok) {
          log.sent[key] = new Date().toISOString();
          result.remindersSent.push(ev.id);
        }
      }
    }
  }

  await saveNotifLog(log);
  return result;
}
