import { Topbar } from "@/components/admin/Topbar";
import { BlogForm } from "../BlogForm";

export default function NewBlogPostPage() {
  return (
    <>
      <Topbar
        title="Nouvel article"
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Blog", href: "/admin/blog" },
          { label: "Nouveau" },
        ]}
      />
      <div className="p-8">
        <BlogForm />
      </div>
    </>
  );
}
