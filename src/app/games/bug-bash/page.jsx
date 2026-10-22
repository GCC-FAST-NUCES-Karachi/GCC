import BugBash from "./bug-bash";
import "../games.css";

export const metadata = { title: "Bug Bash", description: "Squash bugs before they ship, spare the working code, and never force push." };

export default function BugBashPage() {
  return <main id="main-content" className="games-page bug-page"><BugBash /></main>;
}
