import { test } from "node:test";
import assert from "node:assert/strict";
import { createContactHandler } from "../src/lib/contact-handler";

const valid = {
  name: "Test Visitor",
  email: "visitor@example.com",
  enquiry: "Client project",
  message: "I would like to discuss a web application for my team.",
  website: "",
};
const settings = {
  apiKey: "test-only",
  sender: "sender@example.com",
  recipient: "contact@ayyan.tech",
  siteUrl: "https://portfolio.example",
};
test("accepts same-origin aliases and previews with a bare canonical domain", async () => {
  const handler = createContactHandler({
    settings: () => ({ ...settings, siteUrl: " ayyan.tech " }),
    fetch: async () => Response.json({ messageId: "test" }),
  });
  for (const origin of [
    "https://www.ayyan.tech",
    "https://preview.vercel.app",
  ]) {
    const submission = new Request(`${origin}/api/contact`, {
      method: "POST",
      headers: { origin, "content-type": "application/json" },
      body: JSON.stringify(valid),
    });
    assert.equal((await handler(submission)).status, 200);
  }
  assert.equal(
    (await handler(request(valid, "https://unrelated.example"))).status,
    403,
  );
});
function request(
  body: unknown = valid,
  origin = "https://portfolio.example",
  ip = "test",
) {
  return new Request("https://portfolio.example/api/contact", {
    method: "POST",
    headers: { origin, "content-type": "application/json", "x-real-ip": ip },
    body: JSON.stringify(body),
  });
}
test("sends to configured owner, uses visitor only as replyTo, and requires a Brevo receipt", async () => {
  let payload: Record<string, unknown> | undefined;
  const handler = createContactHandler({
    settings: () => settings,
    fetch: async (url, init) => {
      assert.equal(url, "https://api.brevo.com/v3/smtp/email");
      assert.equal(
        (init?.headers as Record<string, string>)["api-key"],
        "test-only",
      );
      payload = JSON.parse(String(init?.body));
      return Response.json({ messageId: "test-receipt" }, { status: 201 });
    },
  });
  assert.equal((await handler(request())).status, 200);
  assert.deepEqual(payload?.to, [
    { email: "contact@ayyan.tech", name: "Ayyan Anwar" },
  ]);
  assert.deepEqual(payload?.replyTo, {
    email: "visitor@example.com",
    name: "Test Visitor",
  });
  assert.match(String(payload?.textContent), /web application/);
});
test("rejects invalid input, cross-origin requests, and honeypots without sending email", async () => {
  let sent = 0;
  const handler = createContactHandler({
    settings: () => settings,
    fetch: async () => {
      sent++;
      return Response.json({ messageId: "test" });
    },
  });
  assert.equal(
    (await handler(request({ ...valid, email: "invalid" }))).status,
    400,
  );
  assert.equal(
    (await handler(request(valid, "https://other.example"))).status,
    403,
  );
  assert.equal(
    (await handler(request({ ...valid, website: "bot.example" }))).status,
    400,
  );
  assert.equal(sent, 0);
});
test("does not report success for missing configuration, provider errors, or ambiguous receipts", async () => {
  const missing = createContactHandler({
    settings: () => ({}),
    fetch: async () => {
      throw new Error("must not send");
    },
  });
  assert.equal((await missing(request())).status, 503);
  for (const response of [
    Response.json({ error: "private-provider-detail" }, { status: 400 }),
    Response.json({}),
    Response.json({ messageId: null }),
  ]) {
    const handler = createContactHandler({
      settings: () => settings,
      fetch: async () => response,
    });
    const result = await handler(request());
    assert.equal(result.status, 502);
    assert.doesNotMatch(
      await result.text(),
      /private-provider-detail|test-only/,
    );
  }
});
test("enforces a body limit even without a content-length header", async () => {
  const handler = createContactHandler({
    settings: () => settings,
    fetch: async () => {
      throw new Error("must not send");
    },
  });
  assert.equal(
    (await handler(request({ ...valid, message: "x".repeat(25_000) }))).status,
    413,
  );
});
test("limits repeated attempts and allows submissions after the window expires", async () => {
  let now = 100;
  const handler = createContactHandler({
    settings: () => settings,
    now: () => now,
    fetch: async () => Response.json({ messageId: "test" }),
  });
  for (let i = 0; i < 5; i++)
    assert.equal((await handler(request())).status, 200);
  assert.equal((await handler(request())).status, 429);
  now += 10 * 60_000;
  assert.equal((await handler(request())).status, 200);
});
test("network failure is not a successful send and is not retried", async () => {
  let attempts = 0;
  const handler = createContactHandler({
    settings: () => settings,
    fetch: async () => {
      attempts++;
      throw new Error("network failure");
    },
  });
  assert.equal((await handler(request())).status, 502);
  assert.equal(attempts, 1);
});
