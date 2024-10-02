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
    this.platformCount = 5; // Reduced number of platforms
    this.score = 0;
    this.maxJumps = 3; // Maximum jump count
    this.currentJumps = 0; // Track current jump count

    // Create score display
    this.createScoreBoard();

    // Create platforms
    this.createInitialPlatforms();

    // Listen for keyboard events
    document.addEventListener("keydown", this.control.bind(this));
    document.addEventListener("keyup", this.stopMoving.bind(this));
  }

  createScoreBoard() {
    // Remove any existing score display
    const existingScoreBoard = document.querySelector(".score-board");
    if (existingScoreBoard) {
      existingScoreBoard.remove();
    }

    // Create a new score display
    this.scoreBoard = document.createElement("div");
    this.scoreBoard.className = "score-board";
    this.scoreBoard.innerText = `Score: ${this.score}`;
    this.container.appendChild(this.scoreBoard);
  }

  updateScore() {
    this.score += 1;
    this.scoreBoard.innerText = `Score: ${this.score}`;
    console.log(`Score Updated: ${this.score}`);
  }

  createInitialPlatforms() {
    let platformGap = this.container.offsetHeight / (this.platformCount + 1);
    for (let i = 0; i < this.platformCount; i++) {
      let bottomSpace = (i + 1) * platformGap; // Adjust to create space between platforms
      let platform = new Platform(this.container, bottomSpace);
      this.platforms.push(platform);
    }
  }

  updatePosition() {
    this.doodlerElement.style.left = `${this.leftSpace}px`;
    this.doodlerElement.style.bottom = `${this.bottomSpace}px`;
    console.log(
      `Doodler Position - Left: ${this.leftSpace}, Bottom: ${this.bottomSpace}`
    );
  }

  clearIntervals() {
    if (this.jumpInterval) clearInterval(this.jumpInterval);
    if (this.fallInterval) clearInterval(this.fallInterval);
  }

  jump() {
    if (this.isJumping || this.currentJumps >= this.maxJumps) return; // Prevent multiple jumps or exceeding jump limit

    this.isJumping = true;
    this.clearIntervals();
    this.newPlatformCreated = false;

    console.log("Doodler is jumping");

    this.jumpInterval = setInterval(() => {
      if (this.bottomSpace >= 250 + 75) {
        // Adjust height threshold to allow jumping higher
        clearInterval(this.jumpInterval);
        this.fall();
        return;
      }

      this.bottomSpace += 10; // Adjusted jump height
      this.updatePosition();
      this.movePlatforms(-5); // Reduce the upward movement of platforms

      // Create new platform above if applicable
      if (this.bottomSpace >= 200 && !this.newPlatformCreated) {
        // Controlled height for creating platform
        this.createSinglePlatformAbove();
        this.newPlatformCreated = true; // Only create one new platform per jump
        console.log("Created new platform above");
      }

      // Ensure platforms scroll up as the Doodler jumps
      this.scrollPlatforms();
    }, 30);

    this.currentJumps++; // Increment the jump count
  }

  fall() {
    this.isJumping = false;
    this.isFalling = true;

    console.log("Doodler is falling");

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
          this.leftSpace <= platform.leftSpace + platform.width // Use platform width here
        ) {
          // Doodler lands on a platform
          landed = true;
          this.bottomSpace = platform.bottomSpace + 15; // Set Doodler right above the platform
          this.updatePosition();
          console.log("Doodler landed on a platform");

          // Reset jump count when landing on a platform
          this.currentJumps = 0;

          // Update score only if the Doodler just jumped
          if (this.isJumping) {
            this.updateScore(); // Increment score when landing
            this.isJumping = false; // Reset jumping status
          }
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
    const newPlatform = new Platform(this.container, highestPlatform + 80); // Adjust for better visibility
    this.platforms.push(newPlatform);
  }

  scrollPlatforms() {
    // Move platforms up when the Doodler jumps high
    if (this.bottomSpace >= 200) {
      this.movePlatforms(-2); // Adjust this value to control how much slower the platforms move
    }
  }

  control(e) {
    console.log(`Key pressed: ${e.key}`);

    if (e.key === "ArrowLeft" && !this.isMovingLeft) {
      this.isMovingLeft = true;
      this.moveLeft();
    } else if (e.key === "ArrowRight" && !this.isMovingRight) {
      this.isMovingRight = true;
      this.moveRight();
    } else if (e.key === "ArrowUp") {
      this.jump(); // Allow jumping only when Up Arrow is pressed
    }
  }

  stopMoving(e) {
    console.log(`Key released: ${e.key}`);

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
