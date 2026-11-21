export const site = {
  url: "https://www.ayyan.tech",
  title: "Ayyan Anwar | Full-stack Developer & Automation",
  description:
    "Ayyan Anwar builds web applications, backend systems, and workflow automations. Explore software projects, applied research, and contact details.",
  image: "/images/social-preview.png",
};

export function isPreviewDeployment() {
  return Boolean(
    process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production",
  );
}
