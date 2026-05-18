import type { EventItem } from "@/types";

async function jsonFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`request_failed_${res.status}`);
  }
  return (await res.json()) as T;
}

export const eventsService = {
  async list(): Promise<EventItem[]> {
    try {
      const data = await jsonFetch<{ events: EventItem[] }>("/api/events");
      return data.events ?? [];
    } catch {
      return [];
    }
  },
  async create(input: Omit<EventItem, "id" | "createdAt">): Promise<EventItem> {
    const data = await jsonFetch<{ event: EventItem }>("/api/events", {
      method: "POST",
      body: JSON.stringify(input),
    });
    return data.event;
  },
  async update(
    id: string,
    patch: Partial<EventItem>
  ): Promise<EventItem | null> {
    try {
      const data = await jsonFetch<{ event: EventItem }>(`/api/events/${id}`, {
        method: "PATCH",
        body: JSON.stringify(patch),
      });
      return data.event;
    } catch {
      return null;
    }
  },
  async remove(id: string): Promise<void> {
    await jsonFetch<{ ok: true }>(`/api/events/${id}`, { method: "DELETE" });
  },
  async toggleDone(id: string): Promise<EventItem | null> {
    const list = await this.list();
    const cur = list.find((e) => e.id === id);
    if (!cur) return null;
    return this.update(id, { done: !cur.done });
  },
};

// NOTE: backed by server JSON store via /api/events. Same interface ready for Supabase.
