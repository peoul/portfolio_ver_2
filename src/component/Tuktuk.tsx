import "./tuktuk.css";

/**
 * A Cambodian remorque, facing right, in a 150×72 box with the road at
 * y=70: a step-through motorbike (Honda Dream style, front basket) towing a
 * two-bench carriage on a hitch over its rear wheel, under a flat canopy on
 * four posts. Wheels spin by the inherited `--spin` custom property, so a
 * parent can drive them without re-rendering.
 */

const spokes = (cx: number, cy: number, r: number) =>
  [0, 45, 90, 135]
    .map((deg) => {
      const a = (deg * Math.PI) / 180;
      const dx = (Math.cos(a) * r).toFixed(2);
      const dy = (Math.sin(a) * r).toFixed(2);
      return `M${cx - +dx} ${cy - +dy} L${cx + +dx} ${cy + +dy}`;
    })
    .join(" ");

function Wheel({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <g className="tt-wheel">
      <circle className="tt-tyre" cx={cx} cy={cy} r={r - 1.6} />
      <path className="tt-spoke" d={spokes(cx, cy, r - 3)} />
      <circle className="tt-hub" cx={cx} cy={cy} r={2} />
    </g>
  );
}

export function TuktukShape() {
  return (
    <g className="tt">
      {/* ---- carriage ---- */}
      {/* canopy, valance and the tie-down cords */}
      <path className="tt-roof" d="M1 9 H77 L75 14 H3 Z" />
      <rect className="tt-red" x={3} y={14} width={72} height={2} />
      <path
        className="tt-cord"
        d="M12 16 q4 5 8 0 M30 16 q4 5 8 0 M48 16 q4 5 8 0 M62 16 q4 5 8 0"
      />
      {/* posts */}
      <path className="tt-line" strokeWidth={1.6} d="M6 16 V44 M72 16 V44" />

      {/* rear bench, facing forward */}
      <rect className="tt-pink" x={9} y={22} width={5} height={21} rx={1.5} />
      <rect className="tt-pink" x={9} y={38} width={20} height={5} rx={1.5} />
      {/* front bench, facing back, with a carved wooden back */}
      <rect className="tt-pink" x={44} y={38} width={20} height={5} rx={1.5} />
      <path className="tt-redline" strokeWidth={1.5} d="M62 28 H68 V43 H62 Z M64 28 V43 M66 28 V43" />
      {/* armrails with balusters */}
      <path
        className="tt-redline"
        strokeWidth={1.4}
        d="M14 32 H31 M18 32 V38 M22 32 V38 M26 32 V38 M44 32 H62 M48 32 V38 M52 32 V38 M56 32 V38"
      />

      {/* tub, rear step and drawbar */}
      <path className="tt-dark" d="M5 43 H73 L71 55 H9 Z" />
      <path className="tt-redline" strokeWidth={2} d="M5 43 H73" />
      <rect className="tt-red" x={1} y={46} width={6} height={8} rx={1} />
      <path className="tt-redline" strokeWidth={2.6} strokeLinejoin="round" d="M71 48 H82 L97 42" />
      <path className="tt-redline" strokeWidth={3} d="M25 55 A15 15 0 0 1 55 55" />

      {/* ---- motorbike ---- */}
      <rect className="tt-engine" x={103} y={51} width={13} height={8} rx={2} />
      <path
        className="tt-red"
        d="M91 52 Q92 42 101 41 H118 Q120 47 122 50 H125 Q128 42 129 32 L133 31 Q134 44 129 52 Q127 56 120 56 H102 Q95 56 91 52 Z"
      />
      <path className="tt-dark" d="M97 38 H117 Q119 38 119 41 H97 Z" />
      <path className="tt-line" strokeWidth={2.4} d="M131 31 L136 60" />
      <path className="tt-redline" strokeWidth={3} d="M127 55 A10 10 0 0 1 145 55" />
      <path className="tt-red" d="M130 24 Q140 21 140 29 L133 32 Z" />
      <path className="tt-line" strokeWidth={1.8} d="M131 25 L129 20 M125 20 H133 M129 20 L127 13" />
      {/* front basket */}
      <path className="tt-line" strokeWidth={1} d="M138 31 H147 V38 H138 Z M141 31 V38 M144 31 V38 M138 34.5 H147" />

      {/* rider */}
      <circle className="tt-dark" cx={111} cy={14} r={4.5} />
      <path className="tt-dark" d="M107 20 Q104 30 106 39 H116 V30 Q116 21 111 19.5 Z" />
      <path className="tt-rider-limb" strokeWidth={3} d="M112 24 L121 30 L127 22" />
      <path className="tt-rider-limb" strokeWidth={4.5} d="M109 38 L121 40 L121 52" />

      <Wheel cx={40} cy={58} r={12} />
      <Wheel cx={100} cy={60} r={10} />
      <Wheel cx={136} cy={60} r={10} />
      {/* chrome exhaust runs past the rear wheel */}
      <path className="tt-exhaust" d="M110 58 L93 62.5" />
    </g>
  );
}

export default function Tuktuk({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 150 72" aria-hidden="true">
      <TuktukShape />
    </svg>
  );
}
