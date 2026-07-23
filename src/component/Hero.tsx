import { hero } from "../assets/data/portfolio.json";
import { DoodleUnderline } from "./Doodle";
import { useWidth } from "./useWidth";

function HeroSection() {
  const { ref, width } = useWidth<HTMLSpanElement>();

  return (
    <section className="hero">
      <div className="hero-eyebrow">
        <span className="idx">00</span>
        <span className="label">Portfolio — 2026</span>
      </div>

      <h1>{hero.name}</h1>

      <span className="hero-role" ref={ref}>
        {hero.title}
        {width > 0 && (
          <DoodleUnderline width={Math.round(width) + 8} className="hero-underline" />
        )}
      </span>

      <p className="hero-tagline">{hero.tagline}</p>
    </section>
  );
}

export default HeroSection;
