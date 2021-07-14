#!/usr/bin/env node
const SCREEN_WIDTH = 40
const SCREEN_HEIGHT = 40
const K1 = 2
const K2 = 4

function sphereSurface() {
    result = []
    for (let theta = 0; theta < Math.PI; theta += Math.PI / 200) {
        for (let phi = 0; phi < 2 * Math.PI; phi += Math.PI / 200) {
            let x = 5 * Math.sin(theta) * Math.cos(phi)
            let y = 5 * Math.sin(theta) * Math.sin(phi)
            let z = 5 * Math.cos(theta) + K2
            result.push({ x: x, y: y, z: z })
        }
    }
    return result
}

function convertTo2d(xyz) {
    return { x: (K1 * xyz.x / (xyz.z + K2)), y: (K1 * xyz.y / (xyz.z + K2)), z: xyz.z }
}

function mapping(xyzs) {
    const xys = xyzs.map(xyz => convertTo2d(xyz))
    const xo = SCREEN_WIDTH / 2
    const yo = SCREEN_HEIGHT / 2
    let view = []
    for (var i = 0; i < SCREEN_HEIGHT; i++) {
        view[i] = [];
        for (var j = 0; j < SCREEN_WIDTH; j++) {
            view[i][j] = " ";
        }
    }
    for (const xy of xys) {
        let xi = Math.floor(xy.x * 10) + xo
        let yi = Math.floor(xy.y * 10) + yo
        if (view[yi][xi] < Math.floor(xy.z)) {
            view[yi][xi] = Math.floor(xy.z)
        }
    }
    console.log(view.map(p => p.join(" ")).join("\n"))
}

const coordinates = sphereSurface()
mapping(coordinates)
