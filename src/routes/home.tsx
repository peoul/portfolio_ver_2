import "../App.css";
import type { Route } from "./+types/home";
import { hero, contact } from "../assets/data/portfolio.json";
import Hero from "../component/Hero";
import Story from "../component/Story";
import Market from "../component/Market";
import Toolbox from "../component/Toolbox";
import Contact from "../component/Contact";
import RideBar from "../component/RideBar";

const SITE_URL = "https://lyhong.dev";

export const meta: Route.MetaFunction = () => {
  const title = `${hero.name} — ${hero.title}`;
  const description =
    "Lyhong Peou is a full-stack developer from Phnom Penh, now in the US, and co-founder of AJILE Studio. Take the ride: the story, the work, and what's next for Cambodian tech.";
  const image = `${SITE_URL}/og-image.png`;

  return [
    { title },
    { name: "description", content: description },
    { name: "author", content: hero.name },
    { name: "robots", content: "index, follow" },
    { name: "theme-color", content: "#e0262f" },

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
        alternateName: hero.kh,
        homeLocation: { "@type": "Country", name: "United States" },
        birthPlace: { "@type": "Place", name: `${hero.origin}, Cambodia` },
        email: `mailto:${contact.email}`,
        worksFor: {
          "@type": "Organization",
          name: "AJILE Studio",
          url: "https://ajile.studio",
        },
        alumniOf: [
          { "@type": "CollegeOrUniversity", name: "Johns Hopkins University" },
          { "@type": "CollegeOrUniversity", name: "Oregon State University" },
        ],
        sameAs: [contact.linkedin, contact.github, "https://ajile.studio"],
      },
    },
  ];
};

// The theme lives on <html data-theme>, stamped before first paint by the
// inline script in root.tsx; the switch's look is pure CSS off that
// attribute, so there's no React state to fall out of sync with it.
function toggleTheme() {
  const root = document.documentElement;
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", next);
  try {
    localStorage.setItem("theme", next);
  } catch {
    // storage blocked: the choice just won't persist
  }
}

export default function Home() {
  return (
    <div className="shell">
      <header className="topbar">
        <a className="brand" href="#top">
          <span className="brand-kh kh-sign" lang="km">
            {hero.kh}
          </span>
          <span className="brand-en">{hero.name}</span>
        </a>

        <button className="daynight" onClick={toggleTheme} aria-label="Switch between day and night">
          <span className="daynight-opt daynight-day">
            <span lang="km">ថ្ងៃ</span> Day
          </span>
          <span className="daynight-opt daynight-night">
            <span lang="km">យប់</span> Night
          </span>
        </button>
      </header>

      <main>
        <Hero />
        <Story />
        <Market />
        <Toolbox />
        <Contact />
      </main>

      <RideBar />
    </div>
  );
}
