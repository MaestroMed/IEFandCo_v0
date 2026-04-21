import { NextResponse } from "next/server";
import { db, schema } from "@/db";
import { getSession } from "@/lib/admin/auth";
import { desc, like, sql, or, eq, and } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const q = (url.searchParams.get("q") || "").trim().toLowerCase();
  const mimeFilter = url.searchParams.get("mime") || "";
  const idOnly = url.searchParams.get("id") || "";

  // Single id lookup (used to hydrate the current value)
  if (idOnly) {
    const row = (await db.select().from(schema.media).where(eq(schema.media.id, idOnly)).limit(1))[0];
    if (!row) return NextResponse.json({ items: [] });
    return NextResponse.json({
      items: [
        {
          id: row.id,
          filename: row.filename,
          url: row.url,
          mime: row.mime,
          alt: row.alt,
          bytes: row.bytes,
          width: row.width,
          height: row.height,
        },
      ],
    });
  }

  const filters = [];
  if (q) {
    const like1 = `%${q}%`;
    filters.push(
      or(
        like(sql`lower(${schema.media.filename})`, like1),
        like(sql`lower(${schema.media.alt})`, like1),
      ),
    );
  }
  if (mimeFilter) {
    filters.push(like(schema.media.mime, `${mimeFilter}%`));
  }

  const rows = await db
    .select()
    .from(schema.media)
    .where(filters.length > 0 ? and(...filters) : undefined)
    .orderBy(desc(schema.media.uploadedAt))
    .limit(120);

  return NextResponse.json({
    items: rows.map((r) => ({
      id: r.id,
      filename: r.filename,
      url: r.url,
      mime: r.mime,
      alt: r.alt,
      bytes: r.bytes,
      width: r.width,
      height: r.height,
    })),
  });
}
