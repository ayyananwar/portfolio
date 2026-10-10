import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("desktop story, project interaction, contact validation, and accessibility", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "I build web",
  );
  await page.getByRole("button", { name: "Creator", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText("Awaiting confirmation");
  await page.getByRole("button", { name: "Recipient", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText("Completed");
  await page.getByRole("button", { name: "Reset commitment flow" }).click();
  await expect(page.getByRole("status")).toHaveText("Try the flow");
  await page.locator("details").first().locator("summary").click();
  await expect(
    page.getByText("Friend requests", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(page.locator("#name")).toBeFocused();
  await expect(page.locator("#email-error")).toBeVisible();
  await page.locator("#name").fill("Visitor");
  await page.locator("#email").fill("visitor@example.com");
  await page
    .locator("#message")
    .fill("I would like to discuss building an application for my business.");
  await page.route("**/api/contact", (route) =>
    route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({
        error:
          "The form is temporarily unavailable. Please email contact@ayyan.tech directly.",
      }),
    }),
  );
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(
    page.getByRole("form", { name: "Send an enquiry" }).getByRole("alert"),
  ).toContainText("temporarily unavailable");
  await expect(page.locator("#message")).toHaveValue(/building an application/);
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(result.violations).toEqual([]);
  expect(errors).toEqual([]);
  await page.locator("#top").scrollIntoViewIfNeeded();
  await page.screenshot({
    path: "test-results/desktop.png",
    fullPage: true,
    animations: "disabled",
  });
});

test("mobile navigation, layout, and successful enquiry state", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Open navigation" }),
  ).toBeFocused();
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "Contact" })
    .click();
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toBeHidden();
  await expect(page.locator("#contact-heading")).toBeInViewport();
  await page.locator("#name").fill("Visitor");
  await page.locator("#email").fill("visitor@example.com");
  await page
    .locator("#message")
    .fill("I would like to discuss building an application for my business.");
  await page.route("**/api/contact", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: '{"ok":true}',
    }),
  );
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(
    page.getByRole("heading", { name: "Your enquiry is on its way." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Send another enquiry" }).click();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.locator("#top").scrollIntoViewIfNeeded();
  await page.screenshot({
    path: "test-results/mobile.png",
    fullPage: true,
    animations: "disabled",
  });
});

test("small-screen layout and content without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 320, height: 700 },
  });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(
    page.locator("noscript").getByRole("link", { name: "contact@ayyan.tech" }),
  ).toBeVisible();
  await expect(page.locator(".contact-form")).toBeHidden();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await context.close();
});

test("reduced motion keeps content available", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe("auto");
});
