import { Topbar } from "@/components/admin/Topbar";
import { BrandForm } from "../BrandForm";

export default function NewBrandPage() {
  return (
    <>
      <Topbar
        title="Nouvelle marque"
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Marques", href: "/admin/content/brands" },
          { label: "Nouvelle" },
        ]}
      />
      <div className="p-8">
        <BrandForm />
      </div>
    </>
  );
}
