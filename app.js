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


const objDiv = document.getElementById("consoleOutLog");
function logInfo(message) {
    document.getElementById('consoleOutLog').innerText += message.toString() + '\n';
    objDiv.scrollTop = objDiv.scrollHeight;
}


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

//askForProjectInfo(); // No comment if want user to enter name and size

// Sets default values if undefined
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

    console.log('includes?: ' + swatchesArrays.includes(currentColorHex.toString()));
    if(ok === true && swatchesArrays.includes(currentColorHex.toString().toUpperCase()) === false) {
        swatchesArrays.push(currentColorHex.toString());
        console.log('swatchesArray: ' + swatchesArrays);

        totalSwatches++;

        let swatchDiv = document.createElement('div');
        let parentDiv = swatchAdd.parentNode;

        swatchDiv.className = 'swatch';
        swatchDiv.id = "swatch" + totalSwatches.toString();

        swatchDiv.style.backgroundColor = currentColorHex; //change to active color picker color

        swatchDiv.onclick = function () {
            currentColorHex = rgb2hex(this.style.backgroundColor);
            // set document.getElementById('colorSectionID') value to ^
            //document.getElementById('colorSectionID').value = rgb2hex(this.style.backgroundColor);
            document.getElementById('colorSelectionButton').style.background = currentColorHex;
            document.documentElement.style.setProperty('--currentColor', currentColorHex);
            document.getElementById('colorSectionID').setAttribute('data-current-color','#00ff00');

            logInfo('current color: ' + currentColorHex);
        }

        parentDiv.append(swatchDiv);
        //parentDiv.insertBefore(swatchDiv, swatchAdd); //keeps addSwatch after all current color swatches
    }

    console.log(totalSwatches + ' swatches');
}

// triggers 'onInput' and 'onChange' on all color pickers when they are ready
//jscolor.trigger('input change');

function starterSwatchClicked(whichStarterSwatch) {
    let thisSwatchNum = 'swatch' + whichStarterSwatch.toString();
    let thisSwatch = document.getElementById(thisSwatchNum);
    currentColorHex = rgb2hex(thisSwatch.style.backgroundColor);
    document.documentElement.style.setProperty('--currentColor', currentColorHex);
    // set document.getElementById('colorSectionID') value to ^
    //document.getElementById('colorSectionID').value = rgb2hex(this.style.backgroundColor);
    document.getElementById('colorSelectionButton').style.background = currentColorHex;
    document.getElementById('colorSectionID').setAttribute('data-current-color','#00ff00');

    if(wc_hex_is_light(currentColorHex.toString())===true){
        document.getElementById('changeColorTextOverlay').style.color = '#000000';
    }
    else {
        document.getElementById('changeColorTextOverlay').style.color = '#ffffff';
    }

    logInfo('current color: ' + currentColorHex);
    console.log(swatchesArrays);
}


// Add new frame div when addFrame clicked
let divAddFrame = document.getElementById('addFrame');
divAddFrame.onclick = addFrameFunc;

function addFrameFunc() {
    totalFrames++;

    let ok = true;

    if(ok === true) {
        // creates a new div (frame) and adds it to the end
        let div = document.createElement('div');
        let parentDiv = divAddFrame.parentNode;
        // gives new frame the frame class and names the id
        div.className = 'frame';
        div.id = "frame" + totalFrames.toString();
        // adds frame number inside of frame
        div.innerText = totalFrames.toString();

        //add image to inside
        let divIMG = document.createElement('img');
        // gives frame preview img a unique id
        divIMG.id = "canvasimg" + totalFrames.toString();
        divIMG.setAttribute('width','100%');
        divIMG.setAttribute('height','100%');
        divIMG.className = 'posAbs';
        //append new img preview to the frame div
        div.append(divIMG);

        div.onclick = function () {
            document.getElementById('frameNumberText').innerText = this.innerText;

            animIsPlaying = false;
            //this.classList.add('frameActive');
            //document.getElementById('frame1').classList.remove('frameActive');
            //document.getElementById('frame2').classList.remove('frameActive');

            //currentFrame = totalFrames.toString();
            frameSwitchUpdate();


            // set every div with class of frame to remove frameActive class //classList.remove('frameActive');
            // add frameActive class to just this div //add('frameActive');
        }

        parentDiv.insertBefore(div, divAddFrame);

        // if the current frame is the last one, switch current to the just added frame
        currentFrame = totalFrames;
        for(let i = 0; i < totalFrames; i++){
            document.getElementById('frame'+(i+1)).classList.remove('frameActive');
        }
        document.getElementById('frame'+currentFrame.toString()).classList.add('frameActive');
        document.getElementById('frameNumberText').innerText = currentFrame.toString();
        load();

    }
}

// Figure out what frame it is on when frame clicked
for (let frame of frames) {
    frame.onclick = alertFrame;
}

function alertFrame() { //only for frames 1 and 2
    document.getElementById('frameNumberText').innerText = this.innerText;
    animIsPlaying = false;
    frameSwitchUpdate()
}

function frameSwitchUpdate() {
    currentFrame = parseInt(document.getElementById('frameNumberText').innerText);

    //repeat for max frames
    for(let i = 0; i < totalFrames; i++){
        document.getElementById('frame'+(i+1)).classList.remove('frameActive');
    }
    document.getElementById('frame'+currentFrame.toString()).classList.add('frameActive');

    // DO STUFF HERE WHEN FRAME IS SWITCHED
    // currentFrame IS THE CURRENT FRAME #
    // 'frame'+currentFrame.toString() IS THE DOM NAME OF CURRENT FRAME

    //call load()
    load();
}

function deleteFrame() {
    this.parentNode.removeChild(this);
}

// Canvas drawing! -----------------------------------------

// create canvas element and append it to document body
let canvas1 = document.getElementById('drawingCanvas1');

// get canvas 2D context and set him correct size
let ctx = canvas1.getContext('2d');

// onion skin canvases
let onionSkin1 = document.getElementById('onionSkin1');
let ctxOnion1 = onionSkin1.getContext('2d');

let elem = document.getElementById('canvas');
let rect = elem.getBoundingClientRect();
canvasDistanceLeft = rect.left.toFixed();
canvasDistanceTop = rect.top.toFixed();

function zoomIn() {

}


// last known position
let pos = { x: 0, y: 0 };
document.getElementById('drawingCanvas1').addEventListener('mousemove', draw);
document.getElementById('drawingCanvas1').addEventListener('mousedown', setPosition);
document.getElementById('drawingCanvas1').addEventListener('mouseenter', setPosition);
// saves drawing after every stroke
document.getElementById('drawingCanvas1').addEventListener('mouseup', save);


// new position from mouse event
function setPosition(e) {
    pos.x = e.clientX - canvasDistanceLeft;
    pos.y = e.clientY - canvasDistanceTop;
    document.getElementById('tempCursorLoc').innerText = pos.x.toString() + ', ' + pos.y.toString();
}

// get the 5th as distance above
// get the 8th/last as distance left

function draw(e) {
    // mouse left button must be pressed
    if (e.buttons !== 1) return;

    ctx.beginPath(); // begin

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = currentColorHex;

    ctx.moveTo(pos.x, pos.y); // from
    setPosition(e);
    ctx.lineTo(pos.x, pos.y); // to

    ctx.stroke(); // draw it!
}

let w = canvas1.width;
let h = canvas1.height;
// onion skin
let wOnion1 = canvas1.width;
let hOnion1 = canvas1.height;

// save current
function save() {
    let dataURL = canvas1.toDataURL();
    // sets frame preview to picture
    document.getElementById("canvasimg"+currentFrame).src = dataURL;
    document.getElementById("canvasimg"+currentFrame).style.display = "inline";

    // saves data to array of that frame
    framesArray[currentFrame] = dataURL;
}

// converts previously stored canvas dataURLs and converts to new image, and sets context of canvas to that
function drawDataURIOnCanvas(strDataURI, canvas) {
    "use strict";
    let img = new window.Image();
    img.addEventListener("load", function () {
        canvas.getContext("2d").drawImage(img, 0, 0);
    });
    img.setAttribute("src", strDataURI);
}

function load() {
    //load dataURL for currentFrame value in framesArray, if no value then return blank canvas
    if(framesArray[currentFrame] === undefined) {
        ctx.clearRect(0, 0, w, h);
        //ctx.fillStyle = "#e5e5e5";
        //ctx.fillRect(0,0,w,h);
    }
    else {
        // load data from framesArray[currentFrame]
        ctx.clearRect(0, 0, w, h);
        drawDataURIOnCanvas(framesArray[currentFrame], canvas1);
        document.getElementById("canvasimg"+currentFrame).src = framesArray[currentFrame];
        document.getElementById("canvasimg"+currentFrame).style.display = "inline";
    }

    // updates previous frame onion skin
    ctxOnion1.clearRect(0, 0, wOnion1, hOnion1);
    if(currentFrame > 1) {
        if(framesArray[currentFrame-1] !== undefined) {
            drawDataURIOnCanvas(framesArray[currentFrame-1], onionSkin1);
        }
        else {
            console.log('no onion skin for this frame.');
        }
    }
    logInfo('loading frame ' + currentFrame + '...');
}

