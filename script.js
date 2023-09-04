//fa-bars fa=>fontawesom classes


let toolsCont = document.querySelector(".tools-cont")
let optCont = document.querySelector('.options-cont');
let optFlag = false; //just to toggle class
//true=>options, false=>cross

let pencToolCont = document.querySelector(".pencil-tool-cont")
let eraserToolCont = document.querySelector(".eraser-tool-cont")
let pencil =document.querySelector(".pencil");
let eraser =document.querySelector(".eraser")
let pencFlag = false;
let eraserFlag = false;

let upload=document.querySelector(".upload");
let sticky=document.querySelector(".sticky");




optCont.addEventListener('click',(e)=>{

    //ab class ko toggle karna hai fa-bars e fa-cross
    // console.log("clicked");
    optFlag=!optFlag;  

    if(optFlag){  
        openTools();
    }else{
        closeTools();
    }
});

function openTools(){
    let iconEle = optCont.children[0];    //uske andar ke elements. Now its <i>
    iconEle.classList.remove('fa-bars'); //remove method is Value based
    iconEle.classList.add("fa-x");
    toolsCont.style.display="flex";
    //we can also use toggle and replace for this see below functions
}


function closeTools(){
    let iconEle = optCont.children[0];
    iconEle.classList.replace('fa-x',"fa-bars"); //remove method is Value based
    
    toolsCont.style.display="none";

//open ke time nhi dekhna par close ke time band karna hai
    pencToolCont.style.display="none";
    eraserToolCont.style.display="none"; 
}

//display and hide pencil and eraser tool container. 
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
        eraserToolCont.style.display="flex"; //not block
    }else{
        eraserToolCont.style.display="none";
    }
})

upload.addEventListener('click',(e)=>{
    //file explorer kholne ke liye 3 line 
    let input=document.createElement('input');
    input.setAttribute('type','file');
    input.click(); //mene input pe clisk nhi kia.. is se ho jaayega

    input.addEventListener('change',()=>{
        let file = input.files[0];
        //is se array milta hai.. ie multiple files upload karna posible hai
        let url=URL.createObjectURL(file);//src ke liye ye hi tarika hai

        //ab bs sticky container with image instead of textarea create karna hai. jo niche kia hua hai..
        
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
    </div>`;//isme text area hai not img

    createSticky(stickyTemplateHTML);
});

function createSticky(stickyTemplate){ //most basic to learn

    let stickyCont=document.createElement("div");
    stickyCont.setAttribute("class","sticky-cont");
    // console.log(stickyCont)
    stickyCont.innerHTML=stickyTemplate;

    document.body.appendChild(stickyCont); //since body is a unique tag


    let minimise=stickyCont.querySelector(".minimise");
    let remove=stickyCont.querySelector(".remove");

    

    noteActions(minimise,remove,stickyCont);//minimise and remove funtionality

    //drag and drop
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
        //text area visible hai to none; none hai to visible
        // console.log(getComputedStyle(stickyCont.children[1]).display) how i reached this line is important

        let noteCont=stickyCont.querySelector('.note-cont');
       
 /*       //or stickyCOnt.children[1];
            let display = getComputedStyle(stickyCont.children[1]).display; //note container ka display  */ 
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
    // document.body.append(element); //usne hatane ko bola
    
    moveAt(event.pageX, event.pageY);
    
    // moves the element at (pageX, pageY) coordinates
    // taking initial shifts into account
    function moveAt(pageX, pageY) {
        element.style.left = pageX - shiftX + 'px';
        element.style.top = pageY - shiftY + 'px';
    }
    
    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }
    
    // move the element on mousemove
    document.addEventListener('mousemove', onMouseMove);
    
    // drop the element, remove unneeded handlers
    element.onmouseup = function() {
        document.removeEventListener('mousemove', onMouseMove);
        element.onmouseup = null;
    };
}