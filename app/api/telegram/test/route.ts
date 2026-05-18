import { NextResponse } from "next/server";
import { getSettings } from "@/lib/serverStore";
import { buildTestMessage, sendTelegram } from "@/lib/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const s = await getSettings();
  if (!s.botToken || !s.chatId) {
    return NextResponse.json(
      { ok: false, error: "missing_credentials" },
      { status: 400 }
    );
  }
  const result = await sendTelegram(s.botToken, s.chatId, buildTestMessage());
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.description ?? result.error ?? "send_failed" },
      { status: 500 }
    );
  }
  return NextResponse.json({ ok: true });
}
