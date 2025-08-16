import { hero } from "../assets/data/portfolio.json";

function HeroSection() {
  return (
      <div className="hero">
        <div className="hero_left">
          <h1>{hero.name}</h1>
          <h2>{hero.title} </h2>
          <p>{hero.tagline}</p>
        </div>
      </div>

  );
}

export default HeroSection;
