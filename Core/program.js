function CreateShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader error: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

const vertexShader = CreateShader(gl.VERTEX_SHADER, vertSource);
const fragmentShader = CreateShader(gl.FRAGMENT_SHADER, fragSource);

const prg = gl.createProgram();
gl.attachShader(prg, vertexShader);
gl.attachShader(prg, fragmentShader);
gl.linkProgram(prg);

function SetShader1i(name,val){
    const offset = gl.getUniformLocation(prg, name);
    gl.uniform1i(offset, val);
}

function SetShader3f(name,x,y,z){
    const offset = gl.getUniformLocation(prg, name);
    gl.uniform3f(offset, x,y,z);
}

function SetShader4x4f(name, val){
    const offset = gl.getUniformLocation(prg, name);
    gl.uniformMatrix4fv(offset, false, val);
}