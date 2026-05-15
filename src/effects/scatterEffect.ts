import { hexToRgb } from '../lib/utils';

export const applyScatterEffect = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  settings: {
    amount: number;
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

  const particleCount = Math.floor(width * height * 0.01 * settings.amount);
  
  for (let i = 0; i < particleCount; i++) {
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);
    const idx = (y * width + x) * 4;
    
    const r = pixels[idx];
    const g = pixels[idx + 1];
    const b = pixels[idx + 2];
    const brightness = (r + g + b) / 3;

    if (brightness < 20) continue;

    if (settings.colorMode === 'rgb') {
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    } else {
      const factor = brightness / 255;
      ctx.fillStyle = `rgb(${baseColor.r * factor}, ${baseColor.g * factor}, ${baseColor.b * factor})`;
    }

    const size = (brightness / 255) * settings.size;
    ctx.fillRect(x - size / 2, y - size / 2, size, size);
  }
};
