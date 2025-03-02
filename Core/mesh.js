function CreateMesh(vers, inxs){
    var vBuff = gl.createBuffer();
    var iBuff = gl.createBuffer();
        
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuff);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuff);
    
    gl.bufferData(gl.ARRAY_BUFFER,          new Float32Array(vers),     gl.STATIC_DRAW);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,  new Uint16Array(inxs),      gl.STATIC_DRAW);

    return {
        vBuff: vBuff,
        iBuff: iBuff,
        size: inxs.length
    }
}

function DestroyMesh(mesh){
    gl.deleteBuffer(mesh.vBuff);
    gl.deleteBuffer(mesh.iBuff);
}

function DrawMesh(mesh){
    gl.bindBuffer(gl.ARRAY_BUFFER,          mesh.vBuff);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,  mesh.iBuff);

    var offset = gl.getAttribLocation(prg, 'aPosition');
    gl.enableVertexAttribArray(offset);
    gl.vertexAttribPointer(offset, 3, gl.FLOAT, false, 3 * 4 + 3 * 4, 0);

    var offset = gl.getAttribLocation(prg, 'aColor');
    gl.enableVertexAttribArray(offset);
    gl.vertexAttribPointer(offset, 3, gl.FLOAT, false, 3 * 4 + 3 * 4, 3 * 4);

    gl.drawElements(gl.TRIANGLES, mesh.size, gl.UNSIGNED_SHORT, 0);
}