import { Topbar } from "@/components/admin/Topbar";
import { TeamForm } from "../TeamForm";

export default function NewTeamMemberPage() {
  return (
    <>
      <Topbar
        title="Nouveau membre"
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Equipe", href: "/admin/team" },
          { label: "Nouveau" },
        ]}
      />
      <div className="p-8">
        <TeamForm />
      </div>
    </>
  );
}
