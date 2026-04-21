import { Topbar } from "@/components/admin/Topbar";
import { SiteForm } from "../SiteForm";

export default function NewSitePage() {
  return (
    <>
      <Topbar
        title="Nouveau site"
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Maintenance", href: "/admin/maintenance" },
          { label: "Sites", href: "/admin/maintenance/sites" },
          { label: "Nouveau" },
        ]}
      />
      <div className="p-8">
        <SiteForm />
      </div>
    </>
  );
}
