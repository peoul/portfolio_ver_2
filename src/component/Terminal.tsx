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
import { TbDatabase, TbCoffee, TbDeviceGamepad2, TbServer } from "react-icons/tb";

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

const HOBBIES: Skill[] = [
  { name: "Coffee", Icon: TbCoffee },
  { name: "Gaming", Icon: TbDeviceGamepad2 },
  { name: "Homelab", Icon: TbServer },
];

function Chips({ items }: { items: Skill[] }) {
  return (
    <dd className="chips">
      {items.map(({ name, Icon }) => (
        <span className="chip" key={name}>
          <Icon className="chip-icon" aria-hidden="true" />
          {name}
        </span>
      ))}
    </dd>
  );
}

function Terminal() {
  return (
    <section className="about">
      <p className="prompt">~ cat about.txt</p>

      <dl className="about-list">
        <div className="about-row">
          <dt>education</dt>
          <dd className="edu">
            <span>
              Johns Hopkins University{" "}
              <em>— MS Information Systems Engineering</em>
            </span>
            <span>
              Oregon State University <em>— BS Computer Science</em>
            </span>
          </dd>
        </div>

        {Object.entries(SKILLS).map(([label, items]) => (
          <div className="about-row" key={label}>
            <dt>{label}</dt>
            <Chips items={items} />
          </div>
        ))}

        <div className="about-row">
          <dt>hobbies</dt>
          <Chips items={HOBBIES} />
        </div>

        <div className="about-row">
          <dt>resume</dt>
          <dd>
            <a href={RESUME_URL} target="_blank" rel="noopener noreferrer">
              View PDF ↗
            </a>
          </dd>
        </div>
      </dl>
    </section>
  );
}

export default Terminal;
