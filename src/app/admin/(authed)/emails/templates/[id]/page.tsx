import { Topbar } from "@/components/admin/Topbar";
import { notFound } from "next/navigation";
import { TemplateForm } from "../TemplateForm";
import { getTemplateById } from "../../queries";

export default async function EditTemplatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const template = await getTemplateById(id);
  if (!template) notFound();

  return (
    <>
      <Topbar
        title={template.name}
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Emails", href: "/admin/emails" },
          { label: "Templates", href: "/admin/emails/templates" },
          { label: template.name },
        ]}
      />
      <div className="p-8">
        <TemplateForm
          templateId={template.id}
          initial={{
            key: template.key,
            name: template.name,
            subject: template.subject,
            bodyHtml: template.bodyHtml,
            variables: template.variables,
          }}
        />
      </div>
    </>
  );
}
