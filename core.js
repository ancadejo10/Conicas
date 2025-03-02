gl.clearColor(0.5,0.5,0.5,1)
gl.enable(gl.DEPTH_TEST)

//gl.enable(gl.BLEND);
//gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

//gl.enable(gl.STENCIL_TEST);

var proj = CreatePerspectiveMatrix(Math.PI / 4, 1, 0.1, 100)
var tick = 0

function Update(){
    posX = Math.max(posX, -3)
    posY = Math.max(posY, -3)
    posZ = Math.max(posZ, -3)

    posX = Math.min(posX, 3)
    posY = Math.min(posY, 3)
    posZ = Math.min(posZ, 3)
    
    zoom = Math.max(zoom, 7)
    zoom = Math.min(zoom, 40)

    var scale = Math.min(window.innerWidth, window.innerHeight) / 1.4

    canvas.width = scale;
    canvas.height = scale;

    controller.style.width = scale + "px";
    controller.style.height = scale + "px";

    var rot = MultiplyMatrices(
        CreateRotationMatrix([0,1,0], rotX/100),
        CreateRotationMatrix([1,0,0], rotY/100)
    )

    view = MultiplyMatrices(
        rot,
        CreateViewMatrix([0,0,zoom], [0, 0, 0], [0, 1, 0])
    )

    SetShader4x4f("Rotation", CreateRotationMatrix([0,0,0], 0))

    var _aX = Math.abs(ToDeg(axisX)) % 360
    const bias = 5

    if(Math.abs(_aX - 0) < bias || Math.abs(_aX - 360) < bias){
        btnType.textContent = "Circunferencia"
    }else if(Math.abs(_aX - 126) < bias || Math.abs(_aX - 230) < bias){
        btnType.textContent = "Parabola"
    }else if(_aX > 126 && _aX < 230){
        btnType.textContent = "Hiperbola"
    }else{
        btnType.textContent = "Elipse"
    }

    imgType.style.height = scale + "px"
    imgType.style.width = (scale * imgScalePoint) + "px"
}

function Render(delta){
    tick = delta/2000

    gl.useProgram(prg)
    Update()

    UpdateFrame()

    gl.viewport(0,0,canvas.width, canvas.height)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT)
    
    SetShader4x4f("CameraProj", proj)
    SetShader4x4f("CameraView", view)

    if(hideCone == false){
        //gl.stencilFunc(gl.ALWAYS, 1, 0xFF);
        //gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);
        gl.depthFunc(gl.LESS)
        SetShader1i("IsPlaneShade", 0)
    
        SetShader3f("Translate", 0, 1, 0)
        SetShader3f("Direction", 1,-1,1)
        DrawMesh(coneModel)

        SetShader3f("Translate", 0, -1, 0)
        SetShader3f("Direction", 1,1,1)
        DrawMesh(coneModel)
    }

    var rot = MultiplyMatrices(
        CreateRotationMatrix([1,0,0], axisX/2),
        CreateRotationMatrix([0,1,0], axisY/2)
    )

    //gl.stencilFunc(gl.EQUAL, 1, 0xFF);
    //gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
    gl.depthFunc(gl.LESS)

    SetShader1i("IsPlaneShade", 1)
    SetShader4x4f("Rotation", rot)
    SetShader3f("Translate", posX, posY, posZ)
    SetShader3f("Direction", 1,1,1)
    DrawMesh(planeModel)

    gl.depthFunc(gl.ALWAYS)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.bindRenderbuffer(gl.RENDERBUFFER, null)
    gl.useProgram(postPrg)
    SetPostShader1i(0)
    DrawMesh(postScreen)

    window.requestAnimationFrame(Render)
}

function RotateCone(x,y){
    rotX -= x
    rotY -= y
}