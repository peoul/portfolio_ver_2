import "./skyline.css";
import { TuktukShape } from "./Tuktuk";

/*
 * Phnom Penh, printed in riso inks. Red = the old city (Independence
 * Monument, the National Museum, Wat Phnom). Gold = the Royal Palace.
 * Blue = the new and the colonial-modern (Central Market, Vattanac Tower,
 * cranes). Shophouses, sugar palms and the knotted power lines sit in front
 * in black. Cream linework is knocked out of the inks for detail, and a
 * halftone dot screen shades the right-hand faces.
 *
 * The scene is very wide (3000×340, street level y=310) and drawn with the
 * landmarks packed around the centre, so `slice` only ever crops the sides:
 * a phone sees Monument → Palace → Museum, a wide screen sees the whole
 * city. hero.css keeps the box at least 100vw / (3000/340) tall so it never
 * crops top-to-bottom.
 */

const W = 3000;
const GROUND = 310;

const f = (n: number) => Math.round(n * 10) / 10;

// Spans the landmarks stand on; the shophouse row leaves them clear.
// Left to right the street runs from the past to the future: Angkor, the
// old city, the palace, then the colonial-modern market and the towers.
const RESERVED: [number, number][] = [
  [388, 772], // Angkor Wat
  [772, 1045], // Wat Phnom
  [1140, 1320], // Independence Monument
  [1330, 1652], // Royal Palace
  [1660, 1920], // National Museum
  [1922, 2240], // Central Market
];

const WIDTHS = [56, 48, 62, 44, 52, 60, 46, 58, 50];
const HEIGHTS = [92, 72, 104, 56, 88, 110, 78, 96, 64, 84];

const HOUSES = (() => {
  const out: [number, number, number][] = [];
  let x = 0;
  let i = 0;
  while (x < W) {
    const w = WIDTHS[i % WIDTHS.length];
    const clash = RESERVED.find(([a, b]) => x + w > a && x < b);
    if (clash) {
      x = clash[1];
      continue;
    }
    out.push([x, w, HEIGHTS[i % HEIGHTS.length]]);
    x += w;
    i++;
  }
  return out;
})();

// [x, width, height, style]
const TOWERS: [number, number, number, "flat" | "crown" | "setback" | "mast"][] = [
  [2420, 46, 170, "setback"],
  [2475, 60, 130, "flat"],
  [2560, 40, 212, "crown"],
  [2700, 56, 160, "setback"],
  [2770, 44, 240, "mast"],
  [2880, 60, 150, "crown"],
  [2940, 44, 196, "mast"],
];

const PALMS = [150, 372, 1098, 1325, 1656, 1921, 2252, 2650, 2970];

// Groups of poles strung together; nothing is wired across the landmarks.
const POLE_RUNS = [
  [20, 340],
  [2260, 2600, 2980],
];

/* ---------- Khmer roof vocabulary ---------- */

type Ink = "gold" | "trad";

/** Concave slope: hugs the eave, then sweeps up to the ridge. */
function slope(cx: number, half: number, yE: number, yT: number, top: number, side: -1 | 1) {
  const dx = half - top;
  const dy = yE - yT;
  return {
    eave: `${cx + side * half} ${yE}`,
    ctrl: `${f(cx + side * (top + dx * 0.32))} ${f(yE - dy * 0.1)}`,
    ridge: `${cx + side * top} ${yT}`,
  };
}

/** Eave tips flicking up, like the hang hong on a Khmer roof. */
const flicks = (cx: number, half: number, yE: number, size = 9) =>
  `M${cx - half} ${yE} q${-size * 0.8} 0 ${-size} ${-size} M${cx + half} ${yE} q${size * 0.8} 0 ${size} ${-size}`;

/** A long hipped roof tier, ridge `top` wide. */
function Roof({ cx, half, yE, yT, top, ink }: { cx: number; half: number; yE: number; yT: number; top: number; ink: Ink }) {
  const L = slope(cx, half, yE, yT, top, -1);
  const R = slope(cx, half, yE, yT, top, 1);
  return (
    <g>
      <path className={`sk-${ink}`} d={`M${L.eave} Q${L.ctrl} ${L.ridge} H${cx + top} Q${R.ctrl} ${R.eave} Z`} />
      <path className="sk-shade" d={`M${cx} ${yT} H${cx + top} Q${R.ctrl} ${R.eave} H${cx} Z`} />
      <path className="sk-detail" d={`M${cx - half + 10} ${yE - 3} H${cx + half - 10}`} />
      <path className={`sk-${ink}-line`} d={flicks(cx, half, yE)} />
    </g>
  );
}

