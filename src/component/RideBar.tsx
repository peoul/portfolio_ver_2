import "./ride.css";
import { useEffect, useRef, useState } from "react";
import { STOPS, khNum } from "./stops";
import Tuktuk from "./Tuktuk";

// A stop is "reached" when its chapter's top passes this fraction of the
// viewport — the same line a click on the stop scrolls it to.
const ARRIVE = 0.15;

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/**
 * The road along the bottom of the screen. Scroll progress drives the
 * tuk-tuk (position, wheel spin, facing) through CSS custom properties set
 * straight on the element, so scrolling never re-renders React; stop
 * positions are re-measured only when the layout changes size.
 */
export default function RideBar() {
  const barRef = useRef<HTMLElement>(null);
  const stopsRef = useRef<number[]>([]);
  const [stops, setStops] = useState<number[] | null>(null);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const maxScroll = () => Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const sectionTop = (id: string) => {
      const el = document.getElementById(id);
      return el ? el.getBoundingClientRect().top + window.scrollY : 0;
    };

    let lastY = window.scrollY;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const p = clamp01(y / maxScroll());
      bar.style.setProperty("--p", String(p));
      bar.style.setProperty("--spin", `${y * 0.9}deg`);
      if (y !== lastY) bar.dataset.dir = y < lastY ? "back" : "forward";
      lastY = y;

      let current = -1;
      stopsRef.current.forEach((s, i) => {
        if (p >= s - 0.002) current = i;
      });
      setActive(current);
    };

    const measure = () => {
      const max = maxScroll();
      const next = STOPS.map(({ id }) =>
        clamp01((sectionTop(id) - window.innerHeight * ARRIVE) / max),
      );
      stopsRef.current = next;
      setStops(next);
      update();
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - window.innerHeight * ARRIVE;
    window.scrollTo({ top });
  };

  return (
    <nav ref={barRef} className="ride" aria-label="Story stops" data-dir="forward">
      <div className="ride-track">
        <div className="ride-road" aria-hidden="true" />
        {STOPS.map(({ id, en, kh }, i) => (
          <button
            key={id}
            className={`ride-stop${i === active ? " is-here" : ""}${i < active ? " is-passed" : ""}`}
            style={stops ? { "--at": stops[i] } as React.CSSProperties : undefined}
            onClick={() => go(id)}
            aria-current={i === active ? "location" : undefined}
            title={`${en} · ${kh}`}
          >
            <span className="ride-num kh-poster" aria-hidden="true">
              {khNum(i + 1)}
            </span>
            <span className="ride-label">{en}</span>
          </button>
        ))}
        <div className="ride-tt" aria-hidden="true">
          <Tuktuk />
        </div>
      </div>
    </nav>
  );
}
