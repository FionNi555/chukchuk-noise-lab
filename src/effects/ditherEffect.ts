export const applyDither = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  settings: { type: 'bayer' | 'random'; levels: number }
) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const levels = Math.max(2, settings.levels);

  const bayerThresholdMap = [
    [  0, 128,  32, 160 ],
    [ 192,  64, 224,  96 ],
    [  48, 176,  16, 144 ],
    [ 240, 112, 208,  80 ]
  ];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const grey = (data[i] + data[i+1] + data[i+2]) / 3;
      
      let threshold = 128;
      if (settings.type === 'bayer') {
        threshold = bayerThresholdMap[y % 4][x % 4];
      } else {
        threshold = Math.random() * 255;
      }

      const val = grey > threshold ? 255 : 0;
      
      data[i] = 0;
      data[i+1] = val; // Green channel for our theme
      data[i+2] = 0;
    }
  }

  ctx.putImageData(imageData, 0, 0);
};
