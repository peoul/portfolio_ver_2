import "./ajile.css";
import { experience } from "../assets/data/portfolio.json";

interface Ajile {
  company: string;
  logo?: string;
  link?: string;
}

const ajile = (experience as unknown as Ajile[])[0];

function AjileStudio() {
  if (!ajile?.link) return null;

  return (
    <aside className="ajile-cta">
      {ajile.logo && (
        <img
          className="ajile-cta-logo"
          src={ajile.logo}
          alt=""
          aria-hidden="true"
        />
      )}
      <p className="ajile-cta-text">
        <strong>{ajile.company}</strong> — my team designs, builds, and ships
        digital products, fast. Got something in mind?
      </p>
      <a
        className="ajile-cta-link"
        href={ajile.link}
        target="_blank"
        rel="noopener noreferrer"
      >
        ajile.team ↗
      </a>
    </aside>
  );
}

export default AjileStudio;
