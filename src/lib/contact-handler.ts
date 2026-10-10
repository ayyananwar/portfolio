import { contactSchema } from "./contact-schema";

type Settings = {
  apiKey?: string;
  sender?: string;
  recipient?: string;
  siteUrl?: string;
};
type Dependencies = {
  settings: () => Settings;
  fetch: typeof fetch;
  now?: () => number;
};
const MAX_BODY_BYTES = 24_000;

async function readBody(request: Request) {
  if (!request.body) throw new Error("EMPTY");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_BODY_BYTES) {
      await reader.cancel();
      throw new Error("TOO_LARGE");
    }
    chunks.push(value);
  }
  const data = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    data.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return JSON.parse(new TextDecoder().decode(data));
}

// This process-local limiter is a first layer. Add a host/WAF rate limit before
// multi-instance deployment; an in-memory map is not a shared production quota.
export function createContactHandler(deps: Dependencies) {
  const attempts = new Map<string, { count: number; expires: number }>();
  const now = deps.now ?? Date.now;
  function reply(
    status: number,
    data: Record<string, unknown>,
    headers: Record<string, string> = {},
  ) {
    return Response.json(data, {
      status,
      headers: { "Cache-Control": "no-store", ...headers },
    });
  }
  return async function handle(request: Request) {
    const config = deps.settings();
    let expectedOrigin: string;
    try {
      expectedOrigin = new URL(config.siteUrl || request.url).origin;
    } catch {
      return reply(503, {
        error:
          "The form is temporarily unavailable. Please email contact@ayyan.tech directly.",
      });
    }
    if (request.headers.get("origin") !== expectedOrigin)
      return reply(403, {
        error: "Please send your enquiry from this website.",
      });
    if (
      !request.headers
        .get("content-type")
        ?.toLowerCase()
        .startsWith("application/json")
    )
      return reply(415, { error: "Please submit the enquiry using the form." });
    const declaredLength = Number(request.headers.get("content-length") || 0);
    if (declaredLength > MAX_BODY_BYTES)
      return reply(413, { error: "Your enquiry is too long." });

    const timestamp = now();
    for (const [key, record] of attempts)
      if (record.expires <= timestamp) attempts.delete(key);
    // Use only the IP header supplied by a trusted deployment proxy. Do not use
    // client-controlled forwarding headers for authorization or identity.
    const address = (request.headers.get("x-real-ip") || "shared").slice(
      0,
      100,
    );
    const existing = attempts.get(address);
    if (existing && existing.count >= 5)
      return reply(
        429,
        { error: "Please wait a few minutes before sending another enquiry." },
        {
          "Retry-After": String(
            Math.ceil((existing.expires - timestamp) / 1000),
          ),
        },
      );
    if (!existing && attempts.size >= 1000)
      return reply(
        429,
        {
          error: "The form is busy. Please email contact@ayyan.tech directly.",
        },
        { "Retry-After": "60" },
      );
    attempts.set(address, {
      count: (existing?.count ?? 0) + 1,
      expires: existing?.expires ?? timestamp + 10 * 60_000,
    });

    let body: unknown;
    try {
      body = await readBody(request);
    } catch (error) {
      return reply(
        error instanceof Error && error.message === "TOO_LARGE" ? 413 : 400,
        { error: "Please check your enquiry and try again." },
      );
    }
    const result = contactSchema.safeParse(body);
    if (!result.success) {
      const fields: Record<string, string> = {};
      for (const issue of result.error.issues)
        fields[String(issue.path[0])] ??= issue.message;
      return reply(400, {
        error: "Please check the highlighted fields.",
        fields,
      });
    }
    if (result.data.website)
      return reply(400, {
        error:
          "This enquiry could not be accepted. Please email contact@ayyan.tech directly.",
      });
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (
      !config.apiKey ||
      !config.sender ||
      !config.recipient ||
      !emailPattern.test(config.sender) ||
      !emailPattern.test(config.recipient)
    ) {
      return reply(503, {
        error:
          "The form is temporarily unavailable. Please email contact@ayyan.tech directly.",
      });
    }
    const { name, email, enquiry, message } = result.data;
    try {
      const sent = await deps.fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": config.apiKey,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          sender: { name: "Ayyan’s portfolio", email: config.sender },
          to: [{ email: config.recipient, name: "Ayyan Anwar" }],
          replyTo: { email, name },
          subject: `Portfolio enquiry: ${enquiry || "General"}`,
          textContent: `Name: ${name}\nEmail: ${email}\nEnquiry: ${enquiry || "Not specified"}\n\n${message}`,
        }),
        signal: AbortSignal.timeout(12_000),
      });
      if (!sent.ok)
        return reply(502, {
          error:
            "Your enquiry couldn’t be sent. Please email contact@ayyan.tech directly.",
        });
      const receipt = await sent.json();
      if (typeof receipt.messageId !== "string" || !receipt.messageId)
        return reply(502, {
          error:
            "We couldn’t confirm delivery. Please email contact@ayyan.tech directly.",
        });
      return reply(200, { ok: true });
    } catch {
      // Delivery can be ambiguous after a timeout. Never retry automatically.
      return reply(502, {
        error:
          "We couldn’t confirm delivery. Please email contact@ayyan.tech directly rather than sending the form again.",
      });
    }
  };
}
