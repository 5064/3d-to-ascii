#!/usr/bin/env node
const readline = require("readline")

const SCREEN_WIDTH = 50
const SCREEN_HEIGHT = 50
const R = 5  // radius
// distance between screen to object center z
let K2 = R
// K1 is distance between eye to screen z
const K1 = 2 / 5 * SCREEN_WIDTH;
// 仮想領域の奥行きの最大値 球3つ分とする
const SPACE_Z = R * 2 * 3
const TEXTURE = " .-~:!=+*o$@";

const INIT_V_THETA = -Math.PI/6  // 移動ベクトルのx軸方向の角度
const INIT_V_PHI = Math.PI/4  // 移動ベクトルのy軸方向の角度

const vector = {x:Math.cos(INIT_V_THETA),y:Math.sin(INIT_V_PHI), z: SPACE_Z/100}  // 移動単位ベクトル
const v = {x:0,y:0,z:K2}

const SPEED = 2  // 移動単位ベクトルの係数

function sphereSurface() {
    result = []
    for (let theta = 0; theta < Math.PI; theta += Math.PI / 100) {
        for (let phi = 0; phi < 2 * Math.PI; phi += Math.PI / 100) {
            // 3D polar coordinates
            let x = R * Math.sin(theta) * Math.cos(phi)
            let y = R * Math.sin(theta) * Math.sin(phi)
            let z = R * Math.cos(theta)
            result.push({ x:(x), y:(y), z: (z + v.z)})
        }
    }
    return result
}

function convertTo2d(xyz) {
    return { x: (K1 * xyz.x / (xyz.z + v.z))+v.x, y: (K1 * xyz.y / (xyz.z + v.z))+v.y, z: xyz.z }
}

function move() {
  v.x += vector.x * SPEED
  v.y += vector.y * SPEED
  v.z += vector.z * SPEED
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
    for (const p of projection) {
        for (const z of p) {
            // luminance range is 0 to texture length 
            // Texture.length / (maxZ / z)
            const i = Math.floor((TEXTURE.length - 1) / (SPACE_Z / z))

            output += TEXTURE[i] + " "
        }
        output += "|\n"
    }
    return output
}

setInterval(function() {
    const output = show(sphereSurface())
    readline.cursorTo(process.stdout, 0, 0);
    process.stdout.cursorTo(0);
    process.stdout.write("\x1B[?25l")  // clear cursor
    process.stdout.write(output);
    move()
}, 500);
