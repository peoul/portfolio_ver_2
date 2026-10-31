import "./chapter.css";
import type { ReactNode } from "react";
import { khNum, stopOf, type StopId } from "./stops";

/**
 * One stop on the ride: a blue road-sign stop number in Khmer numerals,
 * the Khmer heading in Moul, the English title under it.
 */
export default function Chapter({
  id,
  title,
  place,
  className,
  children,
}: {
  id: StopId;
  title: string;
  place?: string;
  className?: string;
  children: ReactNode;
}) {
  const stop = stopOf(id);

  return (
    <section id={id} className={`chapter ${className ?? ""}`} aria-labelledby={`${id}-title`}>
      <div className="chapter-inner">
        <header className="chapter-head">
          <div className="stop-sign" aria-hidden="true">
            <span className="stop-num kh-poster">{khNum(stop.n)}</span>
            <span className="stop-word">Stop</span>
          </div>
          <div className="chapter-titles">
            <p className="chapter-kh kh-sign" lang="km">
              {stop.kh}
            </p>
            <h2 className="chapter-title" id={`${id}-title`}>
              {title}
            </h2>
            {place && <p className="chapter-place label">{place}</p>}
          </div>
        </header>
        {children}
      </div>
    </section>
  );
}
