class Platform {
  constructor(container, bottomSpace) {
    this.container = container;
    this.bottomSpace = bottomSpace;
    this.leftSpace = Math.random() * (this.container.offsetWidth - 85); // Randomize horizontal position
    this.width = 85;

    // Create the platform element
    this.platformElement = document.createElement("div");
    this.platformElement.classList.add("platform", "grass"); // Add a basic style for platforms (grass, stone, etc.)

    // Set platform position
    this.platformElement.style.left = `${this.leftSpace}px`;
    this.platformElement.style.bottom = `${this.bottomSpace}px`;

    // Append platform to the game container
    this.container.appendChild(this.platformElement);

    // 30% chance of adding a coin to the platform
    if (Math.random() < 0.3) {
      this.addCoin();
    }
  }

  // Function to add a coin to the platform
  addCoin() {
    this.coinElement = document.createElement("div");
    this.coinElement.classList.add("coin"); // Add coin style

    // Append the coin to the platform (coin becomes a child of the platform)
    this.platformElement.appendChild(this.coinElement);

    // Center the coin relative to the platform
    this.coinElement.style.position = "absolute";
    this.coinElement.style.left = `${(this.width - 20) / 2}px`; // Center coin horizontally on platform
    this.coinElement.style.bottom = `20px`; // Position the coin slightly above the platform surface
  }

  // Animate and remove the coin after it's collected
  removeCoin() {
    if (this.coinElement) {
      console.log("Coin is collected. Starting disappear animation.");

      // Add the disappearing class to trigger the animation
      this.coinElement.classList.add("disappearing");

      // Add a small delay to ensure the animation starts before checking for animation end
      setTimeout(() => {
        // Listen for the animation to complete before removing the coin
        this.coinElement.addEventListener("animationend", () => {
          console.log("Coin has disappeared. Removing from DOM.");
          this.coinElement.remove(); // Remove the coin from the DOM
          this.coinElement = null; // Clear the reference
        });
      }, 50); // Small delay to let the animation kick in
    }
  }
}
