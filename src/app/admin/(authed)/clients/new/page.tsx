import { Topbar } from "@/components/admin/Topbar";
import { ClientForm } from "../ClientForm";

export default function NewClientPage() {
  return (
    <>
      <Topbar
        title="Nouveau client"
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Clients", href: "/admin/clients" },
          { label: "Nouveau" },
        ]}
      />
      <div className="p-8">
        <ClientForm />
      </div>
    </>
  );
}
