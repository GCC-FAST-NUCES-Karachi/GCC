import OctoDive from "./octo-dive";
import "../games.css";

export const metadata = {
  title: "Octo Dive",
  description:
    "A Kahoot-style GitHub quiz where a ghostly Octocat dives deeper as you score. Answer 15 multiple-choice questions about Git and GitHub — how deep can you go?",
};

export default function OctoDivePage() {
  return (
    <main id="main-content" className="games-page octo-page">
      <OctoDive />
    </main>
  );
}
