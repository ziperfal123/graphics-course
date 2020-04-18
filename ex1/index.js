// Amit Levy - 311133433
// Yaniv Ziperfal - 203311303

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const actionBtns = document.getElementsByClassName("action-btn");
const lineBtn = document.getElementById("line");
const resetBtn = document.getElementById("reset-btn");
const colorBtn = document.getElementById("color-btn");
const widthToggle = document.getElementById("width-toggle");
const scaleToggle = document.getElementById("scale-toggle");
const widthBtn = document.getElementById("width-btn");
const scaleBtn = document.getElementById("scale-btn");
const inputs = document.getElementsByTagName("input");
let mode;
let color;
let lineWidth;
let scale;
let p0;
let p1;
let p2;
let p3;

function setInitialValues() {
  mode = "line";
  color = "#000000";
  lineWidth = 2;
  scale = 60;
  scaleBtn.value = 60;
  colorBtn.value = "#000000";
  widthBtn.value = 2;
  scaleBtn.classList.add("hide-element");
  widthBtn.classList.add("hide-element");
  lineBtn.classList.add("selected");
}

(function init() {
  setInitialValues();
  resetPoints();
  for (let i = 0; i < actionBtns.length; i++) {
    actionBtns[i].addEventListener("click", changeMode);
  }
})();

canvas.addEventListener("click", e => {
  const xPos = e.x - context.canvas.offsetLeft;
  const yPos = e.y - context.canvas.offsetTop;

  switch (mode) {
    case "line":
      handleLine(xPos, yPos, color);
      break;

    case "circle":
      handleCircle(xPos, yPos, color);
      break;

    case "bezier":
      handleBezier(xPos, yPos);
      break;

    default:
      break;
  }
});

resetBtn.addEventListener("click", e => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  resetSelected();
  setInitialValues();
  resetPoints();
});

colorBtn.addEventListener("change", e => {
  color = e.target.value;
});

widthBtn.addEventListener("change", e => {
  lineWidth = e.target.value;
});

scaleBtn.addEventListener("change", e => {
  scale = e.target.value;
});

function toggleElement(Element) {
  Element.classList.contains("hide-element")
    ? Element.classList.remove("hide-element")
    : Element.classList.add("hide-element");
}

widthToggle.addEventListener("click", e => {
  toggleElement(widthBtn);
});

scaleToggle.addEventListener("click", e => {
  toggleElement(scaleBtn);
});

function selectInput(clickedElement) {
  resetSelected();
  clickedElement.classList.add("selected");
}

function resetSelected() {
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].classList.remove("selected");
  }
}

// This function clear point selection after each drawing or when selecting different drawing mode
function resetPoints() {
  p0 = { x: -1, y: -1 };
  p1 = { x: -1, y: -1 };
  p2 = { x: -1, y: -1 };
  p3 = { x: -1, y: -1 };
}

// This function sets 2 selected points for use in line and circle drawing
function setTwoPoints(xPos, yPos) {
  if (p0.x === -1) {
    p0.x = xPos;
    p0.y = yPos;
  } else if (p1.x === -1) {
    p1.x = xPos;
    p1.y = yPos;
  }
}

// This function sets 4 selected points for use in bezier curve drawing
function setFourPoints(xPos, yPos) {
  if (p0.x === -1) {
    p0.x = xPos;
    p0.y = yPos;
  } else if (p1.x === -1) {
    p1.x = xPos;
    p1.y = yPos;
  } else if (p2.x === -1) {
    p2.x = xPos;
    p2.y = yPos;
  } else if (p3.x === -1) {
    p3.x = xPos;
    p3.y = yPos;
  }
}

// This function draws 1 pixel with color and width (if width is not passed, it uses the global width determined by input)
// height and width of the pixel would always be equal
function drawPixel(x, y, width = lineWidth) {
  context.fillStyle = color;
  context.fillRect(x, y, width, width);
}

// This function changes canvas drawing mode
function changeMode(e) {
  if (e.target.value !== "bezier") scaleBtn.classList.add("hide-element");
  selectInput(e.target);
  mode = e.target.value;
  resetPoints();
}

