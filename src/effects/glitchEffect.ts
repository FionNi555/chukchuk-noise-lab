export const applyGlitch = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  settings: { amount: number; speed: number }
) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const pixels = imageData.data;
  
  const intensity = settings.amount * 50;
  
  for (let i = 0; i < intensity; i++) {
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);
    const w = Math.max(1, Math.floor(Math.random() * width * settings.amount));
    const h = Math.max(1, Math.floor(Math.random() * 10 * settings.amount));
    
    // Ensure we stay within bounds for getImageData
    const actualW = Math.min(w, width - x);
    const actualH = Math.min(h, height - y);
    
    if (actualW <= 0 || actualH <= 0) continue;

    const slice = ctx.getImageData(x, y, actualW, actualH);
    const offset = (Math.random() - 0.5) * 40 * settings.amount;
    
    ctx.putImageData(slice, Math.min(width - actualW, Math.max(0, x + offset)), y);
    
    if (Math.random() > 0.8) {
      ctx.fillStyle = `rgba(0, 255, 65, ${Math.random() * 0.2})`;
      ctx.fillRect(x, y, w, h);
    }
  }
};
