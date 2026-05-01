import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// Mock @/db so the module can be imported without DATABASE_URL or postgres driver loading.
vi.mock("@/db", () => ({
  db: {} as unknown,
  schema: { rateLimits: {} } as unknown,
}));

import { checkOrigin } from "./rate-limit";

const ORIGINAL_ENV = { ...process.env };

function makeReq(headers: Record<string, string>): Request {
  return new Request("https://iefandco.com/api/contact", {
    method: "POST",
    headers,
  });
}

describe("checkOrigin", () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
    delete process.env.NEXT_PUBLIC_SITE_URL;
  });

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  it("accepts same-origin requests (origin header matches site URL)", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://iefandco.com";
    const req = makeReq({
      origin: "https://iefandco.com",
      host: "iefandco.com",
    });
    expect(checkOrigin(req)).toBe(true);
  });

  it("rejects cross-origin requests (origin from another domain)", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://iefandco.com";
    (process.env as Record<string, string>).NODE_ENV = "production";
    const req = makeReq({
      origin: "https://evil.com",
      host: "iefandco.com",
    });
    expect(checkOrigin(req)).toBe(false);
  });

  it("allows missing Origin/Referer in development", () => {
    (process.env as Record<string, string>).NODE_ENV = "development";
    const req = makeReq({ host: "localhost:3000" });
    expect(checkOrigin(req)).toBe(true);
  });

  it("rejects missing Origin/Referer in production", () => {
    (process.env as Record<string, string>).NODE_ENV = "production";
    const req = makeReq({ host: "iefandco.com" });
    expect(checkOrigin(req)).toBe(false);
  });

  it("accepts vercel preview hosts when host header is set", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://iefandco.com";
    const req = makeReq({
      origin: "https://iefandco-preview-abc123.vercel.app",
      host: "iefandco-preview-abc123.vercel.app",
    });
    expect(checkOrigin(req)).toBe(true);
  });

  it("falls back to referer when origin missing", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://iefandco.com";
    const req = makeReq({
      referer: "https://iefandco.com/contact",
      host: "iefandco.com",
    });
    expect(checkOrigin(req)).toBe(true);
  });
});
