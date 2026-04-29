import { Topbar } from "@/components/admin/Topbar";
import { ComparatorForm } from "../ComparatorForm";

export default function NewComparatorPage() {
  return (
    <>
      <Topbar
        title="Nouveau comparatif"
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Comparatifs", href: "/admin/content/comparators" },
          { label: "Nouveau" },
        ]}
      />
      <div className="p-8">
        <ComparatorForm />
      </div>
    </>
  );
}
