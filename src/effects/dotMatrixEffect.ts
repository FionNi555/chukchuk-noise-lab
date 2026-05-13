import { hexToRgb } from '../lib/utils';

export const applyDotMatrix = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  settings: { 
    size: number; 
    spacing: number; 
    shape: string;
    colorMode: string;
  }
) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const pixels = imageData.data;
  
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, width, height);
  
  const step = Math.max(1, settings.size + settings.spacing);
  
  const themes: Record<string, string> = {
    green: '#0f0',
    white: '#fff',
    amber: '#ffb000',
    cyan: '#00ffff'
  };
  const themeColor = themes[settings.colorMode] || '#0f0';
  const baseColor = themeColor.startsWith('#') ? hexToRgb(themeColor) : {r: 0, g: 255, b: 0};

  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const idx = (Math.floor(y) * width + Math.floor(x)) * 4;
      const r = pixels[idx];
      const g = pixels[idx + 1];
      const b = pixels[idx + 2];
      const brightness = (r + g + b) / 3;
      
      const dotSize = (brightness / 255) * settings.size;
      
      if (settings.colorMode === 'rgb') {
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      } else {
        const factor = brightness / 255;
        ctx.fillStyle = `rgb(${baseColor.r * factor}, ${baseColor.g * factor}, ${baseColor.b * factor})`;
      }
      
      ctx.beginPath();
      if (settings.shape === 'circle') {
        ctx.arc(x + step/2, y + step/2, dotSize/2, 0, Math.PI * 2);
      } else {
        ctx.rect(x + (step - dotSize)/2, y + (step - dotSize)/2, dotSize, dotSize);
      }
      ctx.fill();
    }
  }
};
