/**
 * Turns a sampled pointer path into a filled pencil-stroke outline.
 *
 * A constant-width `stroke` reads as a marker. A real pencil varies: it thins
 * as the hand moves faster, thickens under pressure, and tapers at both ends
 * where the tip lifts. So instead of stroking a centre line, we walk the
 * points, offset each one along its normal by a per-point half-width, and
 * close the two sides into a single filled polygon.
 */

export interface StrokePoint {
  x: number;
  y: number;
  /** Per-point width multiplier, from speed + pressure. */
  w: number;
}

/** Nominal nib width in px, before per-point modulation. */
export const NIB = 3.6;

const f = (n: number) => Math.round(n * 100) / 100;

/** How many points at each end are ramped down to a tapered tip. */
const taperOver = (n: number) => Math.max(1, Math.min(6, Math.floor(n / 3)));

export function strokeOutline(pts: StrokePoint[]): string {
  if (!pts.length) return "";

  // A tap with no travel leaves a round dot.
  if (pts.length === 1) {
    const { x, y, w } = pts[0];
    const r = f((NIB * w) / 2);
    return `M${f(x - r)} ${f(y)} a${r} ${r} 0 1 0 ${f(r * 2)} 0 a${r} ${r} 0 1 0 ${f(-r * 2)} 0 Z`;
  }

  const n = pts.length;
  const ramp = taperOver(n);
  const left: string[] = [];
  const right: string[] = [];

  for (let i = 0; i < n; i++) {
    const prev = pts[Math.max(0, i - 1)];
    const next = pts[Math.min(n - 1, i + 1)];

    let dx = next.x - prev.x;
    let dy = next.y - prev.y;
    const len = Math.hypot(dx, dy) || 1;
    dx /= len;
    dy /= len;

    // Normal to the direction of travel.
    const nx = -dy;
    const ny = dx;

    // Ease the tip in and out so ends come to a point.
    const edge = Math.min(i, n - 1 - i);
    const taper = edge >= ramp ? 1 : 0.25 + 0.75 * (edge / ramp);

    const half = (NIB * pts[i].w * taper) / 2;

    left.push(`${f(pts[i].x + nx * half)} ${f(pts[i].y + ny * half)}`);
    right.push(`${f(pts[i].x - nx * half)} ${f(pts[i].y - ny * half)}`);
  }

  // Up one side, back down the other.
  return `M${left[0]} L${left.slice(1).join(" L")} L${right
    .reverse()
    .join(" L")} Z`;
}

/**
 * Width multiplier for a new sample: faster strokes are thinner, pressure
 * (stylus) thickens. Mice report a flat 0.5, which lands at ~1.0.
 */
export function nibWidth(speed: number, pressure: number, previous: number) {
  const bySpeed = 1 - Math.min(0.55, speed * 0.18);
  const byPressure = pressure > 0 ? 0.4 + pressure * 1.2 : 1;
  const target = Math.max(0.35, Math.min(1.4, bySpeed * byPressure));
  // Smooth against the last sample so the edge doesn't shimmer.
  return previous ? previous * 0.7 + target * 0.3 : target;
}
