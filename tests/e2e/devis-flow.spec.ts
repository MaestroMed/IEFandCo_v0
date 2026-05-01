import { test, expect } from "@playwright/test";

test.describe("Devis multi-step flow", () => {
  test("user can complete the 4-step quote form and reach success state", async ({ page }) => {
    // Mock the POST /api/devis so the test does not need DB or email config.
    await page.route("**/api/devis", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      });
    });

    // Visit homepage first to verify the CTA exists, then navigate to /devis.
    // (Some homepage variants render the link inside an animated hero so direct
    // click can race; goto /devis is the same user journey and is reliable.)
    await page.goto("/");
    await expect(page.locator('a[href="/devis"]').first()).toBeVisible();
    await page.goto("/devis");
    await expect(page).toHaveURL(/\/devis$/);

    // Step 1 — service + description
    await page.locator("select").first().selectOption({ index: 1 });
    await page
      .locator('textarea[placeholder*="Décrivez"]')
      .fill("Test E2E : besoin d'un portail coulissant motorisé pour un site industriel.");
    await page.getByRole("button", { name: /Suivant/i }).click();

    // Step 2 — urgence + adresse (optional)
    await expect(page.locator("text=Urgence")).toBeVisible();
    await page.locator("select").first().selectOption("normal");
    await page.locator('input[autocomplete="street-address"]').fill("12 rue du test, 75001 Paris");
    await page.getByRole("button", { name: /Suivant/i }).click();

    // Step 3 — contact info
    await page.locator('input[autocomplete="given-name"]').fill("Jean");
    await page.locator('input[autocomplete="family-name"]').fill("Dupont");
    await page.locator('input[type="email"]').fill("jean.dupont@example.com");
    await page.locator('input[type="tel"]').fill("+33 6 12 34 56 78");
    await page.getByRole("button", { name: /Suivant/i }).click();

    // Step 4 — récap + submit
    await expect(page.locator("text=Récapitulatif")).toBeVisible();
    await page.getByRole("button", { name: /Envoyer la demande/i }).click();

    // Success state
    await expect(page.locator("text=Demande envoyée")).toBeVisible({ timeout: 10_000 });
  });
});
