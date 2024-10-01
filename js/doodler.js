class Doodler {
  constructor(container) {
    this.container = container;
    this.doodlerElement = document.createElement("div");

    // Set doodler styles
    this.doodlerElement.style.width = "60px";
    this.doodlerElement.style.height = "60px";
    this.doodlerElement.style.backgroundColor = "blue";
    this.doodlerElement.style.position = "absolute";

    // Set initial position
    this.leftSpace = 150;
    this.bottomSpace = 150;
    this.doodlerElement.style.left = `${this.leftSpace}px`;
    this.doodlerElement.style.bottom = `${this.bottomSpace}px`;

    // Append doodler to game container
    this.container.appendChild(this.doodlerElement);

    this.isJumping = false;
    this.isFalling = false;
    this.isMovingLeft = false;
    this.isMovingRight = false;

    this.jumpInterval = null;
    this.fallInterval = null;

    this.platforms = [];
    this.platformCount = 5;
    this.score = 0;

    // Create platforms
    this.createInitialPlatforms();

    // Start the jump action when the doodler is created
    this.jump();

    // Listen for keyboard events
    document.addEventListener("keydown", this.control.bind(this));
    document.addEventListener("keyup", this.stopMoving.bind(this));

    // Create score display
    this.createScoreBoard();
  }

  createScoreBoard() {
    this.scoreBoard = document.createElement("div");
    this.scoreBoard.className = "score-board";
    this.scoreBoard.innerText = `Score: ${this.score}`;
    this.container.appendChild(this.scoreBoard);
  }

  createInitialPlatforms() {
    let platformGap = this.container.offsetHeight / this.platformCount;
    for (let i = 0; i < this.platformCount; i++) {
      let bottomSpace = i * platformGap + 50;
      let platform = new Platform(this.container, bottomSpace);
      this.platforms.push(platform);
    }
  }

  updatePosition() {
    this.doodlerElement.style.left = `${this.leftSpace}px`;
    this.doodlerElement.style.bottom = `${this.bottomSpace}px`;
  }

  clearIntervals() {
    if (this.jumpInterval) clearInterval(this.jumpInterval);
    if (this.fallInterval) clearInterval(this.fallInterval);
  }

  jump() {
    this.isJumping = true;
    this.clearIntervals();
    this.newPlatformCreated = false;

    this.jumpInterval = setInterval(() => {
      if (this.bottomSpace >= 250) {
        clearInterval(this.jumpInterval);
        this.fall();
      }

      this.bottomSpace += 15; // Control jump height
      this.updatePosition();
      this.movePlatforms(-15);

      // Create new platform at a controlled height
      if (this.bottomSpace >= 250 && !this.newPlatformCreated) {
        this.createSinglePlatformAbove();
        this.newPlatformCreated = true; // Only create one new platform per jump
      }
    }, 30);
  }

  fall() {
    this.isJumping = false;
    this.isFalling = true;

    this.fallInterval = setInterval(() => {
      if (this.bottomSpace <= 0) {
        clearInterval(this.fallInterval);
        this.endGame();
        return;
      }

      let landed = false;

      this.platforms.forEach((platform) => {
        if (
          this.bottomSpace >= platform.bottomSpace &&
          this.bottomSpace <= platform.bottomSpace + 15 &&
          this.leftSpace + 60 >= platform.leftSpace &&
          this.leftSpace <= platform.leftSpace + 85 &&
          !this.isJumping
        ) {
          clearInterval(this.fallInterval);
          this.jump();
          this.updateScore();
          landed = true;
        }
      });

      if (!landed) {
        this.bottomSpace -= 5; // Falling speed
      }

      this.updatePosition();
    }, 30);
  }

  movePlatforms(offset) {
    this.platforms.forEach((platform) => {
      platform.bottomSpace += offset;
      platform.platformElement.style.bottom = `${platform.bottomSpace}px`;

      // Remove platforms that move off the screen
      if (platform.bottomSpace < 0) {
        platform.platformElement.remove();
        this.platforms.shift(); // Remove the platform from the array
      }
    });
  }

  createSinglePlatformAbove() {
    const highestPlatform = Math.max(
      ...this.platforms.map((p) => p.bottomSpace)
    );
    const newPlatform = new Platform(this.container, highestPlatform + 100); // Add 100px above the highest platform
    this.platforms.push(newPlatform);
  }

  updateScore() {
    this.score += 1;
    this.scoreBoard.innerText = `Score: ${this.score}`;
  }

  control(e) {
    if (e.key === "ArrowLeft" && !this.isMovingLeft) {
      this.isMovingLeft = true;
      this.moveLeft();
    } else if (e.key === "ArrowRight" && !this.isMovingRight) {
      this.isMovingRight = true;
      this.moveRight();
    }
  }

  stopMoving(e) {
    if (e.key === "ArrowLeft") {
      this.isMovingLeft = false;
    } else if (e.key === "ArrowRight") {
      this.isMovingRight = false;
    }
  }

  moveLeft() {
    let moveInterval = setInterval(() => {
      if (this.isMovingLeft && this.leftSpace > 0) {
        this.leftSpace -= 5;
        this.updatePosition();
      } else {
        clearInterval(moveInterval);
      }
    }, 20);
  }

  moveRight() {
    let moveInterval = setInterval(() => {
      if (
        this.isMovingRight &&
        this.leftSpace < this.container.offsetWidth - 60
      ) {
        this.leftSpace += 5;
        this.updatePosition();
      } else {
        clearInterval(moveInterval);
      }
    }, 20);
  }

  endGame() {
    console.log("Game Over!");
    this.container.innerHTML = ""; // Clear the game container
    this.container.innerText = "Game Over! Refresh to restart."; // Inform the player
  }
}

// Initialize the doodler when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const gameContainer = document.querySelector(".game-container");
  new Doodler(gameContainer);
});
