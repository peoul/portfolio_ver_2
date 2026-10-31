import "./story.css";
import { story, experience } from "../assets/data/portfolio.json";
import Chapter from "./Chapter";
import type { StopId } from "./stops";

interface Role {
  company: string;
  role: string;
  location: string;
  period: string;
  link?: string;
  blurb?: string;
  highlights?: string[];
}

interface StoryChapter {
  id: StopId;
  title: string;
  place?: string;
  expected?: string;
  paragraphs: string[];
  education?: { school: string; degree: string }[];
  roles?: string[];
}

const ROLES = experience as Role[];
const CHAPTERS = story as StoryChapter[];

const host = (url: string) => new URL(url).hostname.replace(/^www\./, "");

/* ---- artifacts: the things you'd pick up at each stop ---- */

function Postcard() {
  return (
    <figure className="postcard" aria-label="A postcard from Phnom Penh">
      <p className="postcard-greet">Greetings from</p>
      <p className="postcard-city riso">Phnom Penh</p>
      <p className="postcard-kh kh-sign" lang="km">
        ភ្នំពេញ
      </p>
      <div className="postcard-stamp" aria-hidden="true">
        <span className="postcard-stamp-value kh-poster">៛៥០០</span>
        <span className="postcard-stamp-country">Cambodia</span>
      </div>
      <div className="postcard-postmark" aria-hidden="true">
        <span>Phnom Penh</span>
        <span>· KH ·</span>
      </div>
    </figure>
  );
}

function Stamps({ education }: { education: NonNullable<StoryChapter["education"]> }) {
  return (
    <ul className="stamps" aria-label="Education">
      {education.map(({ school, degree }, i) => (
        <li key={school} className={`stamp stamp--${i % 2}`}>
          <span className="stamp-school">{school}</span>
          <span className="stamp-degree">{degree}</span>
        </li>
      ))}
    </ul>
  );
}

function Ticket({ role }: { role: Role }) {
  return (
    <article className="ticket">
      <div className="ticket-top">
        <span>{role.period}</span>
        <span>{role.location}</span>
      </div>
      <h3 className="ticket-company">{role.company}</h3>
      <p className="ticket-role">{role.role}</p>
      {role.blurb && <p className="ticket-text">{role.blurb}</p>}
      {role.highlights && (
        <ul className="ticket-list">
          {role.highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      )}
      {role.link && (
        <a className="ticket-link" href={role.link} target="_blank" rel="noopener noreferrer">
          {host(role.link)} <span aria-hidden="true">↗</span>
        </a>
      )}
    </article>
  );
}

function Fork({ expected }: { expected: string }) {
  return (
    <div className="fork" aria-label={`A fork in the road: ${expected}, or AJILE Studio`}>
      <span className="fork-post" aria-hidden="true" />
      <span className="fork-arrow fork-arrow--left">
        <s>{expected}</s>
        <small>expected</small>
      </span>
      <span className="fork-arrow fork-arrow--right">
        AJILE Studio
        <small>chosen</small>
      </span>
    </div>
  );
}

function Artifacts({ chapter }: { chapter: StoryChapter }) {
  const roles = (chapter.roles ?? [])
    .map((name) => ROLES.find((r) => r.company === name))
    .filter((r): r is Role => Boolean(r));

  return (
    <div className="story-side">
      {chapter.id === "home" && <Postcard />}
      {chapter.expected && <Fork expected={chapter.expected} />}
      {chapter.education && <Stamps education={chapter.education} />}
      {roles.map((role) => (
        <Ticket key={role.company} role={role} />
      ))}
    </div>
  );
}

export default function Story() {
  return (
    <>
      {CHAPTERS.map((chapter) => (
        <Chapter key={chapter.id} id={chapter.id} title={chapter.title} place={chapter.place}>
          <div className="story-grid">
            <div className="story-text">
              {chapter.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <Artifacts chapter={chapter} />
          </div>
        </Chapter>
      ))}
    </>
  );
}
