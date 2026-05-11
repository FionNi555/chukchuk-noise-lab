export type EffectMode = 
  | 'ascii' 
  | 'dot-matrix' 
  | 'motion-blur' 
  | 'glitch' 
  | 'crt' 
  | 'pixelate' 
  | 'rgb-split' 
  | 'edge-detection' 
  | 'dither' 
  | 'original';

export interface EffectSettings {
  ascii: {
    density: number;
    fontSize: number;
    colorMode: 'green' | 'white' | 'rgb';
    charset: 'standard' | 'kana' | 'emoji' | 'binary';
    brightnessOffset: number;
  };
  dotMatrix: {
    size: number;
    spacing: number;
    shape: 'circle' | 'square';
    colorMode: 'green' | 'white' | 'rgb';
  };
  motionBlur: {
    trail: number;
    intensity: number;
  };
  glitch: {
    amount: number;
    speed: number;
  };
  crt: {
    scanlines: boolean;
    curvature: number;
    noise: number;
  };
  pixelate: {
    size: number;
  };
  rgbSplit: {
    offset: number;
  };
  edgeDetection: {
    threshold: number;
    mix: number;
  };
  dither: {
    type: 'bayer' | 'random';
    levels: number;
  };
}

export const INITIAL_SETTINGS: EffectSettings = {
  ascii: {
    density: 1,
    fontSize: 10,
    colorMode: 'green',
    charset: 'standard',
    brightnessOffset: 0,
  },
  dotMatrix: {
    size: 4,
    spacing: 1,
    shape: 'circle',
    colorMode: 'green',
  },
  motionBlur: {
    trail: 0.1,
    intensity: 1,
  },
  glitch: {
    amount: 0.5,
    speed: 0.5,
  },
  crt: {
    scanlines: true,
    curvature: 0.1,
    noise: 0.1,
  },
  pixelate: {
    size: 8,
  },
  rgbSplit: {
    offset: 10,
  },
  edgeDetection: {
    threshold: 40,
    mix: 1.0,
  },
  dither: {
    type: 'bayer',
    levels: 4,
  },
};
