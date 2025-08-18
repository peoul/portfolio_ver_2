import "./recent.css";
import { projects } from "../assets/data/portfolio.json";
import File from "../assets/image/file.svg?react";
import Github from "../assets/image/github.svg?react";
import { useState } from "react";

interface ProjectProps {
  title: string;
  description: string;
  tags: string[];
  github: string;
}

function Modal({
  title,
  description,
  tags,
  github,
  onClose,
}: ProjectProps & { onClose: () => void }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-terminal" onClick={(e) => e.stopPropagation()}>
        <div className="header-modal">
          <p>{title}</p>
          <div className="header-action">
            <p className="close_btn" onClick={onClose}>
              ×
            </p>
          </div>
        </div>

        <div className="modal-content-body">
          <div className="content-body-left">


          </div>
          <div className="content-body-right">
            <p>{description}</p>
            <div className="tags">
              {tags.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                </span>
              ))}
            </div>
            <a href={github} target="_blank" rel="noopener noreferrer">
              <Github />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ title, description, tags, github }: ProjectProps) {
  const [open, setOpen] = useState(false);

  const openHandler = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(true);
  };

  const closeHandler = () => {
    setOpen(false);
  };

  return (
    <>
      <div className="file" onClick={openHandler}>
        <File />
        <p>{title}</p>
      </div>

      {open && (
        <Modal
          title={title}
          description={description}
          tags={tags}
          github={github}
          onClose={closeHandler}
        />
      )}
    </>
  );
}

function RecentProject() {
  return (
    <div className="terminal">
      <div className="header">
        <p>My Works</p>
        <div className="header-action">
          <p>⎼</p>
          <p>□</p>
          <p>×</p>
        </div>
      </div>

      <div className="folder">
        {projects.map((item, idx) => (
          <Card
            key={idx}
            title={item.title}
            description={item.description}
            tags={item.tags}
            github={item.github}
          />
        ))}
      </div>
    </div>
  );
}

export default RecentProject;
