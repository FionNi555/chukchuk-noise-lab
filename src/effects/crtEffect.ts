export const applyCrt = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  settings: { scanlines: boolean; curvature: number; noise: number }
) => {
  // 1. Noise
  if (settings.noise > 0) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const pixels = imageData.data;
    for (let i = 0; i < pixels.length; i += 4) {
      const noise = (Math.random() - 0.5) * settings.noise * 255;
      pixels[i] += noise;
      pixels[i+1] += noise;
      pixels[i+2] += noise;
    }
    ctx.putImageData(imageData, 0, 0);
  }

  // 2. Scanlines
  if (settings.scanlines) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    for (let y = 0; y < height; y += 4) {
      ctx.fillRect(0, y, width, 1);
    }
  }

  // 3. Vignette
  const gradient = ctx.createRadialGradient(
    width / 2, height / 2, width / 4,
    width / 2, height / 2, width / 1.5
  );
  gradient.addColorStop(0, 'rgba(0,0,0,0)');
  gradient.addColorStop(1, 'rgba(0,0,0,0.5)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
};
