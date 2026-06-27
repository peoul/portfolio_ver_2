import { hero } from "../assets/data/portfolio.json";

function HeroSection() {
  return (
    <section className="hero">
      <p className="prompt">~ whoami</p>
      <h1>{hero.name}</h1>
      <p className="role">{hero.title}</p>
      <p className="tagline">{hero.tagline}</p>
    </section>
  );
}

export default HeroSection;
