import { contact } from "../assets/data/portfolio.json";
import { FaEnvelope, FaLinkedinIn, FaGithub } from "react-icons/fa6";
import "./contact.css";
import Section from "./Section";
import { DoodleCircle, DoodleExternal, DoodleHeart } from "./Doodle";

const LINKS = [
  { key: "email", label: "Email", href: `mailto:${contact.email}`, Icon: FaEnvelope, external: false },
  { key: "linkedin", label: "LinkedIn", href: contact.linkedin, Icon: FaLinkedinIn, external: true },
  { key: "github", label: "GitHub", href: contact.github, Icon: FaGithub, external: true },
];

function ContactSection() {
  return (
    <Section index="05" label="Contact" id="contact">
      <ul className="contact-list">
        {LINKS.map(({ key, label, href, Icon, external }) => (
          <li key={key}>
            <a
              className="contact-link"
              href={href}
              {...(external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
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
