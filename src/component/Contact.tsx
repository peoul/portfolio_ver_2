import { contact } from "../assets/data/portfolio.json";
import { FaLinkedinIn, FaGithub } from "react-icons/fa6";
import { useEffect, useState } from "react";
import "./contact.css";
import Section from "./Section";
import { DoodleCheck, DoodleCircle, DoodleExternal, DoodleHeart } from "./Doodle";

const LINKS = [
  { key: "linkedin", label: "LinkedIn", href: contact.linkedin, Icon: FaLinkedinIn },
  { key: "github", label: "GitHub", href: contact.github, Icon: FaGithub },
];

/** The address itself is the call to action; copying beats a mailto: for
 *  anyone without a desktop mail client. */
function EmailLead() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
    } catch {
      // clipboard blocked — the mailto link still works
    }
  };

  return (
    <div className="contact-lead">
      <p className="contact-headline">{contact.headline}</p>
      <div className="contact-email-row">
        <a className="contact-email" href={`mailto:${contact.email}`}>
          {contact.email}
        </a>
        <button
          className="copy-btn"
          onClick={copy}
          aria-label={copied ? "Email copied" : "Copy email address"}
        >
          {copied ? (
            <>
              <DoodleCheck className="copy-check" /> Copied
            </>
          ) : (
            "Copy"
          )}
        </button>
      </div>
    </div>
  );
}

function ContactSection() {
  return (
    <Section index="05" label="Contact" id="contact">
      <EmailLead />

      <ul className="contact-list">
        {LINKS.map(({ key, label, href, Icon }) => (
          <li key={key}>
            <a
              className="contact-link"
              href={href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="contact-glyph">
                <Icon aria-hidden="true" />
                <DoodleCircle size={40} className="contact-ring" />
              </span>
              <span className="contact-label">{label}</span>
              <DoodleExternal className="link-arrow" />
            </a>
          </li>
        ))}
      </ul>

      <p className="attribution">
        <span>Made by Lyhong Peou</span>
        <DoodleHeart className="attribution-heart" />
        <span>© 2026</span>
      </p>
    </Section>
  );
}

export default ContactSection;
