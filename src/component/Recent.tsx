import "./recent.css";
import { work } from "../assets/data/portfolio.json";
import Github from "../assets/image/github.svg?react";
import { useEffect, useState } from "react";
import Section from "./Section";
import { DoodleArrow, DoodleExternal } from "./Doodle";

interface Project {
  title: string;
  description: string;
  tags: string[];
  status?: string;
  meta?: string;
  year?: string;
  link?: string;
  github?: string;
  logo?: string;
}

const slug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

function Modal({ project, onClose }: { project: Project; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const { title, description, tags, status, meta, link, github, logo } = project;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="modal-head">
          <span className="label">{slug(title)}.md</span>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ESC ✕
          </button>
        </div>

        <div className="modal-title-row">
          {logo && (
            <div className="modal-logo">
              <img src={logo} alt={`${title} logo`} />
            </div>
          )}
          <h3 className="modal-title">{title}</h3>
        </div>

        {(status || meta) && (
          <div className="modal-badges">
            {status && <span className="status">{status}</span>}
            {meta && <span className="badge">{meta}</span>}
          </div>
        )}

        <p className="modal-desc">{description}</p>

        {tags.length > 0 && (
          <div className="tags">
            {tags.map((tag, index) => (
              <span key={index} className="badge">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="modal-links">
          {github && (
            <a
              className="repo-link"
              href={github}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="repo-glyph" /> View source
            </a>
          )}
          {link && (
            <a
              className="repo-link"
              href={link}
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit site
              <DoodleExternal className="link-arrow" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function WorkRow({ project, index }: { project: Project; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className={`work-item${project.status === "WIP" ? " is-wip" : ""}`}
        onClick={() => setOpen(true)}
      >
        <span className="idx work-idx">{String(index).padStart(2, "0")}</span>
        <span className="work-main">
          <span className="work-title">{project.title}</span>
          <span className="work-tags">
            {project.tags.slice(0, 3).join(" · ")}
          </span>
        </span>
        <span className="work-meta">{project.meta}</span>
        <span className="work-year">{project.year}</span>
        <span className="work-status">
          {project.status && <span className="status">{project.status}</span>}
        </span>
        <DoodleArrow className="work-arrow" />
      </button>

      {/*
        The detail below otherwise exists only inside the modal, which is not
        rendered until clicked — so descriptions and project URLs never reached
        the prerendered HTML. This mirrors it into the markup for crawlers.
        aria-hidden + tabIndex=-1 because the same content is already exposed
        to assistive tech through the dialog; this copy must not be announced
        twice or create invisible tab stops.
      */}
      <div className="visually-hidden" aria-hidden="true">
        <span>
          {project.title}
          {project.status ? ` — ${project.status}` : ""}
          {project.meta ? ` — ${project.meta}` : ""}
        </span>
        <p>{project.description}</p>
        <span>{project.tags.join(", ")}</span>
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

      {open && <Modal project={project} onClose={() => setOpen(false)} />}
    </>
  );
}

const STUDIO = work.studio as Project[];
const PERSONAL = work.personal as Project[];
// The year column only appears once at least one project has a year.
const HAS_YEARS = [...STUDIO, ...PERSONAL].some((p) => p.year);

function WorkGroup({
  label,
  projects,
  start,
}: {
  label: string;
  projects: Project[];
  start: number;
}) {
  return (
    <div className="work-group">
      <p className="label work-group-label">{label}</p>
      <div className="work-list">
        {projects.map((project, idx) => (
          <WorkRow key={idx} project={project} index={start + idx} />
        ))}
      </div>
    </div>
  );
}

/**
 * Typographic index (no.  project  type  year  status) — every fact is on
 * the row; the modal only adds the long description and links.
 */
function RecentProject() {
  return (
    <Section index="03" label="Selected Work" id="work">
      <div className={`work-index${HAS_YEARS ? " has-years" : ""}`}>
        <div className="work-head label" aria-hidden="true">
          <span>No.</span>
          <span>Project</span>
          <span>Type</span>
          <span className="work-year">Year</span>
          <span>Status</span>
          <span />
        </div>
        <WorkGroup label="studio/" projects={STUDIO} start={1} />
        <WorkGroup
          label="personal/"
          projects={PERSONAL}
          start={STUDIO.length + 1}
        />
      </div>
    </Section>
  );
}

export default RecentProject;