/** A pointed front gable with naga bargeboards and a chofa at the apex. */
function Gable({ cx, half, yE, yT, ink }: { cx: number; half: number; yE: number; yT: number; ink: Ink }) {
  const L = slope(cx, half, yE, yT, 0, -1);
  const R = slope(cx, half, yE, yT, 0, 1);
  const iL = slope(cx, half - 6, yE - 3, yT + 9, 0, -1);
  const iR = slope(cx, half - 6, yE - 3, yT + 9, 0, 1);
  return (
    <g>
      <path className={`sk-${ink}`} d={`M${L.eave} Q${L.ctrl} ${cx} ${yT} Q${R.ctrl} ${R.eave} Z`} />
      <path className="sk-shade" d={`M${cx} ${yT} Q${R.ctrl} ${R.eave} H${cx} Z`} />
      <path className="sk-detail" d={`M${iL.eave} Q${iL.ctrl} ${cx} ${yT + 9} Q${iR.ctrl} ${iR.eave}`} />
      <path
        className={`sk-${ink}-line`}
        d={`${flicks(cx, half, yE, 8)} M${cx} ${yT} q-1 -8 3 -15`}
      />
    </g>
  );
}

/** A tapering spire whose sides curve in, ringed with cream bands. */
function Spire({ cx, yb, yt, half, ink, rings = 4 }: { cx: number; yb: number; yt: number; half: number; ink: Ink; rings?: number }) {
  const h = yb - yt;
  return (
    <g>
      <path
        className={`sk-${ink}`}
        d={`M${cx - half} ${yb} Q${cx - half * 0.2} ${f(yb - h * 0.35)} ${cx} ${yt} Q${cx + half * 0.2} ${f(yb - h * 0.35)} ${cx + half} ${yb} Z`}
      />
      <path
        className="sk-detail"
        d={Array.from({ length: rings }, (_, i) => {
          const y = yb - (h * (i + 1)) / (rings + 2);
          const w = half * (1 - (i + 1) / (rings + 1.4));
          return `M${f(cx - w)} ${f(y)} H${f(cx + w)}`;
        }).join(" ")}
      />
    </g>
  );
}

/** Columns knocked out of a wall. */
const columns = (x1: number, x2: number, y1: number, y2: number, step: number) =>
  Array.from({ length: Math.floor((x2 - x1) / step) + 1 }, (_, i) => `M${x1 + i * step} ${y1} V${y2}`).join(" ");

/* ---------- landmarks ---------- */

/**
 * Independence Monument: a terraced plinth, an open pillared storey you can
 * see through, a wide cornice, then a lotus-bud tower of tiers that curve
 * in to a rounded tip, every tier bristling with naga heads.
 */
