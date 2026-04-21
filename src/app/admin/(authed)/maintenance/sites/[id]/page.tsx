import { Topbar } from "@/components/admin/Topbar";
import { notFound } from "next/navigation";
import {
  getSiteById,
  getEquipmentForSite,
  getContractsForSite,
  getVisitsForSite,
} from "../../queries";
import { SiteDetail } from "./SiteDetail";

interface SearchParams {
  tab?: "infos" | "equipement" | "contrats" | "historique";
}

export default async function SiteDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const site = await getSiteById(id);
  if (!site) notFound();

  const [equipment, contracts, visits] = await Promise.all([
    getEquipmentForSite(id),
    getContractsForSite(id),
    getVisitsForSite(id),
  ]);

  const title = site.label ? `${site.clientName} — ${site.label}` : site.clientName;

  return (
    <>
      <Topbar
        title={title}
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Maintenance", href: "/admin/maintenance" },
          { label: "Sites", href: "/admin/maintenance/sites" },
          { label: title },
        ]}
      />
      <SiteDetail
        site={site}
        equipment={equipment}
        contracts={contracts}
        visits={visits.map((v) => ({ ...v.visit, equipmentLabel: v.equipment?.label || v.equipment?.type || null }))}
        initialTab={sp.tab || "infos"}
      />
    </>
  );
}
