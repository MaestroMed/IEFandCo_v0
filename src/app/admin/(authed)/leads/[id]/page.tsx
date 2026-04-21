import { notFound } from "next/navigation";
import { Topbar } from "@/components/admin/Topbar";
import { getLeadWithEvents } from "../queries";
import { LeadDetail } from "./LeadDetail";

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getLeadWithEvents(id);
  if (!data) notFound();

  return (
    <>
      <Topbar
        title={`${data.lead.firstName} ${data.lead.lastName}`}
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Leads", href: "/admin/leads" },
          { label: `${data.lead.firstName} ${data.lead.lastName}` },
        ]}
      />
      <LeadDetail lead={data.lead} events={data.events} />
    </>
  );
}
