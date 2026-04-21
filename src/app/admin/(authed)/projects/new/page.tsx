import { Topbar } from "@/components/admin/Topbar";
import { ProjectForm } from "../ProjectForm";

export default function NewProjectPage() {
  return (
    <>
      <Topbar
        title="Nouveau projet"
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Realisations", href: "/admin/projects" },
          { label: "Nouveau" },
        ]}
      />
      <div className="p-8">
        <ProjectForm />
      </div>
    </>
  );
}
