import { describe, it, expect } from "vitest";
import { escapeHtml } from "./email";

describe("escapeHtml", () => {
  it("escapes ampersand first to avoid double-encoding", () => {
    // & must be replaced before < / > / " / ', otherwise &amp; becomes &amp;amp; etc.
    expect(escapeHtml("Tom & Jerry")).toBe("Tom &amp; Jerry");
  });

  it("escapes angle brackets", () => {
    expect(escapeHtml("<script>alert(1)</script>")).toBe(
      "&lt;script&gt;alert(1)&lt;/script&gt;",
    );
  });

  it("escapes double and single quotes", () => {
    expect(escapeHtml(`He said "hi" and 'hello'`)).toBe(
      "He said &quot;hi&quot; and &#039;hello&#039;",
    );
  });

  it("handles all reserved chars together without double-encoding", () => {
    expect(escapeHtml(`<a href="x?y=1&z=2">'click'</a>`)).toBe(
      "&lt;a href=&quot;x?y=1&amp;z=2&quot;&gt;&#039;click&#039;&lt;/a&gt;",
    );
  });

  it("returns empty string for empty input", () => {
    expect(escapeHtml("")).toBe("");
  });

  it("leaves safe text untouched", () => {
    expect(escapeHtml("Bonjour, ceci est un texte sans caractere reserve")).toBe(
      "Bonjour, ceci est un texte sans caractere reserve",
    );
  });
});
