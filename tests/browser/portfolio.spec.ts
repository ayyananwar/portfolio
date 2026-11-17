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
  await expect(page.locator(".project-card")).toHaveCount(3);
  await expect(
    page.getByRole("link", { name: "Restaurant operations, even offline." }),
  ).toHaveAttribute("href", "https://github.com/ayyananwar/restaurant-portal");
  await expect(page.locator(".direct-contact")).toContainText("+91 6207904901");
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

for (const width of [320, 390, 768, 1024, 1440]) {
  test(`responsive layout and loaded images at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.locator(".hero-portrait img")).toBeVisible();
    await page.locator("#about").scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        page
          .locator("img")
          .evaluateAll((images) =>
            images.every(
              (image) =>
                image instanceof HTMLImageElement &&
                image.complete &&
                image.naturalWidth > 0,
            ),
          ),
      )
      .toBe(true);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
    await page.locator("#top").scrollIntoViewIfNeeded();
    await page.screenshot({
      path: `test-results/responsive-${width}.png`,
      fullPage: true,
      animations: "disabled",
    });
  });
}
for (const width of [390, 1440]) {
  test(`all navigation destinations and active state at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const mobile = width < 960;
    for (const [label, id] of [
      ["Work", "work"],
      ["Services", "services"],
      ["About", "about"],
      ["Contact", "contact"],
    ]) {
      if (mobile)
        await page.getByRole("button", { name: "Open navigation" }).click();
      const navigation = page.getByRole("navigation", {
        name: mobile ? "Mobile navigation" : "Main navigation",
        exact: true,
      });
      await navigation.getByRole("link", { name: label, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`#${id}$`));
      await expect(page.locator(`#${id} h2`)).toBeInViewport();
      await expect
        .poll(() =>
          page
            .locator(`#${id} h2`)
            .evaluate((el) => el.getBoundingClientRect().top),
        )
        .toBeGreaterThanOrEqual(76);
      if (mobile) {
        await expect(navigation).toBeHidden();
        await expect(page.locator(`#${id}`)).toBeFocused();
      } else {
        await expect(
          navigation.getByRole("link", { name: label, exact: true }),
        ).toHaveAttribute("aria-current", "location");
      }
    }
    await page
      .getByRole("navigation", { name: "Footer navigation" })
      .getByRole("link", { name: "Work", exact: true })
      .click();
    await expect(page.locator("#work-heading")).toBeInViewport();
    await page.locator(".site-header .wordmark").click();
    await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(3);
    await page
      .getByRole("link", { name: "Discuss a project", exact: true })
      .click();
    await expect(page.locator("#contact-heading")).toBeInViewport();
  });
}

test("mobile menu resets across desktop breakpoint and browser back restores hash", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(
    page.getByRole("button", { name: "Open navigation" }),
  ).toHaveAttribute("aria-expanded", "false");
  await page.getByRole("link", { name: "View projects", exact: true }).click();
  await page
    .getByRole("navigation", { name: "Footer navigation" })
    .getByRole("link", { name: "About", exact: true })
    .click();
  await page.goBack();
  await expect(page).toHaveURL(/#work$/);
  await expect(page.locator("#work-heading")).toBeInViewport();
});
