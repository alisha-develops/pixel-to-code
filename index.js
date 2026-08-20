const svcanvas = document.getElementById("svcanvas");
const svctx = svcanvas.getContext("2d");
const huecanvas = document.getElementById("huecanvas");
const huectx = huecanvas.getContext("2d");
const currentcolorbox = document.getElementById("currentcolor");
const hexinput = document.getElementById("hexinput");

let currenthue = 320;
let currentcolor = "#fca1f9";
let issvdragging = false;
let ishuedragging = false;

function hsv2hex(h, s, v) {
    const c = v * s;
    const x = c * (1 - Math.abs((h/60) % 2 - 1));
    const m = v - c;

    let [r, g, b] =
    h < 60 ? [c, x, 0] :
    h < 120 ? [x, c, 0] :
        h < 180 ? [0, c, x] :
        h < 240 ? [0, x, c] :
        h < 300 ? [x, 0, c] :
        [c, 0, x];

    return '#' + [r, g, b]
        .map(n => Math.round((n + m) * 255).toString(16).padStart(2, "0"))
        .join("");map
}

function drawhuestrip() {
    const gradient = huectx.createLinearGradient(0, 0, huecanvas.clientWidth, 0);

    for (let h = 0; h <= 360; h +=60) {
        gradient.addColorStop(h / 360, hsv2hex(h, 1, 1));
    }

    huectx.fillStyle = gradient;
    huectx.fillRect(0, 0, huecanvas.clientWidth, huecanvas.height);
}

function drawsvsquare() {
    svctx.fillStyle = hsv2hex(currenthue,1, 1);
    svctx.fillRect(0, 0,  svcanvas.clientWidth, svcanvas.height);

    const white = svctx.createLinearGradient(0,0, svcanvas.clientWidth, 0);
    white.addColorStop(0, "#fff");
    white.addColorStop(1, "transparent");
    svctx.fillStyle = white;
    svctx.fillRect(0,0, svcanvas.clientWidth, svcanvas.height);

    const black = svctx.createLinearGradient(0,0, 0, svcanvas.height);
    black.addColorStop(0, "transparent");
    black.addColorStop(1, "#000");
    svctx.fillStyle = black;
    svctx.fillRect(0,0, svcanvas.clientWidth, svcanvas.height);
}


drawhuestrip();
drawsvsquare();

let gridsize = 16;
let pixels = [];
const gridelement = document.getElementById("grid");
const selectsize = document.getElementById("selectsize");
const colorpicker = document.getElementById("colorpicker");
const outputbox = document.getElementById("output");
const copystatus = document.getElementById("copyStatus");
let ismousedown = false;

function buildGrid(size) {
    gridsize = size;
    pixels = new Array(gridsize * gridsize).fill(null);

    gridelement.innerHTML = "";
    gridelement.style.gridTemplateColumns = "repeat(" + gridsize + ", 1fr)";
    gridelement.style.gridTemplateRows = "repeat(" + gridsize + ", 1fr)";
    gridelement.style.backgroundSize = "calc(100% / " + gridsize + ") calc(100% / " + gridsize + ")";

    for (let i = 0; i < gridsize * gridsize; i++) {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.dataset.index = i;
        gridelement.appendChild(cell);
    }
}

function paintCell(index) {
    const color = colorpicker.value;
    pixels[index] = color;

    const cells = gridelement.children;
    cells[index].style.background = color;
}

function handlePaint(event) {
    if(event.target.classList.contains("cell")){
        const index = parseInt(event.target.dataset.index, 10);
        paintCell(index);
    }
}

gridelement.addEventListener("mousedown", function(event){
    ismousedown = true;
    handlePaint(event);
});

gridelement.addEventListener("mouseover", function(event){
    if(ismousedown) {
        handlePaint(event);
    }
});

document.addEventListener("mouseup", function() {
    ismousedown = false;
});

document.getElementById("clear").addEventListener("click", function(){
    pixels = new Array(gridsize * gridsize).fill(null);
    const cells = gridelement.children;

    for (let i= 0; i < cells.length; i++){
        cells[i].style.background = "";
    }

    outputbox.value = "";
    copystatus.textContent ="";
});

function generateCSS(){
    const shadowparts = [];

    for (let i = 0; i < pixels.length; i++){
        const color = pixels[i];

        if(color !== null){
            const x = i % gridsize;
            const y = Math.floor(i / gridsize);
            shadowparts.push(x+ "px" + y + "px 0" + color);
        }
    }
    if (shadowparts.length === 0){
        return "/* grid is empty, paint something first! */"
    }
    let css = ".pixel-art {\n";
    css += "  width: 1px;\n  height: 1px;\n";
    css += "  box-shadow:\n    " + shadowparts.join(",\n    ") + ";\n";
    css += "}";

    return css;
}

document.getElementById("generate").addEventListener("click", function(){
    outputbox.value = generateCSS();
    copystatus.textContent = "";
});

document.getElementById("copycss").addEventListener("click", function() {
    if (outputbox.value === "") {
        copystatus.textContent = "nothing to copy yet";
        return;
    }

    navigator.clipboard.writeText(outputbox.value).then(function() {
        copystatus.textContent = "copied!";
    }).catch(function() {
        copystatus.textContent = "copy failed";
    });
});

selectsize.addEventListener("change", function() {
    const newsize = parseInt(selectsize.value, 10);
    buildGrid(newsize);
});

buildGrid(gridsize);