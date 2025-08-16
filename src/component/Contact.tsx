import { contact } from "../assets/data/portfolio.json";
import LinkedIn from "../assets/image/linkedin.svg?react";
import Github from "../assets/image/github.svg?react";

import "./contact.css";

function ContactSection() {
  return (
    <div className="contact_section">
      <h2> Contact Me</h2>

      <div className="contact">
        <a>{contact.email}</a>
        <span className="separator">||</span>
        <a>
          <LinkedIn />
        </a>
        <span className="separator">||</span>
        <a>
          <Github />
        </a>
      </div>

      <p className="attribution">
        Made By Lyhong Peou @2025 and inspired by{" "}
        <a
          href="https://www.justinchi.me"
          target="_blank"
          rel="noopener noreferrer"
        >
          Justin Chi 
        </a>
        
      </p>
    </div>
  );
}

export default ContactSection;
