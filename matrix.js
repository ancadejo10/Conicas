function ToRad(i){
    return i * 0.0174533
}

function ToDeg(i){
    return i * 57.2958
}

function CreatePerspectiveMatrix(fov, aspect, near, far) {
    const f = 1.0 / Math.tan(fov / 2); // Cotangent of half FOV
    const rangeInv = 1.0 / (near - far); // Inverse depth range

    return new Float32Array([
        f / aspect, 0,  0,                          0,
        0,         f,  0,                          0,
        0,         0,  (far + near) * rangeInv,   -1,
        0,         0,  (2 * far * near) * rangeInv, 0
    ]);
}

function CreateViewMatrix(eye, center, up) {
    // Compute the forward (F) vector
    const F = [
        center[0] - eye[0],
        center[1] - eye[1],
        center[2] - eye[2]
    ];
    const fMag = Math.hypot(F[0], F[1], F[2]);
    F[0] /= fMag; F[1] /= fMag; F[2] /= fMag; // Normalize

    // Compute the right (R) vector
    const R = [
        F[1] * up[2] - F[2] * up[1],
        F[2] * up[0] - F[0] * up[2],
        F[0] * up[1] - F[1] * up[0]
    ];
    const rMag = Math.hypot(R[0], R[1], R[2]);
    R[0] /= rMag; R[1] /= rMag; R[2] /= rMag; // Normalize

    // Compute the true up (U) vector
    const U = [
        R[1] * F[2] - R[2] * F[1],
        R[2] * F[0] - R[0] * F[2],
        R[0] * F[1] - R[1] * F[0]
    ];

    // Compute translation
    const Tx = -(R[0] * eye[0] + R[1] * eye[1] + R[2] * eye[2]);
    const Ty = -(U[0] * eye[0] + U[1] * eye[1] + U[2] * eye[2]);
    const Tz = -(-F[0] * eye[0] - F[1] * eye[1] - F[2] * eye[2]);

    return new Float32Array([
        R[0], U[0], -F[0], 0,
        R[1], U[1], -F[1], 0,
        R[2], U[2], -F[2], 0,
        Tx,   Ty,   Tz,   1
    ]);
}

function CreateRotationMatrix(axis, angle) {
    const [x, y, z] = axis;
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const t = 1 - c;

    return new Float32Array([
        t*x*x + c,    t*x*y - s*z,  t*x*z + s*y,  0,
        t*x*y + s*z,  t*y*y + c,    t*y*z - s*x,  0,
        t*x*z - s*y,  t*y*z + s*x,  t*z*z + c,    0,
        0,            0,            0,            1
    ]);
}

function CreateTranslationMatrix(tx, ty, tz) {
    return new Float32Array([
        1, 0, 0, tx,
        0, 1, 0, ty,
        0, 0, 1, tz,
        0, 0, 0, 1
    ]);
}

function MultiplyMatrices(a, b) {
    const result = new Float32Array(16);
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            result[row * 4 + col] =
                a[row * 4 + 0] * b[0 * 4 + col] +
                a[row * 4 + 1] * b[1 * 4 + col] +
                a[row * 4 + 2] * b[2 * 4 + col] +
                a[row * 4 + 3] * b[3 * 4 + col];
        }
    }
    return result;
}
