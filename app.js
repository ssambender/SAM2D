let currentFrame = 1;
let totalFrames = 2;
let frames = document.querySelectorAll('.frame');
let framesArray = ['framesArray'];
let frameSpeed = 100; //in ms

let totalSwatches = 11;
let currentColorHex = '#666666';
let canvasBgColor = '#E5E5E5';
let swatchesArrays = ['#FFFFFF','#000000',
    '#7A582B','#3B740D', '#F5D417','#F8921B','#DA2016','#4CA12C','#62D2EB','#2362CB','#420F81'];

let brushSize = 5;

let canvasDistanceLeft;
let canvasDistanceTop;

let onionSkinOpacity = 20;
document.getElementById('onionSkin1').style.opacity = onionSkinOpacity + '%';
let accentColor = '#3bc4ff';
document.documentElement.style.setProperty('--accentColor', accentColor);

let animIsPlaying = false;
let animTimeout; 

const objDiv = document.getElementById("consoleOutLog");
function logInfo(message) {
    document.getElementById('consoleOutLog').innerText += message.toString() + '\n';
    objDiv.scrollTop = objDiv.scrollHeight;
}


// --- UNDO / REDO HISTORY SYSTEM ---
const MAX_HISTORY = 30;
let historyStack = [];
let historyIndex = -1;

function saveState() {
    if (historyIndex < historyStack.length - 1) {
        historyStack = historyStack.slice(0, historyIndex + 1);
    }
    
    historyStack.push({
        framesArray: [...framesArray],
        currentFrame: currentFrame,
        totalFrames: totalFrames
    });
    
    if (historyStack.length > MAX_HISTORY) {
        historyStack.shift();
    } else {
        historyIndex++;
    }
}

function restoreState(state) {
    framesArray = [...state.framesArray];
    currentFrame = state.currentFrame;
    totalFrames = state.totalFrames;

    const framesContainer = document.getElementById('framesContainer');
    const addBtn = document.getElementById('addFrame');
    document.querySelectorAll('.frame').forEach(f => f.remove());

    for (let i = 1; i <= totalFrames; i++) {
        let div = document.createElement('div');
        div.className = 'frame';
        div.id = "frame" + i;
        div.innerText = i;

        let divIMG = document.createElement('img');
        divIMG.id = "canvasimg" + i;
        divIMG.setAttribute('width','100%');
        divIMG.setAttribute('height','100%');
        divIMG.className = 'posAbs';
        if (framesArray[i]) {
            divIMG.src = framesArray[i];
            divIMG.style.display = "inline";
        }

        div.append(divIMG);
        div.onclick = alertFrame;
        setupDragAndDrop(div);
        framesContainer.insertBefore(div, addBtn);
    }

    document.getElementById('frameNumberText').innerText = currentFrame.toString();
    frameSwitchUpdate(); 
}

function undo() {
    if (historyIndex > 0) {
        historyIndex--;
        restoreState(historyStack[historyIndex]);
        logInfo('Undo applied.');
    }
}

function redo() {
    if (historyIndex < historyStack.length - 1) {
        historyIndex++;
        restoreState(historyStack[historyIndex]);
        logInfo('Redo applied.');
    }
}
// ----------------------------------

// SETS PROJECT NAME AND DIMENSIONS
let projectName = "Untitled Project";
let projectDimensionX = 1400;
let projectDimensionY = 700;

function askForProjectInfo(){
    projectName = prompt("Enter project name:", "");
    if(projectName === '') projectName = "Untitled Project";
    projectDimensionX = parseInt(prompt("Enter project width in px:", ""));
    projectDimensionY = parseInt(prompt("Enter project height in px:", ""));
}

if(isNaN(projectDimensionX) === true) projectDimensionX = 1400;
if(isNaN(projectDimensionY) === true) projectDimensionY = 700;

document.getElementById('projectName').innerText = projectName;
document.getElementById('projectDimensions').innerText = projectDimensionX.toString() + 'x' + projectDimensionY.toString();

document.getElementById('drawingCanvas1').setAttribute('width',projectDimensionX);
document.getElementById('drawingCanvas1').setAttribute('height',projectDimensionY);
document.getElementById('canvas').style.width = projectDimensionX + 'px';
document.getElementById('canvas').style.height = projectDimensionY + 'px';
document.getElementById('onionSkin1').setAttribute('width',projectDimensionX);
document.getElementById('onionSkin1').setAttribute('height',projectDimensionY);

logInfo('new project created');
logInfo('"' + projectName + '"');
logInfo(projectDimensionX + 'x' + projectDimensionY);

const rgb2hex = (rgb) => `#${rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/).slice(1).map(n => parseInt(n, 10).toString(16).padStart(2, '0')).join('')}`

