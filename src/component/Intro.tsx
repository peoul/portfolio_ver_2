import { useEffect, useState } from "react";
import "./intro.css";
import { hero } from "../assets/data/portfolio.json";
import { DoodleUnderline } from "./Doodle";
import { useWidth } from "./useWidth";

/** Total time before the overlay is torn out of the DOM (matches intro.css). */
const INTRO_MS = 3400;

/**
 * Welcome screen shown once on load, then wiped away to reveal the portfolio.
 *
 * The dismissal is driven by CSS (`animation-fill-mode: forwards`) rather than
 * JS, so the overlay still clears itself if hydration never runs — the
 * prerendered page is never left stuck behind it. React only removes the node
 * afterwards for cleanliness. Click or any key skips it.
 */
export default function Intro() {
  const [gone, setGone] = useState(false);
  const { ref, width } = useWidth<HTMLSpanElement>();

  useEffect(() => {
    // Respect reduced motion: no intro at all.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setGone(true);
      return;
    }

    const timer = window.setTimeout(() => setGone(true), INTRO_MS);
    const skip = () => {
      window.clearTimeout(timer);
      setGone(true);
    };

    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, []);

  // Hold the page still while the overlay is up.
  useEffect(() => {
    if (gone) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [gone]);

  if (gone) return null;

  return (
    <div className="intro" role="presentation">
      <div className="intro-top">
        <span className="wordmark">
          <span className="wordmark-dot" aria-hidden="true" />
          <span className="label">{hero.name}</span>
        </span>
        <span className="label">Portfolio — 2026</span>
      </div>

      <div className="intro-center">
        <span className="label intro-kicker">Welcome</span>
        <span className="intro-word" ref={ref}>
          Hello
          {width > 0 && (
            <DoodleUnderline
              width={Math.round(width) + 8}
              className="intro-underline"
            />
          )}
        </span>
        <p className="intro-sub">{hero.welcome}</p>
      </div>

      <div className="intro-bottom">
        <span className="label">Loading</span>
        <div className="intro-track">
          <span className="intro-bar" />
        </div>
        <span className="intro-count" aria-hidden="true" />
      </div>
    </div>
  );
}
