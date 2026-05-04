import Image from "next/image";
import Link from "next/link";
import { getBranding } from "@/lib/content";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const branding = await getBranding();

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "var(--bg)" }}>
      <div className="w-full max-w-md">
        {/* Blueprint-style header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="h-px w-6 bg-copper" />
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-copper">BACKOFFICE</span>
            <span className="h-px w-6 bg-copper" />
          </div>
          {branding.logoUrl ? (
            <div className="flex items-center justify-center">
              <Image
                src={branding.logoUrl}
                alt={branding.logoAlt}
                width={180}
                height={48}
                className="h-12 w-auto object-contain"
                priority
                unoptimized={branding.logoUrl.endsWith(".svg")}
              />
            </div>
          ) : (
            <div className="font-display text-3xl font-bold tracking-tight" style={{ color: "var(--text)" }}>
              IEF<span className="text-primary">&amp;</span>CO
            </div>
          )}
          <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
            Espace de gestion interne
          </p>
        </div>

        {/* Login card */}
        <LoginForm />

        <p className="mt-8 text-center">
          <Link href="/" className="text-xs transition-colors hover:text-primary" style={{ color: "var(--text-muted)" }}>
            ← Retour au site
          </Link>
        </p>
      </div>
    </div>
  );
}
