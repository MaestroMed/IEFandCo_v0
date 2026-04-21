import { redirect } from "next/navigation";
import { getSession } from "@/lib/admin/auth";
import { Sidebar } from "@/components/admin/Sidebar";
import { CommandPalette } from "@/components/admin/CommandPalette";
import { Toaster } from "sonner";

export default async function AdminAuthedLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Sidebar userName={session.user.name} userRole={session.user.role} />
      <main className="pl-64">{children}</main>
      <Toaster position="bottom-right" theme="system" />
      <CommandPalette />
    </div>
  );
}
