export const applyGlitch = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  settings: { amount: number; speed: number }
) => {
  if (settings.amount <= 0) return;
  
  const intensity = Math.floor(settings.amount * 50);
  
  for (let i = 0; i < intensity; i++) {
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);
    const w = Math.max(1, Math.floor(Math.random() * width * settings.amount));
    const h = Math.max(1, Math.floor(Math.random() * 10 * settings.amount));
    
    // Ensure we stay within bounds for drawImage
    const actualW = Math.min(w, width - x);
    const actualH = Math.min(h, height - y);
    
    if (actualW <= 0 || actualH <= 0) continue;

    const offset = (Math.random() - 0.5) * 40 * settings.amount;
    const targetX = Math.min(width - actualW, Math.max(0, x + offset));
    
    // Use drawImage instead of getImageData for massive performance boost
    ctx.drawImage(ctx.canvas, x, y, actualW, actualH, targetX, y, actualW, actualH);
    
    if (Math.random() > 0.8) {
      ctx.fillStyle = `rgba(0, 255, 65, ${Math.random() * 0.2})`;
      ctx.fillRect(x, y, w, h);
    }
  }
};
