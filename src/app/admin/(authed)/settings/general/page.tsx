import { Topbar } from "@/components/admin/Topbar";
import { SettingsTabs } from "../SettingsTabs";
import { getGeneralSettings } from "../queries";
import { GeneralForm } from "./GeneralForm";
import { companyInfo } from "@/data/navigation";

export const dynamic = "force-dynamic";

export default async function GeneralSettingsPage() {
  const data = await getGeneralSettings();

  return (
    <>
      <Topbar
        title="Parametres"
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Parametres", href: "/admin/settings" },
          { label: "General" },
        ]}
      />

      <div className="p-8 space-y-6">
        <SettingsTabs />
        <GeneralForm
          initial={{
            name: (data["site:name"] as string) || companyInfo.name,
            tagline: (data["site:tagline"] as string) || companyInfo.description,
            phone: (data["site:phone"] as string) || companyInfo.phoneDisplay,
            email: (data["site:email"] as string) || companyInfo.email,
            address: (data["site:address"] as string) || `${companyInfo.address.street}, ${companyInfo.address.postalCode} ${companyInfo.address.city}`,
            hours: (data["site:hours"] as string) || "Lundi - Vendredi : 8h - 18h",
            siren: (data["site:siren"] as string) || companyInfo.siren,
            rcs: (data["site:rcs"] as string) || companyInfo.rcs,
            president: (data["site:president"] as string) || companyInfo.president,
          }}
        />
      </div>
    </>
  );
}