function Monument({ cx }: { cx: number }) {
  // [bottom width, height] per tier; the shrinking steps give the bullet curve
  const spec: [number, number][] = [
    [70, 22],
    [62, 20],
    [53, 18],
    [44, 16],
    [34, 14],
    [24, 12],
  ];
  let y = 206;
  const tiers = spec.map(([wb, h]) => {
    const t = { wb, wt: wb - 8, yb: y, yt: y - h };
    y -= h;
    return t;
  });
  const top = y;

  return (
    <g>
      <g className="sk-trad">
        {/* terraced plinth */}
        <rect x={cx - 92} y={302} width={184} height={8} />
        <rect x={cx - 76} y={293} width={152} height={9} />
        <rect x={cx - 60} y={284} width={120} height={9} />
        {/* open pillared storey: two openings show the sky through it */}
        <path
          fillRule="evenodd"
          d={`M${cx - 38} 284 V226 H${cx + 38} V284 Z M${cx - 29} 280 V244 q9 -8 18 0 V280 Z M${cx + 11} 280 V244 q9 -8 18 0 V280 Z`}
        />
        {/* cornice */}
        <rect x={cx - 48} y={216} width={96} height={10} />
        <rect x={cx - 41} y={206} width={82} height={10} />
        {tiers.map(({ wb, wt, yb, yt }) => (
          <path
            key={yb}
            d={`M${cx - wb / 2} ${yb} Q${cx - wt / 2} ${yb - 4} ${cx - wt / 2} ${yt} H${cx + wt / 2} Q${cx + wt / 2} ${yb - 4} ${cx + wb / 2} ${yb} Z`}
          />
        ))}
        {/* rounded lotus-bud tip */}
        <path d={`M${cx - 9} ${top} C${cx - 11} ${top - 12} ${cx - 4} ${top - 20} ${cx} ${top - 24} C${cx + 4} ${top - 20} ${cx + 11} ${top - 12} ${cx + 9} ${top} Z`} />
      </g>
      <path
        className="sk-shade"
        fillRule="evenodd"
        d={`M${cx + 6} 284 V226 H${cx + 38} V284 Z M${cx + 11} 280 V244 q9 -8 18 0 V280 Z ${tiers
          .map(({ wb, wt, yb, yt }) => `M${cx} ${yt} H${cx + wt / 2} Q${cx + wt / 2} ${yb - 4} ${cx + wb / 2} ${yb} H${cx} Z`)
          .join(" ")}`}
      />
      <path
        className="sk-detail"
        d={`M${cx - 72} 297 H${cx + 72} M${cx - 56} 288 H${cx + 56} M${cx - 44} 220 H${cx + 44} M${cx - 38} 232 H${cx + 38} ${tiers
          .map(({ wt, yt }) => `M${f(cx - wt / 2 + 3)} ${yt + 4} H${f(cx + wt / 2 - 3)}`)
          .join(" ")}`}
      />
      {/* naga heads: big at the cornice and tier corners, small between */}
      <path
        className="sk-trad-line"
        d={`M${cx - 48} 217 q-7 -2 -10 -14 M${cx + 48} 217 q7 -2 10 -14 ${tiers
          .map(({ wt, yt }) => {
            const corners = `M${cx - wt / 2} ${yt + 2} q-5 -2 -7 -11 M${cx + wt / 2} ${yt + 2} q5 -2 7 -11`;
            const between = [-0.22, 0.22].map((t) => `M${f(cx + t * wt)} ${yt} q-2 -4 1 -7`).join(" ");
            return `${corners} ${between}`;
          })
          .join(" ")}`}
      />
      <path className="sk-trad-line" strokeWidth={2} d={`M${cx} ${top - 24} V${top - 34}`} />
    </g>
  );
}

/** The Cambodian flag on its pole: blue, red, blue, Angkor in white. */
function Flag({ x }: { x: number }) {
  const y = 196;
  return (
    <g>
      <path className="sk-wire sk-wire--bold" d={`M${x} ${GROUND} V${y - 4}`} />
      <rect className="sk-flag-blue" x={x + 1} y={y} width={30} height={20} />
      <rect className="sk-flag-red" x={x + 1} y={y + 5} width={30} height={10} />
      <path
        className="sk-flag-white"
        d={`M${x + 8} ${y + 14} V${y + 11} h2 v-2 h1.5 v-2 l1.5 -2 l1.5 2 v2 h1.5 v2 h2 v-3 l1.5 -2 l1.5 2 v3 h2 v3 Z`}
      />
    </g>
  );
}

/**
 * Angkor Wat, not in Phnom Penh but on every Cambodian heart (and flag):
 * three stepped galleries and five lotus-bud towers, the centre one highest.
 */
