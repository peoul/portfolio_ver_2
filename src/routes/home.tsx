import { useEffect, useState } from "react";
import "../App.css";
import type { Route } from "./+types/home";
import { hero, contact } from "../assets/data/portfolio.json";
import ModeIcon from "../assets/image/mode.svg?react";
import Intro from "../component/Intro";
import Scribble from "../component/Scribble";
import HeroSection from "../component/Hero";
import Terminal from "../component/Terminal";
import Experience from "../component/Experience";
import RecentProject from "../component/Recent";
import AjileStudio from "../component/AjileStudio";
import ContactSection from "../component/Contact";

const SITE_URL = "https://lyhong.dev";

export const meta: Route.MetaFunction = () => {
  const title = `${hero.name} — ${hero.title}`;
  const description =
    "Lyhong Peou is a full-stack developer and co-founder of AJILE Studio, designing, building, and shipping digital products fast. Explore selected work, experience, and skills.";
  const image = `${SITE_URL}/og-image.png`;

  return [
    { title },
    { name: "description", content: description },
    { name: "author", content: hero.name },
    { name: "robots", content: "index, follow" },
    { name: "theme-color", content: "#1a1a1a" },

    { property: "og:type", content: "website" },
    { property: "og:site_name", content: hero.name },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: SITE_URL },
    { property: "og:image", content: image },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:alt", content: title },

    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },

    { tagName: "link", rel: "canonical", href: SITE_URL },

    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@type": "Person",
        name: hero.name,
        url: SITE_URL,
        image,
        jobTitle: hero.title,
        email: `mailto:${contact.email}`,
        worksFor: {
          "@type": "Organization",
          name: "AJILE Studio",
          url: "https://ajile.team",
        },
        alumniOf: [
          { "@type": "CollegeOrUniversity", name: "Johns Hopkins University" },
          { "@type": "CollegeOrUniversity", name: "Oregon State University" },
        ],
        sameAs: [contact.linkedin, contact.github, "https://ajile.team"],
      },
    },
  ];
};

export default function Home() {
  // Dark is the default — it matches the CSS :root, so there is no theme
  // flash on first paint.
  const [dark, setDark] = useState(true);

  const toggleTheme = () => setDark((prev) => !prev);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <div className="shell">
      <Intro />

      <header className="topbar">
        <span className="wordmark">
          <span className="wordmark-dot" aria-hidden="true" />
          <span className="label">{hero.name} · Portfolio</span>
        </span>
        <div className="topbar-controls">
          <Scribble />

          <button
            className="mode_btn"
            onClick={toggleTheme}
            title={dark ? "Light mode" : "Dark mode"}
            aria-label="Toggle color theme"
          >
            <ModeIcon />
          </button>
        </div>
      </header>

      <main className="container">
        <HeroSection />
        <Terminal />
        <Experience />
        <RecentProject />
        <AjileStudio />
        <ContactSection />
      </main>
    </div>
  );
}
