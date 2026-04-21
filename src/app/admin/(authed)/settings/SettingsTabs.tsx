"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SETTINGS_TABS } from "./constants";

export function SettingsTabs() {
  const pathname = usePathname();
  return (
    <div className="flex items-center gap-1 overflow-x-auto border-b" style={{ borderColor: "var(--border)" }}>
      {SETTINGS_TABS.map((t) => {
        const active = pathname.startsWith(t.path);
        return (
          <Link
            key={t.key}
            href={t.path}
            className="px-4 py-2.5 text-sm transition-colors whitespace-nowrap border-b-2"
            style={{
              borderColor: active ? "var(--color-primary)" : "transparent",
              color: active ? "var(--text)" : "var(--text-muted)",
              fontWeight: active ? 600 : 400,
            }}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
