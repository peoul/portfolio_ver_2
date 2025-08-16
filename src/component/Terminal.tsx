import "./terminal.css";
import { contact } from "../assets/data/portfolio.json";
function Terminal() {
  return (
    <div className="terminal">
      <div className="header">
        <p>Terminal — About Me</p>
        <div className="header-action">
          <p>⎼</p>
          <p>□</p>
          <p>×</p>
        </div>
      </div>

      <div className="command">
        <div className="input-statement">
          <p>lyhong@local ~</p>
          <p className="input">$ Lyhong.education</p>
          <p className="output">
            [ "Johns Hopkins University - MS Information Systems Engineering" ,
            "Oregon State University - BS Computer Science" ]
          </p>
        </div>

        <div className="input-statement">
          <p>lyhong@local ~</p>
          <p className="input">$ Lyhong.hobbies</p>
          <p className="output">[ "Coffee" , "Gaming" , "Homelab" ]</p>
        </div>

        <div className="input-statement">
          <p>lyhong@local ~</p>
          <p className="input">$ Lyhong.languages</p>
          <p className="output">[ "TypeScript" , "C++" , "Python" ]</p>
        </div>

        <div className="input-statement">
          <p>lyhong@local ~</p>
          <p className="input">$ resume</p>
          <a href="/resume.pdf" className="output">
            📄 View PDF
          </a>
        </div>

        <div className="input-statement">
          <p>lyhong@local ~</p>
          <p className="input">$ cat contact.txt</p>
          <p className="output">
            <a href={`mailto:${contact.email}`}>📧 gmail.com</a> ,{" "}
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              🔗 linkedin.com
            </a>{" "}
            ,{" "}
            <a href={contact.github} target="_blank" rel="noopener noreferrer">
              🐙 github.com
            </a>
          </p>
        </div>

        <div className="input-statement">
          <p>lyhong@local ~</p>
          <p className="input">
            $ <span className="cursor">_</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Terminal;
