class Platform {
  constructor(container, bottomSpace) {
    this.container = container;
    this.bottomSpace = bottomSpace;

    // Randomize platform position and width
    this.width = Math.random() * (120 - 60) + 60; // Random width between 60 and 120
    this.leftSpace = Math.random() * (container.offsetWidth - this.width);

    // Create platform element
    this.platformElement = document.createElement("div");
    this.platformElement.style.width = `${this.width}px`;
    this.platformElement.style.height = "15px";
    this.platformElement.style.backgroundColor = "green";
    this.platformElement.style.position = "absolute";
    this.platformElement.style.left = `${this.leftSpace}px`;
    this.platformElement.style.bottom = `${this.bottomSpace}px`;

    container.appendChild(this.platformElement);
  }
}
