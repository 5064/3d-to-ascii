const readline = require("readline");

const SCREEN_WIDTH = 60;
const SCREEN_HEIGHT = 60;
const R1 = 1; // The donut thickness
const R2 = 2; // radius from K2 to R1
// distance between screen to object center z
const K2 = 5;
// K1 is distance between eye to screen z
const K1 = (SCREEN_WIDTH * K2 * 1) / (5 * (R1 + R2));

const TEXTURE = ".,-~:=!*o#$@";

const donut = (A, B) => {
  // precompute
  const cosA = Math.cos(A);
  const sinA = Math.sin(A);
  const cosB = Math.cos(B);
  const sinB = Math.sin(B);
  let output = [];
  for (let i = 0; i < SCREEN_HEIGHT; i++) {
    output[i] = [];
    for (let j = 0; j < SCREEN_WIDTH; j++) {
      output[i][j] = " ";
    }
  }
  let zBuffer = [];
  for (let i = 0; i < SCREEN_HEIGHT; i++) {
    zBuffer[i] = [];
    for (let j = 0; j < SCREEN_WIDTH; j++) {
      zBuffer[i][j] = 0;
    }
  }
  for (let theta = 0; theta < 2 * Math.PI; theta += Math.PI / 100) {
    // precompute
    const cosT = Math.cos(theta);
    const sinT = Math.sin(theta);
    for (let phi = 0; phi < 2 * Math.PI; phi += Math.PI / 100) {
      // precompute
      const cosP = Math.cos(phi);
      const sinP = Math.sin(phi);
      // precompute circle
      const circleX = R2 + R1 * cosT;
      const circleY = R1 * sinT;
      // Donut shaped surface coordinate before revolving
      //   const x = circleX * cosP;
      //   const y = circleY;
      //   const z = -circleX * sinP + K2;

      // Revolve a donut
      const x =
        circleX * (cosB * cosP + sinA * sinB * sinP) - circleY * cosA * sinB;
      const y =
        circleX * (sinB * cosP - sinA * cosB * sinP) + circleY * cosA * cosB;
      const z = K2 + cosA * circleX * sinP + circleY * sinA;
      const ooz = 1 / z; // one over z

      // x and y projection.
      const xp = Math.round(SCREEN_WIDTH / 2 + K1 * ooz * x);
      const yp = Math.round(SCREEN_HEIGHT / 2 - K1 * ooz * y);

      // calculate luminance
      const l =
        cosP * cosT * sinB -
        cosA * cosT * sinP -
        sinA * sinT +
        cosB * (cosA * sinT - cosT * sinA * sinP);
      if (l > 0) {
        if (ooz > zBuffer[yp][xp]) {
          zBuffer[yp][xp] = ooz;
          const luminance_index = Math.round(l * 8);
          output[yp][xp] = TEXTURE[luminance_index];
        }
      }
    }
  }
  return project(output);
};
const project = (output) => {
  let result = "";
  for (const p of output) {
    for (const z of p) {
      result += z;
    }
    result += "|\n";
  }
  return result;
};

let A = 0; // rotate x-axis by A
let B = 0; // rotate z-axis by B
setInterval(() => {
  const output = donut(A, B);
  readline.cursorTo(process.stdout, 0, 0);
  process.stdout.cursorTo(0);

  process.stdout.write(output);
  process.stdout.write("\x1B[H"); // clear cursor
  A += 0.037;
  B += 0.011;
}, 1000 / 60);
