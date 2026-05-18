import { NextResponse } from "next/server";
import { createEvent, listEvents } from "@/lib/serverStore";
import type { EventItem } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const events = await listEvents();
  return NextResponse.json({ events });
}

export async function POST(req: Request) {
  const body = (await req.json()) as Omit<EventItem, "id" | "createdAt">;
  if (!body?.title || !body?.date || !body?.category || !body?.priority) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }
  const created = await createEvent(body);
  return NextResponse.json({ event: created }, { status: 201 });
}
