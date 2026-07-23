import "./ajile.css";
import { experience } from "../assets/data/portfolio.json";
import Section from "./Section";
import { DoodleArrow } from "./Doodle";

interface Ajile {
  company: string;
  logo?: string;
  link?: string;
}

const ajile = (experience as unknown as Ajile[])[0];

function AjileStudio() {
  if (!ajile?.link) return null;

  return (
    <Section index="04" label="Studio" id="studio">
      <a
        className="ajile-cta"
        href={ajile.link}
        target="_blank"
        rel="noopener noreferrer"
      >
        {ajile.logo && (
          <img
            className="ajile-logo"
            src={ajile.logo}
            alt=""
            aria-hidden="true"
          />
        )}
        <p className="ajile-text">
          <strong>{ajile.company}</strong> — my team designs, builds, and ships
          digital products, fast. Got something in mind?
        </p>
        <span className="ajile-go">
          ajile.team
          <DoodleArrow className="ajile-arrow" />
        </span>
      </a>
    </Section>
  );
}

export default AjileStudio;
