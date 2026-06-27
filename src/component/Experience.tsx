import "./experience.css";
import { useState } from "react";
import { experience } from "../assets/data/portfolio.json";

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

function ExperienceItem({ job, defaultOpen }: { job: Job; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <article className={`exp-item${open ? " open" : ""}`}>
      <button
        className="exp-head"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="exp-id">
          {job.logo && (
            <img className="exp-logo" src={job.logo} alt="" aria-hidden="true" />
          )}
          <span className="exp-heading">
            <span className="exp-company">{job.company}</span>
            <span className="exp-role">
              {job.role} · {job.location}
            </span>
          </span>
        </span>
        <span className="exp-meta">
          <span className="exp-period">{job.period}</span>
          <span className="exp-toggle" aria-hidden="true">
            +
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
              Visit {hostOf(job.link)} ↗
            </a>
          )}
        </div>
      )}
    </article>
  );
}

function Experience() {
  return (
    <section className="experience">
      <p className="prompt">~ cat experience</p>

      <div className="exp-list">
        {JOBS.map((job, idx) => (
          <ExperienceItem key={idx} job={job} defaultOpen={idx === 0} />
        ))}
      </div>
    </section>
  );
}

export default Experience;
