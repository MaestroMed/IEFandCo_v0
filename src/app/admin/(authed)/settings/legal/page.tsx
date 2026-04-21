import { Topbar } from "@/components/admin/Topbar";
import { SettingsTabs } from "../SettingsTabs";
import { getLegalSettings } from "../queries";
import { LegalForm } from "./LegalForm";

export const dynamic = "force-dynamic";

export default async function LegalSettingsPage() {
  const data = await getLegalSettings();

  return (
    <>
      <Topbar
        title="Legal"
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Parametres", href: "/admin/settings" },
          { label: "Legal" },
        ]}
      />

      <div className="p-8 space-y-6">
        <SettingsTabs />
        <LegalForm
          initial={{
            mentions: (data["legal:mentions"] as string) || "",
            privacy: (data["legal:privacy"] as string) || "",
          }}
        />
      </div>
    </>
  );
}
