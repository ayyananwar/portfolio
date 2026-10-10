import type { Metadata } from "next";
import "@fontsource-variable/manrope";
import "@fontsource-variable/dm-sans";
import "@fontsource/ibm-plex-mono/400.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ayyan Anwar — Web, backend & automation",
  description:
    "I build web applications, backend systems, and workflow automations. Explore selected projects and discuss a project with Ayyan Anwar.",
  openGraph: {
    title: "Ayyan Anwar — Web, backend & automation",
    description:
      "Selected work in software development, automation, and simulation research.",
    type: "website",
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
