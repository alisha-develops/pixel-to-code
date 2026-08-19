let gridsize = 16;
let pixels = [];
const gridelement = document.getElementById("grid");
const selectsize = document.getElementById("selectsize");

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

selectsize.addEventListener("change", function() {
    const newsize = parseInt(selectsize.value, 10);
    buildGrid(newsize);
});

buildGrid(gridsize);