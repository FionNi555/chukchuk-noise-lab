import { hexToRgb } from '../lib/utils';

export const applyAscii = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  settings: { 
    density: number; 
    fontSize: number; 
    colorMode: string;
    charset: 'standard' | 'kana' | 'emoji' | 'binary' | 'custom';
    customCharset: string;
    invert: boolean;
    brightnessOffset: number;
    contrast: number;
    transparent: boolean;
  }
) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const pixels = imageData.data;
  
  const themes: Record<string, string> = {
    green: '#0f0',
    white: '#fff',
    amber: '#ffb000',
    cyan: '#00ffff'
  };

  const themeColor = themes[settings.colorMode] || '#0f0';
  const baseColor = themeColor.startsWith('#') ? hexToRgb(themeColor) : {r: 0, g: 255, b: 0};

  if (!settings.transparent) {
    const bgColor = settings.invert ? themeColor : '#000';
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);
  } else {
    // Clear canvas for transparency
    ctx.clearRect(0, 0, width, height);
  }
  
  let chars = ' .:-=+*#%@';
  if (settings.charset === 'kana') {
    chars = ' .·:;+*?%S#@'; // Use standard for now as base
  } else if (settings.charset === 'emoji') {
    chars = ' ✨🌟⭐💫✨🌟⭐💫✨🌟⭐💫'; // Better emoji ramp
  } else if (settings.charset === 'binary') {
    chars = ' 1';
  } else if (settings.charset === 'custom') {
    chars = ' ' + settings.customCharset;
  } else if (settings.density <= 0.5) {
    chars = ' ░▒▓█';
  }

  const step = Math.max(4, Math.floor(settings.fontSize * 0.8));
  ctx.font = `${settings.fontSize}px monospace`;
  
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const idx = (y * width + x) * 4;
      const r = pixels[idx];
      const g = pixels[idx + 1];
      const b = pixels[idx + 2];
      
      // Calculate brightness with offset
      let brightness = ((r + g + b) / 3) + (settings.brightnessOffset * 255);
      
      // Apply contrast
      brightness = ((brightness - 128) * settings.contrast) + 128;
      brightness = Math.min(255, Math.max(0, brightness));
      
      const charIdx = Math.floor((brightness / 255) * (chars.length - 1));
      const char = chars[charIdx];
      
      if (settings.invert) {
        ctx.fillStyle = '#000';
      } else {
        if (settings.colorMode === 'rgb') {
          ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        } else {
          // Apply theme color relative to brightness
          const factor = brightness / 255;
          ctx.fillStyle = `rgb(${baseColor.r * factor}, ${baseColor.g * factor}, ${baseColor.b * factor})`;
        }
      }
      
      ctx.fillText(char ?? '', x, y);
    }
  }
};
