import { Topbar } from "@/components/admin/Topbar";
import { GlossaryForm } from "../GlossaryForm";

export default function NewGlossaryPage() {
  return (
    <>
      <Topbar
        title="Nouveau terme"
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Glossaire", href: "/admin/content/glossary" },
          { label: "Nouveau" },
        ]}
      />
      <div className="p-8">
        <GlossaryForm />
      </div>
    </>
  );
}
