import { describe, it, expect, vi } from "vitest";

// Mock node:fs/promises so storage.ts can be imported without touching the filesystem.
vi.mock("node:fs/promises", () => ({
  default: {
    mkdir: vi.fn(),
    writeFile: vi.fn(),
    unlink: vi.fn(),
  },
  mkdir: vi.fn(),
  writeFile: vi.fn(),
  unlink: vi.fn(),
}));

// Mock supabase client to avoid network init.
vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => null),
}));

import { safeFilename } from "./storage";

describe("safeFilename", () => {
  it("strips slashes from path traversal sequences (../)", () => {
    // safeFilename keeps dots (extensions) but strips path separators, so a
    // raw "../../etc/passwd" becomes "..-..-etc-passwd" — no traversal possible
    // since all "/" are replaced and the name is timestamp-prefixed on upload.
    const out = safeFilename("../../etc/passwd");
    expect(out).not.toContain("/");
    expect(out).not.toContain("\\");
    expect(out).toMatch(/^[a-zA-Z0-9._-]+$/);
  });

  it("strips backslashes (Windows path separators)", () => {
    const out = safeFilename("..\\..\\windows\\system32");
    expect(out).not.toContain("\\");
    expect(out).not.toContain("/");
    expect(out).toMatch(/^[a-zA-Z0-9._-]+$/);
  });

  it("removes accents (NFD normalization + diacritic strip)", () => {
    const out = safeFilename("éàçùê.jpg");
    expect(out).toBe("eacue.jpg");
  });

  it("replaces unsafe characters with hyphens", () => {
    const out = safeFilename("my file (final)!.png");
    expect(out).toMatch(/^[a-zA-Z0-9._-]+$/);
    expect(out.endsWith(".png")).toBe(true);
  });

  it("collapses consecutive hyphens", () => {
    const out = safeFilename("a   b   c.jpg");
    expect(out).not.toMatch(/--/);
  });

  it("truncates filenames longer than 120 chars", () => {
    const long = "a".repeat(200) + ".jpg";
    const out = safeFilename(long);
    expect(out.length).toBeLessThanOrEqual(120);
  });

  it("preserves dots (extension), letters, digits, dashes, underscores", () => {
    const out = safeFilename("photo_001-final.jpg");
    expect(out).toBe("photo_001-final.jpg");
  });

  it("handles empty string gracefully", () => {
    expect(safeFilename("")).toBe("");
  });
});
