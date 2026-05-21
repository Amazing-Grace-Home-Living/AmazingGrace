import { initMatchMakerUI } from "./match-maker-ui.js";
import { bootstrapArcadeModule } from "./js/nexus-connector.js";

const app = document.getElementById("app");

bootstrapArcadeModule({
  moduleId: "MATCH_MAKER",
  title: "Match Maker",
  href: "./",
  description: "Classic gem process wired into the shared Nexus balance.",
});

// Render a simple game-selection screen with Match Maker
app.innerHTML = `
  <header class="arcade-header">
    <h1>🕹️ Arcade</h1>
    <p class="arcade-subtitle">Gamified Learning Arcade</p>
  </header>
  <main class="arcade-main">
    <div id="game-container"></div>
  </main>
`;

const gameContainer = document.getElementById("game-container");
initMatchMakerUI(gameContainer);
