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

function isoDay(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

function toDateTime(ev: EventItem): Date {
  const [y, m, d] = ev.date.split("-").map(Number);
  if (ev.time) {
    const [hh, mm] = ev.time.split(":").map(Number);
    return new Date(y, (m ?? 1) - 1, d ?? 1, hh ?? 0, mm ?? 0);
  }
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

function hhmm(d: Date) {
  return `${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes()
  ).padStart(2, "0")}`;
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
