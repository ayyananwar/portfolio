import { Portfolio } from "@/components/portfolio";
import { profile } from "@/lib/content";
import { site } from "@/lib/site";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${site.url}/#person`,
      name: profile.name,
      url: `${site.url}/`,
      image: `${site.url}/images/ayyan-about.jpg`,
      description: profile.about,
      sameAs: [profile.github, profile.linkedin],
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      name: "Ayyan Anwar",
      url: `${site.url}/`,
      inLanguage: "en",
      publisher: { "@id": `${site.url}/#person` },
    },
    {
      "@type": "ProfilePage",
      "@id": `${site.url}/#profile`,
      url: `${site.url}/`,
      name: site.title,
      mainEntity: { "@id": `${site.url}/#person` },
      isPartOf: { "@id": `${site.url}/#website` },
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <Portfolio />
    </>
  );
}
