import { createContactHandler } from "@/lib/contact-handler";
export const POST = createContactHandler({
  settings: () => ({
    apiKey: process.env.BREVO_API_KEY,
    sender: process.env.BREVO_SENDER_EMAIL,
    recipient: process.env.CONTACT_TO_EMAIL || "contact@ayyan.tech",
    siteUrl: process.env.SITE_URL,
  }),
  fetch: (...args) => fetch(...args),
});
