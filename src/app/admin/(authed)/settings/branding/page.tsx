import { Topbar } from "@/components/admin/Topbar";
import { SettingsTabs } from "../SettingsTabs";
import { getBrandingSettings } from "../queries";
import { BrandingForm } from "./BrandingForm";

export const dynamic = "force-dynamic";

export default async function BrandingSettingsPage() {
  const data = await getBrandingSettings();

  return (
    <>
      <Topbar
        title="Marque"
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Parametres", href: "/admin/settings" },
          { label: "Marque" },
        ]}
      />

      <div className="p-8 space-y-6">
        <SettingsTabs />
        <BrandingForm
          initial={{
            primaryColor: (data["brand:primary-color"] as string) || "#E11021",
            copperColor: (data["brand:copper-color"] as string) || "#C4855C",
            faviconUrl: (data["brand:favicon-url"] as string) || "",
            ogDefaultImage: (data["brand:og-default-image"] as string) || "",
            logoDarkUrl: (data["brand:logo-dark-url"] as string) || "",
            logoLightUrl: (data["brand:logo-light-url"] as string) || "",
            logoMediaId: (data["brand:logo-media-id"] as string) || "",
            logoLightMediaId: (data["brand:logo-light-media-id"] as string) || "",
            faviconMediaId: (data["brand:favicon-media-id"] as string) || "",
            logoAlt: (data["brand:logo-alt"] as string) || "",
          }}
        />
      </div>
    </>
  );
}
