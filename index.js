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
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = v - c;

    let [r, g, b] =
        h < 60 ? [c, x, 0] :
        h < 120 ? [x, c, 0] :
        h < 180 ? [0, c, x] :
        h < 240 ? [0, x, c] :
        h < 300 ? [x, 0, c] :
        [c, 0, x];

    return "#" + [r, g, b]
        .map(n => Math.round((n + m) * 255).toString(16).padStart(2, "0"))
        .join("");
}

function drawhuestrip() {
    const gradient = huectx.createLinearGradient(0, 0, huecanvas.width, 0);

    for (let h = 0; h <= 360; h += 60) {
        gradient.addColorStop(h / 360, hsv2hex(h, 1, 1));
    }

    huectx.fillStyle = gradient;
    huectx.fillRect(0, 0, huecanvas.width, huecanvas.height);
}

function drawsvsquare() {
    svctx.fillStyle = hsv2hex(currenthue, 1, 1);
    svctx.fillRect(0, 0, svcanvas.width, svcanvas.height);

    const white = svctx.createLinearGradient(0, 0, svcanvas.width, 0);
    white.addColorStop(0, "#fff");
    white.addColorStop(1, "transparent");
    svctx.fillStyle = white;
    svctx.fillRect(0, 0, svcanvas.width, svcanvas.height);

    const black = svctx.createLinearGradient(0, 0, 0, svcanvas.height);
    black.addColorStop(0, "transparent");
    black.addColorStop(1, "#000");
    svctx.fillStyle = black;
    svctx.fillRect(0, 0, svcanvas.width, svcanvas.height);
}

function updatecolor(hex) {
    currentcolor = hex;
    currentcolorbox.style.backgroundColor = hex;
    hexinput.value = hex;
}

function pickfromsv(event) {
    const rect = svcanvas.getBoundingClientRect();

    const x = Math.max(0, Math.min(event.clientX - rect.left, svcanvas.width));
    const y = Math.max(0, Math.min(event.clientY - rect.top, svcanvas.height));

    updatecolor(hsv2hex(
        currenthue,
        x / svcanvas.width,
        1 - y / svcanvas.height
    ));
}

function pickfromhue(event) {
    const rect = huecanvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(event.clientX - rect.left, huecanvas.width));

    currenthue = x / huecanvas.width * 360;
    drawsvsquare();
    updatecolor(hsv2hex(currenthue, 1, 1));
}

svcanvas.addEventListener("mousedown", e => {
    issvdragging = true;
    pickfromsv(e);
});

svcanvas.addEventListener("mousemove", e => {
    if (issvdragging) pickfromsv(e);
});

huecanvas.addEventListener("mousedown", e => {
    ishuedragging = true;
    pickfromhue(e);
});

huecanvas.addEventListener("mousemove", e => {
    if (ishuedragging) pickfromhue(e);
});

document.addEventListener("mouseup", () => {
    issvdragging = false;
    ishuedragging = false;
});

hexinput.addEventListener("input", () => {
    if (/^#[0-9A-Fa-f]{6}$/.test(hexinput.value)) {
        updatecolor(hexinput.value);
    }
});

drawhuestrip();
drawsvsquare();
updatecolor(currentcolor);

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
    const color = currentcolor;
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

let piececounter = 0;

function generateCSS(classname) {
    const shadowparts = [];

    for (let i = 0; i < pixels.length; i++) {
        const color = pixels[i];

        if (color !== null) {
            const x = i % gridsize;
            const y = Math.floor(i / gridsize);
            shadowparts.push(x + "px " + y + "px 0 " + color);
        }
    }

    if (shadowparts.length === 0) {
        return "/* grid is empty, paint something first! */";
    }

    let css = "." + classname + " {\n";
    css += "  width: 1px;\n  height: 1px;\n";
    css += "  transform: scale(16);\n";
    css += "  transform-origin: top left;\n";
    css += "  margin: 40px;\n";
    css += "  image-rendering: pixelated;\n";
    css += "  box-shadow:\n    " + shadowparts.join(",\n    ") + ";\n";
    css += "}";

    return css;
}

document.getElementById("generate").addEventListener("click", function() {
    piececounter = piececounter + 1;
    const classname = "pixel-art-" + piececounter;

    const css = generateCSS(classname);
    outputbox.value = css;

    if (htmlbox.value.length > 0) {
        htmlbox.value = htmlbox.value + "\n" + "<div class=\"" + classname + "\"></div>";
    }
    if (htmlbox.value.length === 0) {
        htmlbox.value = "<div class=\"" + classname + "\"></div>";
    }

    if (testcss.value.length > 0) {
        testcss.value = testcss.value + "\n\n" + css;
    }
    if (testcss.value.length === 0) {
        testcss.value = css;
    }

    renderTestPreview();
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

const htmlbox = document.getElementById("htmlbox");
const testcss = document.getElementById("testcss");
const testframe = document.getElementById("testframe");

function renderTestPreview() {
    const doc = testframe.contentDocument;
    doc.open();
    doc.write("<html><head><style>" + testcss.value + "</style></head><body>" + htmlbox.value + "</body></html>");
    doc.close();
}

htmlbox.addEventListener("input", renderTestPreview);
testcss.addEventListener("input", renderTestPreview);

document.getElementById("cleartest").addEventListener("click", function() {
    htmlbox.value = "";
    testcss.value = "";
    piececounter = 0;
    renderTestPreview();
});