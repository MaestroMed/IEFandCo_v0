import { Topbar } from "@/components/admin/Topbar";
import { Repeat } from "lucide-react";
import { EmptyState } from "@/components/admin/EmptyState";
import { getRedirects } from "../queries";
import { RedirectsClient } from "./RedirectsClient";

export const dynamic = "force-dynamic";

export default async function RedirectsPage() {
  const redirects = await getRedirects();

  return (
    <>
      <Topbar
        title="Redirections"
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "SEO", href: "/admin/seo" },
          { label: "Redirections" },
        ]}
      />

      <div className="p-8 space-y-6">
        <RedirectsClient
          redirects={redirects.map((r) => ({
            id: r.id,
            fromPath: r.fromPath,
            toPath: r.toPath,
            statusCode: r.statusCode,
            hits: r.hits,
            createdAt: r.createdAt.getTime(),
          }))}
        />

        {redirects.length === 0 && (
          <EmptyState
            icon={Repeat}
            title="Aucune redirection"
            description="Ajoutez une redirection ou importez un lot via CSV pour commencer."
          />
        )}
      </div>
    </>
  );
}