function moveToFrameLeft() {
    if(currentFrame > 1){
        currentFrame -= 1;
    }
    else {
        currentFrame = totalFrames;
    }
    for(let i = 0; i < totalFrames; i++) {
        document.getElementById('frame'+(i+1)).classList.remove('frameActive');
    }
    document.getElementById('frame'+currentFrame.toString()).classList.add('frameActive');
    document.getElementById('frameNumberText').innerText = currentFrame.toString();
    load();
}

function moveToFrameRight() {
    if(currentFrame < totalFrames) {
        currentFrame += 1;
    }
    else {
        currentFrame = 1;
    }
    for(let i = 0; i < totalFrames; i++){
        document.getElementById('frame'+(i+1)).classList.remove('frameActive');
    }
    document.getElementById('frame'+currentFrame.toString()).classList.add('frameActive');
    document.getElementById('frameNumberText').innerText = currentFrame.toString();
    load();
}

// Change frame on arrow key press
document.addEventListener("keydown", (e) => {
    e = e || window.event;
    if (e.key === "ArrowLeft") {
        moveToFrameLeft();
    }
    else if (e.key === "ArrowRight") {
        moveToFrameRight();
    }
});

document.onkeypress = function(evt) {
    evt = evt || window.event;
    let charCode = evt.which || evt.keyCode;
    let charStr = String.fromCharCode(charCode);
    if (charStr === "=") {
        addFrameFunc();
    }
};


// Onionskin opacity change
document.getElementById('onionOpacity1').oninput = function (){
    onionSkinOpacity = this.value;
    document.getElementById('onionSkin1').style.opacity = onionSkinOpacity + '%';
    logInfo('onion skin opacity: ' + this.value + '%');
}

// Change accent color
document.getElementById('accentColorInput').oninput = function () {
    accentColor = this.value;
    document.documentElement.style.setProperty('--accentColor', accentColor);
    logInfo('accent color: ' + this.value);
}

// Change viewport bg color
document.getElementById('bgColorInput').oninput = function () {
    document.documentElement.style.setProperty('--viewportBgColor', this.value);
    logInfo('viewport bg color: ' + this.value);
}

// Brush size change
document.getElementById('brushSizeSlider').oninput = function (){
    brushSize = this.value;
    document.getElementById('brushSizeNumber').value = this.value;
    logInfo('brush size: ' + brushSize + 'px');
}
document.getElementById('brushSizeNumber').oninput = function (){
    brushSize = this.value;
    document.getElementById('brushSizeSlider').value = this.value;
    logInfo('brush size: ' + brushSize + 'px');
}

// filebar clicks
let fileBarOpenTab = 0;
document.body.addEventListener("click", function(){
    if (fileBarOpenTab === 1) {
        document.getElementById('filebarOpenFile').style.visibility = 'hidden';
        document.getElementById('filebarOpenEdit').style.visibility = 'hidden';
        document.getElementById('filebarOpenOptions').style.visibility = 'hidden';
        document.getElementById('filebarOpenFrame').style.visibility = 'hidden';
        document.getElementById('filebarOpenPlayback').style.visibility = 'hidden';
        fileBarOpenTab = 0;
    }
})
function filebarOpenFileFunc() {
    document.getElementById('filebarOpenFile').style.visibility = 'visible';
    setTimeout(() => {
        fileBarOpenTab = 1;
    }, 100);
}
function filebarOpenEditFunc() {
    document.getElementById('filebarOpenEdit').style.visibility = 'visible';
    setTimeout(() => {
        fileBarOpenTab = 1;
    }, 100);
}
function filebarOpenOptionsFunc() {
    document.getElementById('filebarOpenOptions').style.visibility = 'visible';
    setTimeout(() => {
        fileBarOpenTab = 1;
    }, 100);
}
function filebarOpenFrameFunc() {
    document.getElementById('filebarOpenFrame').style.visibility = 'visible';
    setTimeout(() => {
        fileBarOpenTab = 1;
    }, 100);
}
function filebarOpenPlaybackFunc() {
    document.getElementById('filebarOpenPlayback').style.visibility = 'visible';
    setTimeout(() => {
        fileBarOpenTab = 1;
    }, 100);
}

function newFile() {
    const response = confirm("Start a new file?\nAll current work will be lost!");
    if (response === true){
        window.onbeforeunload = null;
        location.reload();
    }
}


function chooseDrawing() {
    logInfo('Drawing');
    document.getElementById('roughSketchCanvas').style.zIndex = '9';
}

function chooseRoughSketch() {
    logInfo('Rough sketch');
    document.getElementById('roughSketchCanvas').style.zIndex = '11';
}


//let tempBrushSize = brushSize;
let tempBrushColor = currentColorHex;
// switch to brush or eraser
function chooseBrush() {
    currentColorHex = tempBrushColor;
    //brushSize = tempBrushSize;
}

function chooseEraser() {
    tempBrushColor = currentColorHex;
    //tempBrushSize = brushSize;

    //brushSize = 20;
    currentColorHex = '#E5E5E5';
}


function goToStart() {
    currentFrame = 1;
    for(let i = 0; i < totalFrames; i++){
        document.getElementById('frame'+(i+1)).classList.remove('frameActive');
    }
    document.getElementById('frame'+currentFrame.toString()).classList.add('frameActive');
    document.getElementById('frameNumberText').innerText = currentFrame.toString();
    load();
}
function goToLast() {
    currentFrame = totalFrames;
    for(let i = 0; i < totalFrames; i++){
        document.getElementById('frame'+(i+1)).classList.remove('frameActive');
    }
    document.getElementById('frame'+currentFrame.toString()).classList.add('frameActive');
    document.getElementById('frameNumberText').innerText = currentFrame.toString();
    load();
}

function setFrameSpeed() {
    let inputtedSpeed = prompt("Enter frame speed (in ms)", frameSpeed.toString());
    if (inputtedSpeed != null && parseInt(inputtedSpeed) > 0) {
        frameSpeed = inputtedSpeed;
        encoder.setDelay(frameSpeed);
    }
}

function renameProj() {
    projectName = prompt("Enter project name:", "");
    if(projectName === '') projectName = "Untitled Project";
    document.getElementById('projectName').innerText = projectName;
}

function duplicateFrame() {
    framesArray[totalFrames+1] = framesArray[currentFrame]
    addFrameFunc();
    load();
}

function playAnimation() {
    animIsPlaying = true;
    function animateAnimation() {
        currentFrame ++;
        if (currentFrame > totalFrames) currentFrame = 1;
        load();
        document.getElementById('frameNumberText').innerText = currentFrame.toString();

        setTimeout(() => {
            if(animIsPlaying === true){
                animateAnimation();
            }
        }, frameSpeed);
    }
    animateAnimation();
}
function pauseAnimation() {
    animIsPlaying = false;
}

// gets text from saved file ----------------------------------------------------------------------
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
    //console.log('old framesArray length: ' + framesArray.length);
    loadedText = document.getElementById('content-target').value;

    //find first comma in text, start reading after that. take that up until next comma and add as frameArray[1]
    //add one to frameArray[value] and continue
    framesArray = loadedText.split(',data');

    //console.log('new framesArray length: ' + framesArray.length);
    //TODO - framesArray is now the loaded one, go through and update each frame now

    // for every value in frames array, add 'data' before it starting at framesArray[2] and going to end
    for(let i=1;i<framesArray.length;i++){
        framesArray[i]="data"+framesArray[i];
    }
    console.log(framesArray);
    let newTotalFrames = framesArray.length - 1;

    for (let i = 0; i < newTotalFrames; i++) {
        addFrameFunc();
        load();
    }
    setTimeout(() => {
        currentFrame = totalFrames;
        frameSwitchUpdate();
    }, 10);
    logInfo('project loaded!');
}

/* reading json file

fetch('file.json')
  .then(response => response.json())
  .then(jsonResponse => console.log(jsonResponse))
   // outputs a javascript object from the parsed json

 */

function DownloadCanvasAsImage(){
    let downloadLink = document.createElement('a');
    downloadLink.setAttribute('download', 'CanvasAsImage.png');
    let dataURL = canvas1.toDataURL('image/png');
    let url = dataURL.replace(/^data:image\/png/,'data:application/octet-stream');
    downloadLink.setAttribute('href', url);
    downloadLink.click();
}

// confirm page reload
window.onbeforeunload = function() {
    return true;
};
        // Remove navigation prompt
            // window.onbeforeunload = null;

// save array as a text file
const downloadFile = () => {
    logInfo('saving project file');
    const link = document.createElement("a");
    const content = framesArray.toString();
    const file = new Blob([content], {type: 'text/plain'});
    link.href = URL.createObjectURL(file);
    link.download = projectName.replace(/\s/g, '').toLowerCase() + ".sam2d"; //todo- file extension name
    link.click();
    URL.revokeObjectURL(link.href);
}


// encode as gif -------------

