import { Topbar } from "@/components/admin/Topbar";
import { redirect } from "next/navigation";
import { canManageTeam, getSession } from "@/lib/admin/auth";
import { generateTempPassword } from "../password";
import { InviteUserForm } from "./InviteUserForm";

export const dynamic = "force-dynamic";

export default async function InviteUserPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  if (!canManageTeam(session.user)) redirect("/admin");

  const suggested = generateTempPassword();

  return (
    <>
      <Topbar
        title="Inviter un utilisateur"
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Utilisateurs", href: "/admin/users" },
          { label: "Nouveau" },
        ]}
      />
      <div className="p-8">
        <InviteUserForm suggestedPassword={suggested} />
      </div>
    </>
  );
}
