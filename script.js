let canvas = document.getElementById("canvas");
let brush = document.getElementById("brush");

let tools = document.querySelectorAll(".tools");
let clear = document.getElementById("clear");
let save = document.getElementById("save");
let ctx = canvas.getContext("2d", { willReadFrequently: false });
let isDraw = false;
let preX, preY;
let sizeSlider = document.getElementById("mySize");
let fillCheck = document.getElementById("fillColor");
let colors = document.querySelectorAll(".color-circle");
let colorPicker = document.getElementById('color-picker')
// console.log(colors);

let isfillColor;

let selectedTool,
  selectedColor,
  brushSize = sizeSlider.value;

var window_width = window.innerWidth;
var window_height = window.innerHeight;

canvas.width = window_width;
canvas.height = window_height;
window.onresize = () => {
  var window_width = window.innerWidth;
  var window_height = window.innerHeight;

  canvas.width = window_width;
  canvas.height = window_height;
};

const drawRect = (e) => {
  // ctx.clearRect(0, 0, canvas.width, canvas.height);
  // ctx.clearRect(preX, preY, e.x - preX, e.y - preY);

  // ctx.strokeStyle = "black";
  // ctx.fillStyle = 'transparent';
  //draw
  if (isfillColor) {
    return ctx.fillRect(
      e.offsetX,
      e.offsetY,
      preX - e.offsetX,
      preY - e.offsetY
    );
  }
  ctx.strokeRect(e.offsetX, e.offsetY, preX - e.offsetX, preY - e.offsetY);
};

const drawCicle = (e) => {
  ctx.beginPath();
  // ctx.clearRect(0, 0, canvas.width, canvas.height);
  let radius = Math.sqrt(
    Math.pow(preX - e.offsetX, 2) + Math.pow(preY - e.offsetY, 2)
  );
  // ctx.clearRect(preX, preY, e.x - preX, e.y - preY);

  // ctx.strokeStyle = "black";
  // ctx.fillStyle = 'transparent';
  //draw

  ctx.arc(preX, preY, radius, 0, 2 * Math.PI);
  isfillColor ? ctx.fill() : ctx.stroke();
};

const drawTriangle = (e) => {
  ctx.beginPath(); // creating new path to draw circle
  ctx.moveTo(preX, preY); // moving triangle to the mouse pointer
  ctx.lineTo(e.offsetX, e.offsetY); // creating first line according to the mouse pointer
  ctx.lineTo(preX * 2 - e.offsetX, e.offsetY); // creating bottom line of triangle
  ctx.closePath(); // closing path of a triangle so the third line draw automatically
  // fillColor.checked ? ctx.fill() : ctx.stroke(); // if fillColor is checked fill triangle else draw border
  isfillColor ? ctx.fill() : ctx.stroke();
};

const drawing = (e) => {
  if (!isDraw) {
    return;
  }
  ctx.putImageData(snapshot, 0, 0);
  if (selectedTool === "brush" || selectedTool === "eraser") {
    ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
    ctx.lineTo(e.offsetX, e.offsetY);

    ctx.stroke();
  } else if (selectedTool === "rectangle") {
    drawRect(e);
  } else if (selectedTool === "circle") {
    drawCicle(e);
  } else if (selectedTool === "triangle") {
    drawTriangle(e);
  } else {
    console.log("Nothing");
  }
};

// console.log(tools);

const startDrawing = (e) => {
  isDraw = true;
  preX = e.offsetX;
  preY = e.offsetY;
  ctx.beginPath();

  ctx.lineWidth = brushSize;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.lineColor = selectedColor;
  ctx.fillStyle = selectedColor;
  ctx.strokeStyle = selectedColor;
  ctx.moveTo(e.offsetX, e.offsetY);
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
};

tools?.forEach((btn) => {
  // selectedTool = btn.id;
  //   console.log("tools",tools,"btn",btn);

  btn.addEventListener("click", () => {
    selectedTool = btn.id;
    document.querySelector(".selected")?.classList.remove("selected");
    btn.classList.add("selected");
    console.log(btn.id);
  });
});

clear.addEventListener("click", (e) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

save.addEventListener("click", () => {
  const link = document.createElement("a"); // creating <a> element
  link.download = `${Date.now()}.png`; // passing current date as link download value
  link.href = canvas.toDataURL(); // passing canvasData as link href value
  link.click();
});

sizeSlider.addEventListener("change", () => {
  brushSize = sizeSlider.value;
  console.log(brushSize);
});

fillCheck.addEventListener("change", () => {
  isfillColor = fillCheck.checked;
  console.log(isfillColor);
});

colors?.forEach((color) => {
  color.addEventListener("click", () => {
    document.querySelector(".color-selected")?.classList.remove("color-selected");
    color.classList.add("color-selected");
    if (color.id === 'multiColor'){
      colorPicker.addEventListener("change",(e) => {
        // Get the selected color value
        selectedColor = e.target.value;
        
        colorPicker.parentElement.style.background = selectedColor;
        
      });
      
    }else{
      selectedColor = color.id;
    }

    // selectedColor = window.getComputedStyle(color).getPropertyValue("background-color");
  });
});

canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => {
  isDraw = false;
});
