var controller = document.getElementById("Control")

let isDragging = false;
var prevX = 0;
var prevY = 0;
var rotX = 0
var rotY = 0

function StartDrag(event){
    let x, y;
    if (event.touches) {
        event.preventDefault();
        x = event.touches[0].clientX;
        y = event.touches[0].clientY;
    } else {
        x = event.clientX;
        y = event.clientY;
    }

    prevX = x
    prevY = y

    isDragging = true;
}

function MoveDrag(event){
    if (isDragging) {
        let x, y;
        if (event.touches) {
            event.preventDefault();
            x = event.touches[0].clientX;
            y = event.touches[0].clientY;
        } else {
            x = event.clientX;
            y = event.clientY;
        }

        RotateCone(x-prevX, y-prevY)

        prevX = x
        prevY = y
    }
}

function EndDrag(){
    if (isDragging) {
        isDragging = false;
    }
}

canvas.addEventListener("mousedown", StartDrag);
canvas.addEventListener("mousemove", MoveDrag);
canvas.addEventListener("mouseup", EndDrag);

canvas.addEventListener("touchstart", StartDrag, { passive: false });
canvas.addEventListener("touchmove", MoveDrag, { passive: false });
canvas.addEventListener("touchend", EndDrag);

var posX = 0
var posY = 0
var posZ = 0

var axisX = 0
var axisY = 0
var axisZ = 0

var zoom = 7

function MovementControl(id, dir, pos){
    var terminate = false;

    function Mover(){
        if(pos == true){
            posX += dir[0] / 40
            posY += dir[1] / 40
            posZ += dir[2] / 40
        }else if(pos == false){
            axisX += dir[0] / 40
            axisY += dir[1] / 40
            axisZ += dir[2] / 40
        }else{
            zoom += dir/4
        }
    
        if(!terminate){
            setTimeout(Mover, 5)
        }
    }

    document.addEventListener("mouseup", function(event){
        event.preventDefault();
        terminate = true
    })

    document.addEventListener("touchend", function(event){
        event.preventDefault();
        terminate = true
    })

    document.getElementById(id).addEventListener("mousedown", function(event){
        event.preventDefault();
        terminate = false
        Mover()
    })

    document.getElementById(id).addEventListener("touchstart", function(event){
        event.preventDefault();
        terminate = false
        Mover()
    })
}

MovementControl("BtnE", [0,1,0], true)
MovementControl("BtnQ", [0,-1,0], true)
MovementControl("BtnW", [1,0,0], true)
MovementControl("BtnS", [-1,0,0], true)
MovementControl("BtnA", [0,0,1], true)
MovementControl("BtnD", [0,0,-1], true)

MovementControl("BtnU", [1,0,0], false)
MovementControl("BtnB", [-1,0,0], false)
MovementControl("BtnL", [0,1,0], false)
MovementControl("BtnR", [0,-1,0], false)

MovementControl("BtnP", -1)
MovementControl("BtnM", 1)

var hideCone = false

document.getElementById("BtnH").addEventListener("touchstart", function(){
    hideCone = !hideCone
})

document.getElementById("BtnH").addEventListener("click", function(){
    hideCone = !hideCone
})

var btnType = document.getElementById("BtnT")
var imgType = document.getElementById("ImgE")

var imgScalePoint = 1

function TypeViewer(){
    document.getElementById("CanvasSlot").style.display = "none"
    document.getElementById("ControlSlot").style.display = "none"
    imgType.style.display = "block"
    imgType.src = "Examples/" + btnType.textContent + ".png"
}

function JView(){
    document.getElementById("CanvasSlot").style.display = "block"
    document.getElementById("ControlSlot").style.display = "block"
    imgType.style.display = "none"
}

btnType.addEventListener("touchstart", TypeViewer)
btnType.addEventListener("click", TypeViewer)

imgType.addEventListener("touchend", JView)
imgType.addEventListener("click", JView)

imgType.addEventListener("load", function(){
    imgScalePoint = imgType.naturalWidth / imgType.naturalHeight
})