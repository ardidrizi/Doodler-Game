class Game {
  constructor(container) {
    this.container = container;
    this.doodler = new Doodler(this.container); // Initialize Doodler and platforms
    this.isGameOver = false;

    this.init();
  }

  init() {
    // Initialize the game, create score display
    this.createScoreBoard();

    // Update scoreboard periodically
    this.updateScoreBoard();

    // Start the game by making the doodler jump
    this.doodler.jump();
  }

  createScoreBoard() {
    this.scoreBoard = document.createElement("div");
    this.scoreBoard.className = "score-board";
    this.scoreBoard.innerText = `Score: ${this.doodler.score}`;
    this.container.appendChild(this.scoreBoard);
  }

  updateScoreBoard() {
    setInterval(() => {
      this.scoreBoard.innerText = `Score: ${this.doodler.score}`;
    }, 100); // Update the score every 100ms to reflect the changes
  }
}

// Initialize the game when DOM is ready
const startButton = document.querySelector("#start-button");
console.log(startButton);

// restartButton.addEventListener("click", () => {
//   location.reload();
// });

// console.log(startButton);
startButton.addEventListener("click", () => {
  // show the game container
  document.querySelector(".instruction-container").style.display = "none";
  document.querySelector(".game-container").style.display = "block";

  const gameContainer = document.querySelector(".game-container");
  new Game(gameContainer);
});
