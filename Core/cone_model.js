function CreateCone(){
    var vers = [
        0,1,0,       1,0,0,
    ]
    
    var inxs = []
    const faces = 50;
    const angle = ToRad(360 / faces)

    for(let i = 0; i < faces; i++){
        const x1 = Math.sin(i * angle)
        const y1 = Math.cos(i * angle)

        const x2 = Math.sin((i+1) * angle)
        const y2 = Math.cos((i+1) * angle)

        vers.push(x1,-1, y1,     Math.random(),0,0)
        vers.push(x2,-1, y2,     Math.random(),0,0)

        inxs.push((i+1)*2-1,(i+1)*2,0)
    }

    return CreateMesh(vers, inxs)
}

const coneModel = CreateCone()