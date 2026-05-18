import { promises as fs } from "fs";
import path from "path";
import type { EventItem } from "@/types";

// DATA_DIR can be overridden via env var (e.g. a Railway persistent volume mounted at /data)
const DATA_DIR = process.env.DATA_DIR ?? path.join(process.cwd(), "data");
const EVENTS_FILE = path.join(DATA_DIR, "events.json");
const SETTINGS_FILE = path.join(DATA_DIR, "settings.json");
const NOTIF_FILE = path.join(DATA_DIR, "notifications.json");

export interface TelegramSettings {
  enabled: boolean;
  botToken: string;
  chatId: string;
  digestTime: string; // HH:mm
  reminderMinutes: number; // default 30
  notifyImportant: boolean;
  notifyUrgent: boolean;
}

export const defaultSettings: TelegramSettings = {
  enabled: false,
  botToken: "",
  chatId: "",
  digestTime: "08:00",
  reminderMinutes: 30,
  notifyImportant: true,
  notifyUrgent: true,
};

export interface NotificationLog {
  // key: `${eventId}:${type}:${dayIso?}`
  sent: Record<string, string>; // iso timestamp
  lastDigestDate?: string; // yyyy-mm-dd
}

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    await ensureDir();
    const raw = await fs.readFile(file, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson<T>(file: string, data: T): Promise<void> {
  await ensureDir();
  await fs.writeFile(file, JSON.stringify(data, null, 2), "utf8");
}

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function isoDay(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

// --- Events ---
export async function listEvents(): Promise<EventItem[]> {
  return readJson<EventItem[]>(EVENTS_FILE, []);
}

export async function saveEvents(events: EventItem[]) {
  await writeJson(EVENTS_FILE, events);
}

export async function createEvent(
  input: Omit<EventItem, "id" | "createdAt">
): Promise<EventItem> {
  const all = await listEvents();
  const ev: EventItem = {
    ...input,
    id: uid(),
    createdAt: new Date().toISOString(),
  };
  await saveEvents([ev, ...all]);
  return ev;
}

export async function updateEvent(
  id: string,
  patch: Partial<EventItem>
): Promise<EventItem | null> {
  const all = await listEvents();
  const idx = all.findIndex((e) => e.id === id);
  if (idx < 0) return null;
  const next = { ...all[idx], ...patch, id };
  all[idx] = next;
  await saveEvents(all);
  return next;
}

export async function deleteEvent(id: string) {
  const all = await listEvents();
  await saveEvents(all.filter((e) => e.id !== id));
}

// --- Settings ---
export async function getSettings(): Promise<TelegramSettings> {
  return readJson<TelegramSettings>(SETTINGS_FILE, defaultSettings);
}

export async function saveSettings(s: TelegramSettings) {
  await writeJson(SETTINGS_FILE, s);
}

// --- Notification log ---
export async function getNotifLog(): Promise<NotificationLog> {
  return readJson<NotificationLog>(NOTIF_FILE, { sent: {} });
}

export async function saveNotifLog(log: NotificationLog) {
  await writeJson(NOTIF_FILE, log);
}

export async function markSent(key: string) {
  const log = await getNotifLog();
  log.sent[key] = new Date().toISOString();
  await saveNotifLog(log);
}

export async function wasSent(key: string): Promise<boolean> {
  const log = await getNotifLog();
  return Boolean(log.sent[key]);
}

// --- Seed ---
function seed(): EventItem[] {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const inFive = new Date(today);
  inFive.setDate(today.getDate() + 5);

  return [
    {
      id: uid(),
      title: "Reunião com fornecedor",
      description: "Alinhamento de pedidos do mês",
      date: isoDay(today),
      time: "14:00",
      category: "work",
      priority: "important",
      location: "Google Meet",
      createdAt: new Date().toISOString(),
    },
    {
      id: uid(),
      title: "Envio Jadlog",
      date: isoDay(today),
      time: "17:00",
      category: "work",
      priority: "urgent",
      createdAt: new Date().toISOString(),
    },
    {
      id: uid(),
      title: "Renovar domínio",
      date: isoDay(tomorrow),
      category: "finance",
      priority: "important",
      createdAt: new Date().toISOString(),
    },
    {
      id: uid(),
      title: "🎉 Salão Diecast 7",
      description: "Evento anual de colecionadores",
      date: isoDay(inFive),
      time: "09:00",
      category: "events",
      priority: "important",
      location: "São Paulo Expo",
      createdAt: new Date().toISOString(),
    },
  ];
}
