"use client";

import { useCallback, useEffect, useState } from "react";
import type { EventItem } from "@/types";
import { eventsService } from "@/services/events";

export function useEvents() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const data = await eventsService.list();
    setEvents(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = useCallback(
    async (input: Omit<EventItem, "id" | "createdAt">) => {
      await eventsService.create(input);
      await refresh();
    },
    [refresh]
  );

  const update = useCallback(
    async (id: string, patch: Partial<EventItem>) => {
      await eventsService.update(id, patch);
      await refresh();
    },
    [refresh]
  );

  const remove = useCallback(
    async (id: string) => {
      await eventsService.remove(id);
      await refresh();
    },
    [refresh]
  );

  const toggleDone = useCallback(
    async (id: string) => {
      await eventsService.toggleDone(id);
      await refresh();
    },
    [refresh]
  );

  return { events, loading, refresh, create, update, remove, toggleDone };
}