function wc_hex_is_light(color) {
    const hex = color.replace('#', '');
    const c_r = parseInt(hex.substring(0, 0 + 2), 16);
    const c_g = parseInt(hex.substring(2, 2 + 2), 16);
    const c_b = parseInt(hex.substring(4, 4 + 2), 16);
    const brightness = ((c_r * 299) + (c_g * 587) + (c_b * 114)) / 1000;
    return brightness > 155;
}

// Color Picker
function update(picker, selector) {
    document.querySelector(selector).style.background = picker.toBackground();
    currentColorHex = picker;
    document.documentElement.style.setProperty('--currentColor', currentColorHex);

    if(wc_hex_is_light(currentColorHex.toString())===true){
        document.getElementById('changeColorTextOverlay').style.color = '#000000';
    }
    else {
        document.getElementById('changeColorTextOverlay').style.color = '#ffffff';
    }
    logInfo('current color: ' + currentColorHex);
}

// Add Swatch
let swatchAdd = document.getElementById('addColorSwatch');
swatchAdd.onclick = function() {
    let ok = true;

    if(ok === true && swatchesArrays.includes(currentColorHex.toString().toUpperCase()) === false) {
        swatchesArrays.push(currentColorHex.toString());
        totalSwatches++;

        let swatchDiv = document.createElement('div');
        let parentDiv = swatchAdd.parentNode;

        swatchDiv.className = 'swatch';
        swatchDiv.id = "swatch" + totalSwatches.toString();
        swatchDiv.style.backgroundColor = currentColorHex;

        swatchDiv.onclick = function () {
            currentColorHex = rgb2hex(this.style.backgroundColor);
            document.getElementById('colorSelectionButton').style.background = currentColorHex;
            document.documentElement.style.setProperty('--currentColor', currentColorHex);
            document.getElementById('colorSectionID').setAttribute('data-current-color','#00ff00');
            logInfo('current color: ' + currentColorHex);
        }
        parentDiv.append(swatchDiv);
    }
}

function starterSwatchClicked(whichStarterSwatch) {
    let thisSwatchNum = 'swatch' + whichStarterSwatch.toString();
    let thisSwatch = document.getElementById(thisSwatchNum);
    currentColorHex = rgb2hex(thisSwatch.style.backgroundColor);
    document.documentElement.style.setProperty('--currentColor', currentColorHex);
    document.getElementById('colorSelectionButton').style.background = currentColorHex;
    document.getElementById('colorSectionID').setAttribute('data-current-color','#00ff00');

    if(wc_hex_is_light(currentColorHex.toString())===true){
        document.getElementById('changeColorTextOverlay').style.color = '#000000';
    } else {
        document.getElementById('changeColorTextOverlay').style.color = '#ffffff';
    }
    logInfo('current color: ' + currentColorHex);
}


// --- DRAG AND DROP FUNCTIONALITY ---
function setupDragAndDrop(frame) {
    frame.setAttribute('draggable', 'true');

    frame.addEventListener('dragstart', (e) => {
        frame.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', frame.id);
    });

    frame.addEventListener('dragend', () => {
        frame.classList.remove('dragging');
        reindexFrames();
    });
}

const framesContainer = document.getElementById('framesContainer');

framesContainer.addEventListener('dragover', e => {
    e.preventDefault();
    const afterElement = getDragAfterElement(framesContainer, e.clientX);
    const draggable = document.querySelector('.dragging');
    
    if (draggable) {
        if (afterElement == null) {
            framesContainer.insertBefore(draggable, document.getElementById('addFrame'));
        } else {
            framesContainer.insertBefore(draggable, afterElement);
        }
    }
});

