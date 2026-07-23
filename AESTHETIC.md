# Visual Direction: TE × Doodle

## Core rule
Structure is Swiss. Marks are hand-drawn. Never both, never neither.
The tension IS the design. If everything is loose, it reads as sloppy.
If everything is rigid, it's just another TE clone.

## Layout (rigid — no exceptions)
- 8px baseline grid. All spacing is a multiple of 8.
- Hairline dividers: 1px, never thicker, never dashed.
- Generous negative space. Crowding kills the TE reference.
- Panels are perfect rectangles with 2px radius max. No blobs.
- Align everything to the grid, including the doodles' bounding boxes.

## Type (rigid)
- Sans-serif, tight tracking. Inter, Helvetica Neue, or system-ui.
- Labels: 10-11px, UPPERCASE, letter-spacing 0.08em, muted gray.
- Body: 14-15px, normal case.
- Numerals: tabular figures where they appear in sequence.
- Never use a handwriting font for UI text. Handwriting is for annotations only.

## Color
- Base: #F5F5F3 (warm off-white), #1A1A1A (near-black), 3 grays between.
- ONE accent, used sparingly: #FF5500 (OP-1 orange) or #00A8E8.
- Accent appears on <10% of the surface. It marks the active/primary thing only.
- No gradients. No shadows except a single 1px offset if absolutely needed.

## Doodle layer (loose — this is the only loose part)
- Applies to: icons, connectors, arrows, underlines, circles-around-things,
  margin annotations, empty states, illustrations.
- Stroke: 1.5-2px, round cap, round join.
- Deliberate imperfection: lines overshoot corners by 2-3px, circles don't
  quite close, straight lines have subtle wobble.
- Draw as inline SVG paths, not icon fonts. Hand-authored or rough.js.
- Doodles sit ON TOP of the grid like someone annotated a printed manual.
  They can overlap panel edges. That overlap is the point.

## Implementation
- Use `roughjs` for procedural sketch strokes if generating shapes in code.
- Otherwise hand-write SVG paths with slight coordinate jitter.
- Keep doodles in a separate component/layer so they can be toggled.
- Animate doodles with stroke-dashoffset draw-on, 300-500ms, ease-out.
  Never animate the rigid layer.

## Anti-patterns — do not do these
- Comic Sans, Patrick Hand, or any "fun" font for interface text
- Paper texture, notebook lines, coffee stains, tape graphics
- Doodling the layout itself (wobbly panels, hand-drawn borders on containers)
- Uniform sketch filter applied to the whole page
- More than one accent color
- Drop shadows, glows, glassmorphism