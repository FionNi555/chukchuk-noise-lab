export const applyRgbSplit = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  settings: { offset: number }
) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const { data } = imageData;
  const out = ctx.createImageData(width, height);
  const outData = out.data;

  const offset = Math.floor(settings.offset);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;

      // Red channel shifted left
      const redIdx = (y * width + Math.max(0, x - offset)) * 4;
      outData[i] = data[redIdx];

      // Green channel original
      outData[i + 1] = data[i + 1];

      // Blue channel shifted right
      const blueIdx = (y * width + Math.min(width - 1, x + offset)) * 4;
      outData[i + 2] = data[blueIdx];

      outData[i + 3] = data[i + 3];
    }
  }

  ctx.putImageData(out, 0, 0);
};