function getDragAfterElement(container, x) {
    const draggableElements = [...container.querySelectorAll('.frame:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = x - box.left - box.width / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function reindexFrames() {
    let remainingFrames = document.querySelectorAll('.frame');
    let newFramesArray = ['framesArray']; 
    let newCurrentFrame = currentFrame;

    remainingFrames.forEach((frame, index) => {
        let newIndex = index + 1;
        let img = frame.querySelector('img');
        
        let oldIndex = parseInt(frame.id.replace('frame', ''));
        newFramesArray[newIndex] = framesArray[oldIndex];

        frame.id = "frame" + newIndex;
        frame.childNodes[0].nodeValue = newIndex; 
        img.id = "canvasimg" + newIndex;

        if (frame.classList.contains('frameActive')) {
            newCurrentFrame = newIndex;
        }
    });

    framesArray = newFramesArray;
    currentFrame = newCurrentFrame;
    document.getElementById('frameNumberText').innerText = currentFrame.toString();
    logInfo('Frames reordered');
    load(); 

    // TRIGGER UNDO HISTORY PUSH
    saveState(); 
}

// Add new frame div when addFrame clicked
let divAddFrame = document.getElementById('addFrame');
divAddFrame.onclick = addFrameFunc;

function addFrameFunc() {
    totalFrames++;

    let div = document.createElement('div');
    let parentDiv = divAddFrame.parentNode;
    div.className = 'frame';
    div.id = "frame" + totalFrames.toString();
    div.innerText = totalFrames.toString();

    let divIMG = document.createElement('img');
    divIMG.id = "canvasimg" + totalFrames.toString();
    divIMG.setAttribute('width','100%');
    divIMG.setAttribute('height','100%');
    divIMG.className = 'posAbs';
    div.append(divIMG);

    div.onclick = function () {
        document.getElementById('frameNumberText').innerText = this.innerText;
        pauseAnimation(); 
        frameSwitchUpdate();
    }

    parentDiv.insertBefore(div, divAddFrame);
    setupDragAndDrop(div);

    currentFrame = totalFrames;
    for(let i = 0; i < totalFrames; i++){
        document.getElementById('frame'+(i+1)).classList.remove('frameActive');
    }
    document.getElementById('frame'+currentFrame.toString()).classList.add('frameActive');
    document.getElementById('frameNumberText').innerText = currentFrame.toString();
    load();

    // TRIGGER UNDO HISTORY PUSH
    saveState(); 
}

function deleteCurrentFrame() {
    if (totalFrames <= 1) {
        alert("You must have at least one frame!");
        return;
    }

    framesArray.splice(currentFrame, 1);
    document.getElementById('frame' + currentFrame).remove();
    totalFrames--;

    reindexFrames(); // Note: Reindex already calls saveState() now

    if (currentFrame > totalFrames) {
        currentFrame = totalFrames;
    }
    
    frameSwitchUpdate();
    logInfo('Deleted frame.');
}

for (let frame of frames) {
    frame.onclick = alertFrame;
    setupDragAndDrop(frame); 
}

function alertFrame() { 
    document.getElementById('frameNumberText').innerText = this.childNodes[0].nodeValue;
    pauseAnimation(); 
    frameSwitchUpdate()
}

function frameSwitchUpdate() {
    currentFrame = parseInt(document.getElementById('frameNumberText').innerText);

    for(let i = 0; i < totalFrames; i++){
        let targetFrame = document.getElementById('frame'+(i+1));
        if (targetFrame) targetFrame.classList.remove('frameActive');
    }
    
    let currentDOMFrame = document.getElementById('frame'+currentFrame.toString());
    if (currentDOMFrame) currentDOMFrame.classList.add('frameActive');
    
    load();
}

// Canvas drawing! -----------------------------------------
let canvas1 = document.getElementById('drawingCanvas1');
let ctx = canvas1.getContext('2d');
let onionSkin1 = document.getElementById('onionSkin1');
let ctxOnion1 = onionSkin1.getContext('2d');

let elem = document.getElementById('canvas');
let rect = elem.getBoundingClientRect();
canvasDistanceLeft = rect.left.toFixed();
canvasDistanceTop = rect.top.toFixed();

let pos = { x: 0, y: 0 };
document.getElementById('drawingCanvas1').addEventListener('mousemove', draw);
document.getElementById('drawingCanvas1').addEventListener('mousedown', setPosition);
document.getElementById('drawingCanvas1').addEventListener('mouseenter', setPosition);
document.getElementById('drawingCanvas1').addEventListener('mouseup', save);

function setPosition(e) {
    pos.x = e.clientX - canvasDistanceLeft;
    pos.y = e.clientY - canvasDistanceTop;
    document.getElementById('tempCursorLoc').innerText = pos.x.toString() + ', ' + pos.y.toString();
}

function draw(e) {
    if (e.buttons !== 1) return;
    ctx.beginPath(); 
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = currentColorHex;
    ctx.moveTo(pos.x, pos.y); 
    setPosition(e);
    ctx.lineTo(pos.x, pos.y); 
    ctx.stroke(); 
}

let w = canvas1.width;
let h = canvas1.height;
let wOnion1 = canvas1.width;
let hOnion1 = canvas1.height;

function save() {
    let tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas1.width;
    tempCanvas.height = canvas1.height;
    let tempCtx = tempCanvas.getContext('2d');

    tempCtx.fillStyle = canvasBgColor || '#E5E5E5'; 
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    tempCtx.drawImage(canvas1, 0, 0);

    let dataURL = tempCanvas.toDataURL('image/png');
    
    let activeCanvasPreview = document.getElementById("canvasimg"+currentFrame);
    if(activeCanvasPreview) {
        activeCanvasPreview.src = dataURL;
        activeCanvasPreview.style.display = "inline";
    }
    
    framesArray[currentFrame] = dataURL;

    // TRIGGER UNDO HISTORY PUSH AFTER A DRAW ACTION
    saveState();
}

function drawDataURIOnCanvas(strDataURI, canvas, shouldClearCtx = false) {
    if (!strDataURI) return;
    let img = new window.Image();
    let context = canvas.getContext("2d");
    img.addEventListener("load", function () {
        if (shouldClearCtx) {
            context.clearRect(0, 0, canvas.width, canvas.height);
        }
        context.drawImage(img, 0, 0);
    });
    img.setAttribute("src", strDataURI);
}

function load() {
    ctxOnion1.clearRect(0, 0, wOnion1, hOnion1);
    if(currentFrame > 1 && framesArray[currentFrame-1] !== undefined) {
        drawDataURIOnCanvas(framesArray[currentFrame-1], onionSkin1, true);
    }

    if(framesArray[currentFrame] === undefined) {
        ctx.clearRect(0, 0, w, h);
    } else {
        drawDataURIOnCanvas(framesArray[currentFrame], canvas1, true);
        
        let activeCanvasPreview = document.getElementById("canvasimg"+currentFrame);
        if(activeCanvasPreview) {
            activeCanvasPreview.src = framesArray[currentFrame];
            activeCanvasPreview.style.display = "inline";
        }
    }
    logInfo('loading frame ' + currentFrame + '...');
}

function moveToFrameLeft() {
    currentFrame = currentFrame > 1 ? currentFrame - 1 : totalFrames;
    frameSwitchUpdate();
}

function moveToFrameRight() {
    currentFrame = currentFrame < totalFrames ? currentFrame + 1 : 1;
    frameSwitchUpdate();
}


// --- KEYBOARD SHORTCUTS ---
document.addEventListener("keydown", (e) => {
    // Canvas navigation
    if (e.key === "ArrowLeft") moveToFrameLeft();
    else if (e.key === "ArrowRight") moveToFrameRight();

    // Undo: Ctrl/Cmd + Z
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault(); 
        if (e.shiftKey) { redo(); } // Ctrl+Shift+Z for redo
        else { undo(); }
    }

    // Redo: Ctrl/Cmd + Y
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
    }
});

