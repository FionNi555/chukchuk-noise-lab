export const applyMotionBlur = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  tempCanvas: HTMLCanvasElement,
  settings: { trail: number }
) => {
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) return;

  // We draw the current frame on top of the previous frame with low opacity
  // To achieve trails, we actually want to keep the old contents and fade them
  
  // 1. Fade old content slightly
  tempCtx.fillStyle = `rgba(0, 0, 0, ${1 - settings.trail})`;
  tempCtx.fillRect(0, 0, width, height);
  
  // 2. Composite current frame
  tempCtx.globalCompositeOperation = 'lighter';
  tempCtx.drawImage(ctx.canvas, 0, 0);
  tempCtx.globalCompositeOperation = 'source-over';
  
  // 3. Draw back to main canvas
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(tempCanvas, 0, 0);
};
