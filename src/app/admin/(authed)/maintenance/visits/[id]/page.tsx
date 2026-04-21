import { Topbar } from "@/components/admin/Topbar";
import { notFound } from "next/navigation";
import { getVisitById } from "../../queries";
import { VisitDetail } from "./VisitDetail";

export default async function VisitDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = await getVisitById(id);
  if (!row) notFound();

  return (
    <>
      <Topbar
        title={`Visite ${id.slice(0, 8)}`}
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Maintenance", href: "/admin/maintenance" },
          { label: "Visites", href: "/admin/maintenance/visits" },
          { label: id.slice(0, 8) },
        ]}
      />
      <VisitDetail
        visit={row.visit}
        site={row.site}
        equipment={row.equipment}
        technician={row.technician}
      />
    </>
  );
}
