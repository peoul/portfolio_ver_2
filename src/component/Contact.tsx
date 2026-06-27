import { contact } from "../assets/data/portfolio.json";
import { FaEnvelope, FaLinkedinIn, FaGithub } from "react-icons/fa6";
import "./contact.css";

function ContactSection() {
  return (
    <section className="contact_section">
      <p className="prompt">~ contact</p>

      <div className="contact">
        <a href={`mailto:${contact.email}`}>
          <FaEnvelope className="contact-icon" aria-hidden="true" /> email{" "}
          <span className="ext">↗</span>
        </a>
        <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">
          <FaLinkedinIn className="contact-icon" aria-hidden="true" /> linkedin{" "}
          <span className="ext">↗</span>
        </a>
        <a href={contact.github} target="_blank" rel="noopener noreferrer">
          <FaGithub className="contact-icon" aria-hidden="true" /> github{" "}
          <span className="ext">↗</span>
        </a>
      </div>

      <p className="attribution">
        Made by Lyhong Peou © 2025
        <span className="cursor" aria-hidden="true" />
      </p>
    </section>
  );
}

export default ContactSection;
