import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { createSession, verifyPassword, SESSION_COOKIE, cookieOptions } from "@/lib/admin/auth";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { email?: string; password?: string };
    if (!body.email || !body.password) {
      return NextResponse.json({ ok: false, error: "Email et mot de passe requis" }, { status: 400 });
    }

    const rows = await db.select().from(schema.users).where(eq(schema.users.email, body.email.toLowerCase())).limit(1);
    const user = rows[0];
    if (!user) {
      return NextResponse.json({ ok: false, error: "Identifiants invalides" }, { status: 401 });
    }

    const ok = await verifyPassword(body.password, user.passwordHash);
    if (!ok) {
      return NextResponse.json({ ok: false, error: "Identifiants invalides" }, { status: 401 });
    }

    const sessionId = await createSession(user.id);
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, sessionId, cookieOptions());

    return NextResponse.json({ ok: true, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    console.error("[LOGIN ERROR]", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
