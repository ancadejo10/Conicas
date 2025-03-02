const vertSource = `
    attribute vec3 aPosition;
    attribute vec3 aColor;

    varying vec3 Color;
    varying vec3 vPos;

    uniform mat4 CameraProj;
    uniform mat4 CameraView;
    
    uniform mat4 Rotation;
    uniform vec3 Translate;

    uniform vec3 Direction;

    void main() {
        Color = aColor;
        vec4 pos = Rotation * vec4((aPosition * Direction), 1);
        pos += vec4(Translate, 0);
        vPos = pos.xyz;
        gl_Position = CameraProj * CameraView * pos;
    }
`;

const fragSource = `
    #ifdef GL_FRAGMENT_PRECISION_HIGH
        precision highp float;
    #else
        precision mediump float;
    #endif

    varying vec3 Color;
    varying vec3 vPos;

    const vec3 uConeTip = vec3(0,0,0);    // Tip of the cone
    const float uConeAngle = 0.465; // Cone angle in radians
    const vec3 uPlaneNormal = vec3(0,1,0);
    const vec3 uPlanePoint = vec3(0,0,0);

    uniform int IsPlaneShade;

    void main() {
        const float transparency = 0.8;

        gl_FragColor = vec4(Color, transparency);

        if(IsPlaneShade == 0){
            return;
        }

        vec3 toPixel = vPos - uConeTip;

        float proj = max(dot(toPixel, vec3(0,-1,0)), 0.0);
        float coneRadius = proj * tan(uConeAngle);
        float distanceToAxis = length(toPixel - proj * vec3(0,-1,0));

        if (distanceToAxis <= coneRadius) {
            gl_FragColor = vec4(0.0, 1.0, 0.0, transparency);
        }

        proj = max(dot(toPixel, vec3(0,1,0)), 0.0);
        coneRadius = proj * tan(uConeAngle);
        distanceToAxis = length(toPixel - proj * vec3(0,1,0));

        if (distanceToAxis <= coneRadius) {
            gl_FragColor = vec4(0.0, 1.0, 0.0, transparency);
        }
    }
`;

const postVertSource = `
    attribute vec3 aPosition;
    attribute vec3 aColor;

    varying vec2 uv;

    void main() {
        uv = aPosition.xz;
        gl_Position = vec4(uv, 0, 1);

        uv = (vec2(uv.x, uv.y) + 1.0) / 2.0;
    }
`;

const postFragSource = `
    #ifdef GL_FRAGMENT_PRECISION_HIGH
        precision highp float;
    #else
        precision mediump float;
    #endif

    varying vec2 uv;
    uniform sampler2D img;

    vec4 GetColor(vec2 i){
        return texture2D(img, uv + i);
    }

    void main() {
        vec4 p0 = GetColor(vec2(0,0));
        vec4 p1 = GetColor(vec2(0,0.001));
        vec4 p2 = GetColor(vec2(0,-0.001));
        vec4 p3 = GetColor(vec2(0.001,0));
        vec4 p4 = GetColor(vec2(-0.001,0));

        float b1 = 0.8;
        float b2 = 0.2;

        if(p0.b > b1){
            if(p1.r > b2 || p2.r > b2 || p3.r > b2 || p4.r > b2){
                gl_FragColor = vec4(0,0,0,1);
            }else{
                gl_FragColor = p0;
            }
        }else{
            gl_FragColor = p0;
        }
    }
`;