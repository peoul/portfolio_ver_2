import "./market.css";
import { useEffect, useRef, useState } from "react";
import { PiGithubLogoBold } from "react-icons/pi";
import { work } from "../assets/data/portfolio.json";
import Chapter from "./Chapter";

interface Project {
  title: string;
  description: string;
  tags: string[];
  status?: string;
  meta?: string;
  link?: string;
  github?: string;
  logo?: string;
}

const STUDIO = work.studio as Project[];
const PERSONAL = work.personal as Project[];

const BULBS = 23;

/** A sagging string of festoon lights across the market. */
function StringLights() {
  return (
    <div className="lights" aria-hidden="true">
      <svg className="lights-wire" viewBox="0 0 100 20" preserveAspectRatio="none">
        <path d="M0 0 Q50 40 100 0" vectorEffect="non-scaling-stroke" />
      </svg>
      {Array.from({ length: BULBS }, (_, i) => {
        const t = (i + 1) / (BULBS + 1);
        // y on the quadratic curve above, as a fraction of its height
        const y = 2 * t * (1 - t) * 2;
        return (
          <span
            key={i}
            className={`bulb bulb--${i % 4}`}
            style={{ left: `${t * 100}%`, top: `${y * 100}%`, animationDelay: `${(i * 0.37) % 3}s` }}
          />
        );
      })}
    </div>
  );
}

function Flyer({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      opener?.focus();
    };
  }, [onClose]);

  const { title, description, tags, status, meta, link, github, logo } = project;

  return (
    <div className="flyer-overlay" onClick={onClose}>
      <div
        className="flyer"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="flyer-title"
      >
        <button ref={closeRef} className="flyer-close" onClick={onClose} aria-label="Close">
          <span lang="km">បិទ</span> ✕
        </button>

        <div className="flyer-head">
          {logo && <img className="flyer-logo" src={logo} alt="" />}
          <div>
            {(meta || status) && (
              <p className="label flyer-meta">
                {meta}
                {meta && status ? " · " : ""}
                {status}
              </p>
            )}
            <h3 className="flyer-title riso" id="flyer-title">
              {title}
            </h3>
          </div>
        </div>

        <p className="flyer-desc">{description}</p>

        <ul className="flyer-tags">
          {tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>

        <div className="flyer-links">
          {link && (
            <a className="flyer-link" href={link} target="_blank" rel="noopener noreferrer">
              Visit site <span aria-hidden="true">↗</span>
            </a>
          )}
          {github && (
            <a className="flyer-link flyer-link--ghost" href={github} target="_blank" rel="noopener noreferrer">
              <PiGithubLogoBold aria-hidden="true" /> View source
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function Stall({ project, index }: { project: Project; index: number }) {
  const [open, setOpen] = useState(false);
  const status = project.status ?? (project.github ? "Open source" : undefined);

  return (
    <li className={`stall stall--${index % 4}`}>
      <button className="stall-btn" onClick={() => setOpen(true)} aria-haspopup="dialog">
        <span className="awning" aria-hidden="true" />
        <span className="stall-board">
          {project.logo && <img className="stall-logo" src={project.logo} alt="" />}
          <span className="stall-name">{project.title}</span>
        </span>
        <span className="stall-meta">{project.meta}</span>
        <span className="stall-goods">
          {project.tags.slice(0, 3).map((t) => (
            <span key={t} className="good">
              {t}
            </span>
          ))}
        </span>
        {status && (
          <span className={`stall-status${project.status === "WIP" ? " is-wip" : ""}`}>{status}</span>
        )}
        <span className="stall-browse" aria-hidden="true">
          Browse →
        </span>
      </button>

      {/*
        The description and links otherwise live only in the flyer, which
        isn't rendered until clicked, so they'd never reach the prerendered
        HTML. Mirrored here for crawlers; hidden from assistive tech, which
        gets the same content through the dialog.
      */}
      <div className="visually-hidden" aria-hidden="true">
        <p>{project.description}</p>
        {project.link && (
          <a href={project.link} tabIndex={-1}>
            {project.title} — visit site
          </a>
        )}
        {project.github && (
          <a href={project.github} tabIndex={-1}>
            {project.title} — source code
          </a>
        )}
      </div>

      {open && <Flyer project={project} onClose={() => setOpen(false)} />}
    </li>
  );
}

function Row({ title, note, projects, start }: { title: string; note: string; projects: Project[]; start: number }) {
  return (
    <div className="market-row">
      <div className="market-row-head">
        <h3 className="market-row-title">{title}</h3>
        <p className="market-row-note">{note}</p>
      </div>
      <ul className="stalls">
        {projects.map((p, i) => (
          <Stall key={p.title} project={p} index={start + i} />
        ))}
      </ul>
    </div>
  );
}

export default function Market() {
  return (
    <Chapter id="market" title="The night market" place="Selected work" className="market">
      <StringLights />
      <p className="market-intro">
        After dark the city sets up shop. Here's what I've been selling. Pick a stall and have a look around.
      </p>
      <Row title="AJILE row" note="Built with the studio: client work and our own products." projects={STUDIO} start={0} />
      <Row title="Side alley" note="Personal and school projects." projects={PERSONAL} start={STUDIO.length} />
    </Chapter>
  );
}
