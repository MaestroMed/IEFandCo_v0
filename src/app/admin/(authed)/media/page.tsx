import { Topbar } from "@/components/admin/Topbar";
import { db, schema } from "@/db";
import { desc } from "drizzle-orm";
import { MediaGrid } from "./MediaGrid";

export const dynamic = "force-dynamic";

export default async function MediaPage() {
  const rows = await db.select().from(schema.media).orderBy(desc(schema.media.uploadedAt));

  return (
    <>
      <Topbar title="Mediatheque" breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Medias" }]} />

      <div className="p-8">
        <MediaGrid rows={rows} />
      </div>
    </>
  );
}
