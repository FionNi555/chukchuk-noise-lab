export const applyPixelate = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  settings: { size: number }
) => {
  const pixelSize = Math.max(1, Math.floor(settings.size));
  if (pixelSize <= 1) return;

  // Create temporary canvas for scaling
  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) return;

  const w = Math.ceil(width / pixelSize);
  const h = Math.ceil(height / pixelSize);

  tempCanvas.width = w;
  tempCanvas.height = h;

  // Draw current canvas content to temp at small scale
  tempCtx.drawImage(ctx.canvas, 0, 0, width, height, 0, 0, w, h);

  // Draw back to main canvas scaled up
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(tempCanvas, 0, 0, w, h, 0, 0, width, height);
  ctx.restore();
};
