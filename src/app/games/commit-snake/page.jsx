import CommitSnake from "./snake";
import "../games.css";

export const metadata = { title: "Commit Snake", description: "Collect commits, grow your branch, and dodge the GCC blockers." };

export default function CommitSnakePage() {
  return <main id="main-content" className="games-page snake-page"><CommitSnake /></main>;
}
