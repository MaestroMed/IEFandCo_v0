import { Topbar } from "@/components/admin/Topbar";
import { notFound } from "next/navigation";
import { getContractById, getSites } from "../../queries";
import { ContractForm } from "../ContractForm";

export default async function EditContractPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const contract = await getContractById(id);
  if (!contract) notFound();
  const sites = await getSites();

  return (
    <>
      <Topbar
        title={`Contrat ${id.slice(0, 8)}`}
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Maintenance", href: "/admin/maintenance" },
          { label: "Contrats", href: "/admin/maintenance/contracts" },
          { label: id.slice(0, 8) },
        ]}
      />
      <div className="p-8">
        <ContractForm
          contractId={contract.id}
          sites={sites.map((s) => ({ id: s.id, clientName: s.clientName, label: s.label }))}
          initial={{
            siteId: contract.siteId,
            type: contract.type,
            startDate: contract.startDate,
            endDate: contract.endDate,
            slaHours: contract.slaHours,
            frequencyMonths: contract.frequencyMonths,
            amountHt: contract.amountHt,
            status: contract.status,
            notes: contract.notes,
          }}
        />
      </div>
    </>
  );
}
