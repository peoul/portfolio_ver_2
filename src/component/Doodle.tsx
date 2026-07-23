import { useEffect, useMemo, useRef, useState } from "react";
import rough from "roughjs";
import "./doodle.css";

/**
 * The doodle layer — the ONLY loose part of the design.
 *
 * Rules (from AESTHETIC.md): applies to icons, connectors, arrows, underlines,
 * and circles-around-things only. Never to layout containers. Strokes are
 * 1.5–2px, round cap/join, with deliberate imperfection. Marks sit ON TOP of
 * the rigid grid like someone annotated a printed manual.
 *
 * Everything is deterministic: roughjs runs with a fixed `seed`, so the paths
 * generated at prerender (SSG) match the ones generated during client
 * hydration — no mismatch. Marks draw on via stroke-dashoffset when scrolled
 * into view, and stay static under prefers-reduced-motion.
 */

const generator = rough.generator();

type RoughOpts = Parameters<typeof generator.line>[4];

const BASE: RoughOpts = {
  roughness: 1.15,
  bowing: 1.4,
  strokeWidth: 2,
  seed: 1,
};

/**
 * Round every number in a path to 2dp.
 *
 * roughjs derives ellipse points with Math.sin/Math.cos, which are
 * implementation-defined past ~15 significant digits — so V8 (Node, where the
 * prerender/SSR pass runs) and SpiderMonkey/JSC can disagree in the last ULP.
 * At full precision that lands in the `d` attribute and React reports a
 * hydration mismatch. 2dp is far below one device pixel at these sizes, and
 * quantising kills the engine noise.
 */
const quantise = (d: string) =>
  d.replace(/-?\d*\.\d+/g, (n) => String(Math.round(parseFloat(n) * 100) / 100));

function toDs(drawable: ReturnType<typeof generator.line>): string[] {
  return generator.toPaths(drawable).map((p) => quantise(p.d));
}

/** Arms the draw-on animation once the mark scrolls into view. */
function useDrawOnView() {
  const ref = useRef<SVGSVGElement>(null);
  // SSR / first paint: fully drawn (no flash for no-JS or reduced motion).
  const [state, setState] = useState<"static" | "armed" | "in">("static");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setState("armed"); // hide, ready to draw
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setState("in");
          io.disconnect();
        }
      },
      // No negative bottom margin: trailing/footer marks have nothing below
      // them to scroll past a dead strip, so they'd never trigger otherwise.
      { threshold: 0, rootMargin: "0px 0px 0px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return { ref, state };
}

interface SvgProps {
  w: number;
  h: number;
  paths: string[];
  className?: string;
  strokeWidth?: number;
  style?: React.CSSProperties;
}

function DoodleSvg({ w, h, paths, className = "", strokeWidth = 2, style }: SvgProps) {
  const { ref, state } = useDrawOnView();
  return (
    <svg
      ref={ref}
      className={`doodle doodle--${state} ${className}`}
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      style={style}
    >
      {paths.map((d, i) => (
        <path key={i} d={d} pathLength={100} />
      ))}
    </svg>
  );
}

/* ---------------------------------------------------------------- connectors */

/** A near-straight underline that wobbles. Spans the given width. */
export function DoodleUnderline({
  width,
  className,
}: {
  width: number;
  className?: string;
}) {
  const h = 10;
  const paths = useMemo(
    () =>
      toDs(
        generator.line(2, h / 2, width - 2, h / 2 + 1, {
          ...BASE,
          roughness: 1.5,
          bowing: 2.6,
          seed: 12,
        })
      ),
    [width]
  );
  return <DoodleSvg w={width} h={h} paths={paths} className={className} />;
}

/** Vertical timeline connector between two role nodes. */
export function DoodleConnector({
  height,
  className,
}: {
  height: number;
  className?: string;
}) {
  const w = 12;
  const paths = useMemo(
    () =>
      toDs(
        generator.line(w / 2, 2, w / 2 + 1, height - 2, {
          ...BASE,
          roughness: 1.1,
          bowing: 2,
          seed: 24,
        })
      ),
    [height]
  );
  return (
    <DoodleSvg w={w} h={height} paths={paths} className={className} strokeWidth={1.8} />
  );
}

/** A hollow node dot for the timeline / list markers. */
export function DoodleNode({ className }: { className?: string }) {
  const paths = useMemo(
    () => toDs(generator.circle(11, 11, 13, { ...BASE, roughness: 0.9, seed: 5 })),
    []
  );
  return <DoodleSvg w={22} h={22} paths={paths} className={className} strokeWidth={2} />;
}

/** A scribbled circle drawn around something, sized to fit. */
export function DoodleCircle({
  size = 44,
  className,
}: {
  size?: number;
  className?: string;
}) {
  const paths = useMemo(
    () =>
      toDs(
        generator.circle(size / 2, size / 2, size - 4, {
          ...BASE,
          roughness: 1.3,
          bowing: 1.1,
          seed: 8,
        })
      ),
    [size]
  );
  return <DoodleSvg w={size} h={size} paths={paths} className={className} strokeWidth={1.8} />;
}

/* -------------------------------------------------------------- arrows/icons */

const ICON = { w: 24, h: 24 };

/** → forward arrow, for list rows and CTAs. */
export function DoodleArrow({ className }: { className?: string }) {
  return (
    <DoodleSvg
      {...ICON}
      className={className}
      paths={["M3.6 12.3 L20 11.7", "M14 6.9 L20.4 12 L13.7 17"]}
    />
  );
}

