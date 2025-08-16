import { useEffect, useState } from "react";
import "./App.css";
import ModeIcon from "./assets/image/mode.svg?react";
import HeroSection from "./component/Hero";
import Terminal from "./component/Terminal";
import RecentProject from "./component/Recent";


function App() {
  const [light, setLight] = useState(true);

  const lightHandler = () => {
    setLight((prev) => !prev);
  };

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      light ? "dark" : "light"
    );
  }, [light]);

  return (
    <div className="container">
      <div className="navbar">
        <button
          className="mode_btn"
          onClick={lightHandler}
          title={light ? "Light mode" : "Dark mode"}
        >
          <ModeIcon />
        </button>
      </div>

      <HeroSection/>

      <Terminal/>

      <RecentProject/>



      <div></div>
    </div>
  );
}

export default App;