function AngkorWat({ cx }: { cx: number }) {
  // [dx, base y, height, width] — outer pair, inner pair, centre
  const towers: [number, number, number, number][] = [
    [-82, 246, 64, 26],
    [82, 246, 64, 26],
    [-46, 240, 80, 28],
    [46, 240, 80, 28],
    [0, 234, 116, 36],
  ];
  const bud = (x: number, yb: number, h: number, w: number) =>
    `M${x - w / 2} ${yb} C${x - w / 2 - 1} ${f(yb - h * 0.5)} ${f(x - w * 0.26)} ${f(yb - h * 0.86)} ${x} ${yb - h} C${f(x + w * 0.26)} ${f(yb - h * 0.86)} ${x + w / 2 + 1} ${f(yb - h * 0.5)} ${x + w / 2} ${yb} Z`;
  // tier rings across a bud, crowding together towards the tip
  const rings = (x: number, yb: number, h: number, w: number) =>
    Array.from({ length: 6 }, (_, i) => {
      const t = 1 - (1 - (i + 1) / 7) ** 1.4;
      const yy = yb - h * t * 0.9;
      const half = (w / 2) * Math.sqrt(1 - t * 0.85);
      return `M${f(x - half)} ${f(yy)} H${f(x + half)} M${f(x - half - 2)} ${f(yy)} l-2 -3 M${f(x + half + 2)} ${f(yy)} l2 -3`;
    }).join(" ");

  return (
    <g>
      <g className="sk-trad">
        {/* galleries, each with its own long roof */}
        <rect x={cx - 186} y={288} width={372} height={22} />
        <path d={`M${cx - 192} 290 Q${cx - 150} 280 ${cx - 120} 280 H${cx + 120} Q${cx + 150} 280 ${cx + 192} 290 Z`} />
        <rect x={cx - 130} y={264} width={260} height={24} />
        <path d={`M${cx - 136} 266 Q${cx - 104} 256 ${cx - 80} 256 H${cx + 80} Q${cx + 104} 256 ${cx + 136} 266 Z`} />
        <rect x={cx - 98} y={246} width={196} height={18} />
        {towers.map(([dx, yb, h, w]) => (
          <g key={dx}>
            <rect x={cx + dx - w / 2 - 4} y={yb} width={w + 8} height={6} />
            <path d={bud(cx + dx, yb, h, w)} />
          </g>
        ))}
      </g>
      <path
        className="sk-shade"
        d={`M${cx} 246 H${cx + 98} V264 H${cx + 130} V288 H${cx + 186} V310 H${cx} Z ${towers
          .filter(([dx]) => dx >= 0)
          .map(([dx, yb, h, w]) => `M${cx + dx} ${yb} V${yb - h} C${f(cx + dx + w * 0.26)} ${f(yb - h * 0.86)} ${cx + dx + w / 2 + 1} ${f(yb - h * 0.5)} ${cx + dx + w / 2} ${yb} Z`)
          .join(" ")}`}
      />
      <path
        className="sk-detail"
        d={`${columns(cx - 178, cx + 178, 294, 308, 10)} ${columns(cx - 122, cx + 122, 270, 286, 10)} ${columns(cx - 90, cx + 90, 250, 262, 10)} ${towers
          .map(([dx, yb, h, w]) => rings(cx + dx, yb, h, w))
          .join(" ")}`}
      />
      <path className="sk-trad-line" strokeWidth={2} d={`M${cx} 118 V108`} />
    </g>
  );
}

/** The Throne Hall: three sweeping roof tiers, cross gables, and the prasat spire. */
function Palace({ cx }: { cx: number }) {
  const tiers: [number, number][] = [
    [34, 176],
    [28, 164],
    [23, 152],
    [18, 140],
    [13, 128],
  ];
  return (
    <g className="sk-palace">
      <g className="sk-gold">
        <rect x={cx - 158} y={300} width={316} height={10} />
        <rect x={cx - 150} y={292} width={300} height={8} />
        <rect x={cx - 128} y={254} width={256} height={38} />
      </g>
      <path className="sk-shade" d={`M${cx} 254 H${cx + 128} V292 H${cx} Z`} />
      <path className="sk-detail" d={`${columns(cx - 120, cx + 120, 262, 292, 16)} M${cx - 146} 296 H${cx + 146} M${cx - 128} 258 H${cx + 128}`} />

      <Roof cx={cx} half={152} yE={260} yT={238} top={120} ink="gold" />
      <Gable cx={cx - 128} half={26} yE={262} yT={222} ink="gold" />
      <Gable cx={cx + 128} half={26} yE={262} yT={222} ink="gold" />
      <Roof cx={cx} half={120} yE={240} yT={216} top={86} ink="gold" />
      <Roof cx={cx} half={88} yE={218} yT={198} top={54} ink="gold" />
      <Gable cx={cx} half={48} yE={264} yT={214} ink="gold" />
      <Gable cx={cx} half={36} yE={236} yT={194} ink="gold" />

      {/* the prasat: a stack of horned tiers, a face tower, then the spire */}
      <g className="sk-gold">
        <rect x={cx - 20} y={176} width={40} height={20} />
        {tiers.map(([w, yb]) => (
          <path
            key={yb}
            d={`M${cx - w / 2} ${yb} L${cx - w / 2 + 2} ${yb - 12} H${cx + w / 2 - 2} L${cx + w / 2} ${yb} Z`}
          />
        ))}
        <path d={`M${cx - 7} 116 Q${cx - 9} 106 ${cx} 98 Q${cx + 9} 106 ${cx + 7} 116 Z`} />
      </g>
      <path
        className="sk-gold-line"
        d={tiers.map(([w, yb]) => `M${cx - w / 2 + 2} ${yb - 12} q-5 -2 -6 -9 M${cx + w / 2 - 2} ${yb - 12} q5 -2 6 -9`).join(" ")}
      />
      <path className="sk-detail" d={`M${cx - 16} 182 H${cx + 16} M${cx - 4} 106 h8`} />
      <Spire cx={cx} yb={100} yt={36} half={6} ink="gold" />
    </g>
  );
}

