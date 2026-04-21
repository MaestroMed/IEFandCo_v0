import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { destroySession, getSession, SESSION_COOKIE } from "@/lib/admin/auth";

export async function POST() {
  const s = await getSession();
  if (s) await destroySession(s.sessionId);
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  return NextResponse.json({ ok: true });
}
