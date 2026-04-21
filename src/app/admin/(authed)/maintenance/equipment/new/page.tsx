import { Topbar } from "@/components/admin/Topbar";
import { EquipmentForm } from "../EquipmentForm";
import { getSites } from "../../queries";
import { redirect } from "next/navigation";

interface SearchParams {
  siteId?: string;
}

export default async function NewEquipmentPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { siteId } = await searchParams;
  const sites = await getSites();
  if (sites.length === 0) {
    redirect("/admin/maintenance/sites/new");
  }

  return (
    <>
      <Topbar
        title="Nouvel equipement"
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Maintenance", href: "/admin/maintenance" },
          { label: "Equipements", href: "/admin/maintenance/equipment" },
          { label: "Nouveau" },
        ]}
      />
      <div className="p-8">
        <EquipmentForm
          sites={sites.map((s) => ({ id: s.id, clientName: s.clientName, label: s.label }))}
          initial={siteId ? { siteId } : undefined}
        />
      </div>
    </>
  );
}
