import { parentPort } from "worker_threads";
import { Jimp } from "jimp";
import { rgbaToInt } from "@jimp/utils";
import wt from "discrete-wavelets";
import pkg from "dct2";
const { DCT, IDCT } = pkg;

/* ---------- Image Utils ---------- */
async function imageToMatrix(buffer) {
  const img = await Jimp.read(buffer);

  img.bitmap.width !== 256 || img.bitmap.height !== 256
    ? img.resize({ w: 256, h: 256 })
    : null;
  img.greyscale(); // only grayscale

  const width = img.bitmap.width;
  const height = img.bitmap.height;

  // create 2D array
  let matrix = Array.from({ length: height }, () => Array(width).fill(0));

  img.scan(0, 0, width, height, function (x, y, idx) {
    matrix[y][x] = this.bitmap.data[idx]; // red channel = grayscale
  });

  // ensure even dimensions for DWT/DCT
  if (matrix.length % 2 !== 0) matrix.push(new Array(matrix[0].length).fill(0));
  matrix.forEach((row, i) => {
    if (row.length % 2 !== 0) row.push(0);
  });

  return matrix;
}

async function matrixToImage(matrix) {
  const height = matrix.length;
  const width = matrix[0].length;

  const img = await new Jimp({
    width,
    height,
    data: Buffer.alloc(width * height * 4, 0xff),
  });

  matrix.forEach((row, y) => {
    row.forEach((val, x) => {
      const gray = Math.max(0, Math.min(255, Math.round(val)));
      const color = rgbaToInt(gray, gray, gray, 255);
      img.setPixelColor(color, x, y);
    });
  });

  return await img.getBase64("image/png");
}

/* ---------- 2D DWT & IDWT ---------- */
function dwt2(matrix, wavelet = "haar") {
  // row-wise DWT
  const rowTransformed = matrix.map((row) => {
    const [approx, detail] = wt.dwt(row, wavelet);
    return [...approx, ...detail];
  });

  // column-wise DWT
  const cols = rowTransformed[0].map((_, colIndex) =>
    rowTransformed.map((row) => row[colIndex])
  );

  const colTransformed = cols.map((col) => {
    const [approx, detail] = wt.dwt(col, wavelet);
    return [...approx, ...detail];
  });

  // transpose back
  const final = colTransformed[0].map((_, i) =>
    colTransformed.map((col) => col[i])
  );
  return final;
}

function idwt2(matrix, wavelet = "haar") {
  const cols = matrix[0].map((_, colIndex) =>
    matrix.map((row) => row[colIndex])
  );

  const colInv = cols.map((col) => {
    const half = col.length / 2;
    return wt.idwt(col.slice(0, half), col.slice(half), wavelet);
  });

  const rowInv = colInv[0].map((_, i) => colInv.map((col) => col[i]));

  const final = rowInv.map((row) => {
    const half = row.length / 2;
    return wt.idwt(row.slice(0, half), row.slice(half), wavelet);
  });

  return final;
}

/* ---------- Stego Functions ---------- */
async function stegoEmbed(coverBuf, secretBuf) {
  const cover = await imageToMatrix(coverBuf);
  const secret = await imageToMatrix(secretBuf);

  const coverDWT = dwt2(cover);
  const secretDWT = dwt2(secret);

  const coverDCT = DCT(coverDWT);
  const secretDCT = DCT(secretDWT);

  const alpha = 0.1;
  const stegoDCT = coverDCT.map((row, i) =>
    row.map((v, j) => v + alpha * secretDCT[i][j])
  );

  const stegoDWT = IDCT(stegoDCT);
  const stego = idwt2(stegoDWT);

  return await matrixToImage(stego);
}

async function stegoExtract(stegoBuf, coverBuf) {
  const stego = await imageToMatrix(stegoBuf);
  const cover = await imageToMatrix(coverBuf);

  const stegoDWT = dwt2(stego);
  const coverDWT = dwt2(cover);

  const coverDCT = DCT(coverDWT);
  const stegoDCT = DCT(stegoDWT);

  const alpha = 0.1;
  const secretDCT = stegoDCT.map((row, i) =>
    row.map((v, j) => (v - coverDCT[i][j]) / alpha)
  );

  const secretDWT = IDCT(secretDCT);
  const secret = idwt2(secretDWT);

  return await matrixToImage(secret);
}

/* ---------- Worker Handler ---------- */
parentPort.on("message", async (task) => {
  try {
    if (task.type === "embed") {
      // Buffers might be transferred as Uint8Array, ensure Buffer
      const cover = Buffer.from(task.cover);
      const secret = Buffer.from(task.secret);
      const result = await stegoEmbed(cover, secret);
      parentPort.postMessage({ success: true, data: result });
    } else if (task.type === "extract") {
      const stego = Buffer.from(task.stego);
      const cover = Buffer.from(task.cover);
      const result = await stegoExtract(stego, cover);
      parentPort.postMessage({ success: true, data: result });
    } else {
      parentPort.postMessage({ success: false, error: "Unknown task type" });
    }
  } catch (error) {
    console.error("Worker Error:", error);
    parentPort.postMessage({ success: false, error: error.message });
  }
});
