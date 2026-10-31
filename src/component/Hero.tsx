import "./hero.css";
import { hero } from "../assets/data/portfolio.json";
import Skyline from "./Skyline";

/**
 * Opening shot: a hand-painted Phnom Penh shop sign — Khmer name in Moul
 * up top, English underneath, the way every storefront in the city reads.
 */
export default function Hero() {
  const lines = hero.tagline;
  const last = lines[lines.length - 1];

  return (
    <section className="hero" id="top" aria-labelledby="hero-name">
      <p className="hero-greet">
        <span className="kh-sign" lang="km">
          ជំរាបសួរ
        </span>
        <span className="hero-greet-en">Hello, come on in.</span>
      </p>

      <div className="sign-hang">
        <div className="sign">
          <p className="sign-kh kh-sign" lang="km">
            {hero.kh}
          </p>
          <h1 className="sign-en" id="hero-name">
            {hero.name}
          </h1>
          <p className="sign-sub">
            <span>{hero.title}</span> <span aria-hidden="true">·</span> <span>{hero.role}</span>
          </p>
          <p className="sign-est">
            est. {hero.origin} <span aria-hidden="true">→</span> now in the {hero.now}
          </p>
          <span className="sign-open" aria-hidden="true">
            <span lang="km">បើក</span> Open
          </span>
        </div>
      </div>

      <p className="hero-tagline">
        {lines.slice(0, -1).map((line) => (
          <span key={line}>{line} </span>
        ))}
        <span className="hero-tagline-next riso">{last}</span>
      </p>

      <a className="hero-cue" href="#home">
        Hop in, scroll to ride <span aria-hidden="true">↓</span>
      </a>

      <div className="hero-street">
        <Skyline className="hero-skyline" />
      </div>
    </section>
  );
}
