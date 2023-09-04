
const express = require("express") 

const socket = require("socket.io")
const cors= require("cors")
app=express(); 

app.use(cors()) 
app.use(express.static("./")); 

let port= process.env.PORT || 5000;
let server = app.listen(port, ()=>{ 
    console.log("Listening to port "+port);
}); //


let io=socket(server,{
    cors:{
        origin:"*"
    }
}); 


io.on("connection", (socket)=>{ 
    console.log("Made Socket connection");

    socket.on("beginPath", (data)=>{

        io.sockets.emit("beginPath", data);

    });

    socket.on("drawStroke", (data)=>{
        io.sockets.emit("drawStroke", data);
    });
    socket.on("redoUndo", (data)=>{ 
        io.sockets.emit("redoUndo", data);
    });

}) 
