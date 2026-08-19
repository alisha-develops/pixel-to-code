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