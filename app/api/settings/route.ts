import { NextResponse } from "next/server";
import { defaultSettings, getSettings, saveSettings, TelegramSettings } from "@/lib/serverStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function redact(s: TelegramSettings) {
  return {
    ...s,
    botToken: s.botToken ? `${s.botToken.slice(0, 6)}…${s.botToken.slice(-4)}` : "",
    hasToken: Boolean(s.botToken),
  };
}

export async function GET() {
  const s = await getSettings();
  return NextResponse.json({ settings: redact(s) });
}

export async function PUT(req: Request) {
  const body = (await req.json()) as Partial<TelegramSettings> & {
    botToken?: string;
  };
  const current = await getSettings();
  const next: TelegramSettings = {
    ...defaultSettings,
    ...current,
    ...body,
    // only overwrite token if explicitly provided non-empty
    botToken:
      typeof body.botToken === "string" && body.botToken.trim() !== ""
        ? body.botToken.trim()
        : current.botToken,
  };
  await saveSettings(next);
  return NextResponse.json({ settings: redact(next) });
}
