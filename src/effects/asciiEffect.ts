import { hexToRgb } from '../lib/utils';

export const applyAscii = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  settings: { 
    density: number; 
    fontSize: number; 
    colorMode: 'green' | 'white' | 'rgb' | 'amber' | 'cyan';
    charset: 'standard' | 'blocks' | 'braille' | 'kana' | 'emoji' | 'binary' | 'custom';
    fontFamily: string;
    customCharset: string;
    invert: boolean;
    brightnessOffset: number;
    contrast: number;
    transparent: boolean;
    backgroundColor: string;
    overlay: 'none' | 'clear' | 'blur';
    overlayIntensity: number;
    lineHeight: number;
    charSpacing: number;
  },
  media: HTMLImageElement | HTMLVideoElement | null
) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const pixels = imageData.data;
  
  if (settings.overlay === 'none') {
    if (!settings.transparent) {
      ctx.fillStyle = settings.backgroundColor;
      ctx.fillRect(0, 0, width, height);
    } else {
      ctx.clearRect(0, 0, width, height);
    }
  } else if (settings.overlay === 'blur') {
    ctx.save();
    // Blur strength based on intensity
    const blurAmount = settings.overlayIntensity * 20;
    const brightness = 1 - (settings.overlayIntensity * 0.5);
    ctx.filter = `blur(${blurAmount}px) brightness(${brightness})`;
    if (media) ctx.drawImage(media, 0, 0, width, height);
    ctx.restore();
  } else if (settings.overlay === 'clear') {
    ctx.save();
    // Keep it clear but allow dimming/opacity
    ctx.globalAlpha = settings.overlayIntensity;
    if (media) ctx.drawImage(media, 0, 0, width, height);
    ctx.restore();
  }
  
  const themes: Record<string, string> = {
    green: '#0f0',
    white: '#fff',
    amber: '#ffb000',
    cyan: '#00ffff'
  };

  const themeColor = themes[settings.colorMode] || '#0f0';
  const baseColor = themeColor.startsWith('#') ? hexToRgb(themeColor) : {r: 0, g: 255, b: 0};

  const CHARSETS: Record<string, string> = {
    standard: ' .:-=+*#%@',
    blocks: ' ░▒▓█',
    braille: ' ⠁⠃⠇⠧⠷⠿',
    kana: ' .·:;+*?%S#@',
    emoji: ' ✨🌟⭐💫',
    binary: ' 01',
    custom: ' ' + settings.customCharset,
  };

  const fonts: Record<string, string> = {
    monospace: 'monospace',
    serif: 'serif',
    'system-ui': 'system-ui',
    retro: '"Courier New", Courier, monospace',
    pixel: '"VT323", monospace'
  };

  let chars = CHARSETS[settings.charset] || CHARSETS.standard;
  const fontFace = fonts[settings.fontFamily] || 'monospace';
  
  const charWidth = settings.fontSize * 0.6 + settings.charSpacing;
  const charHeight = settings.fontSize * settings.lineHeight;

  ctx.font = `${settings.fontSize}px ${fontFace}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  for (let y = 0; y < height; y += charHeight) {
    for (let x = 0; x < width; x += charWidth) {
      // Sample center pixels for better representation
      const px = Math.min(width - 1, Math.floor(x));
      const py = Math.min(height - 1, Math.floor(y));
      const idx = (py * width + px) * 4;
      
      const r = pixels[idx];
      const g = pixels[idx + 1];
      const b = pixels[idx + 2];
      
      // Better brightness calculation (luminosity)
      let brightness = (0.299 * r + 0.587 * g + 0.114 * b) + (settings.brightnessOffset * 255);
      
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
