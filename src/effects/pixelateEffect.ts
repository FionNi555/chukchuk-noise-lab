export const applyPixelate = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  settings: { size: number }
) => {
  const pixelSize = Math.max(1, Math.floor(settings.size));
  const imageData = ctx.getImageData(0, 0, width, height);
  const pixels = imageData.data;

  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, width, height);

  for (let y = 0; y < height; y += pixelSize) {
    for (let x = 0; x < width; x += pixelSize) {
      const i = (y * width + x) * 4;
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const a = pixels[i + 3];

      ctx.fillStyle = `rgba(${r},${g},${b},${a / 255})`;
      ctx.fillRect(x, y, pixelSize, pixelSize);
    }
  }
};
