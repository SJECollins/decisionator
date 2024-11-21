const canvas = document.getElementById("wheel-canvas");
const ctx = canvas.getContext("2d");
const spinButton = document.getElementById("spin-button");
const addItemDiv = document.getElementById("add-items");
const setItemsButton = document.getElementById("set-items-button");
const addItemInput = document.getElementById("item-input");
const addItemButton = document.getElementById("add-item-button");
const wheelDisplay = document.getElementById("wheel-div");
const messageDisplay = document.getElementById("message-display");

const categories = [];
const wheelRadius = canvas.width / 2;
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

let isSpinning = false;
let currentAngle = 0;
let spinSpeed = 0;

const displayMessage = (message) => {
  messageDisplay.style.display = "block";
  messageDisplay.innerHTML = message;
  setTimeout(() => {
    messageDisplay.innerHTML = "";
    messageDisplay.style.display = "none";
  }, 2000);
};

// Add items to the wheel
setItemsButton.addEventListener("click", () => {
  wheelDisplay.style.display = "none";
  addItemDiv.style.display = "flex";
  setItemsButton.style.display = "none";
});

addItemButton.addEventListener("click", () => {
  categories.length = 0;
  const items = addItemInput.value.split(",").map((item) => item.trim());
  if (items.length < 2) {
    displayMessage("Please enter at least two items.");
    return;
  }
  categories.push(...items);
  wheelDisplay.style.display = "flex";
  setItemsButton.style.display = "block";
  addItemDiv.style.display = "none";
  drawWheel();
});

// Draw the wheel
const drawWheel = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const segmentAngle = (2 * Math.PI) / categories.length;
  let firstColour;

  categories.forEach((category, index) => {
    const startAngle = segmentAngle * index + currentAngle;
    const endAngle = startAngle + segmentAngle;

    // Draw segment
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, wheelRadius, startAngle, endAngle);

    let currentColor;

    currentColor = index % 2 === 0 ? "#003566" : "#ffc300";

    if (index === 0) {
      firstColour = currentColor;
    }

    if (index === categories.length - 1 && firstColour === currentColor) {
      currentColor = "#38b000";
    }

    ctx.fillStyle = currentColor;
    ctx.fill();
    ctx.stroke();

    // Draw text
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((startAngle + endAngle) / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "white";
    ctx.font = "24px Arial";
    ctx.fillText(category, wheelRadius - 10, 0);
    ctx.restore();

    previousColor = currentColor;
  });

  // Draw arrow
  ctx.fillStyle = "#000814";
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - wheelRadius + 50);
  ctx.lineTo(centerX - 30, centerY - wheelRadius - 10);
  ctx.lineTo(centerX + 30, centerY - wheelRadius - 10);
  ctx.closePath();
  ctx.fill();
};

// Animate the wheel spinning
const spinWheel = () => {
  if (isSpinning) {
    currentAngle += spinSpeed;
    spinSpeed *= 0.98; // Friction

    // Stop spinning
    if (spinSpeed < 0.01) {
      isSpinning = false;
      determineResult();
    }
    drawWheel();
    requestAnimationFrame(spinWheel);
  }
};

// Determine result
function determineResult() {
  const segmentAngle = (2 * Math.PI) / categories.length;
  const adjustedAngle =
    (2 * Math.PI - (currentAngle % (2 * Math.PI))) % (2 * Math.PI);
  const topAngleOffset = Math.PI / 2;
  let segmentIndex = Math.floor(
    (adjustedAngle - topAngleOffset) / segmentAngle
  );
  if (segmentIndex < 0) {
    segmentIndex = categories.length - 1;
  } else if (segmentIndex >= categories.length) {
    segmentIndex = 0;
  }
  const result = categories[segmentIndex];

  drawWheel();

  setTimeout(() => {
    displayMessage(`The decisionator chose: <br>${result}`);
  }, 500);
}

// Start spinning wheel
spinButton.addEventListener("click", () => {
  if (!isSpinning) {
    spinSpeed = Math.random() * 0.3 + 0.3;
    isSpinning = true;
    spinWheel();
  }
});

drawWheel();