/** ↗ external / outbound arrow. */
export function DoodleExternal({ className }: { className?: string }) {
  return (
    <DoodleSvg
      {...ICON}
      className={className}
      strokeWidth={1.8}
      paths={["M7.2 16.9 L16.6 7.2", "M10.2 6.7 L17.1 6.9 L16.9 13.7"]}
    />
  );
}

/** A pencil — marks the draw-on-the-page control. */
export function DoodlePencil({ className }: { className?: string }) {
  return (
    <DoodleSvg
      {...ICON}
      className={className}
      strokeWidth={1.8}
      paths={[
        "M3.8 20.4 L6.4 14.3 L16.6 4.2 C17.4 3.4 18.7 3.4 19.5 4.2 L20.3 5 C21.1 5.8 21.1 7.1 20.3 7.9 L10.1 18.1 L3.9 20.5",
        "M15.7 5.3 L19.3 8.9",
        "M6.4 14.3 L10.1 18.1",
      ]}
    />
  );
}

/** An eraser — marks the erase tool. */
export function DoodleEraser({ className }: { className?: string }) {
  return (
    <DoodleSvg
      {...ICON}
      className={className}
      strokeWidth={1.8}
      paths={[
        "M4 16.5 L12.4 8.1 C13.2 7.3 14.6 7.3 15.4 8.1 L20.1 12.8 C20.9 13.6 20.9 15 20.1 15.8 L15.3 20.6 L8 20.6 L3.9 16.4",
        "M9.1 11.5 L16.7 19.2",
        "M7.8 20.6 L20.5 20.5",
      ]}
    />
  );
}

/** A bin — clears the drawing. */
export function DoodleTrash({ className }: { className?: string }) {
  return (
    <DoodleSvg
      {...ICON}
      className={className}
      strokeWidth={1.8}
      paths={[
        "M4.2 6.4 L19.9 6.1",
        "M9.4 6.2 L9.6 3.9 L14.5 3.8 L14.6 6.1",
        "M6.2 6.3 L7.1 20.2 C7.2 21 7.8 21.6 8.6 21.6 L15.4 21.5 C16.2 21.5 16.8 20.9 16.9 20.1 L17.7 6.2",
        "M10.4 9.6 L10.6 18.2",
        "M13.6 9.5 L13.5 18.1",
      ]}
    />
  );
}

/** A tick — confirms/closes. */
export function DoodleCheck({ className }: { className?: string }) {
  return (
    <DoodleSvg
      {...ICON}
      className={className}
      strokeWidth={1.8}
      paths={["M4.6 12.7 L9.9 18.5 L19.7 5.7"]}
    />
  );
}

/** + section marker. */
export function DoodleMark({ className }: { className?: string }) {
  return (
    <DoodleSvg
      w={18}
      h={18}
      className={className}
      strokeWidth={1.8}
      paths={["M9 3.4 L9 14.8", "M3.4 9.2 L14.7 8.9"]}
    />
  );
}

/** A small hand-drawn heart — sign-off mark. */
export function DoodleHeart({ className }: { className?: string }) {
  return (
    <DoodleSvg
      {...ICON}
      className={className}
      strokeWidth={1.8}
      paths={[
        "M12 20.4 C3.8 14.4 4.4 7.6 8.5 7.1 C10.7 6.9 11.8 8.5 12 9.8 C12.3 8.4 13.6 6.9 15.7 7.2 C19.8 7.7 19.9 14.6 12 20.5",
      ]}
    />
  );
}

/* ------- hand-drawn glyphs (generic subjects — brand marks stay recognizable) */

export function DoodleCoffee({ className }: { className?: string }) {
  return (
    <DoodleSvg
      {...ICON}
      className={className}
      strokeWidth={1.8}
      paths={[
        "M5.8 9.4 L17.8 9.1 L16.6 19.6 C16.4 20.8 15.3 21.7 13.9 21.7 L9.5 21.7 C8.1 21.7 7.1 20.8 6.9 19.5 L5.7 9.3",
        "M17.6 10.9 C20.7 10.7 21.1 15.5 17.1 15.7",
        "M9.4 6.7 C8.9 5.6 10.4 4.8 9.7 3.5",
        "M13.5 6.7 C13 5.6 14.5 4.8 13.8 3.5",
      ]}
    />
  );
}

export function DoodleGamepad({ className }: { className?: string }) {
  return (
    <DoodleSvg
      {...ICON}
      className={className}
      strokeWidth={1.8}
      paths={[
        "M7.6 8.5 L16.5 8.3 C19.6 8.2 21.4 11 21.4 14 C21.5 16.1 20.4 17.9 18.6 17.9 C17 17.9 16.1 16.2 15 15.4 L9 15.6 C7.8 16.4 7 18 5.4 18 C3.6 18 2.5 16.1 2.7 14 C2.9 11 4.6 8.6 7.6 8.5 Z",
        "M6 12.7 L8.5 12.6",
        "M7.2 11.4 L7.2 13.9",
        "M16.6 12.3 a0.75 0.75 0 1 1 -0.02 0",
        "M18.2 14 a0.75 0.75 0 1 1 -0.02 0",
      ]}
    />
  );
}

export function DoodleServer({ className }: { className?: string }) {
  return (
    <DoodleSvg
      {...ICON}
      className={className}
      strokeWidth={1.8}
      paths={[
        "M4.4 5.5 L19.7 5.1 L19.9 10.1 L4.3 10.3 L4.4 5.4",
        "M4.3 13 L19.8 12.6 L19.9 17.9 L4.2 18.1 L4.3 12.9",
        "M6.6 7.7 L7.5 7.6",
        "M15.8 7.6 L18 7.6",
        "M6.6 15.5 L7.5 15.4",
        "M15.8 15.4 L18 15.4",
      ]}
    />
  );
}
