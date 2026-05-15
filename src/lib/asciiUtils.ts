export const getAsciiText = (
  source: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement,
  settings: { 
    fontSize: number; 
    charset: string;
    customCharset: string;
    brightnessOffset: number;
    contrast?: number;
  }
) => {
  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
  if (!tempCtx) return '';
  
  let width = 0;
  let height = 0;
  
  if (source instanceof HTMLVideoElement) {
    width = source.videoWidth;
    height = source.videoHeight;
  } else if (source instanceof HTMLImageElement) {
    width = source.naturalWidth;
    height = source.naturalHeight;
  } else {
    width = source.width;
    height = source.height;
  }

  if (width === 0 || height === 0) return '';

  // Resize for processing speed and better text mapping
  const scale = Math.min(1, 400 / Math.max(width, height));
  tempCanvas.width = width * scale;
  tempCanvas.height = height * scale;
  
  tempCtx.drawImage(source, 0, 0, tempCanvas.width, tempCanvas.height);
  const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
  const pixels = imageData.data;
  
  const CHARSETS: Record<string, string> = {
    standard: ' .:-=+*#%@',
    blocks: ' ░▒▓█',
    braille: ' ⠁⠃⠇⠧⠷⠿',
    kana: ' .·:;+*?%S#@',
    emoji: ' ✨🌟⭐💫',
    binary: ' 01',
    custom: ' ' + (settings.customCharset || ''),
  };

  const chars = CHARSETS[settings.charset] || CHARSETS.standard;

  // Calculate sampling step based on char density
  const charAspectRatio = 0.5; // Monospace usually 1:2
  const stepX = 4;
  const stepY = stepX / charAspectRatio;
  
  let output = '';
  const contrast = settings.contrast ?? 1;

  for (let y = 0; y < tempCanvas.height; y += stepY) {
    for (let x = 0; x < tempCanvas.width; x += stepX) {
      const idx = (Math.floor(y) * tempCanvas.width + Math.floor(x)) * 4;
      const r = pixels[idx];
      const g = pixels[idx + 1];
      const b = pixels[idx + 2];
      
      // Calculate brightness with luminosity formula
      let brightness = (0.299 * r + 0.587 * g + 0.114 * b) + (settings.brightnessOffset * 255);
      brightness = ((brightness - 128) * contrast) + 128;
      brightness = Math.min(255, Math.max(0, brightness));
      
      const charIdx = Math.floor((brightness / 255) * (chars.length - 1));
      const char = chars[charIdx];
      output += char ?? ' ';
    }
    output += '\n';
  }
  
  return output;
};
