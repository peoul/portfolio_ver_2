import "./recent.css";
import { work } from "../assets/data/portfolio.json";
import Github from "../assets/image/github.svg?react";
import { useEffect, useState } from "react";

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

const statusClass = (status: string) =>
  `status status-${status.toLowerCase().replace(/[^a-z]+/g, "-")}`;

const slug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

function Modal({ project, onClose }: { project: Project; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const { title, description, tags, status, meta, link, github, logo } = project;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <p className="modal-title">~ cat {slug(title)}.md</p>
          <button className="modal-close" onClick={onClose}>
            esc ✕
          </button>
        </div>

        {logo && (
          <div className="modal-logo">
            <img src={logo} alt={`${title} logo`} />
          </div>
        )}

        {(status || meta) && (
          <div className="modal-badges">
            {status && <span className={statusClass(status)}>{status}</span>}
            {meta && <span className="tag">{meta}</span>}
          </div>
        )}

        <p className="desc">{description}</p>

        {tags.length > 0 && (
          <div className="tags">
            {tags.map((tag, index) => (
              <span key={index} className="tag">
                {tag}
              </span>
            ))}
          </div>
        )}

        {github && (
          <a
            className="repo-link"
            href={github}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github /> View source
          </a>
        )}
        {link && (
          <a
            className="repo-link"
            href={link}
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit site ↗
          </a>
        )}
      </div>
    </div>
  );
}

function WorkRow({ project }: { project: Project }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="work-item" onClick={() => setOpen(true)}>
        <span className="arrow">→</span>
        <span className="work-title">{project.title}</span>
        {project.status && (
          <span className={statusClass(project.status)}>{project.status}</span>
        )}
        <span className="work-tags">
          {project.tags.slice(0, 3).join(", ").toLowerCase()}
        </span>
      </button>

      {open && <Modal project={project} onClose={() => setOpen(false)} />}
    </>
  );
}

function WorkGroup({ label, projects }: { label: string; projects: Project[] }) {
  return (
    <div className="work-group">
      <p className="work-group-label">{label}</p>
      <div className="work-list">
        {projects.map((project, idx) => (
          <WorkRow key={idx} project={project} />
        ))}
      </div>
    </div>
  );
}

function RecentProject() {
  return (
    <section className="work">
      <p className="prompt">~ ls work/</p>
      <WorkGroup label="studio/" projects={work.studio as Project[]} />
      <WorkGroup label="personal/" projects={work.personal as Project[]} />
    </section>
  );
}

export default RecentProject;
