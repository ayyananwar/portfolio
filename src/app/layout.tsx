import type { Metadata } from "next";
import { site, isPreviewDeployment } from "@/lib/site";
import "@fontsource-variable/manrope";
import "@fontsource-variable/dm-sans";
import "@fontsource/ibm-plex-mono/400.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  applicationName: "Ayyan Anwar Portfolio",
  authors: [{ name: "Ayyan Anwar", url: site.url }],
  creator: "Ayyan Anwar",
  alternates: { canonical: `${site.url}/` },
  robots: isPreviewDeployment()
    ? { index: false, follow: false }
    : {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, "max-image-preview": "large" },
      },
  openGraph: {
    title: site.title,
    description: site.description,
    url: `${site.url}/`,
    siteName: "Ayyan Anwar",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: site.image,
        width: 1200,
        height: 630,
        alt: "Ayyan Anwar — web applications, backend systems, and automation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    images: [site.image],
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