/** National Museum: terracotta wings and a stack of steep, curving gables. */
function Museum({ cx }: { cx: number }) {
  return (
    <g>
      <g className="sk-trad">
        <rect x={cx - 128} y={300} width={256} height={10} />
        <rect x={cx - 118} y={270} width={236} height={30} />
        <rect x={cx - 40} y={242} width={80} height={58} />
      </g>
      <path className="sk-shade" d={`M${cx} 270 H${cx + 118} V300 H${cx} Z`} />
      <path
        className="sk-detail"
        d={`${columns(cx - 110, cx - 50, 276, 300, 12)} ${columns(cx + 50, cx + 110, 276, 300, 12)} M${cx - 12} 300 V282 q12 -14 24 0 V300`}
      />
      <Roof cx={cx} half={132} yE={272} yT={250} top={100} ink="trad" />
      <Gable cx={cx - 116} half={22} yE={274} yT={244} ink="trad" />
      <Gable cx={cx + 116} half={22} yE={274} yT={244} ink="trad" />
      <Gable cx={cx} half={60} yE={252} yT={194} ink="trad" />
      <Gable cx={cx} half={47} yE={224} yT={168} ink="trad" />
      <Gable cx={cx} half={35} yE={198} yT={146} ink="trad" />
      <Gable cx={cx} half={23} yE={172} yT={126} ink="trad" />
      <Spire cx={cx} yb={128} yt={98} half={3} ink="trad" rings={2} />
    </g>
  );
}

/** Wat Phnom: the bell stupa and vihara on their wooded hill. */
function WatPhnom({ cx }: { cx: number }) {
  const hillY = (x: number) => GROUND - 70 * (1 - ((x - cx) / 140) ** 2);
  const canopy = Array.from({ length: 15 }, (_, i) => {
    const x = cx - 126 + i * 18;
    return { x, y: hillY(x) + 8, r: 13 + (i % 3) * 4 };
  });
  return (
    <g>
      <g className="sk-hill">
        <path
          d={`M${cx - 140} ${GROUND} ${Array.from({ length: 29 }, (_, i) => {
            const x = cx - 140 + i * 10;
            return `L${x} ${f(hillY(x))}`;
          }).join(" ")} L${cx + 140} ${GROUND} Z`}
        />
        {canopy.map(({ x, y, r }) => (
          <circle key={x} cx={x} cy={f(y)} r={r} />
        ))}
      </g>
      <path
        className="sk-detail sk-detail--soft"
        d={canopy.filter((_, i) => i % 2).map(({ x, y, r }) => `M${x - r * 0.5} ${f(y + 2)} q${r * 0.5} -6 ${r} 0`).join(" ")}
      />
      {/* stupa */}
      <g className="sk-trad">
        <rect x={cx - 26} y={232} width={52} height={8} />
        <rect x={cx - 20} y={224} width={40} height={8} />
        <rect x={cx - 16} y={218} width={32} height={6} />
        <path d={`M${cx - 15} 218 Q${cx - 17} 194 ${cx} 190 Q${cx + 17} 194 ${cx + 15} 218 Z`} />
        <rect x={cx - 5} y={182} width={10} height={8} />
      </g>
      <path className="sk-shade" d={`M${cx} 190 Q${cx + 17} 194 ${cx + 15} 218 H${cx} Z`} />
      <path className="sk-detail" d={`M${cx - 22} 228 H${cx + 22} M${cx - 12} 212 H${cx + 12}`} />
      <Spire cx={cx} yb={184} yt={126} half={6} ink="trad" />
      {/* vihara beside it */}
      <g className="sk-trad">
        <rect x={cx + 32} y={228} width={34} height={16} />
      </g>
      <Roof cx={cx + 49} half={26} yE={230} yT={216} top={10} ink="trad" />
      <Gable cx={cx + 49} half={16} yE={224} yT={198} ink="trad" />
    </g>
  );
}

