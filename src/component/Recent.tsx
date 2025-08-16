import "./recent.css";
import {projects} from "../assets/data/portfolio.json"

interface projectProps {
  title: string,
  description: string,
  tags: string[],
  features: string[],
  github: string,
}


function Card({ title, description, technologies, features, github }: ProjectProps) {

  return <>
    <h3></h3>
  </>
  
}

function RecentProject() {
  return (
    <div className="recent_work">
      <h2> Recent Work </h2>
    </div>
  );
}




export default RecentProject;
