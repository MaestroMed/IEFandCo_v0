import { Topbar } from "@/components/admin/Topbar";
import { DepannageForm } from "../DepannageForm";

export default function NewDepannagePage() {
  return (
    <>
      <Topbar
        title="Nouveau service de depannage"
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Depannage", href: "/admin/content/depannage" },
          { label: "Nouveau" },
        ]}
      />
      <div className="p-8">
        <DepannageForm />
      </div>
    </>
  );
}
