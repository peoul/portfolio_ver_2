import "./contact.css";
import { PiGithubLogoBold, PiLinkedinLogoBold, PiArrowUpRightBold } from "react-icons/pi";
import { contact, hero, experience } from "../assets/data/portfolio.json";
import Chapter from "./Chapter";
import Tuktuk from "./Tuktuk";

const studio = experience[0];

export default function Contact() {
  return (
    <>
      <Chapter id="forward" title={contact.headline} place={`${hero.now} → ${hero.origin}`} className="forward">
        <div className="forward-grid">
          <div className="forward-text">
            {contact.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          <div className="forward-actions">
            <a className="mail-sign" href={`mailto:${contact.email}`}>
              <span className="mail-sign-kicker">Say hello</span>
              <span className="mail-sign-addr">{contact.email}</span>
            </a>

            <ul className="socials">
              <li>
                <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">
                  <PiLinkedinLogoBold aria-hidden="true" /> LinkedIn
                </a>
              </li>
              <li>
                <a href={contact.github} target="_blank" rel="noopener noreferrer">
                  <PiGithubLogoBold aria-hidden="true" /> GitHub
                </a>
              </li>
              {studio.link && (
                <li>
                  <a href={studio.link} target="_blank" rel="noopener noreferrer">
                    <PiArrowUpRightBold aria-hidden="true" /> {studio.company}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </Chapter>

      <footer className="footer">
        <div className="footer-road" aria-hidden="true">
          <Tuktuk className="footer-tt" />
        </div>
        <p className="footer-line">
          <span className="kh-sign" lang="km">
            ធ្វើដោយដៃ
          </span>
          <span>
            Handmade by a kid from {hero.origin} · © {new Date().getFullYear()} {hero.name}
          </span>
        </p>
      </footer>
    </>
  );
}
