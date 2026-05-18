import { NextResponse } from "next/server";
import { deleteEvent, updateEvent } from "@/lib/serverStore";
import type { EventItem } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const patch = (await req.json()) as Partial<EventItem>;
  const updated = await updateEvent(params.id, patch);
  if (!updated) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  return NextResponse.json({ event: updated });
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  await deleteEvent(params.id);
  return NextResponse.json({ ok: true });
}
