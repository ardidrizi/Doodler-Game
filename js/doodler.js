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
    this.isMovingLeft = false;
    this.isMovingRight = false;

    // Start the jump action when the doodler is created
    this.jump();

    // Listen for keyboard events
    document.addEventListener("keydown", this.control.bind(this)); // Bind "this" to ensure correct context
    document.addEventListener("keyup", this.stopMoving.bind(this)); // Stop moving on key release
  }

  // Update doodler's position in the game container
  updatePosition() {
    this.doodlerElement.style.left = `${this.leftSpace}px`;
    this.doodlerElement.style.bottom = `${this.bottomSpace}px`;
  }

  // Make the doodler jump
  jump() {
    this.isJumping = true;
    let jumpHeight = 200;
    let jumpInterval = setInterval(() => {
      if (this.bottomSpace >= 350) {
        clearInterval(jumpInterval);
        this.fall();
      }
      this.bottomSpace += 20;
      this.updatePosition();
    }, 30);
  }

  // Make the doodler fall
  fall() {
    this.isJumping = false;
    let fallInterval = setInterval(() => {
      if (this.bottomSpace <= 0) {
        clearInterval(fallInterval);
        console.log("Doodler has hit the ground!");
      }
      this.bottomSpace -= 5;
      this.updatePosition();
    }, 30);
  }

  // Handle left and right movement
  control(e) {
    if (e.key === "ArrowLeft" && !this.isMovingLeft) {
      this.isMovingLeft = true;
      this.moveLeft();
    } else if (e.key === "ArrowRight" && !this.isMovingRight) {
      this.isMovingRight = true;
      this.moveRight();
    }
  }

  // Stop movement when arrow keys are released
  stopMoving(e) {
    if (e.key === "ArrowLeft") {
      this.isMovingLeft = false;
    } else if (e.key === "ArrowRight") {
      this.isMovingRight = false;
    }
  }

  // Move doodler to the left
  moveLeft() {
    let moveInterval = setInterval(() => {
      if (this.isMovingLeft && this.leftSpace > 0) {
        // Ensure doodler doesn't go outside left boundary
        this.leftSpace -= 5;
        this.updatePosition();
      } else {
        clearInterval(moveInterval);
      }
    }, 20); // Speed of left movement
  }

  // Move doodler to the right
  moveRight() {
    let moveInterval = setInterval(() => {
      if (
        this.isMovingRight &&
        this.leftSpace < this.container.offsetWidth - 60
      ) {
        // Ensure doodler doesn't go outside right boundary
        this.leftSpace += 5;
        this.updatePosition();
      } else {
        clearInterval(moveInterval);
      }
    }, 20); // Speed of right movement
  }
}

// Initialize the doodler when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const gameContainer = document.querySelector(".game-container");
  new Doodler(gameContainer);
});
