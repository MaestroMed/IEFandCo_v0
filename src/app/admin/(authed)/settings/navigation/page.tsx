import { Topbar } from "@/components/admin/Topbar";
import { SettingsTabs } from "../SettingsTabs";
import { getNavigation } from "../queries";
import { NavigationEditor } from "./NavigationEditor";
import { navigation as defaultNav } from "@/data/navigation";

export const dynamic = "force-dynamic";

export default async function NavigationSettingsPage() {
  const stored = await getNavigation();
  const initial = stored && stored.length > 0 ? stored : defaultNav;

  return (
    <>
      <Topbar
        title="Navigation"
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Parametres", href: "/admin/settings" },
          { label: "Navigation" },
        ]}
      />

      <div className="p-8 space-y-6">
        <SettingsTabs />
        <NavigationEditor initial={initial} seeded={!stored} />
      </div>
    </>
  );
}
