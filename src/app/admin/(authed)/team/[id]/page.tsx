import { Topbar } from "@/components/admin/Topbar";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { TeamForm } from "../TeamForm";

export default async function EditTeamMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rows = await db.select().from(schema.teamMembers).where(eq(schema.teamMembers.id, id)).limit(1);
  if (rows.length === 0) notFound();
  const member = rows[0];

  return (
    <>
      <Topbar
        title={member.name}
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Equipe", href: "/admin/team" },
          { label: member.name },
        ]}
      />
      <div className="p-8">
        <TeamForm
          memberId={member.id}
          initial={{
            name: member.name,
            role: member.role,
            expertise: member.expertise,
            initials: member.initials,
            orderIdx: String(member.orderIdx),
            visible: member.visible,
            photoMediaId: member.photoMediaId || "",
          }}
        />
      </div>
    </>
  );
}
