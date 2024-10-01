class Platform {
  constructor(container, bottomSpace) {
    this.container = container;
    this.platformElement = document.createElement("div");

    // Set platform styles
    this.platformElement.style.width = "85px";
    this.platformElement.style.height = "15px";
    this.platformElement.style.backgroundColor = "green";
    this.platformElement.style.position = "absolute";

    // Set random horizontal position (leftSpace)
    this.leftSpace = Math.random() * (container.offsetWidth - 85);
    this.bottomSpace = bottomSpace;

    // Apply position to platform
    this.platformElement.style.left = `${this.leftSpace}px`;
    this.platformElement.style.bottom = `${this.bottomSpace}px`;

    // Append platform to the game container
    this.container.appendChild(this.platformElement);
  }
}
