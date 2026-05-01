import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { createSession, verifyPassword, SESSION_COOKIE, cookieOptions } from "@/lib/admin/auth";
import { rateLimit, checkOrigin } from "@/lib/rate-limit";
import { logAudit } from "@/lib/admin/audit";
import { logger } from "@/lib/logger";

export async function POST(req: Request) {
  // Origin check defends against CSRF on login
  if (!checkOrigin(req)) {
    return NextResponse.json({ ok: false, error: "Origine non autorisée" }, { status: 403 });
  }
  // Rate limit by IP : 5 attempts / minute. Slows down credential stuffing.
  const rl = await rateLimit(req, "admin-login", { max: 5, windowSec: 60 });
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, error: "Trop de tentatives. Réessaie dans une minute." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter || 60) } },
    );
  }

  try {
    const body = (await req.json()) as { email?: string; password?: string };
    if (!body.email || !body.password) {
      return NextResponse.json({ ok: false, error: "Email et mot de passe requis" }, { status: 400 });
    }

    const rows = await db.select().from(schema.users).where(eq(schema.users.email, body.email.toLowerCase())).limit(1);
    const user = rows[0];
    if (!user) {
      // Trace failed attempt by email (no userId yet) for forensics
      void logAudit({ userId: null, entity: "auth", action: "login.failure", diff: { email: body.email.toLowerCase(), reason: "user_not_found" } });
      return NextResponse.json({ ok: false, error: "Identifiants invalides" }, { status: 401 });
    }

    const ok = await verifyPassword(body.password, user.passwordHash);
    if (!ok) {
      void logAudit({ userId: user.id, entity: "auth", action: "login.failure", diff: { reason: "wrong_password" } });
      return NextResponse.json({ ok: false, error: "Identifiants invalides" }, { status: 401 });
    }

    const sessionId = await createSession(user.id);
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, sessionId, cookieOptions());

    void logAudit({ userId: user.id, entity: "auth", entityId: user.id, action: "login.success" });

    return NextResponse.json({ ok: true, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    logger.error("admin.login.exception", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
