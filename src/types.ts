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
  | 'orbit'
  | 'spiral'
  | 'scatter'
  | 'lego'
  | 'surveillance'
  | 'original';

export interface EffectSettings {
  ascii: {
    density: number;
    fontSize: number;
    colorMode: 'green' | 'white' | 'rgb' | 'amber' | 'cyan';
    charset: 'standard' | 'blocks' | 'braille' | 'kana' | 'emoji' | 'binary' | 'custom';
    fontFamily: 'monospace' | 'serif' | 'system-ui' | 'retro' | 'pixel';
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
  };
  dotMatrix: {
    size: number;
    spacing: number;
    shape: 'circle' | 'square';
    colorMode: 'green' | 'white' | 'rgb' | 'amber' | 'cyan';
  };
  motionBlur: {
    trail: number;
    intensity: number;
    mode: 'linear' | 'radial' | 'zoom' | 'wave';
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
    type: 'bayer' | 'random' | 'atkinson' | 'floyd-steinberg';
    levels: number;
  };
  orbit: {
    count: number;
    radius: number;
    speed: number;
    size: number;
    colorMode: 'green' | 'white' | 'rgb' | 'amber' | 'cyan';
  };
  spiral: {
    revolutions: number;
    spacing: number;
    speed: number;
    size: number;
    colorMode: 'green' | 'white' | 'rgb' | 'amber' | 'cyan';
  };
  scatter: {
    amount: number;
    size: number;
    colorMode: 'green' | 'white' | 'rgb' | 'amber' | 'cyan';
  };
  lego: {
    size: number;
    colorMode: 'green' | 'white' | 'rgb' | 'amber' | 'cyan';
  };
  surveillance: {
    intensity: number;
    showCallouts: boolean;
    showTracking: boolean;
    trackingPrecision: number;
    colorMode: 'green' | 'red' | 'white' | 'rgb' | 'amber';
  };
}

export const INITIAL_SETTINGS: EffectSettings = {
  ascii: {
    density: 1,
    fontSize: 10,
    colorMode: 'green',
    charset: 'standard',
    customCharset: ' .:-=+*#%@',
    invert: false,
    brightnessOffset: 0,
    contrast: 1,
    transparent: true,
    fontFamily: 'monospace',
    backgroundColor: '#000000',
    overlay: 'none',
    overlayIntensity: 0.5,
    lineHeight: 1.0,
    charSpacing: 0,
  },
  dotMatrix: {
    size: 4,
    spacing: 1,
    shape: 'circle',
    colorMode: 'green',
  },
  motionBlur: {
    trail: 0.9,
    intensity: 1.5,
    mode: 'zoom',
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
  orbit: {
    count: 1000,
    radius: 0.5,
    speed: 0.5,
    size: 2,
    colorMode: 'green',
  },
  spiral: {
    revolutions: 10,
    spacing: 2,
    speed: 0.3,
    size: 2,
    colorMode: 'green',
  },
  scatter: {
    amount: 0.2,
    size: 3,
    colorMode: 'green',
  },
  lego: {
    size: 10,
    colorMode: 'rgb',
  },
  surveillance: {
    intensity: 0.5,
    showCallouts: true,
    showTracking: true,
    trackingPrecision: 0.5,
    colorMode: 'red',
  },
};
