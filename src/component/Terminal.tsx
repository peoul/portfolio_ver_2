import "./terminal.css";

function Terminal() {
  return (
    <>
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
            <p className="input">$ pwd </p>
            <p className="output">"/home/lyhong/portfolio"</p>
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
            <p className="input">$ Lyhong.languages</p>
            <p className="output">[ "TypeScript" , "C++" , "Python" ]</p>
          </div>

          <div className="input-statement">
            <p>lyhong@local ~</p>
            <p className="input">$ cat contact.txt</p>
            <a className="output" href="mailto:lyhong.peou@gmail.com">
              📧 gmail.com
            </a>
            <a
              className="output"
              href="https://linkedin.com/in/lyhong-peou"
              target="_blank"
              rel="noopener noreferrer"
            >
              🔗 linkedin.com
            </a>
            <a
              className="output"
              href="https://github.com/lyhong-peou"
              target="_blank"
              rel="noopener noreferrer"
            >
              🐙 github.com
            </a>
          </div>

          <div className="input-statement">
            <p>lyhong@local ~</p>
            <p className="input">
              $ <span className="cursor">_</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Terminal;
