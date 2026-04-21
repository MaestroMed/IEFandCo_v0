/**
 * Global admin search endpoint.
 *
 * Powers the command palette "Recherche contenu" group. Returns up to 5 results
 * per category (leads, projects, blog, services, team) for the given `q`.
 */

import { NextResponse } from "next/server";
import { db, schema } from "@/db";
import { getSession } from "@/lib/admin/auth";
import { or, like, sql, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

interface SearchResult {
  type: "lead" | "project" | "blog" | "service" | "team";
  id: string;
  title: string;
  subtitle?: string;
  url: string;
}

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const qRaw = (url.searchParams.get("q") || "").trim();
  if (qRaw.length < 2) return NextResponse.json({ results: [] });

  const q = `%${qRaw.toLowerCase()}%`;
  const results: SearchResult[] = [];

  try {
    // Leads
    const leads = await db
      .select()
      .from(schema.leads)
      .where(
        or(
          like(sql`lower(${schema.leads.firstName})`, q),
          like(sql`lower(${schema.leads.lastName})`, q),
          like(sql`lower(${schema.leads.email})`, q),
          like(sql`lower(${schema.leads.company})`, q),
          like(sql`lower(${schema.leads.message})`, q),
        ),
      )
      .orderBy(desc(schema.leads.receivedAt))
      .limit(5);
    for (const l of leads) {
      results.push({
        type: "lead",
        id: l.id,
        title: `${l.firstName} ${l.lastName}`,
        subtitle: `${l.company || l.email} · ${l.type}`,
        url: `/admin/leads/${l.id}`,
      });
    }

    // Projects
    const projects = await db
      .select()
      .from(schema.projects)
      .where(
        or(
          like(sql`lower(${schema.projects.title})`, q),
          like(sql`lower(${schema.projects.clientName})`, q),
          like(sql`lower(${schema.projects.location})`, q),
        ),
      )
      .limit(5);
    for (const p of projects) {
      results.push({
        type: "project",
        id: p.id,
        title: p.title,
        subtitle: [p.clientName, p.location].filter(Boolean).join(" · ") || p.category,
        url: `/admin/projects/${p.id}`,
      });
    }

    // Blog posts
    const posts = await db
      .select()
      .from(schema.blogPosts)
      .where(
        or(
          like(sql`lower(${schema.blogPosts.title})`, q),
          like(sql`lower(${schema.blogPosts.excerpt})`, q),
        ),
      )
      .limit(5);
    for (const b of posts) {
      results.push({
        type: "blog",
        id: b.id,
        title: b.title,
        subtitle: `${b.category} · ${b.status}`,
        url: `/admin/blog/${b.id}`,
      });
    }

    // Services
    const services = await db
      .select()
      .from(schema.services)
      .where(
        or(
          like(sql`lower(${schema.services.title})`, q),
          like(sql`lower(${schema.services.shortTitle})`, q),
        ),
      )
      .limit(5);
    for (const s of services) {
      results.push({
        type: "service",
        id: s.id,
        title: s.title,
        subtitle: s.shortTitle,
        url: `/admin/services/${s.id}`,
      });
    }

    // Team
    const team = await db
      .select()
      .from(schema.teamMembers)
      .where(
        or(
          like(sql`lower(${schema.teamMembers.name})`, q),
          like(sql`lower(${schema.teamMembers.role})`, q),
        ),
      )
      .limit(5);
    for (const t of team) {
      results.push({
        type: "team",
        id: t.id,
        title: t.name,
        subtitle: t.role,
        url: `/admin/team/${t.id}`,
      });
    }

    return NextResponse.json({ results });
  } catch (e) {
    console.error("[admin search]", e);
    return NextResponse.json({ results: [], error: (e as Error).message }, { status: 500 });
  }
}
