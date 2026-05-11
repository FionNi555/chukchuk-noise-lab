import { useState, useRef, useEffect } from 'react';
import { EffectMode, EffectSettings } from '../types';
import { applyAscii } from '../effects/asciiEffect';
import { applyDotMatrix } from '../effects/dotMatrixEffect';
import { applyMotionBlur } from '../effects/motionBlurEffect';
import { applyGlitch } from '../effects/glitchEffect';
import { applyCrt } from '../effects/crtEffect';
import { applyPixelate } from '../effects/pixelateEffect';
import { applyRgbSplit } from '../effects/rgbSplitEffect';
import { applyEdgeDetection } from '../effects/edgeDetectionEffect';
import { applyDither } from '../effects/ditherEffect';

interface CanvasEngineProps {
  media: HTMLImageElement | HTMLVideoElement | null;
  mode: EffectMode;
  settings: EffectSettings;
}

export default function CanvasEngine({ media, mode, settings }: CanvasEngineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tempCanvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (media instanceof HTMLVideoElement) {
      videoRef.current = media;
    } else {
      videoRef.current = null;
    }
  }, [media]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { willReadFrequently: true });
    
    if (!canvas || !ctx || !media) return;

    const processFrame = () => {
      if (!canvas || !ctx || !media) return;

      // Set dimensions
      let sourceWidth = 0;
      let sourceHeight = 0;

      if (media instanceof HTMLVideoElement) {
        sourceWidth = media.videoWidth;
        sourceHeight = media.videoHeight;
      } else {
        sourceWidth = media.naturalWidth;
        sourceHeight = media.naturalHeight;
      }

      if (sourceWidth === 0 || sourceHeight === 0) {
        if (media instanceof HTMLVideoElement && !media.paused) {
          requestRef.current = requestAnimationFrame(processFrame);
        }
        return;
      }

      if (canvas.width !== sourceWidth) {
        canvas.width = sourceWidth;
        canvas.height = sourceHeight;
      }

      const { width, height } = canvas;

      // Draw original
      ctx.drawImage(media, 0, 0, width, height);

      // Apply effects
      try {
        if (mode === 'ascii') {
          applyAscii(ctx, width, height, settings.ascii);
        } else if (mode === 'dot-matrix') {
          applyDotMatrix(ctx, width, height, settings.dotMatrix);
        } else if (mode === 'motion-blur') {
          if (!tempCanvasRef.current) {
            tempCanvasRef.current = document.createElement('canvas');
          }
          if (tempCanvasRef.current.width !== width) {
            tempCanvasRef.current.width = width;
            tempCanvasRef.current.height = height;
          }
          applyMotionBlur(ctx, width, height, tempCanvasRef.current, settings.motionBlur);
        } else if (mode === 'glitch') {
          applyGlitch(ctx, width, height, settings.glitch);
        } else if (mode === 'crt') {
          applyCrt(ctx, width, height, settings.crt);
        } else if (mode === 'pixelate') {
          applyPixelate(ctx, width, height, settings.pixelate);
        } else if (mode === 'rgb-split') {
          applyRgbSplit(ctx, width, height, settings.rgbSplit);
        } else if (mode === 'edge-detection') {
          applyEdgeDetection(ctx, width, height, settings.edgeDetection);
        } else if (mode === 'dither') {
          applyDither(ctx, width, height, settings.dither);
        }
      } catch (err) {
        console.error("Effect Application Error:", err);
      }

      if (media instanceof HTMLVideoElement && !media.paused) {
        requestRef.current = requestAnimationFrame(processFrame);
      }
    };

    if (media instanceof HTMLVideoElement) {
       const handlePlay = () => {
         requestRef.current = requestAnimationFrame(processFrame);
       };
       media.addEventListener('play', handlePlay);
       if (!media.paused) processFrame();
       
       return () => {
         cancelAnimationFrame(requestRef.current);
         media.removeEventListener('play', handlePlay);
       };
    } else {
      processFrame();
      return () => {
        cancelAnimationFrame(requestRef.current);
      };
    }
  }, [media, mode, settings]);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-black/50 rounded-lg overflow-hidden border border-green-500/30 group">
      <canvas 
        ref={canvasRef} 
        className="max-w-full max-h-full object-contain"
        id="main-canvas"
      />
      
      {!media && (
        <div className="text-green-500/50 font-mono text-sm animate-pulse">
          IDLE_STATE: AWAITING_INPUT
        </div>
      )}
      
      <div className="absolute top-4 left-4 p-2 bg-black/80 border border-green-500/50 rounded text-[10px] font-mono text-green-500 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
        <div>ENGINE: V3.0.0</div>
        <div>MODE: {mode.toUpperCase()}</div>
        <div>RES: {canvasRef.current?.width}x{canvasRef.current?.height}</div>
      </div>
    </div>
  );
}
