import "./toolbox.css";
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
import { PiCoffeeBold, PiGameControllerBold, PiHardDrivesBold } from "react-icons/pi";
import Chapter from "./Chapter";

const RESUME_URL = "/Resume_LyhongPeou.pdf";

interface Skill {
  name: string;
  Icon: IconType;
}

const DRAWERS: { label: string; skills: Skill[] }[] = [
  {
    label: "Front end",
    skills: [
      { name: "React", Icon: SiReact },
      { name: "TypeScript", Icon: SiTypescript },
      { name: "JavaScript", Icon: SiJavascript },
      { name: "HTML", Icon: SiHtml5 },
      { name: "CSS", Icon: SiCss },
    ],
  },
  {
    label: "Back end",
    skills: [
      { name: "Node", Icon: SiNodedotjs },
      { name: "Convex", Icon: TbDatabase },
      { name: "SQL", Icon: TbDatabase },
      { name: "NoSQL", Icon: TbDatabase },
      { name: "Spring Boot", Icon: SiSpringboot },
    ],
  },
  {
    label: "Tools",
    skills: [
      { name: "Docker", Icon: SiDocker },
      { name: "GitHub", Icon: SiGithub },
      { name: "Claude Code", Icon: SiClaude },
      { name: "Azure", Icon: VscAzure },
    ],
  },
];

const OFF_HOURS = [
  { name: "Coffee", note: "Iced, with condensed milk", Icon: PiCoffeeBold },
  { name: "Gaming", note: "The other kind of build", Icon: PiGameControllerBold },
  { name: "Homelab", note: "Servers humming in the corner", Icon: PiHardDrivesBold },
];

// Deterministic tilt so prerendered and hydrated markup match.
const tilt = (i: number) => `${((i * 37) % 7) - 3}deg`;

export default function Toolbox() {
  let n = 0;

  return (
    <Chapter id="toolbox" title="What's in the toolbox" place="Skills & off-hours">
      <div className="toolbox">
        <div className="crate">
          {DRAWERS.map(({ label, skills }) => (
            <div className="drawer" key={label}>
              <p className="drawer-label label">{label}</p>
              <ul className="stickers">
                {skills.map(({ name, Icon }) => {
                  const i = n++;
                  return (
                    <li
                      key={name}
                      className={`sticker sticker--${i % 5}`}
                      style={{ "--tilt": tilt(i) } as React.CSSProperties}
                    >
                      <Icon aria-hidden="true" />
                      {name}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <aside className="offhours">
          <p className="label">Off-hours</p>
          <ul className="offhours-list">
            {OFF_HOURS.map(({ name, note, Icon }) => (
              <li key={name}>
                <Icon className="offhours-icon" aria-hidden="true" />
                <span>
                  <strong>{name}</strong>
                  <small>{note}</small>
                </span>
              </li>
            ))}
          </ul>

          <a className="resume" href={RESUME_URL} target="_blank" rel="noopener noreferrer">
            <span className="resume-kicker">Take one</span>
            <span className="resume-title">Résumé</span>
            <span className="resume-meta">PDF ↗</span>
          </a>
        </aside>
      </div>
    </Chapter>
  );
}
