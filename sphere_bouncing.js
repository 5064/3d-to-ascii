#!/usr/bin/env node
const SCREEN_WIDTH = 50
const SCREEN_HEIGHT = 50
const R = 5  // radius
// distance between screen to object center z
const K2 = R
// K1 is distance between eye to screen z
const K1 = 3 / 5 * SCREEN_WIDTH;

const TEXTURE = " .-~:=+*o$@";

function sphereSurface() {
    result = []
    for (let theta = 0; theta < Math.PI; theta += Math.PI / 100) {
        for (let phi = 0; phi < 2 * Math.PI; phi += Math.PI / 100) {
            // 3D polar coordinates
            let x = R * Math.sin(theta) * Math.cos(phi)
            let y = R * Math.sin(theta) * Math.sin(phi)
            let z = R * Math.cos(theta) + K2
            result.push({ x, y, z })
        }
    }
    return result
}

function convertTo2d(xyz) {
    return { x: (K1 * xyz.x / (xyz.z + K2)), y: (K1 * xyz.y / (xyz.z + K2)), z: xyz.z }
}

function show(xyzs) {
    const xys = xyzs.map(xyz => convertTo2d(xyz))
    let projection = []
    for (var i = 0; i < SCREEN_HEIGHT; i++) {
        projection[i] = [];
        for (var j = 0; j < SCREEN_WIDTH; j++) {
            projection[i][j] = 0;
        }
    }
    for (const xy of xys) {
        // x and y projection.
        let xp = SCREEN_WIDTH / 2 + Math.floor(xy.x)
        let yp = SCREEN_HEIGHT / 2 + Math.floor(xy.y)
        if (projection[yp][xp] < xy.z) {
            projection[yp][xp] = xy.z
        }
    }
    let output = ""
    const maxZ = K2 + R
    for (const p of projection) {
        for (const z of p) {
            // luminance range is 0 to texture length 
            // Texture.length / (maxZ / z)
            const i = Math.floor((TEXTURE.length - 1) / (maxZ / z))

            output += TEXTURE[i] + " "
        }
        output += "|\n"
    }
    console.log(output)
}

show(sphereSurface())
