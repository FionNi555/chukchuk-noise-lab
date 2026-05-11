export const getAsciiText = (
  canvas: HTMLCanvasElement,
  settings: { 
    fontSize: number; 
    charset: string;
    customCharset: string;
    brightnessOffset: number;
  }
) => {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return '';
  
  const { width, height } = canvas;
  const imageData = ctx.getImageData(0, 0, width, height);
  const pixels = imageData.data;
  
  let chars = '@#S%?*+;:,..';
  if (settings.charset === 'kana') {
    chars = 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん';
  } else if (settings.charset === 'emoji') {
    chars = '😀😁😂🤣😃😄😅😆😉😊😋😎😍😘🥰';
  } else if (settings.charset === 'binary') {
    chars = '01';
  } else if (settings.charset === 'custom') {
    chars = settings.customCharset || ' ';
  }

  const step = Math.max(4, Math.floor(settings.fontSize * 0.8));
  let output = '';
  
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const idx = (y * width + x) * 4;
      const r = pixels[idx];
      const g = pixels[idx + 1];
      const b = pixels[idx + 2];
      const brightness = Math.min(255, Math.max(0, ((r + g + b) / 3) + (settings.brightnessOffset * 255)));
      
      const charIdx = Math.floor((brightness / 255) * (chars.length - 1));
      const char = chars[charIdx];
      output += char ?? ' ';
    }
    output += '\n';
  }
  
  return output;
};
