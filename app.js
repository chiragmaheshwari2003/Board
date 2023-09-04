
// npm install express, npm install socket.io
//npm init=> enter*n
//require=> built-in funtion to include other module
//socket io client-installation cdn script
//nodemon => if app crashes to rectify hone ke baad restart


const express = require("express") //access  //returns a "function" of express

const socket = require("socket.io")//also a function
const cors= require("cors")
app=express(); //initialising app an server ready
//express was a function .. typical js

app.use(cors()) // location of index.html
app.use(express.static("./")); // location of index.html

let port= process.env.PORT || 5000;
let server = app.listen(port, ()=>{ //started listening
    console.log("Listening to port "+port);
}); //

//fend b-end ka connection ho gaya in index.html script
let io=socket(server,{
    cors:{
        origin:"*"
    }
}); //creating connection //initialisation of socket

// console.log(io.sockets.emit)
io.on("connection", (socket)=>{ //same as addEventListener in f-end. on is eventlistener for b-End
    console.log("Made Socket connection");

    //ab f-end se server ke pas data aagya.. ab server se saare connected comp pe bhejna hai
    socket.on("beginPath", (data)=>{ //data from f-End on mousedown
        //Now transfer data to connected devices

        io.sockets.emit("beginPath", data);

    });

    //same jo upar kis bas alag event pe
    socket.on("drawStroke", (data)=>{
        io.sockets.emit("drawStroke", data);
    });
    socket.on("redoUndo", (data)=>{ //same.. sare systems pe bhej do
        io.sockets.emit("redoUndo", data);
    });

}) 

//ab f-end (canvas se data aayega) mousedown and mousemove //pass that data to server
