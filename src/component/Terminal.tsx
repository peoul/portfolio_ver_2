import "./terminal.css";
import type { IconType } from "react-icons";
import {
  SiReact,
  SiTypescript,
  SiJavascript,
  SiHtml5,
  SiCss,
  SiNodedotjs,
  SiSpringboot,
  SiDocker,
  SiGithub,
  SiClaude,
} from "react-icons/si";
import { VscAzure } from "react-icons/vsc";
import { TbDatabase } from "react-icons/tb";
import Section from "./Section";
import {
  DoodleCoffee,
  DoodleGamepad,
  DoodleServer,
  DoodleExternal,
} from "./Doodle";

const RESUME_URL = "/Resume_LyhongPeou.pdf";

interface Skill {
  name: string;
  Icon: IconType;
}

const SKILLS: Record<string, Skill[]> = {
  frontend: [
    { name: "React", Icon: SiReact },
    { name: "TypeScript", Icon: SiTypescript },
    { name: "JavaScript", Icon: SiJavascript },
    { name: "HTML", Icon: SiHtml5 },
    { name: "CSS", Icon: SiCss },
  ],
  backend: [
    { name: "Node", Icon: SiNodedotjs },
    { name: "Convex", Icon: TbDatabase },
    { name: "SQL", Icon: TbDatabase },
    { name: "NoSQL", Icon: TbDatabase },
    { name: "Spring Boot", Icon: SiSpringboot },
  ],
  tools: [
    { name: "Docker", Icon: SiDocker },
    { name: "GitHub", Icon: SiGithub },
    { name: "Claude Code", Icon: SiClaude },
    { name: "Azure", Icon: VscAzure },
  ],
};

// Generic subjects — these get the hand-drawn doodle treatment.
const HOBBIES = [
  { name: "Coffee", Doodle: DoodleCoffee },
  { name: "Gaming", Doodle: DoodleGamepad },
  { name: "Homelab", Doodle: DoodleServer },
];

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="about-row">
      <span className="label about-key">{label}</span>
      <div className="about-val">{children}</div>
    </div>
  );
}

function Terminal() {
  return (
    <Section index="01" label="About" id="about">
      <dl className="about">
        <Row label="Education">
          <ul className="edu">
            <li>
              <span className="edu-school">Johns Hopkins University</span>
              <span className="edu-degree">MS Information Systems Engineering</span>
            </li>
            <li>
              <span className="edu-school">Oregon State University</span>
              <span className="edu-degree">BS Computer Science</span>
            </li>
          </ul>
        </Row>

        {Object.entries(SKILLS).map(([label, items]) => (
          <Row label={label} key={label}>
            <div className="chips">
              {items.map(({ name, Icon }) => (
                <span className="chip" key={name}>
                  <Icon className="chip-icon" aria-hidden="true" />
                  {name}
                </span>
              ))}
            </div>
          </Row>
        ))}

        <Row label="Hobbies">
          <div className="chips">
            {HOBBIES.map(({ name, Doodle }) => (
              <span className="chip chip--doodle" key={name}>
                <Doodle className="chip-doodle" />
                {name}
              </span>
            ))}
          </div>
        </Row>

        <Row label="Résumé">
          <a
            className="resume-link"
            href={RESUME_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            View PDF
            <DoodleExternal className="link-arrow" />
          </a>
        </Row>
      </dl>
    </Section>
  );
}

export default Terminal;
