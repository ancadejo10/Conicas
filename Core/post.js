var fb = gl.createFramebuffer()
var rb = gl.createRenderbuffer()
var tex = gl.createTexture()

gl.bindTexture(gl.TEXTURE_2D, tex);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

var prevSizeX = 0
var prevSizeY = 0

function UpdateFrame(){
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.bindRenderbuffer(gl.RENDERBUFFER, rb);

    if(prevSizeX != canvas.width || prevSizeY != canvas.height){
        prevSizeX = canvas.width
        prevSizeY = canvas.height

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, canvas.width, canvas.height, 0, gl.RGB, gl.UNSIGNED_BYTE, null);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);

        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, canvas.width, canvas.height);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, rb);
    }
}

const postVertexShader = CreateShader(gl.VERTEX_SHADER, postVertSource);
const postFragmentShader = CreateShader(gl.FRAGMENT_SHADER, postFragSource);

const postScreen = CreatePlane(1)
const postPrg = gl.createProgram();
gl.attachShader(postPrg, postVertexShader);
gl.attachShader(postPrg, postFragmentShader);
gl.linkProgram(postPrg);

function SetPostShader1i(name, val){
    const offset = gl.getUniformLocation(postPrg, name);
    gl.uniform1i(offset, val);
}