/** Phsar Thmei: a louvred art-deco dome over four long, finned arms. */
function Market({ cx }: { cx: number }) {
  const base = 236;
  const top = 158;
  const half = 64;
  const halfAt = (y: number) => half * Math.sqrt(Math.max(0, 1 - ((base - y) / (base - top)) ** 2));
  const louvres = Array.from({ length: 8 }, (_, i) => {
    const y = 166 + i * 9;
    const w = halfAt(y) - 3;
    return `M${f(cx - w)} ${y} H${f(cx + w)}`;
  }).join(" ");
  const meridians = [-0.66, -0.33, 0.33, 0.66]
    .map((t) => `M${f(cx + t * half)} ${base} Q${f(cx + t * half * 1.05)} ${top + 18} ${cx} ${top}`)
    .join(" ");

  return (
    <g>
      <g className="sk-far">
        <path d={`M${cx - 152} ${GROUND} V270 Q${cx - 104} 258 ${cx - 56} 262 V${GROUND} Z`} />
        <path d={`M${cx + 152} ${GROUND} V270 Q${cx + 104} 258 ${cx + 56} 262 V${GROUND} Z`} />
        <path d={`M${cx - 156} ${GROUND} V262 H${cx - 132} V${GROUND} Z M${cx - 152} 262 V254 H${cx - 136} V262 Z`} />
        <path d={`M${cx + 156} ${GROUND} V262 H${cx + 132} V${GROUND} Z M${cx + 152} 262 V254 H${cx + 136} V262 Z`} />
        <rect x={cx - 58} y={232} width={116} height={GROUND - 232} />
        <path d={`M${cx - half} ${base} C${cx - half} 186 ${cx - 36} ${top + 2} ${cx} ${top} C${cx + 36} ${top + 2} ${cx + half} 186 ${cx + half} ${base} Z`} />
        <rect x={cx - 10} y={148} width={20} height={11} />
        <path d={`M${cx - 6} 148 Q${cx} 138 ${cx + 6} 148 Z`} />
      </g>
      <path
        className="sk-shade"
        d={`M${cx} ${top} C${cx + 36} ${top + 2} ${cx + half} 186 ${cx + half} ${base} V${GROUND} H${cx + 152} V270 Q${cx + 104} 258 ${cx + 56} 262 V${GROUND} H${cx} Z`}
      />
      <path className="sk-detail" d={`${louvres} ${meridians}`} />
      <path
        className="sk-detail"
        d={`${columns(cx - 126, cx - 64, 276, 304, 9)} ${columns(cx + 64, cx + 126, 276, 304, 9)} ${columns(cx - 48, cx + 48, 244, 304, 12)}`}
      />
    </g>
  );
}

function Vattanac({ x }: { x: number }) {
  return (
    <g>
      <g className="sk-far">
        <path d={`M${x} ${GROUND} V54 Q${x + 26} 40 ${x + 56} 34 V${GROUND} Z`} />
        {/* the dragon-tail fin sweeping off its base */}
        <path
          d={`M${x} ${GROUND} C${x - 42} 286 ${x - 56} 226 ${x - 34} 176 C${x - 22} 156 ${x - 8} 146 ${x} 142 Z`}
        />
      </g>
      <path className="sk-shade" d={`M${x + 30} ${GROUND} V40 Q${x + 44} 36 ${x + 56} 34 V${GROUND} Z`} />
      <path className="sk-detail sk-detail--soft" d={columns(x + 8, x + 50, 60, GROUND - 6, 7)} />
    </g>
  );
}

