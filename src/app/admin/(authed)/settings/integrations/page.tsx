import { Topbar } from "@/components/admin/Topbar";
import { SettingsTabs } from "../SettingsTabs";
import { getIntegrationsSettings } from "../queries";
import { IntegrationsForm } from "./IntegrationsForm";

export const dynamic = "force-dynamic";

export default async function IntegrationsSettingsPage() {
  const data = await getIntegrationsSettings();
  const envResendSet = !!process.env.RESEND_API_KEY;

  return (
    <>
      <Topbar
        title="Integrations"
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Parametres", href: "/admin/settings" },
          { label: "Integrations" },
        ]}
      />

      <div className="p-8 space-y-6">
        <SettingsTabs />
        <IntegrationsForm
          envResendSet={envResendSet}
          initial={{
            resendKey: (data["int:resend-api-key"] as string) || "",
            mapsEmbed: (data["int:maps-embed"] as string) || "",
            vercelAnalytics: !!data["int:vercel-analytics"],
            plausibleDomain: (data["int:plausible-domain"] as string) || "",
          }}
        />
      </div>
    </>
  );
}
