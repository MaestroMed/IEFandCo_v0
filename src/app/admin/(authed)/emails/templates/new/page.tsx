import { Topbar } from "@/components/admin/Topbar";
import { TemplateForm } from "../TemplateForm";

export default function NewTemplatePage() {
  return (
    <>
      <Topbar
        title="Nouveau template"
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Emails", href: "/admin/emails" },
          { label: "Templates", href: "/admin/emails/templates" },
          { label: "Nouveau" },
        ]}
      />
      <div className="p-8">
        <TemplateForm />
      </div>
    </>
  );
}