function encodeAsGif() {
    logInfo('starting render');

    for (let i = 1; i < totalFrames + 1; i++){
        if(framesArray[i] === undefined){
            framesArray[i] = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABXgAAAK8CAYAAABV1dcbAAAAAXNSR0IArs4c6QAAIABJREFUeF7t2EENAAAMArHh3/R0XNIpIGUvdo4AAQIECBAgQIAAAQIECBAgQIAAAQIEkgJLphaaAAECBAgQIECAAAECBAgQIECAAAECBM7A6wkIECBAgAABAgQIECBAgAABAgQIECAQFTDwRosTmwABAgQIECBAgAABAgQIECBAgAABAgZeP0CAAAECBAgQIECAAAECBAgQIECAAIGogIE3WpzYBAgQIECAAAECBAgQIECAAAECBAgQMPD6AQIECBAgQIAAAQIECBAgQIAAAQIECEQFDLzR4sQmQIAAAQIECBAgQIAAAQIECBAgQICAgdcPECBAgAABAgQIECBAgAABAgQIECBAICpg4I0WJzYBAgQIECBAgAABAgQIECBAgAABAgQMvH6AAAECBAgQIECAAAECBAgQIECAAAECUQEDb7Q4sQkQIECAAAECBAgQIECAAAECBAgQIGDg9QMECBAgQIAAAQIECBAgQIAAAQIECBCIChh4o8WJTYAAAQIECBAgQIAAAQIECBAgQIAAAQOvHyBAgAABAgQIECBAgAABAgQIECBAgEBUwMAbLU5sAgQIECBAgAABAgQIECBAgAABAgQIGHj9AAECBAgQIECAAAECBAgQIECAAAECBKICBt5ocWITIECAAAECBAgQIECAAAECBAgQIEDAwOsHCBAgQIAAAQIECBAgQIAAAQIECBAgEBUw8EaLE5sAAQIECBAgQIAAAQIECBAgQIAAAQIGXj9AgAABAgQIECBAgAABAgQIECBAgACBqICBN1qc2AQIECBAgAABAgQIECBAgAABAgQIEDDw+gECBAgQIECAAAECBAgQIECAAAECBAhEBQy80eLEJkCAAAECBAgQIECAAAECBAgQIECAgIHXDxAgQIAAAQIECBAgQIAAAQIECBAgQCAqYOCNFic2AQIECBAgQIAAAQIECBAgQIAAAQIEDLx+gAABAgQIECBAgAABAgQIECBAgAABAlEBA2+0OLEJECBAgAABAgQIECBAgAABAgQIECBg4PUDBAgQIECAAAECBAgQIECAAAECBAgQiAoYeKPFiU2AAAECBAgQIECAAAECBAgQIECAAAEDrx8gQIAAAQIECBAgQIAAAQIECBAgQIBAVMDAGy1ObAIECBAgQIAAAQIECBAgQIAAAQIECBh4/QABAgQIECBAgAABAgQIECBAgAABAgSiAgbeaHFiEyBAgAABAgQIECBAgAABAgQIECBAwMDrBwgQIECAAAECBAgQIECAAAECBAgQIBAVMPBGixObAAECBAgQIECAAAECBAgQIECAAAECBl4/QIAAAQIECBAgQIAAAQIECBAgQIAAgaiAgTdanNgECBAgQIAAAQIECBAgQIAAAQIECBAw8PoBAgQIECBAgAABAgQIECBAgAABAgQIRAUMvNHixCZAgAABAgQIECBAgAABAgQIECBAgICB1w8QIECAAAECBAgQIECAAAECBAgQIEAgKmDgjRYnNgECBAgQIECAAAECBAgQIECAAAECBAy8foAAAQIECBAgQIAAAQIECBAgQIAAAQJRAQNvtDixCRAgQIAAAQIECBAgQIAAAQIECBAgYOD1AwQIECBAgAABAgQIECBAgAABAgQIEIgKGHijxYlNgAABAgQIECBAgAABAgQIECBAgAABA68fIECAAAECBAgQIECAAAECBAgQIECAQFTAwBstTmwCBAgQIECAAAECBAgQIECAAAECBAgYeP0AAQIECBAgQIAAAQIECBAgQIAAAQIEogIG3mhxYhMgQIAAAQIECBAgQIAAAQIECBAgQMDA6wcIECBAgAABAgQIECBAgAABAgQIECAQFTDwRosTmwABAgQIECBAgAABAgQIECBAgAABAgZeP0CAAAECBAgQIECAAAECBAgQIECAAIGogIE3WpzYBAgQIECAAAECBAgQIECAAAECBAgQMPD6AQIECBAgQIAAAQIECBAgQIAAAQIECEQFDLzR4sQmQIAAAQIECBAgQIAAAQIECBAgQICAgdcPECBAgAABAgQIECBAgAABAgQIECBAICpg4I0WJzYBAgQIECBAgAABAgQIECBAgAABAgQMvH6AAAECBAgQIECAAAECBAgQIECAAAECUQEDb7Q4sQkQIECAAAECBAgQIECAAAECBAgQIGDg9QMECBAgQIAAAQIECBAgQIAAAQIECBCIChh4o8WJTYAAAQIECBAgQIAAAQIECBAgQIAAAQOvHyBAgAABAgQIECBAgAABAgQIECBAgEBUwMAbLU5sAgQIECBAgAABAgQIECBAgAABAgQIGHj9AAECBAgQIECAAAECBAgQIECAAAECBKICBt5ocWITIECAAAECBAgQIECAAAECBAgQIEDAwOsHCBAgQIAAAQIECBAgQIAAAQIECBAgEBUw8EaLE5sAAQIECBAgQIAAAQIECBAgQIAAAQIGXj9AgAABAgQIECBAgAABAgQIECBAgACBqICBN1qc2AQIECBAgAABAgQIECBAgAABAgQIEDDw+gECBAgQIECAAAECBAgQIECAAAECBAhEBQy80eLEJkCAAAECBAgQIECAAAECBAgQIECAgIHXDxAgQIAAAQIECBAgQIAAAQIECBAgQCAqYOCNFic2AQIECBAgQIAAAQIECBAgQIAAAQIEDLx+gAABAgQIECBAgAABAgQIECBAgAABAlEBA2+0OLEJECBAgAABAgQIECBAgAABAgQIECBg4PUDBAgQIECAAAECBAgQIECAAAECBAgQiAoYeKPFiU2AAAECBAgQIECAAAECBAgQIECAAAEDrx8gQIAAAQIECBAgQIAAAQIECBAgQIBAVMDAGy1ObAIECBAgQIAAAQIECBAgQIAAAQIECBh4/QABAgQIECBAgAABAgQIECBAgAABAgSiAgbeaHFiEyBAgAABAgQIECBAgAABAgQIECBAwMDrBwgQIECAAAECBAgQIECAAAECBAgQIBAVMPBGixObAAECBAgQIECAAAECBAgQIECAAAECBl4/QIAAAQIECBAgQIAAAQIECBAgQIAAgaiAgTdanNgECBAgQIAAAQIECBAgQIAAAQIECBAw8PoBAgQIECBAgAABAgQIECBAgAABAgQIRAUMvNHixCZAgAABAgQIECBAgAABAgQIECBAgICB1w8QIECAAAECBAgQIECAAAECBAgQIEAgKmDgjRYnNgECBAgQIECAAAECBAgQIECAAAECBAy8foAAAQIECBAgQIAAAQIECBAgQIAAAQJRAQNvtDixCRAgQIAAAQIECBAgQIAAAQIECBAgYOD1AwQIECBAgAABAgQIECBAgAABAgQIEIgKGHijxYlNgAABAgQIECBAgAABAgQIECBAgAABA68fIECAAAECBAgQIECAAAECBAgQIECAQFTAwBstTmwCBAgQIECAAAECBAgQIECAAAECBAgYeP0AAQIECBAgQIAAAQIECBAgQIAAAQIEogIG3mhxYhMgQIAAAQIECBAgQIAAAQIECBAgQMDA6wcIECBAgAABAgQIECBAgAABAgQIECAQFTDwRosTmwABAgQIECBAgAABAgQIECBAgAABAgZeP0CAAAECBAgQIECAAAECBAgQIECAAIGogIE3WpzYBAgQIECAAAECBAgQIECAAAECBAgQMPD6AQIECBAgQIAAAQIECBAgQIAAAQIECEQFDLzR4sQmQIAAAQIECBAgQIAAAQIECBAgQICAgdcPECBAgAABAgQIECBAgAABAgQIECBAICpg4I0WJzYBAgQIECBAgAABAgQIECBAgAABAgQMvH6AAAECBAgQIECAAAECBAgQIECAAAECUQEDb7Q4sQkQIECAAAECBAgQIECAAAECBAgQIGDg9QMECBAgQIAAAQIECBAgQIAAAQIECBCIChh4o8WJTYAAAQIECBAgQIAAAQIECBAgQIAAAQOvHyBAgAABAgQIECBAgAABAgQIECBAgEBUwMAbLU5sAgQIECBAgAABAgQIECBAgAABAgQIGHj9AAECBAgQIECAAAECBAgQIECAAAECBKICBt5ocWITIECAAAECBAgQIECAAAECBAgQIEDAwOsHCBAgQIAAAQIECBAgQIAAAQIECBAgEBUw8EaLE5sAAQIECBAgQIAAAQIECBAgQIAAAQIGXj9AgAABAgQIECBAgAABAgQIECBAgACBqICBN1qc2AQIECBAgAABAgQIECBAgAABAgQIEDDw+gECBAgQIECAAAECBAgQIECAAAECBAhEBQy80eLEJkCAAAECBAgQIECAAAECBAgQIECAgIHXDxAgQIAAAQIECBAgQIAAAQIECBAgQCAqYOCNFic2AQIECBAgQIAAAQIECBAgQIAAAQIEDLx+gAABAgQIECBAgAABAgQIECBAgAABAlEBA2+0OLEJECBAgAABAgQIECBAgAABAgQIECBg4PUDBAgQIECAAAECBAgQIECAAAECBAgQiAoYeKPFiU2AAAECBAgQIECAAAECBAgQIECAAAEDrx8gQIAAAQIECBAgQIAAAQIECBAgQIBAVMDAGy1ObAIECBAgQIAAAQIECBAgQIAAAQIECBh4/QABAgQIECBAgAABAgQIECBAgAABAgSiAgbeaHFiEyBAgAABAgQIECBAgAABAgQIECBAwMDrBwgQIECAAAECBAgQIECAAAECBAgQIBAVMPBGixObAAECBAgQIECAAAECBAgQIECAAAECBl4/QIAAAQIECBAgQIAAAQIECBAgQIAAgaiAgTdanNgECBAgQIAAAQIECBAgQIAAAQIECBAw8PoBAgQIECBAgAABAgQIECBAgAABAgQIRAUMvNHixCZAgAABAgQIECBAgAABAgQIECBAgICB1w8QIECAAAECBAgQIECAAAECBAgQIEAgKmDgjRYnNgECBAgQIECAAAECBAgQIECAAAECBAy8foAAAQIECBAgQIAAAQIECBAgQIAAAQJRAQNvtDixCRAgQIAAAQIECBAgQIAAAQIECBAgYOD1AwQIECBAgAABAgQIECBAgAABAgQIEIgKGHijxYlNgAABAgQIECBAgAABAgQIECBAgAABA68fIECAAAECBAgQIECAAAECBAgQIECAQFTAwBstTmwCBAgQIECAAAECBAgQIECAAAECBAgYeP0AAQIECBAgQIAAAQIECBAgQIAAAQIEogIG3mhxYhMgQIAAAQIECBAgQIAAAQIECBAgQMDA6wcIECBAgAABAgQIECBAgAABAgQIECAQFTDwRosTmwABAgQIECBAgAABAgQIECBAgAABAgZeP0CAAAECBAgQIECAAAECBAgQIECAAIGogIE3WpzYBAgQIECAAAECBAgQIECAAAECBAgQMPD6AQIECBAgQIAAAQIECBAgQIAAAQIECEQFDLzR4sQmQIAAAQIECBAgQIAAAQIECBAgQICAgdcPECBAgAABAgQIECBAgAABAgQIECBAICpg4I0WJzYBAgQIECBAgAABAgQIECBAgAABAgQMvH6AAAECBAgQIECAAAECBAgQIECAAAECUQEDb7Q4sQkQIECAAAECBAgQIECAAAECBAgQIGDg9QMECBAgQIAAAQIECBAgQIAAAQIECBCIChh4o8WJTYAAAQIECBAgQIAAAQIECBAgQIAAAQOvHyBAgAABAgQIECBAgAABAgQIECBAgEBUwMAbLU5sAgQIECBAgAABAgQIECBAgAABAgQIGHj9AAECBAgQIECAAAECBAgQIECAAAECBKICBt5ocWITIECAAAECBAgQIECAAAECBAgQIEDAwOsHCBAgQIAAAQIECBAgQIAAAQIECBAgEBUw8EaLE5sAAQIECBAgQIAAAQIECBAgQIAAAQIGXj9AgAABAgQIECBAgAABAgQIECBAgACBqICBN1qc2AQIECBAgAABAgQIECBAgAABAgQIEDDw+gECBAgQIECAAAECBAgQIECAAAECBAhEBQy80eLEJkCAAAECBAgQIECAAAECBAgQIECAgIHXDxAgQIAAAQIECBAgQIAAAQIECBAgQCAqYOCNFic2AQIECBAgQIAAAQIECBAgQIAAAQIEDLx+gAABAgQIECBAgAABAgQIECBAgAABAlEBA2+0OLEJECBAgAABAgQIECBAgAABAgQIECBg4PUDBAgQIECAAAECBAgQIECAAAECBAgQiAoYeKPFiU2AAAECBAgQIECAAAECBAgQIECAAAEDrx8gQIAAAQIECBAgQIAAAQIECBAgQIBAVMDAGy1ObAIECBAgQIAAAQIECBAgQIAAAQIECBh4/QABAgQIECBAgAABAgQIECBAgAABAgSiAgbeaHFiEyBAgAABAgQIECBAgAABAgQIECBAwMDrBwgQIECAAAECBAgQIECAAAECBAgQIBAVMPBGixObAAECBAgQIECAAAECBAgQIECAAAECBl4/QIAAAQIECBAgQIAAAQIECBAgQIAAgaiAgTdanNgECBAgQIAAAQIECBAgQIAAAQIECBAw8PoBAgQIECBAgAABAgQIECBAgAABAgQIRAUMvNHixCZAgAABAgQIECBAgAABAgQIECBAgICB1w8QIECAAAECBAgQIECAAAECBAgQIEAgKmDgjRYnNgECBAgQIECAAAECBAgQIECAAAECBAy8foAAAQIECBAgQIAAAQIECBAgQIAAAQJRAQNvtDixCRAgQIAAAQIECBAgQIAAAQIECBAgYOD1AwQIECBAgAABAgQIECBAgAABAgQIEIgKGHijxYlNgAABAgQIECBAgAABAgQIECBAgAABA68fIECAAAECBAgQIECAAAECBAgQIECAQFTAwBstTmwCBAgQIECAAAECBAgQIECAAAECBAgYeP0AAQIECBAgQIAAAQIECBAgQIAAAQIEogIG3mhxYhMgQIAAAQIECBAgQIAAAQIECBAgQMDA6wcIECBAgAABAgQIECBAgAABAgQIECAQFTDwRosTmwABAgQIECBAgAABAgQIECBAgAABAgZeP0CAAAECBAgQIECAAAECBAgQIECAAIGogIE3WpzYBAgQIECAAAECBAgQIECAAAECBAgQMPD6AQIECBAgQIAAAQIECBAgQIAAAQIECEQFDLzR4sQmQIAAAQIECBAgQIAAAQIECBAgQICAgdcPECBAgAABAgQIECBAgAABAgQIECBAICpg4I0WJzYBAgQIECBAgAABAgQIECBAgAABAgQMvH6AAAECBAgQIECAAAECBAgQIECAAAECUQEDb7Q4sQkQIECAAAECBAgQIECAAAECBAgQIGDg9QMECBAgQIAAAQIECBAgQIAAAQIECBCIChh4o8WJTYAAAQIECBAgQIAAAQIECBAgQIAAAQOvHyBAgAABAgQIECBAgAABAgQIECBAgEBUwMAbLU5sAgQIECBAgAABAgQIECBAgAABAgQIGHj9AAECBAgQIECAAAECBAgQIECAAAECBKICBt5ocWITIECAAAECBAgQIECAAAECBAgQIEDAwOsHCBAgQIAAAQIECBAgQIAAAQIECBAgEBUw8EaLE5sAAQIECBAgQIAAAQIECBAgQIAAAQIGXj9AgAABAgQIECBAgAABAgQIECBAgACBqICBN1qc2AQIECBAgAABAgQIECBAgAABAgQIEDDw+gECBAgQIECAAAECBAgQIECAAAECBAhEBQy80eLEJkCAAAECBAgQIECAAAECBAgQIECAgIHXDxAgQIAAAQIECBAgQIAAAQIECBAgQCAqYOCNFic2AQIECBAgQIAAAQIECBAgQIAAAQIEDLx+gAABAgQIECBAgAABAgQIECBAgAABAlEBA2+0OLEJECBAgAABAgQIECBAgAABAgQIECBg4PUDBAgQIECAAAECBAgQIECAAAECBAgQiAoYeKPFiU2AAAECBAgQIECAAAECBAgQIECAAAEDrx8gQIAAAQIECBAgQIAAAQIECBAgQIBAVMDAGy1ObAIECBAgQIAAAQIECBAgQIAAAQIECBh4/QABAgQIECBAgAABAgQIECBAgAABAgSiAgbeaHFiEyBAgAABAgQIECBAgAABAgQIECBAwMDrBwgQIECAAAECBAgQIECAAAECBAgQIBAVMPBGixObAAECBAgQIECAAAECBAgQIECAAAECBl4/QIAAAQIECBAgQIAAAQIECBAgQIAAgaiAgTdanNgECBAgQIAAAQIECBAgQIAAAQIECBAw8PoBAgQIECBAgAABAgQIECBAgAABAgQIRAUMvNHixCZAgAABAgQIECBAgAABAgQIECBAgICB1w8QIECAAAECBAgQIECAAAECBAgQIEAgKmDgjRYnNgECBAgQIECAAAECBAgQIECAAAECBAy8foAAAQIECBAgQIAAAQIECBAgQIAAAQJRAQNvtDixCRAgQIAAAQIECBAgQIAAAQIECBAgYOD1AwQIECBAgAABAgQIECBAgAABAgQIEIgKGHijxYlNgAABAgQIECBAgAABAgQIECBAgAABA68fIECAAAECBAgQIECAAAECBAgQIECAQFTAwBstTmwCBAgQIECAAAECBAgQIECAAAECBAgYeP0AAQIECBAgQIAAAQIECBAgQIAAAQIEogIG3mhxYhMgQIAAAQIECBAgQIAAAQIECBAgQMDA6wcIECBAgAABAgQIECBAgAABAgQIECAQFTDwRosTmwABAgQIECBAgAABAgQIECBAgAABAgZeP0CAAAECBAgQIECAAAECBAgQIECAAIGogIE3WpzYBAgQIECAAAECBAgQIECAAAECBAgQMPD6AQIECBAgQIAAAQIECBAgQIAAAQIECEQFDLzR4sQmQIAAAQIECBAgQIAAAQIECBAgQICAgdcPECBAgAABAgQIECBAgAABAgQIECBAICpg4I0WJzYBAgQIECBAgAABAgQIECBAgAABAgQMvH6AAAECBAgQIECAAAECBAgQIECAAAECUQEDb7Q4sQkQIECAAAECBAgQIECAAAECBAgQIGDg9QMECBAgQIAAAQIECBAgQIAAAQIECBCIChh4o8WJTYAAAQIECBAgQIAAAQIECBAgQIAAAQOvHyBAgAABAgQIECBAgAABAgQIECBAgEBUwMAbLU5sAgQIECBAgAABAgQIECBAgAABAgQIGHj9AAECBAgQIECAAAECBAgQIECAAAECBKICBt5ocWITIECAAAECBAgQIECAAAECBAgQIEDAwOsHCBAgQIAAAQIECBAgQIAAAQIECBAgEBUw8EaLE5sAAQIECBAgQIAAAQIECBAgQIAAAQIGXj9AgAABAgQIECBAgAABAgQIECBAgACBqICBN1qc2AQIECBAgAABAgQIECBAgAABAgQIEDDw+gECBAgQIECAAAECBAgQIECAAAECBAhEBQy80eLEJkCAAAECBAgQIECAAAECBAgQIECAgIHXDxAgQIAAAQIECBAgQIAAAQIECBAgQCAqYOCNFic2AQIECBAgQIAAAQIECBAgQIAAAQIEDLx+gAABAgQIECBAgAABAgQIECBAgAABAlEBA2+0OLEJECBAgAABAgQIECBAgAABAgQIECBg4PUDBAgQIECAAAECBAgQIECAAAECBAgQiAoYeKPFiU2AAAECBAgQIECAAAECBAgQIECAAAEDrx8gQIAAAQIECBAgQIAAAQIECBAgQIBAVMDAGy1ObAIECBAgQIAAAQIECBAgQIAAAQIECBh4/QABAgQIECBAgAABAgQIECBAgAABAgSiAgbeaHFiEyBAgAABAgQIECBAgAABAgQIECBAwMDrBwgQIECAAAECBAgQIECAAAECBAgQIBAVMPBGixObAAECBAgQIECAAAECBAgQIECAAAECBl4/QIAAAQIECBAgQIAAAQIECBAgQIAAgaiAgTdanNgECBAgQIAAAQIECBAgQIAAAQIECBAw8PoBAgQIECBAgAABAgQIECBAgAABAgQIRAUMvNHixCZAgAABAgQIECBAgAABAgQIECBAgICB1w8QIECAAAECBAgQIECAAAECBAgQIEAgKmDgjRYnNgECBAgQIECAAAECBAgQIECAAAECBAy8foAAAQIECBAgQIAAAQIECBAgQIAAAQJRAQNvtDixCRAgQIAAAQIECBAgQIAAAQIECBAgYOD1AwQIECBAgAABAgQIECBAgAABAgQIEIgKGHijxYlNgAABAgQIECBAgAABAgQIECBAgAABA68fIECAAAECBAgQIECAAAECBAgQIECAQFTAwBstTmwCBAgQIECAAAECBAgQIECAAAECBAgYeP0AAQIECBAgQIAAAQIECBAgQIAAAQIEogIG3mhxYhMgQIAAAQIECBAgQIAAAQIECBAgQMDA6wcIECBAgAABAgQIECBAgAABAgQIECAQFTDwRosTmwABAgQIECBAgAABAgQIECBAgAABAgZeP0CAAAECBAgQIECAAAECBAgQIECAAIGogIE3WpzYBAgQIECAAAECBAgQIECAAAECBAgQMPD6AQIECBAgQIAAAQIECBAgQIAAAQIECEQFDLzR4sQmQIAAAQIECBAgQIAAAQIECBAgQICAgdcPECBAgAABAgQIECBAgAABAgQIECBAICpg4I0WJzYBAgQIECBAgAABAgQIECBAgAABAgQMvH6AAAECBAgQIECAAAECBAgQIECAAAECUQEDb7Q4sQkQIECAAAECBAgQIECAAAECBAgQIGDg9QMECBAgQIAAAQIECBAgQIAAAQIECBCIChh4o8WJTYAAAQIECBAgQIAAAQIECBAgQIAAAQOvHyBAgAABAgQIECBAgAABAgQIECBAgEBUwMAbLU5sAgQIECBAgAABAgQIECBAgAABAgQIGHj9AAECBAgQIECAAAECBAgQIECAAAECBKICBt5ocWITIECAAAECBAgQIECAAAECBAgQIEDAwOsHCBA1C4sBAAAgAElEQVQgQIAAAQIECBAgQIAAAQIECBAgEBUw8EaLE5sAAQIECBAgQIAAAQIECBAgQIAAAQIGXj9AgAABAgQIECBAgAABAgQIECBAgACBqICBN1qc2AQIECBAgAABAgQIECBAgAABAgQIEDDw+gECBAgQIECAAAECBAgQIECAAAECBAhEBQy80eLEJkCAAAECBAgQIECAAAECBAgQIECAgIHXDxAgQIAAAQIECBAgQIAAAQIECBAgQCAqYOCNFic2AQIECBAgQIAAAQIECBAgQIAAAQIEDLx+gAABAgQIECBAgAABAgQIECBAgAABAlEBA2+0OLEJECBAgAABAgQIECBAgAABAgQIECBg4PUDBAgQIECAAAECBAgQIECAAAECBAgQiAoYeKPFiU2AAAECBAgQIECAAAECBAgQIECAAAEDrx8gQIAAAQIECBAgQIAAAQIECBAgQIBAVMDAGy1ObAIECBAgQIAAAQIECBAgQIAAAQIECBh4/QABAgQIECBAgAABAgQIECBAgAABAgSiAgbeaHFiEyBAgAABAgQIECBAgAABAgQIECBAwMDrBwgQIECAAAECBAgQIECAAAECBAgQIBAVMPBGixObAAECBAgQIECAAAECBAgQIECAAAECBl4/QIAAAQIECBAgQIAAAQIECBAgQIAAgaiAgTdanNgECBAgQIAAAQIECBAgQIAAAQIECBAw8PoBAgQIECBAgAABAgQIECBAgAABAgQIRAUMvNHixCZAgAABAgQIECBAgAABAgQIECBAgICB1w8QIECAAAECBAgQIECAAAECBAgQIEAgKmDgjRYnNgECBAgQIECAAAECBAgQIECAAAECBAy8foAAAQIECBAgQIAAAQIECBAgQIAAAQJRAQNvtDixCRAgQIAAAQIECBAgQIAAAQIECBAgYOD1AwQIECBAgAABAgQIECBAgAABAgQIEIgKGHijxYlNgAABAgQIECBAgAABAgQIECBAgAABA68fIECAAAECBAgQIECAAAECBAgQIECAQFTAwBstTmwCBAgQIECAAAECBAgQIECAAAECBAgYeP0AAQIECBAgQIAAAQIECBAgQIAAAQIEogIG3mhxYhMgQIAAAQIECBAgQIAAAQIECBAgQMDA6wcIECBAgAABAgQIECBAgAABAgQIECAQFTDwRosTmwABAgQIECBAgAABAgQIECBAgAABAgZeP0CAAAECBAgQIECAAAECBAgQIECAAIGogIE3WpzYBAgQIECAAAECBAgQIECAAAECBAgQMPD6AQIECBAgQIAAAQIECBAgQIAAAQIECEQFDLzR4sQmQIAAAQIECBAgQIAAAQIECBAgQICAgdcPECBAgAABAgQIECBAgAABAgQIECBAICpg4I0WJzYBAgQIECBAgAABAgQIECBAgAABAgQMvH6AAAECBAgQIECAAAECBAgQIECAAAECUQEDb7Q4sQkQIECAAAECBAgQIECAAAECBAgQIGDg9QMECBAgQIAAAQIECBAgQIAAAQIECBCIChh4o8WJTYAAAQIECBAgQIAAAQIECBAgQIAAAQOvHyBAgAABAgQIECBAgAABAgQIECBAgEBUwMAbLU5sAgQIECBAgAABAgQIECBAgAABAgQIGHj9AAECBAgQIECAAAECBAgQIECAAAECBKICBt5ocWITIECAAAECBAgQIECAAAECBAgQIEDAwOsHCBAgQIAAAQIECBAgQIAAAQIECBAgEBUw8EaLE5sAAQIECBAgQIAAAQIECBAgQIAAAQIGXj9AgAABAgQIECBAgAABAgQIECBAgACBqICBN1qc2AQIECBAgAABAgQIECBAgAABAgQIEDDw+gECBAgQIECAAAECBAgQIECAAAECBAhEBQy80eLEJkCAAAECBAgQIECAAAECBAgQIECAgIHXDxAgQIAAAQIECBAgQIAAAQIECBAgQCAqYOCNFic2AQIECBAgQIAAAQIECBAgQIAAAQIEDLx+gAABAgQIECBAgAABAgQIECBAgAABAlEBA2+0OLEJECBAgAABAgQIECBAgAABAgQIECBg4PUDBAgQIECAAAECBAgQIECAAAECBAgQiAoYeKPFiU2AAAECBAgQIECAAAECBAgQIECAAAEDrx8gQIAAAQIECBAgQIAAAQIECBAgQIBAVMDAGy1ObAIECBAgQIAAAQIECBAgQIAAAQIECBh4/QABAgQIECBAgAABAgQIECBAgAABAgSiAgbeaHFiEyBAgAABAgQIECBAgAABAgQIECBAwMDrBwgQIECAAAECBAgQIECAAAECBAgQIBAVMPBGixObAAECBAgQIECAAAECBAgQIECAAAECBl4/QIAAAQIECBAgQIAAAQIECBAgQIAAgaiAgTdanNgECBAgQIAAAQIECBAgQIAAAQIECBAw8PoBAgQIECBAgAABAgQIECBAgAABAgQIRAUMvNHixCZAgAABAgQIECBAgAABAgQIECBAgICB1w8QIECAAAECBAgQIECAAAECBAgQIEAgKmDgjRYnNgECBAgQIECAAAECBAgQIECAAAECBAy8foAAAQIECBAgQIAAAQIECBAgQIAAAQJRAQNvtDixCRAgQIAAAQIECBAgQIAAAQIECBAgYOD1AwQIECBAgAABAgQIECBAgAABAgQIEIgKGHijxYlNgAABAgQIECBAgAABAgQIECBAgAABA68fIECAAAECBAgQIECAAAECBAgQIECAQFTAwBstTmwCBAgQIECAAAECBAgQIECAAAECBAgYeP0AAQIECBAgQIAAAQIECBAgQIAAAQIEogIG3mhxYhMgQIAAAQIECBAgQIAAAQIECBAgQMDA6wcIECBAgAABAgQIECBAgAABAgQIECAQFTDwRosTmwABAgQIECBAgAABAgQIECBAgAABAgZeP0CAAAECBAgQIECAAAECBAgQIECAAIGogIE3WpzYBAgQIECAAAECBAgQIECAAAECBAgQMPD6AQIECBAgQIAAAQIECBAgQIAAAQIECEQFDLzR4sQmQIAAAQIECBAgQIAAAQIECBAgQICAgdcPECBAgAABAgQIECBAgAABAgQIECBAICpg4I0WJzYBAgQIECBAgAABAgQIECBAgAABAgQMvH6AAAECBAgQIECAAAECBAgQIECAAAECUQEDb7Q4sQkQIECAAAECBAgQIECAAAECBAgQIGDg9QMECBAgQIAAAQIECBAgQIAAAQIECBCIChh4o8WJTYAAAQIECBAgQIAAAQIECBAgQIAAAQOvHyBAgAABAgQIECBAgAABAgQIECBAgEBUwMAbLU5sAgQIECBAgAABAgQIECBAgAABAgQIGHj9AAECBAgQIECAAAECBAgQIECAAAECBKICBt5ocWITIECAAAECBAgQIECAAAECBAgQIEDAwOsHCBAgQIAAAQIECBAgQIAAAQIECBAgEBUw8EaLE5sAAQIECBAgQIAAAQIECBAgQIAAAQIGXj9AgAABAgQIECBAgAABAgQIECBAgACBqICBN1qc2AQIECBAgAABAgQIECBAgAABAgQIEDDw+gECBAgQIECAAAECBAgQIECAAAECBAhEBQy80eLEJkCAAAECBAgQIECAAAECBAgQIECAgIHXDxAgQIAAAQIECBAgQIAAAQIECBAgQCAqYOCNFic2AQIECBAgQIAAAQIECBAgQIAAAQIEDLx+gAABAgQIECBAgAABAgQIECBAgAABAlEBA2+0OLEJECBAgAABAgQIECBAgAABAgQIECBg4PUDBAgQIECAAAECBAgQIECAAAECBAgQiAoYeKPFiU2AAAECBAgQIECAAAECBAgQIECAAAEDrx8gQIAAAQIECBAgQIAAAQIECBAgQIBAVMDAGy1ObAIECBAgQIAAAQIECBAgQIAAAQIECBh4/QABAgQIECBAgAABAgQIECBAgAABAgSiAgbeaHFiEyBAgAABAgQIECBAgAABAgQIECBAwMDrBwgQIECAAAECBAgQIECAAAECBAgQIBAVMPBGixObAAECBAgQIECAAAECBAgQIECAAAECBl4/QIAAAQIECBAgQIAAAQIECBAgQIAAgaiAgTdanNgECBAgQIAAAQIECBAgQIAAAQIECBAw8PoBAgQIECBAgAABAgQIECBAgAABAgQIRAUMvNHixCZAgAABAgQIECBAgAABAgQIECBAgICB1w8QIECAAAECBAgQIECAAAECBAgQIEAgKmDgjRYnNgECBAgQIECAAAECBAgQIECAAAECBAy8foAAAQIECBAgQIAAAQIECBAgQIAAAQJRAQNvtDixCRAgQIAAAQIECBAgQIAAAQIECBAgYOD1AwQIECBAgAABAgQIECBAgAABAgQIEIgKGHijxYlNgAABAgQIECBAgAABAgQIECBAgAABA68fIECAAAECBAgQIECAAAECBAgQIECAQFTAwBstTmwCBAgQIECAAAECBAgQIECAAAECBAgYeP0AAQIECBAgQIAAAQIECBAgQIAAAQIEogIG3mhxYhMgQIAAAQIECBAgQIAAAQIECBAgQMDA6wcIECBAgAABAgQIECBAgAABAgQIECAQFTDwRosTmwABAgQIECBAgAABAgQIECBAgAABAgZeP0CAAAECBAgQIECAAAECBAgQIECAAIGogIE3WpzYBAgQIECAAAECBAgQIECAAAECBAgQMPD6AQIECBAgQIAAAQIECBAgQIAAAQIECEQFDLzR4sQmQIAAAQIECBAgQIAAAQIECBAgQICAgdcPECBAgAABAgQIECBAgAABAgQIECBAICpg4I0WJzYBAgQIECBAgAABAgQIECBAgAABAgQMvH6AAAECBAgQIECAAAECBAgQIECAAAECUQEDb7Q4sQkQIECAAAECBAgQIECAAAECBAgQIGDg9QMECBAgQIAAAQIECBAgQIAAAQIECBCIChh4o8WJTYAAAQIECBAgQIAAAQIECBAgQIAAAQOvHyBAgAABAgQIECBAgAABAgQIECBAgEBUwMAbLU5sAgQIECBAgAABAgQIECBAgAABAgQIGHj9AAECBAgQIECAAAECBAgQIECAAAECBKICBt5ocWITIECAAAECBAgQIECAAAECBAgQIEDAwOsHCBAgQIAAAQIECBAgQIAAAQIECBAgEBUw8EaLE5sAAQIECBAgQIAAAQIECBAgQIAAAQIGXj9AgAABAgQIECBAgAABAgQIECBAgACBqICBN1qc2AQIECBAgAABAgQIECBAgAABAgQIEDDw+gECBAgQIECAAAECBAgQIECAAAECBAhEBQy80eLEJkCAAAECBAgQIECAAAECBAgQIECAgIHXDxAgQIAAAQIECBAgQIAAAQIECBAgQCAqYOCNFic2AQIECBAgQIAAAQIECBAgQIAAAQIEDLx+gAABAgQIECBAgAABAgQIECBAgAABAlEBA2+0OLEJECBAgAABAgQIECBAgAABAgQIECBg4PUDBAgQIECAAAECBAgQIECAAAECBAgQiAoYeKPFiU2AAAECBAgQIECAAAECBAgQIECAAAEDrx8gQIAAAQIECBAgQIAAAQIECBAgQIBAVMDAGy1ObAIECBAgQIAAAQIECBAgQIAAAQIECBh4/QABAgQIECBAgAABAgQIECBAgAABAgSiAgbeaHFiEyBAgAABAgQIECBAgAABAgQIECBAwMDrBwgQIECAAAECBAgQIECAAAECBAgQIBAVMPBGixObAAECBAgQIECAAAECBAgQIECAAAECBl4/QIAAAQIECBAgQIAAAQIECBAgQIAAgaiAgTdanNgECBAgQIAAAQIECBAgQIAAAQIECBAw8PoBAgQIECBAgAABAgQIECBAgAABAgQIRAUMvNHixCZAgAABAgQIECBAgAABAgQIECBAgICB1w8QIECAAAECBAgQIECAAAECBAgQIEAgKmDgjRYnNgECBAgQIECAAAECBAgQIECAAAECBAy8foAAAQIECBAgQIAAAQIECBAgQIAAAQJRAQNvtDixCRAgQIAAAQIECBAgQIAAAQIECBAgYOD1AwQIECBAgAABAgQIECBAgAABAgQIEIgKGHijxYlNgAABAgQIECBAgAABAgQIECBAgAABA68fIECAAAECBAgQIECAAAECBAgQIECAQFTAwBstTmwCBAgQIECAAAECBAgQIECAAAECBAgYeP0AAQIECBAgQIAAAQIECBAgQIAAAQIEogIG3mhxYhMgQIAAAQIECBAgQIAAAQIECBAgQMDA6wcIECBAgAABAgQIECBAgAABAgQIECAQFTDwRosTmwABAgQIECBAgAABAgQIECBAgAABAgZeP0CAAAECBAgQIECAAAECBAgQIECAAIGogIE3WpzYBAgQIECAAAECBAgQIECAAAECBAgQMPD6AQIECBAgQIAAAQIECBAgQIAAAQIECEQFDLzR4sQmQIAAAQIECBAgQIAAAQIECBAgQICAgdcPECBAgAABAgQIECBAgAABAgQIECBAICpg4I0WJzYBAgQIECBAgAABAgQIECBAgAABAgQMvH6AAAECBAgQIECAAAECBAgQIECAAAECUQEDb7Q4sQkQIECAAAECBAgQIECAAAECBAgQIGDg9QMECBAgQIAAAQIECBAgQIAAAQIECBCIChh4o8WJTYAAAQIECBAgQIAAAQIECBAgQIAAAQOvHyBAgAABAgQIECBAgAABAgQIECBAgEBUwMAbLU5sAgQIECBAgAABAgQIECBAgAABAgQIGHj9AAECBAgQIECAAAECBAgQIECAAAECBKICBt5ocWITIECAAAECBAgQIECAAAECBAgQIEDAwOsHCBAgQIAAAQIECBAgQIAAAQIECBAgEBUw8EaLE5sAAQIECBAgQIAAAQIECBAgQIAAAQIGXj9AgAABAgQIECBAgAABAgQIECBAgACBqICBN1qc2AQIECBAgAABAgQIECBAgAABAgQIEDDw+gECBAgQIECAAAECBAgQIECAAAECBAhEBQy80eLEJkCAAAECBAgQIECAAAECBAgQIECAgIHXDxAgQIAAAQIECBAgQIAAAQIECBAgQCAqYOCNFic2AQIECBAgQIAAAQIECBAgQIAAAQIEDLx+gAABAgQIECBAgAABAgQIECBAgAABAlEBA2+0OLEJECBAgAABAgQIECBAgAABAgQIECBg4PUDBAgQIECAAAECBAgQIECAAAECBAgQiAoYeKPFiU2AAAECBAgQIECAAAECBAgQIECAAAEDrx8gQIAAAQIECBAgQIAAAQIECBAgQIBAVMDAGy1ObAIECBAgQIAAAQIECBAgQIAAAQIECBh4/QABAgQIECBAgAABAgQIECBAgAABAgSiAgbeaHFiEyBAgAABAgQIECBAgAABAgQIECBAwMDrBwgQIECAAAECBAgQIECAAAECBAgQIBAVMPBGixObAAECBAgQIECAAAECBAgQIECAAAECBl4/QIAAAQIECBAgQIAAAQIECBAgQIAAgaiAgTdanNgECBAgQIAAAQIECBAgQIAAAQIECBAw8PoBAgQIECBAgAABAgQIECBAgAABAgQIRAUMvNHixCZAgAABAgQIECBAgAABAgQIECBAgICB1w8QIECAAAECBAgQIECAAAECBAgQIEAgKmDgjRYnNgECBAgQIECAAAECBAgQIECAAAECBAy8foAAAQIECBAgQIAAAQIECBAgQIAAAQJRAQNvtDixCRAgQIAAAQIECBAgQIAAAQIECBAgYOD1AwQIECBAgAABAgQIECBAgAABAgQIEIgKGHijxYlNgAABAgQIECBAgAABAgQIECBAgAABA68fIECAAAECBAgQIECAAAECBAgQIECAQFTAwBstTmwCBAgQIECAAAECBAgQIECAAAECBAgYeP0AAQIECBAgQIAAAQIECBAgQIAAAQIEogIG3mhxYhMgQIAAAQIECBAgQIAAAQIECBAgQMDA6wcIECBAgAABAgQIECBAgAABAgQIECAQFTDwRosTmwABAgQIECBAgAABAgQIECBAgAABAgZeP0CAAAECBAgQIECAAAECBAgQIECAAIGogIE3WpzYBAgQIECAAAECBAgQIECAAAECBAgQMPD6AQIECBAgQIAAAQIECBAgQIAAAQIECEQFDLzR4sQmQIAAAQIECBAgQIAAAQIECBAgQICAgdcPECBAgAABAgQIECBAgAABAgQIECBAICpg4I0WJzYBAgQIECBAgAABAgQIECBAgAABAgQMvH6AAAECBAgQIECAAAECBAgQIECAAAECUQEDb7Q4sQkQIECAAAECBAgQIECAAAECBAgQIGDg9QMECBAgQIAAAQIECBAgQIAAAQIECBCIChh4o8WJTYAAAQIECBAgQIAAAQIECBAgQIAAAQOvHyBAgAABAgQIECBAgAABAgQIECBAgEBUwMAbLU5sAgQIECBAgAABAgQIECBAgAABAgQIGHj9AAECBAgQIECAAAECBAgQIECAAAECBKICBt5ocWITIECAAAECBAgQIECAAAECBAgQIEDAwOsHCBAgQIAAAQIECBAgQIAAAQIECBAgEBUw8EaLE5sAAQIECBAgQIAAAQIECBAgQIAAAQIGXj9AgAABAgQIECBAgAABAgQIECBAgACBqICBN1qc2AQIECBAgAABAgQIECBAgAABAgQIEDDw+gECBAgQIECAAAECBAgQIECAAAECBAhEBQy80eLEJkCAAAECBAgQIECAAAECBAgQIECAgIHXDxAgQIAAAQIECBAgQIAAAQIECBAgQCAqYOCNFic2AQIECBAgQIAAAQIECBAgQIAAAQIEDLx+gAABAgQIECBAgAABAgQIECBAgAABAlEBA2+0OLEJECBAgAABAgQIECBAgAABAgQIECBg4PUDBAgQIECAAAECBAgQIECAAAECBAgQiAoYeKPFiU2AAAECBAgQIECAAAECBAgQIECAAAEDrx8gQIAAAQIECBAgQIAAAQIECBAgQIBAVMDAGy1ObAIECBAgQIAAAQIECBAgQIAAAQIECBh4/QABAgQIECBAgAABAgQIECBAgAABAgSiAgbeaHFiEyBAgAABAgQIECBAgAABAgQIECBAwMDrBwgQIECAAAECBAgQIECAAAECBAgQIBAVMPBGixObAAECBAgQIECAAAECBAgQIECAAAECBl4/QIAAAQIECBAgQIAAAQIECBAgQIAAgaiAgTdanNgECBAgQIAAAQIECBAgQIAAAQIECBAw8PoBAgQIECBAgAABAgQIECBAgAABAgQIRAUMvNHixCZAgAABAgQIECBAgAABAgQIECBAgICB1w8QIECAAAECBAgQIECAAAECBAgQIEAgKmDgjRYnNgECBAgQIECAAAECBAgQIECAAAECBAy8foAAAQIECBAgQIAAAQIECBAgQIAAAQJRAQNvtDixCRAgQIAAAQIECBAgQIAAAQIECBAgYOD1AwQIECBAgAABAgQIECBAgAABAgQIEIgKGHijxYlNgAABAgQIECBAgAABAgQIECBAgAABA68fIECAAAECBAgQIECAAAECBAgQIECAQFTAwBstTmwCBAgQIECAAAECBAgQIECAAAECBAgYeP0AAQIECBAgQIAAAQIECBAgQIAAAQIEogIG3mhxYhMgQIAAAQIECBAgQIAAAQIECBAgQMDA6wcIECBAgAABAgQIECBAgAABAgQIECAQFTDwRosTmwABAgQIECBAgAABAgQIECBAgAABAgZeP0CAAAECBAgQIECAAAECBAgQIECAAIGogIE3WpzYBAgQIECAAAECBAgQIECAAAECBAgQMPD6AQIECBAgQIAAAQIECBAgQIAAAQIECEQFDLzR4sQmQIAAAQIECBAgQIAAAQIECBAgQICAgdcPECBAgAABAgQIECBAgAABAgQIECBAICpg4I0WJzYBAgQIECBAgAABAgQIECBAgAABAgQMvH6AAAECBAgQIECAAAECBAgQIECAAAECUQEDb7Q4sQkQIECAAAECBAgQIECAAAECBAgQIGDg9QMECBAgQIAAAQIECBAgQIAAAQIECBCIChh4o8WJTYAAAQIECBAgQIAAAQIECBAgQIAAAQOvHyBAgAABAgQIECBAgAABAgQIECBAgEBUwMAbLU5sAgQIECBAgAABAgQIECBAgAABAgQIGHj9AAECBAgQIECAAAECBAgQIECAAAECBKICBt5ocWITIECAAAECBAgQIECAAAECBAgQIEDAwOsHCBAgQIAAAQIECBAgQIAAAQIECBAgEBUw8EaLE5sAAQIECBAgQIAAAQIECBAgQIAAAQIGXj9AgAABAgQIECBAgAABAgQIECBAgACBqICBN1qc2AQIECBAgAABAgQIECBAgAABAgQIEDDw+gECBAgQIECAAAECBAgQIECAAAECBAhEBQy80eLEJkCAAAECBAgQIECAAAECBAgQIECAgIHXDxAgQIAAAQIECBAgQIAAAQIECBAgQCAqYOCNFic2AQIECBAgQIAAAQIECBAgQIAAAQIEDLx+gAABAgQIECBAgAABAgQIECBAgAABAlEBA2+0OLEJECBAgAABAgQIECBAgAABAgQIECBg4PUDBAgQIECAAAECBAgQIECAAAECBAgQiAoYeKPFiU2AAAECBAgQIECAAAECBAgQIECAAAEDrx8gQIAAAQIECBAgQIAAAQIECBAgQIBAVMDAGy1ObAIECBAgQIAAAQIECBAgQIAAAQIECBh4/QABAgQIECBAgAABAgQIECBAgAABAgSiAgbeaHFiEyBAgAABAgQIECBAgAABAgQIECBAwMDrBwgQIECAAAECBAgQIECAAAECBAgQIBAVMPBGixObAAECBAgQIECAAAECBAgQIECAAAECBl4/QIAAAQIECBAgQIAAAQIECBAgQIAAgaiAgTdanA080S4AAAkSSURBVNgECBAgQIAAAQIECBAgQIAAAQIECBAw8PoBAgQIECBAgAABAgQIECBAgAABAgQIRAUMvNHixCZAgAABAgQIECBAgAABAgQIECBAgICB1w8QIECAAAECBAgQIECAAAECBAgQIEAgKmDgjRYnNgECBAgQIECAAAECBAgQIECAAAECBAy8foAAAQIECBAgQIAAAQIECBAgQIAAAQJRAQNvtDixCRAgQIAAAQIECBAgQIAAAQIECBAgYOD1AwQIECBAgAABAgQIECBAgAABAgQIEIgKGHijxYlNgAABAgQIECBAgAABAgQIECBAgAABA68fIECAAAECBAgQIECAAAECBAgQIECAQFTAwBstTmwCBAgQIECAAAECBAgQIECAAAECBAgYeP0AAQIECBAgQIAAAQIECBAgQIAAAQIEogIG3mhxYhMgQIAAAQIECBAgQIAAAQIECBAgQMDA6wcIECBAgAABAgQIECBAgAABAgQIECAQFTDwRosTmwABAgQIECBAgAABAgQIECBAgAABAgZeP0CAAAECBAgQIECAAAECBAgQIECAAIGogIE3WpzYBAgQIECAAAECBAgQIECAAAECBAgQMPD6AQIECBAgQIAAAQIECBAgQIAAAQIECEQFDLzR4sQmQIAAAQIECBAgQIAAAQIECBAgQICAgdcPECBAgAABAgQIECBAgAABAgQIECBAICpg4I0WJzYBAgQIECBAgAABAgQIECBAgAABAgQMvH6AAAECBAgQIECAAAECBAgQIECAAAECUQEDb7Q4sQkQIECAAAECBAgQIECAAAECBAgQIGDg9QMECBAgQIAAAQIECBAgQIAAAQIECBCIChh4o8WJTYAAAQIECBAgQIAAAQIECBAgQIAAAQOvHyBAgAABAgQIECBAgAABAgQIECBAgEBUwMAbLU5sAgQIECBAgAABAgQIECBAgAABAgQIGHj9AAECBAgQIECAAAECBAgQIECAAAECBKICBt5ocWITIECAAAECBAgQIECAAAECBAgQIEDAwOsHCBAgQIAAAQIECBAgQIAAAQIECBAgEBUw8EaLE5sAAQIECBAgQIAAAQIECBAgQIAAAQIGXj9AgAABAgQIECBAgAABAgQIECBAgACBqICBN1qc2AQIECBAgAABAgQIECBAgAABAgQIEDDw+gECBAgQIECAAAECBAgQIECAAAECBAhEBQy80eLEJkCAAAECBAgQIECAAAECBAgQIECAgIHXDxAgQIAAAQIECBAgQIAAAQIECBAgQCAqYOCNFic2AQIECBAgQIAAAQIECBAgQIAAAQIEDLx+gAABAgQIECBAgAABAgQIECBAgAABAlEBA2+0OLEJECBAgAABAgQIECBAgAABAgQIECBg4PUDBAgQIECAAAECBAgQIECAAAECBAgQiAoYeKPFiU2AAAECBAgQIECAAAECBAgQIECAAAEDrx8gQIAAAQIECBAgQIAAAQIECBAgQIBAVMDAGy1ObAIECBAgQIAAAQIECBAgQIAAAQIECBh4/QABAgQIECBAgAABAgQIECBAgAABAgSiAgbeaHFiEyBAgAABAgQIECBAgAABAgQIECBAwMDrBwgQIECAAAECBAgQIECAAAECBAgQIBAVMPBGixObAAECBAgQIECAAAECBAgQIECAAAECBl4/QIAAAQIECBAgQIAAAQIECBAgQIAAgaiAgTdanNgECBAgQIAAAQIECBAgQIAAAQIECBAw8PoBAgQIECBAgAABAgQIECBAgAABAgQIRAUMvNHixCZAgAABAgQIECBAgAABAgQIECBAgICB1w8QIECAAAECBAgQIECAAAECBAgQIEAgKmDgjRYnNgECBAgQIECAAAECBAgQIECAAAECBAy8foAAAQIECBAgQIAAAQIECBAgQIAAAQJRAQNvtDixCRAgQIAAAQIECBAgQIAAAQIECBAgYOD1AwQIECBAgAABAgQIECBAgAABAgQIEIgKGHijxYlNgAABAgQIECBAgAABAgQIECBAgAABA68fIECAAAECBAgQIECAAAECBAgQIECAQFTAwBstTmwCBAgQIECAAAECBAgQIECAAAECBAgYeP0AAQIECBAgQIAAAQIECBAgQIAAAQIEogIG3mhxYhMgQIAAAQIECBAgQIAAAQIECBAgQMDA6wcIECBAgAABAgQIECBAgAABAgQIECAQFTDwRosTmwABAgQIECBAgAABAgQIECBAgAABAgZeP0CAAAECBAgQIECAAAECBAgQIECAAIGogIE3WpzYBAgQIECAAAECBAgQIECAAAECBAgQMPD6AQIECBAgQIAAAQIECBAgQIAAAQIECEQFDLzR4sQmQIAAAQIECBAgQIAAAQIECBAgQICAgdcPECBAgAABAgQIECBAgAABAgQIECBAICpg4I0WJzYBAgQIECBAgAABAgQIECBAgAABAgQMvH6AAAECBAgQIECAAAECBAgQIECAAAECUQEDb7Q4sQkQIECAAAECBAgQIECAAAECBAgQIGDg9QMECBAgQIAAAQIECBAgQIAAAQIECBCIChh4o8WJTYAAAQIECBAgQIAAAQIECBAgQIAAAQOvHyBAgAABAgQIECBAgAABAgQIECBAgEBUwMAbLU5sAgQIECBAgAABAgQIECBAgAABAgQIGHj9AAECBAgQIECAAAECBAgQIECAAAECBKICBt5ocWITIECAAAECBAgQIECAAAECBAgQIEDAwOsHCBAgQIAAAQIECBAgQIAAAQIECBAgEBUw8EaLE5sAAQIECBAgQIAAAQIECBAgQIAAAQIGXj9AgAABAgQIECBAgAABAgQIECBAgACBqICBN1qc2AQIECBAgAABAgQIECBAgAABAgQIEDDw+gECBAgQIECAAAECBAgQIECAAAECBAhEBQy80eLEJkCAAAECBAgQIECAAAECBAgQIECAgIHXDxAgQIAAAQIECBAgQIAAAQIECBAgQCAqYOCNFic2AQIECBAgQIAAAQIECBAgQIAAAQIEDLx+gAABAgQIECBAgAABAgQIECBAgAABAlEBA2+0OLEJECBAgAABAgQIECBAgAABAgQIECDwWUkCvQGoemcAAAAASUVORK5CYII=';
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

            //download gif
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