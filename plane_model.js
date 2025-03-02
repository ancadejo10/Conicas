function CreatePlane(scale){
    var vers = [
        scale,0,scale,        0,0,1,
        -scale,0,scale,       0,0,1,
        scale,0,-scale,       0,0,1,
        -scale,0,-scale,      0,0,1,
    ]
    
    var inxs = [
        0,1,2,
        1,2,3
    ]

    return CreateMesh(vers, inxs)
}

const planeModel = CreatePlane(2)