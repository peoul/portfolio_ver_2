import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./scribble.css";
import {
  DoodlePencil,
  DoodleEraser,
  DoodleTrash,
  DoodleCheck,
} from "./Doodle";
import { strokeOutline, nibWidth, type StrokePoint } from "./strokeOutline";

type Tool = "draw" | "erase";

/** Ignore samples closer than this, so the outline stays clean. */
const MIN_STEP = 1.6;

/** Eraser reach, in px, around the pointer. */
const ERASER_RADIUS = 12;

/**
 * Lets a visitor scribble on the page — the doodle layer, but theirs.
 *
 * The canvas is an absolutely positioned SVG portalled to <body> and sized to
 * the whole document, so marks are anchored to the page and scroll with the
 * content rather than floating over the viewport. Coordinates come straight
 * from pageX/pageY, which are already document-relative, so no transform maths
 * is needed.
 *
 * Nothing renders until the visitor turns it on, so there is no SSR output and
 * no hydration surface. Strokes are deliberately not roughened — a real hand
 * already supplies the wobble.
 */
export default function Scribble() {
  const [active, setActive] = useState(false);
  const [tool, setTool] = useState<Tool>("draw");
  const [strokes, setStrokes] = useState<string[]>([]);
  const [current, setCurrent] = useState<string | null>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  const points = useRef<StrokePoint[]>([]);
  const lastAt = useRef(0);
  const erasing = useRef(false);
  const svgRef = useRef<SVGSVGElement>(null);

  // Size the canvas to the full document, and keep it in step.
  useEffect(() => {
    if (!active) return;
    const measure = () => {
      const doc = document.documentElement;
      setSize({
        w: Math.max(doc.scrollWidth, window.innerWidth),
        h: Math.max(doc.scrollHeight, window.innerHeight),
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [active]);

  // Escape leaves draw mode.
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  /**
   * Whole-stroke eraser. Uses the browser's own hit-testing against the
   * rendered paths — the canvas has no viewBox and sits at the document
   * origin, so page coordinates are already the SVG's user space. Strokes are
   * filled outlines rather than stroked centre lines, so this tests fill.
   * A ring of samples gives the eraser a radius rather than demanding a
   * pixel-perfect hit on a thin line.
   */
  const eraseAt = useCallback((x: number, y: number) => {
    const svg = svgRef.current;
    if (!svg) return;

    const samples: [number, number][] = [[0, 0]];
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      samples.push([
        Math.cos(a) * ERASER_RADIUS,
        Math.sin(a) * ERASER_RADIUS,
      ]);
    }

    const hit = new Set<number>();
    svg.querySelectorAll<SVGPathElement>("path[data-i]").forEach((path) => {
      const i = Number(path.dataset.i);
      for (const [dx, dy] of samples) {
        if (path.isPointInFill(new DOMPoint(x + dx, y + dy))) {
          hit.add(i);
          return;
        }
      }
    });

    if (hit.size) setStrokes((s) => s.filter((_, i) => !hit.has(i)));
  }, []);

  const start = (e: React.PointerEvent<SVGSVGElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    if (tool === "erase") {
      erasing.current = true;
      eraseAt(e.pageX, e.pageY);
      return;
    }
    lastAt.current = e.timeStamp;
    points.current = [
      { x: e.pageX, y: e.pageY, w: nibWidth(0, e.pressure, 0) },
    ];
    setCurrent(strokeOutline(points.current));
  };

  const move = (e: React.PointerEvent<SVGSVGElement>) => {
    if (tool === "erase") {
      if (erasing.current) eraseAt(e.pageX, e.pageY);
      return;
    }
    const pts = points.current;
    if (!pts.length) return;

    const last = pts[pts.length - 1];
    const dist = Math.hypot(e.pageX - last.x, e.pageY - last.y);
    if (dist < MIN_STEP) return;

    const dt = Math.max(1, e.timeStamp - lastAt.current);
    lastAt.current = e.timeStamp;

    pts.push({
      x: e.pageX,
      y: e.pageY,
      w: nibWidth(dist / dt, e.pressure, last.w),
    });
    setCurrent(strokeOutline(pts));
  };

  const end = () => {
    if (tool === "erase") {
      erasing.current = false;
      return;
    }
    if (!points.current.length) return;
    const d = strokeOutline(points.current);
    if (d) setStrokes((s) => [...s, d]);
    points.current = [];
    setCurrent(null);
  };

  return (
    <>
      <button
        className="draw_btn"
        onClick={() => setActive((a) => !a)}
        aria-pressed={active}
        title={active ? "Stop drawing" : "Draw on the page"}
      >
        <DoodlePencil className="draw_btn-icon" />
        <span className="label">Draw</span>
      </button>

      {active &&
        createPortal(
          <>
            <svg
              ref={svgRef}
              className="scribble-canvas"
              data-tool={tool}
              width={size.w}
              height={size.h}
              onPointerDown={start}
              onPointerMove={move}
              onPointerUp={end}
              onPointerCancel={end}
            >
              <defs>
                {/* Roughens the outline edges so it reads as graphite rather
                    than vector. Applied per stroke to keep each filter region
                    small. */}
                <filter id="pencil-grain" x="-15%" y="-15%" width="130%" height="130%">
                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.85"
                    numOctaves={2}
                    seed={7}
                    result="noise"
                  />
                  <feDisplacementMap
                    in="SourceGraphic"
                    in2="noise"
                    scale="1.7"
                    xChannelSelector="R"
                    yChannelSelector="G"
                  />
                </filter>
              </defs>

              {strokes.map((d, i) => (
                <path key={i} data-i={i} d={d} filter="url(#pencil-grain)" />
              ))}
              {current && <path d={current} />}
            </svg>

            <div className="scribble-bar">
              <div className="scribble-tools">
                <button
                  className="scribble-tool"
                  aria-pressed={tool === "draw"}
                  onClick={() => setTool("draw")}
                  title="Pencil"
                >
                  <DoodlePencil className="scribble-icon" />
                </button>
                <button
                  className="scribble-tool"
                  aria-pressed={tool === "erase"}
                  onClick={() => setTool("erase")}
                  title="Eraser"
                >
                  <DoodleEraser className="scribble-icon" />
                </button>
              </div>

              <span className="scribble-sep" aria-hidden="true" />

              <button
                className="scribble-tool"
                onClick={() => setStrokes([])}
                disabled={!strokes.length}
                title="Clear all"
              >
                <DoodleTrash className="scribble-icon" />
              </button>

              <button
                className="scribble-tool scribble-done"
                onClick={() => setActive(false)}
                title="Done"
              >
                <DoodleCheck className="scribble-icon" />
              </button>
            </div>
          </>,
          document.body
        )}
    </>
  );
}
