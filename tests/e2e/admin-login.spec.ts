import { test, expect } from "@playwright/test";

test.describe("Admin login", () => {
  test("shows error on bad credentials, redirects to /admin on success", async ({ page }) => {
    let loginAttempts = 0;

    // Mock the login API so we don't need a DB or seeded admin user.
    await page.route("**/api/admin/login", async (route) => {
      loginAttempts += 1;
      const req = route.request();
      const body = req.postDataJSON() as { email?: string; password?: string } | null;

      if (!body?.email || !body?.password) {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ ok: false, error: "Champs requis" }),
        });
        return;
      }
      if (body.email !== "admin@iefandco.com" || body.password !== "admin1234") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ ok: false, error: "Identifiants invalides" }),
        });
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      });
    });

    // Avoid landing on /admin after redirect (would require auth) — intercept
    // navigation to /admin and answer with a stub page.
    await page.route("**/admin", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "text/html; charset=utf-8",
        body: "<html><body><h1>Admin OK</h1></body></html>",
      });
    });

    await page.goto("/admin/login");
    await expect(page.getByRole("heading", { name: /Connexion/i })).toBeVisible();

    // Browser-level required validation prevents submission with empty fields,
    // so we type invalid credentials to verify the API-error path renders.
    await page.locator('input[type="email"]').fill("user@example.com");
    await page.locator('input[type="password"]').fill("wrongpass");
    await page.getByRole("button", { name: /Se connecter/i }).click();
    await expect(page.locator("text=/Identifiants invalides/i")).toBeVisible();

    // Now valid credentials → redirect to /admin
    await page.locator('input[type="email"]').fill("admin@iefandco.com");
    await page.locator('input[type="password"]').fill("admin1234");
    await page.getByRole("button", { name: /Se connecter/i }).click();

    await expect(page).toHaveURL(/\/admin\/?$/, { timeout: 10_000 });
    expect(loginAttempts).toBeGreaterThanOrEqual(2);
  });
});
