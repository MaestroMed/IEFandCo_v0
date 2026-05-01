import { describe, it, expect, beforeEach, afterEach } from "vitest";

// Note: isDbConfigured is exported from src/db/index.ts and re-exported in
// src/lib/content.ts uses (it lives in the @/db module). The function reads
// process.env.DATABASE_URL on each call, so we toggle the env around tests.

const ORIGINAL_ENV = { ...process.env };

describe("isDbConfigured (DB env detection)", () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  it("returns false when DATABASE_URL is unset", async () => {
    delete process.env.DATABASE_URL;
    const { isDbConfigured } = await import("@/db");
    expect(isDbConfigured()).toBe(false);
  });

  it("returns false when DATABASE_URL is empty string", async () => {
    process.env.DATABASE_URL = "";
    const { isDbConfigured } = await import("@/db");
    expect(isDbConfigured()).toBe(false);
  });

  it("returns true when DATABASE_URL is set to a non-empty value", async () => {
    process.env.DATABASE_URL = "postgres://user:pwd@localhost:5432/db";
    const { isDbConfigured } = await import("@/db");
    expect(isDbConfigured()).toBe(true);
  });
});
