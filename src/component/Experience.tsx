import "./experience.css";
import { useEffect, useRef, useState } from "react";
import { experience } from "../assets/data/portfolio.json";
import Section from "./Section";
import { DoodleNode, DoodleConnector, DoodleExternal } from "./Doodle";

interface Job {
  company: string;
  role: string;
  location: string;
  period: string;
  logo?: string;
  link?: string;
  blurb?: string;
  highlights?: string[];
}

const JOBS = experience as unknown as Job[];

const hostOf = (url: string) => {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
};

/** Measures an element's height so the doodle connector can fill the row. */
function useHeight<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [height, setHeight] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      // border-box, so the padding that spaces items is included
      const box = entry.borderBoxSize?.[0]?.blockSize ?? el.offsetHeight;
      setHeight(box);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return { ref, height };
}

function ExperienceItem({
  job,
  defaultOpen,
  last,
}: {
  job: Job;
  defaultOpen: boolean;
  last: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  // Measure the content column (which does NOT contain the connector) so the
  // rail can size the connector to it without a ResizeObserver feedback loop.
  const { ref, height } = useHeight<HTMLDivElement>();
  const connectorH = Math.max(0, Math.round(height) - 22);

  return (
    <article className={`exp-item${open ? " open" : ""}`}>
      <div className="exp-rail">
        <DoodleNode
          className={`exp-node${defaultOpen ? " exp-node--current" : ""}`}
        />
        {!last && connectorH > 0 && (
          <DoodleConnector height={connectorH} className="exp-connector" />
        )}
      </div>

      <div className="exp-content" ref={ref}>
        <button
          className="exp-head"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
        >
          <span className="exp-heading">
            <span className="exp-company">{job.company}</span>
            <span className="exp-role">
              {job.role} · {job.location}
            </span>
          </span>
          <span className="exp-meta">
            <span className="exp-period">{job.period}</span>
            <span className="exp-toggle" aria-hidden="true">
              {open ? "–" : "+"}
            </span>
          </span>
        </button>

        {open && (
          <div className="exp-body">
            {job.blurb && <p className="exp-blurb">{job.blurb}</p>}
            {job.highlights && (
              <ul className="exp-highlights">
                {job.highlights.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            )}
            {job.link && (
              <a
                className="exp-link"
                href={job.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit {hostOf(job.link)}
                <DoodleExternal className="link-arrow" />
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

function Experience() {
  return (
    <Section index="02" label="Experience" id="experience">
      <div className="exp-list">
        {JOBS.map((job, idx) => (
          <ExperienceItem
            key={idx}
            job={job}
            defaultOpen={idx === 0}
            last={idx === JOBS.length - 1}
          />
        ))}
      </div>
    </Section>
  );
}

export default Experience;
