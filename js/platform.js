class Platform {
  constructor(container, bottomSpace) {
    this.container = container;
    this.bottomSpace = bottomSpace;
    this.leftSpace = Math.random() * (container.offsetWidth - 85); // Randomize platform position

    // Create platform element
    this.platformElement = document.createElement("div");
    this.platformElement.style.width = "85px";
    this.platformElement.style.height = "15px";
    this.platformElement.style.backgroundColor = "green";
    this.platformElement.style.position = "absolute";
    this.platformElement.style.left = `${this.leftSpace}px`;
    this.platformElement.style.bottom = `${this.bottomSpace}px`;

    container.appendChild(this.platformElement);
  }
}
