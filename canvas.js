//this is f-end module.. yaha se data server pe jata hai


function understandingCanvas(){
    let canvas = document.querySelector('canvas')
    
    canvas.width = window.innerWidth;//in px
    canvas.height = window.innerHeight;

    let tool = canvas.getContext('2d');// api to do graphics
    tool.strokeStyle='blue' ;// to change color
    tool.lineWidth=8 //width of line  
    tool.beginPath();  //new graphic
    tool.moveTo(20,20); //starting point
    tool.lineTo(100,150); //end point(invisible line)
    tool.stroke(); //to fill colors(graphic) in above line


    //nt using begin path to continue hoga
    tool.lineTo(300,100)
    tool.stroke();

    //new path
    tool.strokeStyle='red';
    tool.lineWidth=20;
    tool.beginPath();
    tool.moveTo(100,100);
    tool.lineTo(100,200)
    tool.stroke();

}

let canvas = document.querySelector('canvas')

canvas.width = window.innerWidth;//in px
canvas.height = window.innerHeight;
let tool = canvas.getContext('2d');



let penClrs = document.querySelectorAll('.pencil-color');// sare color
let penWidthEle = document.querySelector('.pencil-width')
let eraserWidthEle = document.querySelector('.eraser-width')
let download = document.querySelector('.download');
let redo = document.querySelector('.redo');
let undo = document.querySelector('.undo');


let penWidth = penWidthEle.value;
let eraserWidth = eraserWidthEle.value;   
let penClr = 'red';
// console.log(penClrs)
let eraserClr = 'white'//useless.. bgcolor ke barabar hoga.

tool.strokeStyle = penClr;//initially to default value bhi de sakte the
tool.lineWidth = penWidth;



let mouseDown=false;

let undoRedoTracker=[]; //array to track moves.. har mouseup ko store karenge
let track=0; //idx on tracker 

//mousedown->key is pressed "Start path"  
// mousemove-> fill path(stroke)

canvas.addEventListener('mousedown', (e) => {
    mouseDown=true;
    // beginPath({ 
    //     x: e.clientX,
    //     y: e.clientY,
    // })

    let data={ 
        x: e.clientX,
        y: e.clientY,  
    }
    socket.emit("beginPath", data)  //sending data to server.. (identifier,data)
    
});

canvas.addEventListener('mousemove', (e) => {
    if(mouseDown) { //nahi to sirf ove pe bhi chal raha tha.
        // drawStroke({
        //     x: e.clientX,
        //     y: e.clientY,
        //     strokeClr: eraserFlag ? eraserClr : penClr,
        //     strokeWidth: eraserFlag ? eraserWidth : penWidth,
        // });
    // ab wahi kaam jo uper mousedown me kia.. send data to server
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
    // console.log(strokeObj+"stroke");
    tool.moveTo(strokeObj.clientX, strokeObj.clientY);
    tool.beginPath(); 
    
    //bina beginpath ke bhi draw ho jata hai. pr color wagera(width) refresh nhi hote
    //also naya mousedown aur purana mouseup ke bich bhi ek line aa jati hai
}

function drawStroke(strokeObj){
    // console.log(strokeObj)
    tool.lineTo(strokeObj.x, strokeObj.y);
    tool.stroke();

    //**don't know yaha kyu handle kiya inko
    tool.strokeStyle = strokeObj.strokeClr; 
    tool.lineWidth = strokeObj.strokeWidth;   
}

penClrs.forEach((clrEle)=>{
    clrEle.addEventListener('click',(e)=>{
        let clr = clrEle.classList[0];
        penClr = clr; // as of now need of pencolor variable not clear
        tool.strokeStyle=penClr;
    });
}) ;

penWidthEle.addEventListener('change',(e)=>{
    penWidth = penWidthEle.value;
    tool.lineWidth = penWidth; // as of now need of penWidth  variable not clear
});
eraserWidthEle.addEventListener('change',(e)=>{
    eraserWidth = eraserWidthEle.value;
    tool.lineWidth = eraserWidth; // as of now need of penWidth  variable not clear
})

eraser.addEventListener('click',(e)=>{ 
    //eraser in script.js 
    // aur since canvas wali ko bad me script src kia hai to uska access hai
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
    //prev action. since pushing new action at end. therefore track--

    if(track > 0)
        track--;
    // let trackObj ={
    //     trackValue : track,
    //     undoRedoTracker : undoRedoTracker,   
    // };

    let data ={
        trackValue : track,
        undoRedoTracker : undoRedoTracker,   
    };

    // undoRedoCanvas(trackObj); ab karna nhiserver pe bhejna hai .. fir us se handle karwana hai
    socket.emit("redoUndo", data); //sending to server


});


redo.addEventListener('click', (e) =>{
    if(track < undoRedoTracker.length-1)
        track++;

    // let trackObj ={
    //     trackValue : track,
    //     undoRedoTracker : undoRedoTracker,   
    // };
    let data ={
        trackValue : track,
        undoRedoTracker : undoRedoTracker,   
    };
    
    // undoRedoCanvas(trackObj);
    socket.emit("redoUndo", data); //sending to server. ab server listen karega app.js me aur sabko bhej dega
       
});

function undoRedoCanvas(trackObj){
    // to be on the safer side. reinitialise it. baad me usecase samajh aayega
    track = trackObj.trackValue; 
    undoRedoTracker = trackObj.undoRedoTracker; 

    let url = undoRedoTracker[track];
    let img = new Image(); //created new Image reference
    img.src = url;
    img.onload = (e)=>{ //eventlistener for load.
        //addeventlistener se bhi kar sakte the.. par ye bhi ek tarika hai.
        tool.drawImage(img, 0, 0, canvas.width, canvas.height);
        //src, StartX,StartY,Endx,Endy
       
    }
}

//ab server ne sabko data bheja hoga including me
//hum recieve karke kam karte hai f-end pe

//mousedown pe begin path
socket.on("beginPath", (data)=>{ // recieving data from server

    beginPath(data);
});

//musemove pe drawstroke
socket.on("drawStroke", (data)=>{ // recieving data from server
    drawStroke(data);

});


//undo and redo

socket.on("redoUndo", (data)=>{
    undoRedoCanvas(data);
})