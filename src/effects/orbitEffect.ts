import { hexToRgb } from '../lib/utils';

export const applyOrbitEffect = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  settings: {
    count: number;
    radius: number;
    speed: number;
    size: number;
    colorMode: 'green' | 'white' | 'rgb' | 'amber' | 'cyan';
  }
) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const pixels = imageData.data;
  
  ctx.clearRect(0, 0, width, height);
  
  const themes: Record<string, string> = {
    green: '#0f0',
    white: '#fff',
    amber: '#ffb000',
    cyan: '#00ffff'
  };
  const themeColor = themes[settings.colorMode] || '#0f0';
  const baseColor = themeColor.startsWith('#') ? hexToRgb(themeColor) : {r: 0, g: 255, b: 0};

  const time = performance.now() * 0.001 * settings.speed;
  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = Math.min(width, height) * settings.radius;

  for (let i = 0; i < settings.count; i++) {
    const angle = (i / settings.count) * Math.PI * 2 + time;
    const r = maxRadius * (0.5 + 0.5 * Math.sin(angle * 3 + time));
    
    const x = Math.floor(centerX + Math.cos(angle) * r);
    const y = Math.floor(centerY + Math.sin(angle) * r);

    if (x >= 0 && x < width && y >= 0 && y < height) {
      const idx = (y * width + x) * 4;
      const pr = pixels[idx];
      const pg = pixels[idx + 1];
      const pb = pixels[idx + 2];
      const brightness = (pr + pg + pb) / 3;

      if (brightness < 40) continue;

      if (settings.colorMode === 'rgb') {
        ctx.fillStyle = `rgb(${pr}, ${pg}, ${pb})`;
      } else {
        const factor = brightness / 255;
        ctx.fillStyle = `rgb(${baseColor.r * factor}, ${baseColor.g * factor}, ${baseColor.b * factor})`;
      }

      const size = (brightness / 255) * settings.size;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
};
