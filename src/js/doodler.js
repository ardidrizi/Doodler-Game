class Doodler {
  constructor(container) {
    this.container = container;
    this.doodlerElement = document.createElement("div");

    this.jumpSound = new Audio("sounds/jump.wav"); // Add jump sound
    this.collectCoinSound = new Audio("sounds/collect.wav");
    this.gameOverSound = new Audio("sounds/game_over.wav");

    // Set doodler styles
    this.doodlerElement.style.width = "60px";
    this.doodlerElement.style.height = "60px";
    this.doodlerElement.style.backgroundImage = "url('images/doodler.webp')";
    this.doodlerElement.style.backgroundSize = "cover";
    this.doodlerElement.style.backgroundRepeat = "no-repeat";
    this.doodlerElement.style.borderRadius = "50%";
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

    // Initialize platforms
    this.platforms = [];
    this.platformCount = 5;
    this.createInitialPlatforms();

    // Initialize score and last platform tracker
    this.score = 0;
    this.lastPlatform = null; // Track the last platform Doodler landed on
    this.money = 0; // Track the money collected

    // Cache the bound methods for event listeners
    this.boundControl = this.control.bind(this);
    this.boundStopMoving = this.stopMoving.bind(this);

    // Listen for keyboard events using the cached functions
    document.addEventListener("keydown", this.boundControl);
    document.addEventListener("keyup", this.boundStopMoving);
  }

  // Function to update money count after collecting a coin
  collectCoin() {
    this.money += 1;
    this.collectCoinSound.play(); // Play coin collection sound
    console.log(`Money collected: ${this.money}`);
    document.querySelector(".money-board").innerText = `Money: ${this.money}`;
  }

  // Check coin collision and collect if Doodler lands on it
  checkCoinCollision(platform) {
    if (platform.coinElement) {
      const doodlerLeft = this.leftSpace;
      const doodlerRight = this.leftSpace + 60;
      const coinLeft = platform.leftSpace + (platform.width - 20) / 2;
      const coinRight = coinLeft + 20;

      if (doodlerRight >= coinLeft && doodlerLeft <= coinRight) {
        // Doodler collides with the coin
        platform.removeCoin();
        this.collectCoin(); // Increment money when the coin is collected
      }
    }
  }

  // Check landing on platform and coin collision
  checkLandingOnPlatform() {
    let landedPlatform = null;
    this.platforms.forEach((platform) => {
      if (
        this.bottomSpace >= platform.bottomSpace &&
        this.bottomSpace <= platform.bottomSpace + 15 &&
        this.leftSpace + 60 >= platform.leftSpace &&
        this.leftSpace <= platform.leftSpace + platform.width
      ) {
        // Doodler landed on the platform
        landedPlatform = platform;
        this.bottomSpace = platform.bottomSpace + 15;
        this.updatePosition();

        // Check for coin collection on this platform
        this.checkCoinCollision(platform);
      }
    });
    return landedPlatform;
  }

  createInitialPlatforms() {
    let platformGap = this.container.offsetHeight / (this.platformCount + 1);
    for (let i = 0; i < this.platformCount; i++) {
      let bottomSpace = (i + 3) * platformGap;
      let platform = new Platform(this.container, bottomSpace);
      this.platforms.push(platform);
    }
  }

  updatePosition() {
    this.doodlerElement.style.left = `${this.leftSpace}px`;
    this.doodlerElement.style.bottom = `${this.bottomSpace}px`;
  }

  updateScore(platform) {
    // Only update score if the new platform is different and higher than the last one
    if (platform !== this.lastPlatform) {
      this.score += 1;
      this.lastPlatform = platform; // Update last platform to the current one
    }
  }

  jump() {
    if (this.isJumping || this.isFalling) return;

    this.isJumping = true;
    this.jumpSound.play(); // Play jump sound
    this.clearIntervals();

    this.jumpInterval = setInterval(() => {
      this.bottomSpace += 10; // Control jump height increment
      this.updatePosition();

      if (this.bottomSpace > 250) {
        this.scrollPlatforms(); // Scroll platforms when jumping high enough
      }

      if (this.bottomSpace > 350) {
        this.fall(); // Start falling after reaching peak
      }
    }, 30); // Smooth jumping
  }

  fall() {
    this.isJumping = false;
    this.isFalling = true;
    this.clearIntervals();

    this.fallInterval = setInterval(() => {
      this.bottomSpace -= 5; // Control fall speed
      this.updatePosition();

      let platformLandedOn = this.checkLandingOnPlatform();
      if (platformLandedOn) {
        this.updateScore(platformLandedOn);
        clearInterval(this.fallInterval); // Stop falling after landing
        this.isFalling = false;
      }

      if (this.bottomSpace <= 0) {
        clearInterval(this.fallInterval);
        this.endGame();
      }
    }, 30);
  }

  moveLeft() {
    if (this.isMovingLeft) {
      this.leftSpace -= 5;
      if (this.leftSpace < 0) {
        this.leftSpace = this.container.offsetWidth - 60; // Wrap around to right side
      }
      this.updatePosition();

      if (!this.checkLandingOnPlatform() && !this.isFalling) {
        this.fall(); // Start falling if not on a platform
      }
    }
  }

  moveRight() {
    if (this.isMovingRight) {
      this.leftSpace += 5;
      if (this.leftSpace > this.container.offsetWidth - 60) {
        this.leftSpace = 0; // Wrap around to left side
      }
      this.updatePosition();

      if (!this.checkLandingOnPlatform() && !this.isFalling) {
        this.fall(); // Start falling if not on a platform
      }
    }
  }

  control(e) {
    if (e.key === "ArrowLeft") {
      this.isMovingLeft = true;
      this.leftTimer = setInterval(() => this.moveLeft(), 20);
    } else if (e.key === "ArrowRight") {
      this.isMovingRight = true;
      this.rightTimer = setInterval(() => this.moveRight(), 20);
    } else if (e.key === "ArrowUp") {
      this.jump(); // Allow jumping only with the Up arrow key
    }
  }

  stopMoving(e) {
    if (e.key === "ArrowLeft") {
      clearInterval(this.leftTimer);
      this.isMovingLeft = false;
    } else if (e.key === "ArrowRight") {
      clearInterval(this.rightTimer);
      this.isMovingRight = false;
    }
  }

  scrollPlatforms() {
    this.platforms.forEach((platform) => {
      platform.bottomSpace -= 10; // Adjust platform scrolling speed
      platform.platformElement.style.bottom = `${platform.bottomSpace}px`;

      if (platform.bottomSpace < 0) {
        platform.platformElement.remove();
        this.platforms.shift(); // Remove platform from array
        this.createSinglePlatformAbove();
      }
    });
  }

  createSinglePlatformAbove() {
    const highestPlatform = Math.max(
      ...this.platforms.map((p) => p.bottomSpace)
    );
    const newPlatform = new Platform(this.container, highestPlatform + 120);
    this.platforms.push(newPlatform);
  }

  clearIntervals() {
    if (this.jumpInterval) clearInterval(this.jumpInterval);
    if (this.fallInterval) clearInterval(this.fallInterval);
  }

  endGame() {
    this.gameOverSound.play(); // Play game over sound
    document.removeEventListener("keydown", this.boundControl);
    document.removeEventListener("keyup", this.boundStopMoving);

    this.doodlerElement.remove();
    this.clearIntervals();
    this.platforms.forEach((platform) => platform.platformElement.remove());
    this.platforms = [];

    const gameOverScreen = document.querySelector(".game-over-container");
    gameOverScreen.style.display = "flex";
    document.querySelector("#final-score").innerText = `Score: ${this.score}`;

    document.querySelector("#reset-button").addEventListener("click", () => {
      location.reload();
    });
  }
}