document.onkeypress = function(evt) {
    evt = evt || window.event;
    let charCode = evt.which || evt.keyCode;
    let charStr = String.fromCharCode(charCode);
    if (charStr === "=") addFrameFunc();
};

document.getElementById('onionOpacity1').oninput = function (){
    onionSkinOpacity = this.value;
    document.getElementById('onionSkin1').style.opacity = onionSkinOpacity + '%';
    logInfo('onion skin opacity: ' + this.value + '%');
}

document.getElementById('accentColorInput').oninput = function () {
    accentColor = this.value;
    document.documentElement.style.setProperty('--accentColor', accentColor);
    logInfo('accent color: ' + this.value);
}

document.getElementById('bgColorInput').oninput = function () {
    document.documentElement.style.setProperty('--viewportBgColor', this.value);
    logInfo('viewport bg color: ' + this.value);
}

document.getElementById('brushSizeSlider').oninput = function (){
    brushSize = this.value;
    document.getElementById('brushSizeNumber').value = this.value;
}
document.getElementById('brushSizeNumber').oninput = function (){
    brushSize = this.value;
    document.getElementById('brushSizeSlider').value = this.value;
}


function closeAllDropdowns() {
    document.querySelectorAll('.filebarOpen').forEach(menu => menu.style.visibility = 'hidden');
}

document.body.addEventListener("click", function(e) {
    if (!e.target.closest('.filebarButton') && !e.target.closest('.filebarOpen')) {
        closeAllDropdowns();
    }
});

function toggleDropdown(menuId, event) {
    event.stopPropagation(); 
    const menu = document.getElementById(menuId);
    const isVisible = menu.style.visibility === 'visible';
    
    closeAllDropdowns(); 
    
    if (!isVisible) {
        menu.style.visibility = 'visible'; 
    }
}

function newFile() {
    if (confirm("Start a new file?\nAll current work will be lost!")){
        window.onbeforeunload = null;
        location.reload();
    }
}

let tempBrushColor = currentColorHex;
function chooseBrush() { currentColorHex = tempBrushColor; }
function chooseEraser() { tempBrushColor = currentColorHex; currentColorHex = '#E5E5E5'; }

function goToStart() { currentFrame = 1; frameSwitchUpdate(); }
function goToLast() { currentFrame = totalFrames; frameSwitchUpdate(); }

function setFrameSpeed() {
    let inputtedSpeed = prompt("Enter frame speed (in ms)", frameSpeed.toString());
    if (inputtedSpeed != null && parseInt(inputtedSpeed) > 0) {
        frameSpeed = inputtedSpeed;
    }
}

function renameProj() {
    projectName = prompt("Enter project name:", "");
    if(projectName === '') projectName = "Untitled Project";
    document.getElementById('projectName').innerText = projectName;
}

function duplicateFrame() {
    framesArray.splice(currentFrame + 1, 0, framesArray[currentFrame]);
    
    addFrameFunc();
    reindexFrames();
    load();
}


