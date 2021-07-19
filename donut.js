#!/usr/bin/env node
const readline = require("readline")

const SCREEN_WIDTH = 80
const SCREEN_HEIGHT = 50
const R1 = 1  // The donut thickness
const R2 = 2  // radius from K2 to R1
// distance between screen to object center z
let K2 = 3
// K1 is distance between eye to screen z
const K1 = SCREEN_WIDTH*K2*3/(8*(R1+R2));

const TEXTURE = " .-~:!=+*o$@";

function donut() {
    /**
     * return Donut shape surface cordinate(before revolving)
     */
    result = []
    for (let theta = 0; theta < 2* Math.PI; theta += Math.PI / 100) {
        for (let phi = 0; phi < 2 * Math.PI; phi += Math.PI / 100) {
            let donutX = (R2 + R1 * Math.cos(theta)) * Math.cos(phi)
            let donutY = R1 * Math.sin(theta)
            let donutZ = -(R2+R1*Math.cos(theta))*Math.sin(phi)+ K2
            result.push({ x, y, z})
        }
    }
    return result
}

function convertTo2d(xyz) {
    return { x: (K1 * xyz.x / (xyz.z + K2)), y: (K1 * xyz.y / (xyz.z + K2)), z: xyz.z }
}

function project(xyzs) {
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
    const maxZ = K2 +R2+R1
    for (const p of projection) {
        for (const z of p) {
            // luminance range is 0 to texture length 
            // Texture.length / (maxZ / z)
            const i = Math.floor((TEXTURE.length - 1) / (maxZ / z))

            output += TEXTURE[i] + " "
        }
        output += "|\n"
    }
    return output
}
function revolve(dx,dy,dz) {
    const x = dx * (cos)
    return 
}
renderFrame(a,b) {
    // precompute
    const cosA = Math.cos(a)
    const sinA = Math.sin(a)
    const cosB = Math.cos(b)
    const sinB = Math.sin(b)

    const donut = donut()
    revolve(donut.x,donut.y,donut.z)
}

setInterval(function() {
    const output = project(donut())
    readline.cursorTo(process.stdout, 0, 0);
    process.stdout.cursorTo(0);
    process.stdout.write("\x1B[?25l")  // clear cursor
    process.stdout.write(output);
}, 500);
