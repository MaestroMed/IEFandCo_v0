import { Topbar } from "@/components/admin/Topbar";
import { ZoneForm } from "../ZoneForm";

export default function NewZonePage() {
  return (
    <>
      <Topbar
        title="Nouvelle zone"
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Zones", href: "/admin/content/zones" },
          { label: "Nouvelle" },
        ]}
      />
      <div className="p-8">
        <ZoneForm />
      </div>
    </>
  );
}
