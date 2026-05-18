export interface TelegramSettingsDTO {
  enabled: boolean;
  botToken: string; // masked from server
  hasToken: boolean;
  chatId: string;
  digestTime: string;
  reminderMinutes: number;
  notifyImportant: boolean;
  notifyUrgent: boolean;
}

export const settingsService = {
  async get(): Promise<TelegramSettingsDTO> {
    const res = await fetch("/api/settings", { cache: "no-store" });
    const data = (await res.json()) as { settings: TelegramSettingsDTO };
    return data.settings;
  },
  async save(
    patch: Partial<TelegramSettingsDTO> & { botToken?: string }
  ): Promise<TelegramSettingsDTO> {
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(patch),
    });
    const data = (await res.json()) as { settings: TelegramSettingsDTO };
    return data.settings;
  },
  async test(): Promise<{ ok: boolean; error?: string }> {
    const res = await fetch("/api/telegram/test", { method: "POST" });
    return (await res.json()) as { ok: boolean; error?: string };
  },
};
