export const applyAscii = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  settings: { 
    density: number; 
    fontSize: number; 
    colorMode: string;
    charset: 'standard' | 'kana' | 'emoji' | 'binary';
    brightnessOffset: number;
  }
) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const pixels = imageData.data;
  
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, width, height);
  
  let chars = '@#S%?*+;:,..';
  if (settings.charset === 'kana') {
    chars = 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん';
  } else if (settings.charset === 'emoji') {
    chars = '😀😁😂🤣😃😄😅😆😉😊😋😎😍😘🥰';
  } else if (settings.charset === 'binary') {
    chars = '01';
  } else if (settings.density <= 0.5) {
    chars = '█▓▒░ ';
  }

  const step = Math.max(4, Math.floor(settings.fontSize * 0.8));
  ctx.font = `${settings.fontSize}px monospace`;
  
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const idx = (y * width + x) * 4;
      const r = pixels[idx];
      const g = pixels[idx + 1];
      const b = pixels[idx + 2];
      const brightness = Math.min(255, Math.max(0, ((r + g + b) / 3) + (settings.brightnessOffset * 255)));
      
      const charIdx = Math.floor((brightness / 255) * (chars.length - 1));
      const char = chars[charIdx];
      
      if (settings.colorMode === 'green') {
        ctx.fillStyle = `rgb(0, ${brightness}, 0)`;
      } else if (settings.colorMode === 'white') {
        ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;
      } else {
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      }
      
      ctx.fillText(char ?? '', x, y);
    }
  }
};
