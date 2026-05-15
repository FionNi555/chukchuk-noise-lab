export const applyMotionBlur = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  tempCanvas: HTMLCanvasElement,
  settings: { trail: number; intensity: number; mode: 'linear' | 'radial' | 'zoom' | 'wave' }
) => {
  const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
  if (!tempCtx) return;

  const mode = settings.mode || 'linear';
  const trail = Math.max(0.1, Math.min(0.99, settings.trail)); 
  const intensity = settings.intensity || 1.0;

  // 1. First, we capture a copy of the current accumulated buffer to transform it
  // We can just use the tempCanvas as its own source if we are careful
  
  tempCtx.save();
  
  // Fade the previous content slightly
  tempCtx.globalCompositeOperation = 'copy';
  tempCtx.globalAlpha = trail;

  if (mode === 'zoom') {
    const scale = 1.0 + (0.005 * intensity);
    const w = width * scale;
    const h = height * scale;
    const x = (width - w) / 2;
    const y = (height - h) / 2;
    tempCtx.drawImage(tempCanvas, x, y, w, h);
  } else if (mode === 'radial') {
    const rotation = 0.003 * intensity;
    tempCtx.translate(width / 2, height / 2);
    tempCtx.rotate(rotation);
    tempCtx.translate(-width / 2, -height / 2);
    tempCtx.drawImage(tempCanvas, 0, 0);
  } else if (mode === 'wave') {
    const dx = Math.sin(performance.now() * 0.002) * 2 * intensity;
    const dy = Math.cos(performance.now() * 0.003) * 2 * intensity;
    tempCtx.drawImage(tempCanvas, dx, dy);
  } else {
    // Linear / Motion
    const shift = 2 * intensity;
    tempCtx.drawImage(tempCanvas, shift, 0);
  }
  
  tempCtx.restore();

  // 2. Blend in the NEW frame from the main canvas
  // We use a small alpha so the trails persist longer than the current frame
  tempCtx.globalAlpha = 1.0 - trail; 
  tempCtx.globalCompositeOperation = 'source-over';
  tempCtx.drawImage(ctx.canvas, 0, 0);

  // 3. Draw final accumulated result back to main canvas
  ctx.save();
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(tempCanvas, 0, 0);
  ctx.restore();
};