function Tower({ x, w, h, style }: { x: number; w: number; h: number; style: (typeof TOWERS)[number][3] }) {
  const top = GROUND - h;
  const body =
    style === "crown"
      ? `M${x} ${GROUND} V${top + 18} L${x + w / 2} ${top} L${x + w} ${top + 18} V${GROUND} Z`
      : style === "setback"
        ? `M${x} ${GROUND} V${top + 28} H${x + 8} V${top} H${x + w - 8} V${top + 28} H${x + w} V${GROUND} Z`
        : `M${x} ${GROUND} V${top} H${x + w} V${GROUND} Z`;
  return (
    <g>
      <path className="sk-far" d={body} />
      {style === "mast" && <path className="sk-crane" d={`M${x + w / 2} ${top} V${top - 36}`} />}
      <path className="sk-shade" d={`M${x + w * 0.6} ${GROUND} V${top + (style === "crown" ? 12 : 0)} H${x + w} V${GROUND} Z`} />
      <path className="sk-detail sk-detail--soft" d={columns(x + 6, x + w - 6, top + 30, GROUND - 8, 8)} />
    </g>
  );
}

function Crane({ x }: { x: number }) {
  return (
    <path
      className="sk-crane"
      d={`M${x} ${GROUND} V72 M${x - 58} 84 H${x + 84} M${x} 70 L${x - 58} 84 M${x} 70 L${x + 84} 84 M${x + 62} 84 V128 M${x - 6} ${GROUND} V72 ${Array.from({ length: 10 }, (_, i) => `M${x - 6} ${GROUND - i * 23} L${x} ${GROUND - (i + 1) * 23}`).join(" ")}`}
    />
  );
}

function Palm({ x }: { x: number }) {
  const cy = 142;
  const fronds = Array.from({ length: 22 }, (_, i) => {
    const a = (i / 22) * Math.PI * 2;
    const r = i % 2 ? 22 : 30;
    const ex = Math.cos(a) * r;
    const ey = Math.sin(a) * r;
    // each frond droops a little at its tip
    return `M${x + 2} ${cy} q${f(ex * 0.6)} ${f(ey * 0.6 - 3)} ${f(ex)} ${f(ey + 3)}`;
  }).join(" ");

  return (
    <g className="sk-palm">
      <path className="sk-trunk" d={`M${x - 1} ${GROUND} Q${x + 7} 220 ${x + 2} ${cy}`} />
      <path className="sk-frond" d={fronds} />
      <circle cx={x + 2} cy={cy} r={7} />
    </g>
  );
}

