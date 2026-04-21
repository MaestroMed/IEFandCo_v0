import { NextResponse } from "next/server";
import { getSession } from "@/lib/admin/auth";
import { getNotifications, markAllRead } from "@/lib/admin/notifications";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await getNotifications(session.user.id);
  return NextResponse.json({
    items: data.items.map((it) => ({ ...it, at: it.at.toISOString() })),
    unread: data.unread,
    lastSeen: data.lastSeen ? data.lastSeen.toISOString() : null,
  });
}

export async function POST() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await markAllRead(session.user.id);
  return NextResponse.json({ ok: true });
}
