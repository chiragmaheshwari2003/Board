
let toolsCont = document.querySelector(".tools-cont")
let optCont = document.querySelector('.options-cont');
let optFlag = false; 

let pencToolCont = document.querySelector(".pencil-tool-cont")
let eraserToolCont = document.querySelector(".eraser-tool-cont")
let pencil =document.querySelector(".pencil");
let eraser =document.querySelector(".eraser")
let pencFlag = false;
let eraserFlag = false;

let upload=document.querySelector(".upload");
let sticky=document.querySelector(".sticky");



optCont.addEventListener('click',(e)=>{

    optFlag=!optFlag;  

    if(optFlag){  
        openTools();
    }else{
        closeTools();
    }
});

function openTools(){
    let iconEle = optCont.children[0];  
    iconEle.classList.remove('fa-bars');
    iconEle.classList.add("fa-x");
    toolsCont.style.display="flex";
}


function closeTools(){
    let iconEle = optCont.children[0];
    iconEle.classList.replace('fa-x',"fa-bars");
    toolsCont.style.display="none";

    pencToolCont.style.display="none";
    eraserToolCont.style.display="none"; 
}

pencil.addEventListener('click',(e)=>{
    pencFlag=!pencFlag;

    if(pencFlag){
        pencToolCont.style.display="block";
    }else{
        pencToolCont.style.display="none";
    }
})
eraser.addEventListener('click',(e)=>{
    eraserFlag=!eraserFlag;

    if(eraserFlag){
        eraserToolCont.style.display="flex"; 
    }else{
        eraserToolCont.style.display="none";
    }
})

upload.addEventListener('click',(e)=>{
    let input=document.createElement('input');
    input.setAttribute('type','file');
    input.click(); 

    input.addEventListener('change',()=>{
        let file = input.files[0];
        let url=URL.createObjectURL(file);

        let stickyTemplateHTML=`
        <div class="header-cont">
            <div class="minimise"></div>
            <div class="remove"></div>
         </div>
    
        <div class="note-cont">
            <img src="${url}">
        </div>`;
        createSticky(stickyTemplateHTML);
            
    })   
})



sticky.addEventListener('click',()=>{ 
    let stickyTemplateHTML=`
    <div class="header-cont">
        <div class="minimise"></div>
        <div class="remove"></div>
    </div>

    <div class="note-cont">
        <textarea spellcheck="false"></textarea>
    </div>`;

    createSticky(stickyTemplateHTML);
});

function createSticky(stickyTemplate){ 

    let stickyCont=document.createElement("div");
    stickyCont.setAttribute("class","sticky-cont");

    stickyCont.innerHTML=stickyTemplate;

    document.body.appendChild(stickyCont); 

    let minimise=stickyCont.querySelector(".minimise");
    let remove=stickyCont.querySelector(".remove");

    

    noteActions(minimise,remove,stickyCont);
    
    stickyCont.onmousedown = function (event){
        dragAndDrop(stickyCont,event)
    };
    stickyCont.ondragstart = function() {
        return false;
      };
}

function noteActions(minimise,remove,stickyCont){
    remove.addEventListener('click',(e)=>{
        stickyCont.remove();
    })

    minimise.addEventListener('click',(e)=>{
        
        let noteCont=stickyCont.querySelector('.note-cont');
       
 
        let display=getComputedStyle(noteCont).getPropertyValue("display");

        if(display === "none"){
            noteCont.style.display = 'block';
        }else{
            noteCont.style.display = "none";
        }
    })
}

function dragAndDrop(element,event){
    
    let shiftX = event.clientX - element.getBoundingClientRect().left;
    let shiftY = event.clientY - element.getBoundingClientRect().top;
    
    element.style.position = 'absolute';
    element.style.zIndex = 1000;
    
    moveAt(event.pageX, event.pageY);
    
    function moveAt(pageX, pageY) {
        element.style.left = pageX - shiftX + 'px';
        element.style.top = pageY - shiftY + 'px';
    }
    
    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }
    

    document.addEventListener('mousemove', onMouseMove);
    
    element.onmouseup = function() {
        document.removeEventListener('mousemove', onMouseMove);
        element.onmouseup = null;
    };
}