import type { ReactNode } from "react";
import { DoodleMark } from "./Doodle";

/**
 * Rigid section frame: a monospace index + uppercase label in a left gutter,
 * content in the wide column, a 1px hairline on top. The only loose thing here
 * is the small doodle mark beside the label.
 */
export default function Section({
  index,
  label,
  id,
  children,
}: {
  index: string;
  label: string;
  id?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="section">
      <div className="section-head">
        <span className="idx">{index}</span>
        <span className="label">{label}</span>
        <DoodleMark className="section-mark" />
      </div>
      <div className="section-body">{children}</div>
    </section>
  );
}