function togglePlayPause() {
    if (animIsPlaying) { pauseAnimation(); } else { playAnimation(); }
}

function playAnimation() {
    if (animIsPlaying) return; 
    
    animIsPlaying = true;
    document.getElementById('playPauseNav').innerHTML = '⏸️ Pause Animation';
    closeAllDropdowns();

    function animateAnimation() {
        if (!animIsPlaying) return; 
        
        currentFrame++;
        if (currentFrame > totalFrames) currentFrame = 1;
        load();
        document.getElementById('frameNumberText').innerText = currentFrame.toString();

        for(let i = 0; i < totalFrames; i++){
            let f = document.getElementById('frame'+(i+1));
            if(f) f.classList.remove('frameActive');
        }
        
        let cf = document.getElementById('frame'+currentFrame.toString());
        if(cf) cf.classList.add('frameActive');

        animTimeout = setTimeout(animateAnimation, frameSpeed);
    }
    animateAnimation();
}

function pauseAnimation() { 
    animIsPlaying = false; 
    clearTimeout(animTimeout); 
    const btn = document.getElementById('playPauseNav');
    if (btn) btn.innerHTML = '▶️ Play Animation';
}

document.getElementById('input-file').addEventListener('change', getFile)
function getFile(event) {
    const input = event.target
    if ('files' in input && input.files.length > 0) {
        placeFileContent(document.getElementById('content-target'), input.files[0]);
    }
}
function placeFileContent(target, file) {
    readFileContent(file).then(content => {
        target.value = content;
        loadContent();
    }).catch(error => console.log(error))
}
function readFileContent(file) {
    const reader = new FileReader()
    return new Promise((resolve, reject) => {
        reader.onload = event => resolve(event.target.result)
        reader.onerror = error => reject(error)
        reader.readAsText(file)
    })
}

let loadedText;
function loadContent() {
    logInfo('loading project');
    loadedText = document.getElementById('content-target').value;
    let parsedArray = loadedText.split(',data');

    framesArray = [];
    for(let i = 1; i < parsedArray.length; i++){
        framesArray[i] = "data" + parsedArray[i];
    }

    const framesContainer = document.getElementById('framesContainer');
    const addBtn = document.getElementById('addFrame');
    document.querySelectorAll('.frame').forEach(f => f.remove());
    
    totalFrames = 0;

    for (let i = 1; i < framesArray.length; i++) {
        totalFrames++;
        let div = document.createElement('div');
        div.className = 'frame';
        div.id = "frame" + totalFrames.toString();
        div.innerText = totalFrames.toString();

        let divIMG = document.createElement('img');
        divIMG.id = "canvasimg" + totalFrames.toString();
        divIMG.setAttribute('width','100%');
        divIMG.setAttribute('height','100%');
        divIMG.className = 'posAbs';
        if (framesArray[i]) divIMG.src = framesArray[i];

        div.append(divIMG);
        div.onclick = alertFrame; 
        setupDragAndDrop(div); 
        framesContainer.insertBefore(div, addBtn);
    }

    currentFrame = 1;
    frameSwitchUpdate();
    logInfo('project loaded!');
    saveState();
}

function DownloadCanvasAsImage(){
    let downloadLink = document.createElement('a');
    downloadLink.setAttribute('download', 'CanvasAsImage.png');
    let dataURL = canvas1.toDataURL('image/png');
    let url = dataURL.replace(/^data:image\/png/,'data:application/octet-stream');
    downloadLink.setAttribute('href', url);
    downloadLink.click();
}

window.onbeforeunload = function() { return true; };

const downloadFile = () => {
    logInfo('saving project file');
    const link = document.createElement("a");
    const content = framesArray.toString();
    const file = new Blob([content], {type: 'text/plain'});
    link.href = URL.createObjectURL(file);
    link.download = projectName.replace(/\s/g, '').toLowerCase() + ".sam2d"; 
    link.click();
    URL.revokeObjectURL(link.href);
}

