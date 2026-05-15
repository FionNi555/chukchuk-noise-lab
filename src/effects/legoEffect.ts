import { hexToRgb } from '../lib/utils';

export const applyLegoEffect = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  settings: {
    size: number;
    colorMode: 'green' | 'white' | 'rgb' | 'amber' | 'cyan';
  }
) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const pixels = imageData.data;
  
  ctx.clearRect(0, 0, width, height);
  
  const size = settings.size;
  const themes: Record<string, string> = {
    green: '#0f0',
    white: '#fff',
    amber: '#ffb000',
    cyan: '#00ffff'
  };
  const themeColor = themes[settings.colorMode] || '#0f0';
  const baseColor = themeColor.startsWith('#') ? hexToRgb(themeColor) : {r: 0, g: 255, b: 0};

  for (let y = 0; y < height; y += size) {
    for (let x = 0; x < width; x += size) {
      const idx = (Math.floor(y) * width + Math.floor(x)) * 4;
      const r = pixels[idx];
      const g = pixels[idx + 1];
      const b = pixels[idx + 2];
      const brightness = (r + g + b) / 3;

      if (settings.colorMode === 'rgb') {
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      } else {
        const factor = brightness / 255;
        ctx.fillStyle = `rgb(${baseColor.r * factor}, ${baseColor.g * factor}, ${baseColor.b * factor})`;
      }

      // Main brick
      ctx.fillRect(x + 0.5, y + 0.5, size - 1, size - 1);
      
      // Stud (the little circle on top)
      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2, size / 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.fill();
      
      // Shadow for depth
      ctx.strokeStyle = 'rgba(0,0,0,0.3)';
      ctx.strokeRect(x + 0.5, y + 0.5, size - 1, size - 1);
    }
  }
};
