export const applyEdgeDetection = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  settings: { threshold: number; mix: number }
) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const out = ctx.createImageData(width, height);
  const outData = out.data;

  const threshold = settings.threshold;

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const i = (y * width + x) * 4;

      // Simple gradient calculation
      const left = ((y * width + (x - 1)) * 4);
      const right = ((y * width + (x + 1)) * 4);
      const top = (((y - 1) * width + x) * 4);
      const bottom = (((y + 1) * width + x) * 4);

      const gx = (data[right] + data[right+1] + data[right+2]) - (data[left] + data[left+1] + data[left+2]);
      const gy = (data[bottom] + data[bottom+1] + data[bottom+2]) - (data[top] + data[top+1] + data[top+2]);

      const mag = Math.sqrt(gx * gx + gy * gy);
      const edge = mag > threshold ? 255 : 0;

      if (settings.mix >= 1) {
        outData[i] = 0;
        outData[i + 1] = edge; // Neon green edges
        outData[i + 2] = 0;
      } else {
        outData[i] = data[i] * (1 - settings.mix) + 0;
        outData[i + 1] = data[i+1] * (1 - settings.mix) + edge * settings.mix;
        outData[i + 2] = data[i+2] * (1 - settings.mix) + 0;
      }
      outData[i + 3] = 255;
    }
  }

  ctx.putImageData(out, 0, 0);
};
