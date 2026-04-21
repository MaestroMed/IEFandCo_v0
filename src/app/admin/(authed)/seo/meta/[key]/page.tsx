import { Topbar } from "@/components/admin/Topbar";
import { notFound } from "next/navigation";
import { STATIC_PAGES } from "../../constants";
import { getSeoOverride } from "@/lib/admin/seo-override";
import { StaticSeoForm } from "./StaticSeoForm";

export const dynamic = "force-dynamic";

export default async function StaticSeoEditPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const page = STATIC_PAGES.find((p) => p.key === key);
  if (!page) notFound();

  const current = await getSeoOverride(key);

  return (
    <>
      <Topbar
        title={`SEO ${page.name}`}
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "SEO", href: "/admin/seo" },
          { label: "Meta", href: "/admin/seo/meta" },
          { label: page.name },
        ]}
      />
      <div className="p-8">
        <StaticSeoForm
          pageKey={key}
          path={page.path}
          name={page.name}
          initial={{ title: current?.title || "", description: current?.description || "" }}
        />
      </div>
    </>
  );
}