// This function calculates the distance between the 2 selected points
function getDistanceBetweenPoints(p0, p1) {
  const left = (p0.x - p1.x) ** 2;
  const right = (p0.y - p1.y) ** 2;
  return Math.sqrt(left + right);
}

function handleLine(xPos, yPos) {
  setTwoPoints(xPos, yPos);
  drawPixel(xPos, yPos);

  if (p0.x !== -1 && p1.x !== -1) {
    myLine(p0, p1);
    resetPoints();
  }
}

function handleCircle(xPos, yPos) {
  setTwoPoints(xPos, yPos);
  drawPixel(xPos, yPos);

  if (p0.x !== -1 && p1.x !== -1) {
    myCircle(p0, p1);
    resetPoints();
  }
}

function handleBezier(xPos, yPos) {
  setFourPoints(xPos, yPos);
  drawPixel(xPos, yPos);

  if (p0.x !== -1 && p1.x !== -1 && p2.x !== -1 && p3.x !== -1) {
    let t = 0;
    let pSrc, pDest;

    // get source and destination points depending on t
    while (t < 1) {
      pSrc = myBezier(t, p0, p1, p2, p3);
      t = t + 1 / scale > 1 ? 1 : t + 1 / scale; // if t is larger than one for the destination point than set it to 1
      pDest = myBezier(t, p0, p1, p2, p3);
      myLine(pSrc, pDest); // draw line between source and destination points
    }
    resetPoints();
  }
}

function myLine(p0, p1) {
  //determine deltas
  let deltaX = Math.abs(p1.x - p0.x);
  let deltaY = Math.abs(p1.y - p0.y);

  //determine quarter
  let signX = p0.x < p1.x ? 1 : -1;
  let signY = p0.y < p1.y ? 1 : -1;
  let err = deltaX - deltaY;

  // helper function - calculate next pixel by error
  function _calculateNext() {
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

  // draw pixels from source point for as long as you didn't reach destination point
  if (deltaX > deltaY) {
    while (Math.floor(p0.x) !== Math.floor(p1.x)) {
      drawPixel(p0.x, p0.y);
      _calculateNext();
    }
  } else {
    while (Math.floor(p0.y) !== Math.floor(p1.y)) {
      drawPixel(p0.x, p0.y);
      _calculateNext();
    }
  }
}

function myCircle(p0, p1) {
  // get circle radius by calculating the distance between the 2 selected points
  let radius = getDistanceBetweenPoints(p0, p1);

  let x0 = p0.x;
  let y0 = p0.y;
  let x = radius;
  let y = 0;
  let radiusErr = 1 - x;

  while (x >= y) {
    // draw pixel from both sides in each quoter of the circle for as lone as y didn't reach x
    drawPixel(x + x0, y + y0);
    drawPixel(y + x0, x + y0);
    drawPixel(-x + x0, y + y0);
    drawPixel(-y + x0, x + y0);
    drawPixel(-x + x0, -y + y0);
    drawPixel(-y + x0, -x + y0);
    drawPixel(x + x0, -y + y0);
    drawPixel(y + x0, -x + y0);
    y++;

    // handle error
    if (radiusErr < 0) {
      radiusErr += 2 * y + 1;
    } else {
      x--;
      radiusErr += 2 * (y - x + 1);
    }
  }
}

function myBezier(t, p0, p1, p2, p3) {
  // calculate parameters
  const cX = 3 * (p1.x - p0.x),
    bX = 3 * (p2.x - p1.x) - cX,
    aX = p3.x - p0.x - cX - bX;

  const cY = 3 * (p1.y - p0.y),
    bY = 3 * (p2.y - p1.y) - cY,
    aY = p3.y - p0.y - cY - bY;

  // calculate x(t) and y(t)
  const x = aX * Math.pow(t, 3) + bX * Math.pow(t, 2) + cX * t + p0.x;
  const y = aY * Math.pow(t, 3) + bY * Math.pow(t, 2) + cY * t + p0.y;

  return { x, y };
}
