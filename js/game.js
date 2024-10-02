class Game {
  constructor(container) {
    this.container = container;
    this.doodler = new Doodler(this.container);
    this.platforms = this.doodler.platforms; // Reference to platforms created in Doodler
    this.isGameOver = false;

    this.init();
  }

  init() {
    // Any initialization logic can go here
    // e.g., setting up score, listening to events, etc.
    this.createScoreBoard();
  }

  createScoreBoard() {
    this.scoreBoard = document.createElement("div");
    this.scoreBoard.className = "score-board";
    this.scoreBoard.innerText = `Score: ${this.doodler.score}`;
    this.container.appendChild(this.scoreBoard);

    // Update the score display every time the score changes
    this.doodler.updateScore = () => {
      this.doodler.score += 1;
      this.scoreBoard.innerText = `Score: ${this.doodler.score}`;
    };
  }

  endGame() {
    this.isGameOver = true;
    alert("Game Over! Refresh to restart."); // Show game over message
    this.container.innerHTML = ""; // Clear the game container
  }
}

// Initialize the game when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const gameContainer = document.querySelector(".game-container");
  new Game(gameContainer);
});
