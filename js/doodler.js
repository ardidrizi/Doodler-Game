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

    // Create platforms
    this.createPlatforms();

    // Start the jump action when the doodler is created
    this.jump();

    // Listen for keyboard events
    document.addEventListener("keydown", this.control.bind(this));
    document.addEventListener("keyup", this.stopMoving.bind(this));
  }

  createPlatforms() {
    let platformGap = this.container.offsetHeight / this.platformCount;
    for (let i = 0; i < this.platformCount; i++) {
      let bottomSpace = i * platformGap;
      let platform = new Platform(this.container, bottomSpace);
      this.platforms.push(platform);
      console.log(
        `Platform ${i} created at bottom: ${bottomSpace}, left: ${platform.leftSpace}`
      );
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
    console.log("Jumping...");
    this.isJumping = true;
    this.jumpInterval = setInterval(() => {
      if (this.bottomSpace >= 350) {
        console.log("Max height reached, start falling...");
        clearInterval(this.jumpInterval);
        this.fall();
      }

      if (this.bottomSpace > 250) {
        this.container.style.transform = `translateY(${-(
          this.bottomSpace - 250
        )}px)`;
        this.checkPlatforms(); // Check for new platforms as the Doodler rises
      }

      this.bottomSpace += 20;
      this.updatePosition();
      this.updateScore();
    }, 30);
  }

  fall() {
    console.log("Falling...");
    this.isJumping = false;
    this.isFalling = true;

    this.fallInterval = setInterval(() => {
      if (this.bottomSpace <= 0) {
        this.bottomSpace = 0; // Prevent falling below ground level
        clearInterval(this.fallInterval);
        console.log("Doodler hit the ground!");
        this.endGame(); // Handle end of game
        return;
      }

      this.platforms.forEach((platform) => {
        if (
          this.bottomSpace >= platform.bottomSpace &&
          this.bottomSpace <= platform.bottomSpace + 15 &&
          this.leftSpace + 60 >= platform.leftSpace &&
          this.leftSpace <= platform.leftSpace + 85 &&
          !this.isJumping
        ) {
          console.log("Landed on a platform!");
          clearInterval(this.fallInterval);
          this.jump();
          this.updateScore();

          // Move all platforms down to simulate rising
          this.platforms.forEach((p) => {
            p.bottomSpace -= 10;
            p.platformElement.style.bottom = `${p.bottomSpace}px`;
          });

          this.checkPlatforms(); // Check for new platforms as well
        }
      });

      this.bottomSpace -= 5;
      this.updatePosition();
    }, 30);
  }

  // Check for new platforms to create
  checkPlatforms() {
    // Create a new platform if the Doodler reaches a certain height
    if (this.bottomSpace > this.container.offsetHeight - 100) {
      this.createNewPlatform();
    }

    // Remove platforms that are below the visible area
    this.platforms.forEach((platform, index) => {
      if (platform.bottomSpace < 0) {
        platform.platformElement.remove(); // Remove from DOM
        this.platforms.splice(index, 1); // Remove from the platforms array
      }
    });
  }

  createNewPlatform() {
    const newPlatformBottom = this.container.offsetHeight; // Create a new platform at the top
    const platform = new Platform(this.container, newPlatformBottom);
    this.platforms.push(platform);
    console.log(`New platform created at bottom: ${newPlatformBottom}`);
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
}

// Initialize the doodler when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const gameContainer = document.querySelector(".game-container");
  new Doodler(gameContainer);
});