function House({ x, w, h, i }: { x: number; w: number; h: number; i: number }) {
  const top = GROUND - h;
  const floors = Math.max(1, Math.floor((h - 34) / 24));
  const kind = i % 5;
  const r = x + w - 2;
  return (
    <g>
      <rect className="sk-near" x={x} y={top} width={w - 2} height={h} />
      {/* rooflines: water tank, stepped parapet, tiled pitch, antenna, rooftop room */}
      {kind === 0 && (
        <g className="sk-near">
          <rect x={x + w - 20} y={top - 12} width={12} height={12} rx={2} />
          <rect x={x + w - 22} y={top - 2} width={16} height={2} />
        </g>
      )}
      {kind === 1 && <path className="sk-near" d={`M${x} ${top} V${top - 6} H${x + w / 2 - 8} V${top - 11} H${x + w / 2 + 6} V${top - 6} H${r} V${top} Z`} />}
      {kind === 2 && <path className="sk-near" d={`M${x - 3} ${top} L${x + w / 2} ${top - 14} L${r + 3} ${top} Z`} />}
      {kind === 3 && (
        <path className="sk-wire sk-wire--bold" d={`M${x + 10} ${top} V${top - 18} M${x + 4} ${top - 14} H${x + 16} M${x + 6} ${top - 8} H${x + 14}`} />
      )}
      {kind === 4 && <rect className="sk-near" x={x + 6} y={top - 10} width={w * 0.45} height={10} />}

      {Array.from({ length: floors }, (_, fl) => {
        const y = top + 8 + fl * 24;
        return (
          <g key={fl}>
            <rect className={`sk-win${(i + fl) % 3 === 0 ? " sk-win--off" : ""}`} x={x + w * 0.2} y={y} width={8} height={11} />
            <rect className={`sk-win${(i + fl) % 4 === 1 ? " sk-win--off" : ""}`} x={x + w * 0.6} y={y} width={8} height={11} />
            {/* balcony rail with balusters */}
            <path
              className="sk-balcony"
              d={`M${x} ${y + 16} H${r} ${Array.from({ length: Math.floor(w / 6) }, (_, k) => `M${x + 3 + k * 6} ${y + 16} v-4`).join(" ")}`}
            />
          </g>
        );
      })}
      <rect className={`sk-sign sk-sign--${i % 4}`} x={x + 4} y={GROUND - 30} width={w - 10} height={13} />
      {/* roll-down shutter at street level */}
      <path className="sk-balcony" d={`M${x + 4} ${GROUND - 12} H${r - 4} M${x + 4} ${GROUND - 8} H${r - 4} M${x + 4} ${GROUND - 4} H${r - 4}`} />
    </g>
  );
}

function Wires() {
  const spans = POLE_RUNS.flatMap((run) =>
    run.slice(1).map((x2, i) => {
      const x1 = run[i];
      const mid = (x1 + x2) / 2;
      const sag = Math.min(40, (x2 - x1) / 8);
      return [196, 203, 211].map((y, k) => `M${x1} ${y} Q${mid} ${y + sag + k * 6} ${x2} ${y}`).join(" ");
    }),
  );
  return (
    <g>
      {POLE_RUNS.flat().map((x) => (
        <g key={x}>
          <rect className="sk-near" x={x - 2} y={188} width={4} height={GROUND - 188} />
          <rect className="sk-near" x={x - 10} y={192} width={20} height={3} />
        </g>
      ))}
      <path className="sk-wire" d={spans.join(" ")} />
      {/* the knot every Phnom Penh pole seems to grow */}
      <path
        className="sk-wire"
        d="M322 204 c10 -14 32 -8 22 6 c-8 14 -32 8 -18 -8 c10 -10 30 2 16 14 c-6 6 -20 4 -22 -4 M328 216 c8 -6 18 -2 14 6"
      />
    </g>
  );
}

export default function Skyline({ className }: { className?: string }) {
  return (
    <svg
      className={`skyline ${className ?? ""}`}
      viewBox={`0 0 ${W} 340`}
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      <defs>
        {/* riso halftone screen for shading */}
        <pattern id="sk-dots" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <circle cx="2.5" cy="2.5" r="1.15" />
        </pattern>
      </defs>

      <circle className="sk-moon" cx={1491} cy={165} r={105} />

      {TOWERS.map(([x, w, h, style]) => (
        <Tower key={x} x={x} w={w} h={h} style={style} />
      ))}
      <Vattanac x={2330} />
      <Crane x={2620} />

      <AngkorWat cx={580} />
      <WatPhnom cx={908} />
      <Monument cx={1231} />
      <Palace cx={1491} />
      <Museum cx={1790} />
      <Market cx={2081} />
      <circle className="sk-sun" cx={1491} cy={165} r={105} />

      {HOUSES.map(([x, w, h], i) => (
        <House key={x} x={x} w={w} h={h} i={i} />
      ))}
      {PALMS.map((x) => (
        <Palm key={x} x={x} />
      ))}
      <Flag x={1132} />
      <Wires />

      <rect className="sk-road" x={0} y={GROUND} width={W} height={30} />
      <path className="sk-lane" d={`M0 ${GROUND + 15} H${W}`} />

      {/* the remorque's 150×72 box (road at y=70), scaled to street size and
          parked in the near lane, in front of the palace */}
      <g transform={`translate(1590 ${GROUND + 24 - 70 * 0.85}) scale(0.85)`}>
        <g className="sk-tt">
          <TuktukShape />
        </g>
      </g>
    </svg>
  );
}