function encodeAsGif() {
    logInfo('starting render');
    for (let i = 1; i < totalFrames + 1; i++){
        if(framesArray[i] === undefined){
            framesArray[i] = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABXgAAAK8CAYAAABV1dcbAAAAAXNSR0IArs4c6QAAIABJREFUeF7t2EENAAAMArHh3/R0XNIpIGUvdo4AAQIECBAgQIAAAQIECBAgQIAAAQIEkgJLphaaAAECBAgQIECAAAECBAgQIECAAAECBM7A6wkIECBAgAABAgQIECBAgAABAgQIECAQFTDwRosTmwABAgQIECBAgAABAgQIECBAgAABAgZeP0CAAAECBAgQIECAAAECBAgQIECAAIGogIE3WpzYBAgQIECAAAECBAgQIECAAAECBAgQMPD6AQIECBAgQIAAAQIECBAgQIAAAQIECEQFDLzR4sQmQIAAAQIECBAgQIAAAQIECBAgQICAgdcPECBAgAABAgQIECBAgAABAgQIECBAICpg4I0WJzYBAgQIECBAgAABAgQIECBAgAABAgQMvH6AAAECBAgQIECAAAECBAgQIECAAAECUQEDb7Q4sQkQIECAAAECBAgQIECAAAECBAgQIGDg9QMECBAgQIAAAQIECBAgQIAAAQIECBCIChh4o8WJTYAAAQIECBAgQIAAAQIECBAgQIAAAQOvHyBAgAABAgQIECBAgAABAgQIECBAgEBUwMAbLU5sAgQIECBAgAABAgQIECBAgAABAgQIGHj9AAECBAgQIECAAAECBAgQIECAAAECBKICBt5ocWITIECAAAECBAgQIECAAAECBAgQIEDAwOsHCBAgQIAAAQIECBAgQIAAAQIECBAgEBUw8EaLE5sAAQIECBAgQIAAAQIECBAgQIAAAQIGXj9AgAABAgQIECBAgAABAgQIECBAgACBqICBN1qc2AQIECBAgAABAgQIECBAgAABAgQIEDDw+gECBAgQIECAAAECBAgQIECAAAECBAhEBQy80eLEJkCAAAECBAgQIECAAAECBAgQIECAgIHXDxAgQIAAAQIECBAgQIAAAQIECBAgQCAqYOCNFic2AQIECBAgQIAAAQIECBAgQIAAAQIEDLx+gAABAgQIECBAgAABAgQIECBAgAABAlEBA2+0OLEJECBAgAABAgQIECBAgAABAgQIECBg4PUDBAgQIECAAAECBAgQIECAAAECBAgQiAoYeKPFiU2AAAECBAgQIECAAAECBAgQIECAAAEDrx8gQIAAAQIECBAgQIAAAQIECBAgQIBAVMDAGy1ObAIECBAgQIAAAQIECBAgQIAAAQIECBh4/QABAgQIECBAgAABAgQIECBAgAABAgSiAgbeaHFiEyBAgAABAgQIECBAgAABAgQIECBAwMDrBwgQIECAAAECBAgQIECAAAECBAgQIBAVMPBGixObAAECBAgQIECAAAECBAgQIECAAAECBl4/QIAAAQIECBAgQIAAAQIECBAgQIAAgaiAgTdanNgECBAgQIAAAQIECBAgQIAAAQIECBAw8PoBAgQIECBAgAABAgQIECBAgAABAgQIRAUMvNHixCZAgAABAgQIECBAgAABAgQIECBAgICB1w8QIECAAAECBAgQIECAAAECBAgQIEAgKmDgjRYnNgECBAgQIECAAAECBAgQIECAAAECBAy8foAAAQIECBAgQIAAAQIECBAgQIAAAQJRAQNvtDixCRAgQIAAAQIECBAgQIAAAQIECBAgYOD1AwQIECBAgAABAgQIECBAgAABAgQIEIgKGHijxYlNgAABAgQIECBAgAABAgQIECBAgAABA68fIECAAAECBAgQIECAAAECBAgQIECAQFTAwBstTmwCBAgQIECAAAECBAgQIECAAAECBAgYeP0AAQIECBAgQIAAAQIECBAgQIAAAQIEogIG3mhxYhMgQIAAAQIECBAgQIAAAQIECBAgQMDA6wcIECBAgAABAgQIECBAgAABAgQIECAQFTDwRosTmwABAgQIECBAgAABAgQIECBAgAABAgZeP0CAAAECBAgQIECAAAECBAgQIECAAIGogIE3WpzYBAgQIECAAAECBAgQIECAAAECBAgQMPD6AQIECBAgQIAAAQIECBAgQIAAAQIECEQFDLzR4sQmQIAAAQIECBAgQIAAAQIECBAgQICAgdcPECBAgAABAgQIECBAgAABAgQIECBAICpg4I0WJzYBAgQIECBAgAABAgQIECBAgAABAgQMvH6AAAECBAgQIECAAAECBAgQIECAAAECUQEDb7Q4sQkQIECAAAECBAgQIECAAAECBAgQIGDg9QMECBAgQIAAAQIECBAgQIAAAQIECBCIChh4o8WJTYAAAQIECBAgQIAAAQIECBAgQIAAAQOvHyBAgAABAgQIECBAgAABAgQIECBAgEBUwMAbLU5sAgQIECBAgAABAgQIECBAgAABAgQIGHj9AAECBAgQIECAAAECBAgQIECAAAECBKICBt5ocWITIECAAAECBAgQIECAAAECBAgQIEDAwOsHCBAgQIAAAQIECBAgQIAAAQIECBAgEBUw8EaLE5sAAQIECBAgQIAAAQIECBAgQIAAAQIGXj9AgAABAgQIECBAgAABAgQIECBAgACBqICBN1qc2AQIECBAgAABAgQIECBAgAABAgQIEDDw+gECBAgQIECAAAECBAgQIECAAAECBAhEBQy80eLEJkCAAAECBAgQIECAAAECBAgQIECAgIHXDxAgQIAAAQIECBAgQIAAAQIECBAgQCAqYOCNFic2AQIECBAgQIAAAQIECBAgQIAAAQIEDLx+gAABAgQIECBAgAABAgQIECBAgAABAlEBA2+0OLEJECBAgAABAgQIECBAgAABAgQIECBg4PUDBAgQIECAAAECBAgQIECAAAECBAgQiAoYeKPFiU2AAAECBAgQIECAAAECBAgQIECAAAEDrx8gQIAAAQIECBAgQIAAAQIECBAgQIBAVMDAGy1ObAIECBAgQIAAAQIECBAgQIAAAQIECBh4/QABAgQIECBAgAABAgQIECBAgAABAgSiAgbeaHFiEyBAgAABAgQIECBAgAABAgQIECBAwMDrBwgQIECAAAECBAgQIECAAAECBAgQIBAVMPBGixObAAECBAgQIECAAAECBAgQIECAAAECBl4/QIAAAQIECBAgQIAAAQIECBAgQIAAgaiAgTdanNgECBAgQIAAAQIECBAgQIAAAQIECBAw8PoBAgQIECBAgAABAgQIECBAgAABAgQIRAUMvNHixCZAgAABAgQIECBAgAABAgQIECBAgICB1w8QIECAAAECBAgQIECAAAECBAgQIEAgKmDgjRYnNgECBAgQIECAAAECBAgQIECAAAECBAy8foAAAQIECBAgQIAAAQIECBAgQIAAAQJRAQNvtDixCRAgQIAAAQIECBAgQIAAAQIECBAgYOD1AwQIECBAgAABAgQIECBAgAABAgQIEIgKGHijxYlNgAABAgQIECBAgAABAgQIECBAgAABA68fIECAAAECBAgQIECAAAECBAgQIECAQFTAwBstTmwCBAgQIECAAAECBAgQIECAAAECBAgYeP0AAQIECBAgQIAAAQIECBAgQIAAAQIEogIG3mhxYhMgQIAAAQIECBAgQIAAAQIECBAgQMDA6wcIECBAgAABAgQIECBAgAABAgQIECAQFTDwRosTmwABAgQIECBAgAABAgQIECBAgAABAgZeP0CAAAECBAgQIECAAAECBAgQIECAAIGogIE3WpzYBAgQIECAAAECBAgQIECAAAECBAgQMPD6AQIECBAgQIAAAQIECBAgQIAAAQIECEQFDLzR4sQmQIAAAQIECBAgQIAAAQIECBAgQICAgdcPECBAgAABAgQIECBAgAABAgQIECBAICpg4I0WJzYBAgQIECBAgAABAgQIECBAgAABAgQMvH6AAAECBAgQIECAAAECBAgQIECAAAECUQEDb7Q4sQkQIECAAAECBAgQIECAAAECBAgQIGDg9QMECBAgQIAAAQIECBAgQIAAAQIECBCIChh4o8WJTYAAAQIECBAgQIAAAQIECBAgQIAAAQOvHyBAgAABAgQIECBAgAABAgQIECBAgEBUwMAbLU5sAgQIECBAgAABAgQIECBAgAABAgQIGHj9AAECBAgQIECAAAECBAgQIECAAAECBKICBt5ocWITIECAAAECBAgQIECAAAECBAgQIEDAwOsHCBAgQIAAAQIECBAgQIAAAQIECBAgEBUw8EaLE5sAAQIECBAgQIAAAQIECBAgQIAAAQIGXj9AgAABAgQIECBAgAABAgQIECBAgACBqICBN1qc2AQIECBAgAABAgQIECBAgAABAgQIEDDw+gECBAgQIECAAAECBAgQIECAAAECBAhEBQy80eLEJkCAAAECBAgQIECAAAECBAgQIECAgIHXDxAgQIAAAQIECBAgQIAAAQIECBAgQCAqYOCNFic2AQIECBAgQIAAAQIECBAgQIAAAQIEDLx+gAABAgQIECBAgAABAgQIECBAgAABAlEBA2+0OLEJECBAgAABAgQIECBAgAABAgQIECBg4PUDBAgQIECAAAECBAgQIECAAAECBAgQiAoYeKPFiU2AAAECBAgQIECAAAECBAgQIECAAAEDrx8gQIAAAQIECBAgQIAAAQIECBAgQIBAVMDAGy1ObAIECBAgQIAAAQIECBAgQIAAAQIECBh4/QABAgQIECBAgAABAgQIECBAgAABAgSiAgbeaHFiEyBAgAABAgQIECBAgAABAgQIECBAwMDrBwgQIECAAAECBAgQIECAAAECBAgQIBAVMPBGixObAAECBAgQIECAAAECBAgQIECAAAECBl4/QIAAAQIECBAgQIAAAQIECBAgQIAAgaiAgTdanNgECBAgQIAAAQIECBAgQIAAAQIECBAw8PoBAgQIECBAgAABAgQIECBAgAABAgQIRAUMvNHixCZAgAABAgQIECBAgAABAgQIECBAgICB1w8QIECAAAECBAgQIECAAAECBAgQIEAgKmDgjRYnNgECBAgQIECAAAECBAgQIECAAAECBAy8foAAAQIECBAgQIAAAQIECBAgQIAAAQJRAQNvtDixCRAgQIAAAQIECBAgQIAAAQIECBAgYOD1AwQIECBAgAABAgQIECBAgAABAgQIEIgKGHijxYlNgAABAgQIECBAgAABAgQIECBAgAABA68fIECAAAECBAgQIECAAAECBAgQIECAQFTAwBstTmwCBAgQIECAAAECBAgQIECAAAECBAgYeP0AAQIECBAgQIAAAQIECBAgQIAAAQIEogIG3mhxYhMgQIAAAQIECBAgQIAAAQIECBAgQMDA6wcIECBAgAABAgQIECBAgAABAgQIECAQFTDwRosTmwABAgQIECBAgAABAgQIECBAgAABAgZeP0CAAAECBAgQIECAAAECBAgQIECAAIGogIE3WpzYBAgQIECAAAECBAgQIECAAAECBAgQMPD6AQIECBAgQIAAAQIECBAgQIAAAQIECEQFDLzR4sQmQIAAAQIECBAgQIAAAQIECBAgQICAgdcPECBAgAABAgQIECBAgAABAgQIECBAICpg4I0WJzYBAgQIECBAgAABAgQIECBAgAABAgQMvH6AAAECBAgQIECAAAECBAgQIECAAAECUQEDb7Q4sQkQIECAAAECBAgQIECAAAECBAgQIGDg9QMECBAgQIAAAQIECBAgQIAAAQIECBCIChh4o8WJTYAAAQIECBAgQIAAAQIECBAgQIAAAQOvHyBAgAABAgQIECBAgAABAgQIECBAgEBUwMAbLU5sAgQIECBAgAABAgQIECBAgAABAgQIGHj9AAECBAgQIECAAAECBAgQIECAAAECBKICBt5ocWITIECAAAECBAgQIECAAAECBAgQIEDAwOsHCBAgQIAAAQIECBAgQIAAAQIECBAgEBUw8EaLE5sAAQIECBAgQIAAAQIECBAgQIAAAQIGXj9AgAABAgQIECBAgAABAgQIECBAgACBqICBN1qc2AQIECBAgAABAgQIECBAgAABAgQIEDDw+gECBAgQIECAAAECBAgQIECAAAECBAhEBQy80eLEJkCAAAECBAgQIECAAAECBAgQIECAgIHXDxAgQIAAAQIECBAgQIAAAQIECBAgQCAqYOCNFic2AQIECBAgQIAAAQIECBAgQIAAAQIEDLx+gAABAgQIECBAgAABAgQIECBAgAABAlEBA2+0OLEJECBAgAABAgQIECBAgAABAgQIECDwWUkCvQGoemcAAAAASUVORK5CYII=';
        }
    }

    let framesArraySplice = [...framesArray].splice(1,framesArray.length);

    gifshot.createGIF({
        gifWidth: projectDimensionX,
        gifHeight: projectDimensionY,
        images: framesArraySplice,
        interval: (frameSpeed/1000),
        numFrames: 10,
        frameDuration: 1,
        fontWeight: 'normal',
        fontSize: '16px',
        fontFamily: 'sans-serif',
        fontColor: '#ffffff',
        textAlign: 'center',
        textBaseline: 'bottom',
        sampleInterval: 10,
        numWorkers: 2
    }, function (obj) {
        if (!obj.error) {
            var image = obj.image, animatedImage = document.createElement('img');
            animatedImage.src = image;
            animatedImage.id = 'animatedGIF';
            document.getElementById('gifContainer').appendChild(animatedImage);

            var someimage = document.getElementById('gifContainer');
            var myimg = someimage.getElementsByTagName('img')[0];
            let mysrc = myimg.src;

            setTimeout(() => {
                var a = document.createElement('a');
                a.href = mysrc;
                a.download = projectName.replace(/\s/g, '').toLowerCase() + ".gif";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }, 100);
        }
    });
}

// Ensure the initial empty state is saved so we can undo back to blank frames
setTimeout(() => {
    saveState();
}, 200);
