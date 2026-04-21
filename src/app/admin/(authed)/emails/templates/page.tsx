import { Topbar } from "@/components/admin/Topbar";
import Link from "next/link";
import { History, Mail, Plus } from "lucide-react";
import { EmptyState } from "@/components/admin/EmptyState";
import { getTemplates } from "../queries";

export const dynamic = "force-dynamic";

export default async function TemplatesListPage() {
  const templates = await getTemplates();

  return (
    <>
      <Topbar
        title="Templates email"
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Emails", href: "/admin/emails" },
          { label: "Templates" },
        ]}
      />
      <div className="p-8 space-y-6">
        {/* Section tabs */}
        <div className="flex gap-1 border-b" style={{ borderColor: "var(--border)" }}>
          <Link href="/admin/emails/templates" className="flex items-center gap-2 px-4 py-2.5 text-sm border-b-2" style={{ borderColor: "var(--color-primary)", color: "var(--text)", fontWeight: 600 }}>
            <Mail className="h-3.5 w-3.5" /> Templates
          </Link>
          <Link href="/admin/emails/history" className="flex items-center gap-2 px-4 py-2.5 text-sm border-b-2" style={{ borderColor: "transparent", color: "var(--text-muted)" }}>
            <History className="h-3.5 w-3.5" /> Historique
          </Link>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {templates.length} template{templates.length > 1 ? "s" : ""}
          </p>
          <Link
            href="/admin/emails/templates/new"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Nouveau template
          </Link>
        </div>

        {templates.length === 0 ? (
          <EmptyState
            icon={Mail}
            title="Aucun template"
            description="Creez vos premiers templates d'email pour les reponses automatiques et rappels."
            actionLabel="Creer un template"
            actionHref="/admin/emails/templates/new"
          />
        ) : (
          <div className="rounded-xl overflow-hidden" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider" style={{ color: "var(--text-muted)", background: "var(--bg-muted)" }}>
                  <th className="px-4 py-3 font-medium">Nom</th>
                  <th className="px-4 py-3 font-medium">Cle</th>
                  <th className="px-4 py-3 font-medium">Sujet</th>
                  <th className="px-4 py-3 font-medium">Variables</th>
                  <th className="px-4 py-3 font-medium">Mise a jour</th>
                </tr>
              </thead>
              <tbody>
                {templates.map((t) => (
                  <tr key={t.id} className="border-t transition-colors hover:bg-[var(--bg-muted)]" style={{ borderColor: "var(--border)" }}>
                    <td className="px-4 py-3">
                      <Link href={`/admin/emails/templates/${t.id}`} className="font-medium hover:text-primary transition-colors" style={{ color: "var(--text)" }}>
                        {t.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--color-copper)" }}>{t.key}</td>
                    <td className="px-4 py-3 truncate max-w-[300px]" style={{ color: "var(--text-muted)" }}>{t.subject}</td>
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--text-muted)" }}>{t.variables || "—"}</td>
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--text-muted)" }}>
                      {new Date(t.updatedAt).toLocaleDateString("fr-FR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
