export const applyDither = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  settings: { type: 'bayer' | 'random' | 'atkinson' | 'floyd-steinberg'; levels: number }
) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  if (settings.type === 'bayer' || settings.type === 'random') {
    const bayerThresholdMap = [
      [  0, 128,  32, 160 ],
      [ 192,  64, 224,  96 ],
      [  48, 176,  16, 144 ],
      [ 240, 112, 208,  80 ]
    ];

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        const grey = (data[i] + data[i+1] + data[i+2]) / 3;
        
        let threshold = 128;
        if (settings.type === 'bayer') {
          threshold = bayerThresholdMap[y % 4][x % 4];
        } else {
          threshold = Math.random() * 255;
        }

        const val = grey > threshold ? 255 : 0;
        data[i] = 0; data[i+1] = val; data[i+2] = 0;
      }
    }
  } else {
    // Error Diffusion Dithering
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        const oldPixel = (data[i] + data[i+1] + data[i+2]) / 3;
        const newPixel = oldPixel > 128 ? 255 : 0;
        const error = oldPixel - newPixel;

        data[i] = 0; data[i+1] = newPixel; data[i+2] = 0;

        if (settings.type === 'floyd-steinberg') {
          distributeError(data, x + 1, y, width, height, error * 7/16);
          distributeError(data, x - 1, y + 1, width, height, error * 3/16);
          distributeError(data, x, y + 1, width, height, error * 5/16);
          distributeError(data, x + 1, y + 1, width, height, error * 1/16);
        } else if (settings.type === 'atkinson') {
          distributeError(data, x + 1, y, width, height, error / 8);
          distributeError(data, x + 2, y, width, height, error / 8);
          distributeError(data, x - 1, y + 1, width, height, error / 8);
          distributeError(data, x, y + 1, width, height, error / 8);
          distributeError(data, x + 1, y + 1, width, height, error / 8);
          distributeError(data, x, y + 2, width, height, error / 8);
        }
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
};

function distributeError(data: Uint8ClampedArray, x: number, y: number, width: number, height: number, error: number) {
  if (x < 0 || x >= width || y < 0 || y >= height) return;
  const i = (y * width + x) * 4;
  const val = (data[i] + data[i+1] + data[i+2]) / 3 + error;
  data[i] = data[i+1] = data[i+2] = Math.min(255, Math.max(0, val));
}
