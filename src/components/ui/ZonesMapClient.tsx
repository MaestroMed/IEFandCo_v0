"use client";

/**
 * ZonesMapClient — wrapper client-only pour `ZonesMap`.
 *
 * En Next 15, `dynamic({ ssr: false })` n'est pas autorisé depuis un
 * Server Component. On le place donc ici, dans un Client Component,
 * pour pouvoir être importé librement depuis la page server.
 */

import dynamic from "next/dynamic";

const ZonesMap = dynamic(() => import("./ZonesMap"), {
  ssr: false,
  loading: () => (
    <div
      className="rounded-2xl"
      style={{
        height: 500,
        background: "var(--card-bg)",
        border: "1px solid var(--border)",
      }}
    />
  ),
});

interface ZonesMapClientProps {
  height?: number;
  className?: string;
}

export default function ZonesMapClient(props: ZonesMapClientProps) {
  return <ZonesMap {...props} />;
}
