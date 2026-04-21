import { Topbar } from "@/components/admin/Topbar";
import { redirect } from "next/navigation";
import { ContractForm } from "../ContractForm";
import { getSites } from "../../queries";

interface SearchParams {
  siteId?: string;
}

export default async function NewContractPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const sites = await getSites();
  if (sites.length === 0) {
    redirect("/admin/maintenance/sites/new");
  }
  return (
    <>
      <Topbar
        title="Nouveau contrat"
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Maintenance", href: "/admin/maintenance" },
          { label: "Contrats", href: "/admin/maintenance/contracts" },
          { label: "Nouveau" },
        ]}
      />
      <div className="p-8">
        <ContractForm
          sites={sites.map((s) => ({ id: s.id, clientName: s.clientName, label: s.label }))}
          initial={sp.siteId ? { siteId: sp.siteId } : undefined}
        />
      </div>
    </>
  );
}
