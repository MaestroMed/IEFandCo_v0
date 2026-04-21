import { Topbar } from "@/components/admin/Topbar";
import { TestimonialForm } from "../TestimonialForm";

export default function NewTestimonialPage() {
  return (
    <>
      <Topbar
        title="Nouveau temoignage"
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Temoignages", href: "/admin/testimonials" },
          { label: "Nouveau" },
        ]}
      />
      <div className="p-8">
        <TestimonialForm />
      </div>
    </>
  );
}
