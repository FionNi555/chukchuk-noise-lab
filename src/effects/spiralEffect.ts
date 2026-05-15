import { hexToRgb } from '../lib/utils';

export const applySpiralEffect = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  settings: {
    revolutions: number;
    spacing: number;
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
  
  const totalPoints = 5000;

  for (let i = 0; i < totalPoints; i++) {
    const t = i / totalPoints;
    const angle = t * Math.PI * 2 * settings.revolutions + time;
    const radius = t * Math.min(width, height) / 2;
    
    const x = Math.floor(centerX + Math.cos(angle) * radius);
    const y = Math.floor(centerY + Math.sin(angle) * radius);

    if (x >= 0 && x < width && y >= 0 && y < height) {
      const idx = (y * width + x) * 4;
      const pr = pixels[idx];
      const pg = pixels[idx + 1];
      const pb = pixels[idx + 2];
      const brightness = (pr + pg + pb) / 3;

      if (brightness < 30) continue;

      if (settings.colorMode === 'rgb') {
        ctx.fillStyle = `rgb(${pr}, ${pg}, ${pb})`;
      } else {
        const factor = brightness / 255;
        ctx.fillStyle = `rgb(${baseColor.r * factor}, ${baseColor.g * factor}, ${baseColor.b * factor})`;
      }

      const size = (brightness / 255) * settings.size;
      ctx.fillRect(x - size / 2, y - size / 2, size, size);
    }
  }
};
