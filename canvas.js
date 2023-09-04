

let canvas = document.querySelector('canvas')

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let tool = canvas.getContext('2d');



let penClrs = document.querySelectorAll('.pencil-color');
let penWidthEle = document.querySelector('.pencil-width')
let eraserWidthEle = document.querySelector('.eraser-width')
let download = document.querySelector('.download');
let redo = document.querySelector('.redo');
let undo = document.querySelector('.undo');


let penWidth = penWidthEle.value;
let eraserWidth = eraserWidthEle.value;   
let penClr = 'red';

let eraserClr = 'white'

tool.strokeStyle = penClr;
tool.lineWidth = penWidth;



let mouseDown=false;

let undoRedoTracker=[]; 
let track=0; 



canvas.addEventListener('mousedown', (e) => {
    mouseDown=true;
    
    let data={ 
        x: e.clientX,
        y: e.clientY,  
    }
    socket.emit("beginPath", data) 
    
});

canvas.addEventListener('mousemove', (e) => {
    if(mouseDown) { 
    let data={ 
        x: e.clientX,
        y: e.clientY, 
        strokeClr: eraserFlag ? eraserClr : penClr,
        strokeWidth: eraserFlag ? eraserWidth : penWidth, 
    }
    socket.emit("drawStroke", data);
    }
});

canvas.addEventListener('mouseup',(e)=>{
    mouseDown = false;

    let url=canvas.toDataURL();
    undoRedoTracker.push(url);
    track=undoRedoTracker.length-1;
    
}); 

function beginPath(strokeObj){

    tool.moveTo(strokeObj.clientX, strokeObj.clientY);
    tool.beginPath(); 
}

function drawStroke(strokeObj){
    tool.lineTo(strokeObj.x, strokeObj.y);
    tool.stroke();

    tool.strokeStyle = strokeObj.strokeClr; 
    tool.lineWidth = strokeObj.strokeWidth;   
}

penClrs.forEach((clrEle)=>{
    clrEle.addEventListener('click',(e)=>{
        let clr = clrEle.classList[0];
        penClr = clr; 
        tool.strokeStyle=penClr;
    });
}) ;

penWidthEle.addEventListener('change',(e)=>{
    penWidth = penWidthEle.value;
    tool.lineWidth = penWidth; 
});
eraserWidthEle.addEventListener('change',(e)=>{
    eraserWidth = eraserWidthEle.value;
    tool.lineWidth = eraserWidth; 
})

eraser.addEventListener('click',(e)=>{ 
  
    if(eraserFlag){
        tool.strokeStyle = eraserClr;
        tool.lineWidth = eraserWidth;
    }else{
        tool.strokeStyle = penClr;
        tool.lineWidth = penWidth;
    }
});

download.addEventListener('click', (e) => {
    let url = canvas.toDataURL();  
    canvas.background='white'
    let a = document.createElement("a");
    a.href = url;
    a.download = 'board.jpg';
    a.click();
});

undo.addEventListener('click', (e) =>{ 
    
    if(track > 0)
        track--;
    

    let data ={
        trackValue : track,
        undoRedoTracker : undoRedoTracker,   
    };

    socket.emit("redoUndo", data); 
});


redo.addEventListener('click', (e) =>{
    if(track < undoRedoTracker.length-1)
        track++;

    let data ={
        trackValue : track,
        undoRedoTracker : undoRedoTracker,   
    };

    socket.emit("redoUndo", data); 
});

function undoRedoCanvas(trackObj){
    track = trackObj.trackValue; 
    undoRedoTracker = trackObj.undoRedoTracker; 

    let url = undoRedoTracker[track];
    let img = new Image(); 
    img.src = url;
    img.onload = (e)=>{ 
        tool.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
}
socket.on("beginPath", (data)=>{ 
    beginPath(data);
});


socket.on("drawStroke", (data)=>{ 
    drawStroke(data);

});

socket.on("redoUndo", (data)=>{
    undoRedoCanvas(data);
})