const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const radioBtns = document.getElementsByClassName("radio-btn");
const resetBtn = document.getElementById("reset-btn");
let mode;
let p0;
let p1;

init();

canvas.addEventListener("click", e => {
  const xPos = e.x - context.canvas.offsetLeft;
  const yPos = e.y - context.canvas.offsetTop;

  switch (mode) {
    case "line":
      handleLine(xPos, yPos);
      break;

    case "circle":
      handleCircle(xPos, yPos);
      break;

    case "Special line":
      break;

    default:
      break;
  }
});

function handleLine(xPos, yPos) {
  if (p0.x === -1) {
    p0.x = xPos;
    p0.y = yPos;
  } else if (p1.x === -1) {
    p1.x = xPos;
    p1.y = yPos;
  }
  if (p0.x !== -1 && p1.x !== -1) {
    myLine(p0, p1);
    p0 = { x: -1, y: -1 };
    p1 = { x: -1, y: -1 };
  }
  context.fillRect(xPos, yPos, 2, 2);
}

function handleCircle(xPos, yPos) {
  if (p0.x === -1) {
    p0.x = xPos;
    p0.y = yPos;
  } else if (p1.x === -1) {
    p1.x = xPos;
    p1.y = yPos;
  }
  if (p0.x !== -1 && p1.x !== -1) {
    myCircle(p0, p1);
    p0 = { x: -1, y: -1 };
    p1 = { x: -1, y: -1 };
  }
}

function myLine(p0, p1) {
  let deltaX = Math.abs(p1.x - p0.x);
  let deltaY = Math.abs(p1.y - p0.y);
  let signX = p0.x < p1.x ? 1 : -1;
  let signY = p0.y < p1.y ? 1 : -1;
  let err = deltaX - deltaY;

  while (true) {
    context.fillRect(p0.x, p0.y, 1, 1);
    if (p0.x === p1.x && p0.y === p1.y) break;
    const e2 = 2 * err;
    if (e2 > -deltaY) {
      err -= deltaY;
      p0.x += signX;
    }
    if (e2 < deltaX) {
      err += deltaX;
      p0.y += signY;
    }
  }
}

function myCircle(p0, p1) {
  let radius = distanceBetweenPoints(p0, p1);
  console.log(radius);

  let x0 = p0.x;
  let y0 = p0.y;
  let x = radius;
  let y = 0;
  let radiusErr = 1 - x;

  while (x >= y) {
    drawPixel(x + x0, y + y0);
    drawPixel(y + x0, x + y0);
    drawPixel(-x + x0, y + y0);
    drawPixel(-y + x0, x + y0);
    drawPixel(-x + x0, -y + y0);
    drawPixel(-y + x0, -x + y0);
    drawPixel(x + x0, -y + y0);
    drawPixel(y + x0, -x + y0);
    y++;

    if (radiusErr < 0) {
      radiusErr += 2 * y + 1;
    } else {
      x--;
      radiusErr += 2 * (y - x + 1);
    }
  }
}

function distanceBetweenPoints(p0, p1) {
  const left = (p0.x - p1.x) ** 2;
  const right = (p0.y - p1.y) ** 2;
  return Math.sqrt(left + right);
}

function drawPixel(x, y) {
  context.fillRect(x, y, 1, 1);
}

function changeMode(e) {
  mode = e.target.value;
  p0 = { x: -1, y: -1 };
  p1 = { x: -1, y: -1 };
}

resetBtn.addEventListener("click", e => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  p0 = { x: -1, y: -1 };
  p1 = { x: -1, y: -1 };
});

function init() {
  mode = "line"; // default
  p0 = { x: -1, y: -1 };
  p1 = { x: -1, y: -1 };

  for (let i = 0; i < radioBtns.length; i++) {
    radioBtns[i].addEventListener("click", changeMode);
  }
}
