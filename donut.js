#!/usr/bin/env node

const readline = require("readline");

const SCREEN_WIDTH = 80;
const SCREEN_HEIGHT = 50;
const R1 = 1; // The donut thickness
const R2 = 2; // radius from K2 to R1
// distance between screen to object center z
const K2 = 3;
// K1 is distance between eye to screen z
const K1 = (SCREEN_WIDTH * K2 * 3) / (8 * (R1 + R2));

const TEXTURE = " .-~:!=+*o$@";

const output = [];
for (var i = 0; i < SCREEN_HEIGHT; i++) {
  output[i] = [];
  for (var j = 0; j < SCREEN_WIDTH; j++) {
    output[i][j] = 0;
  }
}

const donut = () => {
  result = [];
  for (let theta = 0; theta < 2 * Math.PI; theta += Math.PI / 50) {
    // precompute
    const cosT = Math.cos(theta);
    const sinT = Math.sin(theta);
    for (let phi = 0; phi < 2 * Math.PI; phi += Math.PI / 50) {
      // precompute
      const cosP = Math.cos(phi);
      const sinP = Math.sin(phi);
      // precompute circle
      const circleX = R2 + R1 * cosT;
      const circleY = R1 * sinT;
      // Donut shaped surface coordinate before revolving
      let x = circleX * cosP;
      let y = circleY;
      let z = -circleX * sinP + K2;
      // const revolved = this.revolve({ x, y, z })
      const converted = convertTo2d({ x, y, z });
      project(convertTo2d);
    }
  }
};

const convertTo2d = (xyz) => {
  return {
    x: (K1 * xyz.x) / (xyz.z + K2),
    y: (K1 * xyz.y) / (xyz.z + K2),
    z: xyz.z,
  };
};

const project = (xyz) => {
  // x and y projection.
  let xp = SCREEN_WIDTH / 2 + Math.floor(xy.x);
  let yp = SCREEN_HEIGHT / 2 + Math.floor(xy.y);
  if (projection[yp][xp] < xy.z) {
    projection[yp][xp] = xy.z;
  }
  let output = "";
  const maxZ = K2 + R2 + R1;
  for (const p of projection) {
    for (const z of p) {
      // luminance range is 0 to texture length
      // Texture.length / (maxZ / z)
      const i = Math.floor((TEXTURE.length - 1) / (maxZ / z));

      output += TEXTURE[i] + " ";
    }
    output += "|\n";
  }
  return output;
};

// setInterval(() => {
//     const output = project(donut())
//     readline.cursorTo(process.stdout, 0, 0);
//     process.stdout.cursorTo(0);
//     process.stdout.write("\x1B[?25l")  // clear cursor
//     process.stdout.write(output);
// }, 500);
