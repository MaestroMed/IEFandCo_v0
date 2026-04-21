import { Topbar } from "@/components/admin/Topbar";
import { notFound, redirect } from "next/navigation";
import { canManageTeam, getSession } from "@/lib/admin/auth";
import { getUserById, getUserSessions } from "../queries";
import { UserDetail } from "./UserDetail";

export const dynamic = "force-dynamic";

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  if (!canManageTeam(session.user)) redirect("/admin");

  const { id } = await params;
  const user = await getUserById(id);
  if (!user) notFound();
  const sessions = await getUserSessions(id);

  return (
    <>
      <Topbar
        title={user.name}
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Utilisateurs", href: "/admin/users" },
          { label: user.name },
        ]}
      />
      <div className="p-8">
        <UserDetail
          currentUserId={session.user.id}
          user={{
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt.getTime(),
            lastSeenAt: user.lastSeenAt ? user.lastSeenAt.getTime() : null,
          }}
          sessions={sessions.map((s) => ({
            id: s.id,
            createdAt: s.createdAt.getTime(),
            expiresAt: s.expiresAt.getTime(),
          }))}
        />
      </div>
    </>
  );
}
