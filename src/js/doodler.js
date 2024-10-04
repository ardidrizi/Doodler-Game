class Doodler {
  constructor(container) {
    this.container = container;
    this.doodlerElement = document.createElement("div");

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

    // Listen for keyboard events
    document.addEventListener("keydown", this.control.bind(this));
    document.addEventListener("keyup", this.stopMoving.bind(this));
  }

  // Function to update money count after collecting a coin
  collectCoin() {
    this.money += 1;
    console.log(`Money collected: ${this.money}`);
    document.querySelector(".money-board").innerText = `Money: ${this.money}`;
  }

  // Check landing on platform (also calls checkCoinCollision)
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

        // Check if there is a coin to collect on this platform
        this.checkCoinCollision(platform);
      }
    });
    return landedPlatform; // Return the platform the Doodler landed on
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
    this.clearIntervals();

    // Make the Doodler jump upwards smoothly
    this.jumpInterval = setInterval(() => {
      this.bottomSpace += 10; // Control jump height increment (slowed it down)
      this.updatePosition();

      // Scroll the game upwards when the doodler is high enough
      if (this.bottomSpace > 250) {
        this.scrollPlatforms();
      }

      // Stop the jump and start falling when jump reaches its peak
      if (this.bottomSpace > 350) {
        this.fall(); // Start falling after reaching peak
      }
    }, 30); // Slower interval for smoother movement
  }

  fall() {
    this.isJumping = false; // Doodler is not jumping anymore
    this.isFalling = true; // Set falling status
    this.clearIntervals();

    // Make the Doodler fall down smoothly
    this.fallInterval = setInterval(() => {
      this.bottomSpace -= 5; // Control fall speed
      this.updatePosition();

      // Check if landed on a platform
      let platformLandedOn = this.checkLandingOnPlatform();
      if (platformLandedOn) {
        // Update the score only when the doodler lands on a new, higher platform
        this.updateScore(platformLandedOn);
        clearInterval(this.fallInterval); // Stop falling once landed
        this.isFalling = false; // Stop the falling state
      }

      // End game if Doodler falls too far
      if (this.bottomSpace <= 0) {
        clearInterval(this.fallInterval);
        this.endGame();
      }
    }, 30); // Same interval speed as jumping for consistency
  }

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
      }
    });
    return landedPlatform; // Return null if no platform is landed on
  }

  moveLeft() {
    if (this.isMovingLeft) {
      this.leftSpace -= 5;
      if (this.leftSpace < 0) {
        this.leftSpace = this.container.offsetWidth - 60; // Wrap around to right side
      }
      this.updatePosition();

      // Check if Doodler is still on a platform; if not, start falling
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

      // Check if Doodler is still on a platform; if not, start falling
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
    // Move platforms down when doodler jumps higher
    this.platforms.forEach((platform) => {
      platform.bottomSpace -= 10; // Adjust the speed of platform scrolling
      platform.platformElement.style.bottom = `${platform.bottomSpace}px`;

      // Remove platforms that move off the screen
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
    const newPlatform = new Platform(this.container, highestPlatform + 120); // Create a new platform higher up
    this.platforms.push(newPlatform);
  }

  clearIntervals() {
    if (this.jumpInterval) clearInterval(this.jumpInterval);
    if (this.fallInterval) clearInterval(this.fallInterval);
  }

  endGame() {
    console.log("Game Over");
    alert(`Game Over! Your score: ${this.score}`);
  }
}
