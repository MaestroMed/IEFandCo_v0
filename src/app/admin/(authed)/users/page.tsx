import { Topbar } from "@/components/admin/Topbar";
import Link from "next/link";
import { Plus, UserCog, Users as UsersIcon } from "lucide-react";
import { EmptyState } from "@/components/admin/EmptyState";
import { getUsers, getActiveSessionsCountByUser } from "./queries";
import { getSession } from "@/lib/admin/auth";
import { canManageTeam } from "@/lib/admin/auth";
import { redirect } from "next/navigation";
import { UsersTable } from "./UsersTable";
import { USER_ROLE_LABELS } from "./constants";

export const dynamic = "force-dynamic";

export default async function UsersListPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  if (!canManageTeam(session.user)) redirect("/admin");

  const [users, sessionsByUser] = await Promise.all([getUsers(), getActiveSessionsCountByUser()]);

  return (
    <>
      <Topbar
        title="Utilisateurs"
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Utilisateurs" },
        ]}
      />

      <div className="p-8 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="rounded-xl p-4 max-w-2xl" style={{ background: "color-mix(in oklab, var(--color-copper) 8%, var(--card-bg))", border: "1px solid color-mix(in oklab, var(--color-copper) 30%, transparent)" }}>
            <div className="flex items-start gap-3">
              <UserCog className="h-5 w-5 mt-0.5" style={{ color: "var(--color-copper)" }} />
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>Gestion d&apos;equipe</p>
                <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                  La gestion complete des utilisateurs (creation, suppression, reinitialisation de mot de passe) necessite un role <strong>owner</strong> ou <strong>admin</strong>.
                </p>
              </div>
            </div>
          </div>
          <Link
            href="/admin/users/new"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90 shrink-0"
          >
            <Plus className="h-4 w-4" />
            Inviter un utilisateur
          </Link>
        </div>

        {users.length === 0 ? (
          <EmptyState
            icon={UsersIcon}
            title="Aucun utilisateur"
            description="Invitez le premier membre de votre equipe."
            actionLabel="Inviter un utilisateur"
            actionHref="/admin/users/new"
          />
        ) : (
          <UsersTable
            currentUserId={session.user.id}
            users={users.map((u) => ({
              id: u.id,
              name: u.name,
              email: u.email,
              role: u.role,
              roleLabel: USER_ROLE_LABELS[u.role as keyof typeof USER_ROLE_LABELS] || u.role,
              lastSeenAt: u.lastSeenAt ? u.lastSeenAt.getTime() : null,
              createdAt: u.createdAt.getTime(),
              activeSessions: sessionsByUser[u.id] || 0,
            }))}
          />
        )}
      </div>
    </>
  );
}
