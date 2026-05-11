import { EffectMode, EffectSettings } from '../types';
import { Sliders, Zap, Download, Activity, RotateCcw } from 'lucide-react';
import { getAsciiText } from '../lib/asciiUtils';

interface ControlPanelProps {
  mode: EffectMode;
  setMode: (mode: EffectMode) => void;
  settings: EffectSettings;
  updateSettings: (mode: keyof EffectSettings, update: any) => void;
  onExport: () => void;
  onReset: () => void;
  isRecording: boolean;
  onToggleRecording: () => void;
}

export default function ControlPanel({ 
  mode, 
  setMode, 
  settings, 
  updateSettings, 
  onExport,
  onReset,
  isRecording,
  onToggleRecording
}: ControlPanelProps) {
  const modes: EffectMode[] = ['original', 'ascii', 'dot-matrix', 'motion-blur', 'glitch', 'crt', 'pixelate', 'rgb-split', 'edge-detection', 'dither'];

  return (
    <div className="flex flex-col gap-4 p-6 terminal-panel rounded-lg neon-shadow h-full overflow-y-auto">
      <div className="flex items-center gap-2 mb-2">
        <Zap size={16} className="text-green-500" />
        <span className="text-xs font-bold uppercase tracking-widest">Effect_Processor</span>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        {modes.map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-3 py-2 text-[10px] uppercase border transition-all ${
              mode === m 
                ? 'bg-green-500 text-black border-green-500 font-bold' 
                : 'border-green-500/30 text-green-500/70 hover:border-green-500'
            }`}
          >
            {m.replace('-', '_')}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-2 mt-4">
        <Sliders size={14} className="text-green-500" />
        <span className="text-[10px] font-bold uppercase opacity-50">Parameters</span>
      </div>

      <div className="space-y-6">
        {mode === 'ascii' && (
          <>
            <ParameterSlider 
              label="Density" 
              value={settings.ascii.density} 
              onChange={(v) => updateSettings('ascii', { density: v })}
            />
            <ParameterSlider 
              label="Font_Size" 
              value={settings.ascii.fontSize} 
              min={4} 
              max={32}
              onChange={(v) => updateSettings('ascii', { fontSize: v })}
            />
            <ParameterSlider 
              label="Brightness_Offset" 
              value={settings.ascii.brightnessOffset} 
              min={-1} 
              max={1}
              onChange={(v) => updateSettings('ascii', { brightnessOffset: v })}
            />
            <ParameterSlider 
              label="Contrast" 
              value={settings.ascii.contrast} 
              min={1} 
              max={5}
              onChange={(v) => updateSettings('ascii', { contrast: v })}
            />
            <div className="grid grid-cols-2 gap-1 mt-2">
              {['standard', 'kana', 'emoji', 'binary', 'custom'].map((cs) => (
                <button
                  key={cs}
                  onClick={() => updateSettings('ascii', { charset: cs })}
                  className={`py-1 text-[8px] uppercase border ${
                    settings.ascii.charset === cs ? 'bg-green-500/20 border-green-500' : 'border-green-500/10'
                  }`}
                >
                  {cs}
                </button>
              ))}
            </div>

            {settings.ascii.charset === 'custom' && (
              <div className="mt-2 space-y-1">
                <span className="text-[8px] uppercase opacity-50">Custom_Charset</span>
                <input 
                  type="text"
                  value={settings.ascii.customCharset}
                  onChange={(e) => updateSettings('ascii', { customCharset: e.target.value })}
                  className="w-full bg-black/50 border border-green-500/30 text-green-500 text-[10px] px-2 py-1 focus:outline-none focus:border-green-500"
                />
              </div>
            )}

            <div className="grid grid-cols-3 gap-1 mt-2">
              {['green', 'white', 'rgb', 'amber', 'cyan'].map((c) => (
                <button
                  key={c}
                  onClick={() => updateSettings('ascii', { colorMode: c })}
                  className={`py-1 text-[8px] uppercase border ${
                    settings.ascii.colorMode === c ? 'bg-green-500/20 border-green-500' : 'border-green-500/10'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <button 
              onClick={() => updateSettings('ascii', { invert: !settings.ascii.invert })}
              className={`w-full py-2 mt-2 text-[9px] uppercase border font-bold ${
                settings.ascii.invert ? 'bg-green-500 text-black border-green-500' : 'border-green-500/10 text-green-500/70'
              }`}
            >
              Invert_Colors: {settings.ascii.invert ? 'YES' : 'NO'}
            </button>

            <div className="grid grid-cols-2 gap-1 mt-2">
              <button 
                onClick={() => {
                  const canvas = document.getElementById('main-canvas') as HTMLCanvasElement;
                  if (!canvas) return;
                  const text = getAsciiText(canvas, settings.ascii);
                  navigator.clipboard.writeText(text);
                  alert("ASCII_DATA_COPIED");
                }}
                className="py-2 text-[8px] uppercase bg-green-500/10 border border-green-500/30 text-green-500 hover:bg-green-500/20 font-bold"
              >
                Copy_Txt
              </button>
              <button 
                onClick={() => {
                  const canvas = document.getElementById('main-canvas') as HTMLCanvasElement;
                  if (!canvas) return;
                  const text = getAsciiText(canvas, settings.ascii);
                  const blob = new Blob([text], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `ascii-kit-${Date.now()}.txt`;
                  link.click();
                }}
                className="py-2 text-[8px] uppercase bg-green-500/10 border border-green-500/30 text-green-500 hover:bg-green-500/20 font-bold"
              >
                Save_Txt
              </button>
            </div>
          </>
        )}

        {mode === 'dot-matrix' && (
          <>
            <ParameterSlider 
              label="Dot_Size" 
              value={settings.dotMatrix.size} 
              min={1} max={20}
              onChange={(v) => updateSettings('dotMatrix', { size: v })}
            />
            <ParameterSlider 
              label="Spacing" 
              value={settings.dotMatrix.spacing} 
              min={0} max={10}
              onChange={(v) => updateSettings('dotMatrix', { spacing: v })}
            />
            <div className="grid grid-cols-3 gap-1 mt-2">
              {['green', 'white', 'rgb', 'amber', 'cyan'].map((c) => (
                <button
                  key={c}
                  onClick={() => updateSettings('dotMatrix', { colorMode: c })}
                  className={`py-1 text-[8px] uppercase border ${
                    settings.dotMatrix.colorMode === c ? 'bg-green-500/20 border-green-500' : 'border-green-500/10'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </>
        )}

        {mode === 'motion-blur' && (
          <>
            <ParameterSlider 
              label="Trail_Len" 
              value={settings.motionBlur.trail} 
              onChange={(v) => updateSettings('motionBlur', { trail: v })}
            />
          </>
        )}

        {mode === 'glitch' && (
          <>
            <ParameterSlider 
              label="Amount" 
              value={settings.glitch.amount} 
              onChange={(v) => updateSettings('glitch', { amount: v })}
            />
            <ParameterSlider 
              label="Speed" 
              value={settings.glitch.speed} 
              onChange={(v) => updateSettings('glitch', { speed: v })}
            />
          </>
        )}

        {mode === 'crt' && (
          <>
            <ParameterSlider 
              label="Noise" 
              value={settings.crt.noise} 
              onChange={(v) => updateSettings('crt', { noise: v })}
            />
            <div className="flex items-center gap-2 mt-2">
               <button 
                onClick={() => updateSettings('crt', { scanlines: !settings.crt.scanlines })}
                className={`flex-1 py-2 text-[9px] uppercase border font-bold ${
                  settings.crt.scanlines ? 'bg-green-500 text-black border-green-500' : 'border-green-500/30'
                }`}
               >
                 Scanlines: {settings.crt.scanlines ? 'ON' : 'OFF'}
               </button>
            </div>
          </>
        )}

        {mode === 'pixelate' && (
          <ParameterSlider 
            label="Block_Size" 
            value={settings.pixelate.size} 
            min={1} max={50}
            onChange={(v) => updateSettings('pixelate', { size: v })}
          />
        )}

        {mode === 'rgb-split' && (
          <ParameterSlider 
            label="Offset" 
            value={settings.rgbSplit.offset} 
            min={0} max={50}
            onChange={(v) => updateSettings('rgbSplit', { offset: v })}
          />
        )}

        {mode === 'edge-detection' && (
          <>
            <ParameterSlider 
              label="Threshold" 
              value={settings.edgeDetection.threshold} 
              min={0} max={255}
              onChange={(v) => updateSettings('edgeDetection', { threshold: v })}
            />
            <ParameterSlider 
              label="Mix" 
              value={settings.edgeDetection.mix} 
              onChange={(v) => updateSettings('edgeDetection', { mix: v })}
            />
          </>
        )}

        {mode === 'dither' && (
          <>
            <div className="grid grid-cols-2 gap-1 mb-4">
              {['bayer', 'random', 'atkinson', 'floyd-steinberg'].map((t) => (
                <button
                  key={t}
                  onClick={() => updateSettings('dither', { type: t })}
                  className={`py-2 text-[8px] uppercase border font-bold ${
                    settings.dither.type === t ? 'bg-green-500 text-black border-green-500' : 'border-green-500/30'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <ParameterSlider 
              label="Levels" 
              value={settings.dither.levels} 
              min={2} max={16}
              onChange={(v) => updateSettings('dither', { levels: v })}
            />
          </>
        )}
      </div>

      <div className="mt-auto pt-6 flex flex-col gap-2">
        <button 
          onClick={onReset}
          className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 text-green-500/50 hover:text-green-500 border border-green-500/10 hover:border-green-500/30 font-bold uppercase text-[10px] transition-all rounded mb-2"
        >
          <RotateCcw size={12} />
          Wipe_Current_Session
        </button>

        <button 
          onClick={onToggleRecording}
          className={`w-full flex items-center justify-center gap-2 py-3 font-bold uppercase text-xs transition-all rounded ${
            isRecording 
              ? 'bg-red-500 hover:bg-red-400 animate-pulse text-white' 
              : 'bg-green-500/20 hover:bg-green-500/30 text-green-500 border border-green-500'
          }`}
        >
          <Activity size={14} />
          {isRecording ? 'Stop_Recording_Stream' : 'Record_Live_Session'}
        </button>

        <button 
          onClick={onExport}
          className="w-full flex items-center justify-center gap-2 py-3 bg-green-500 hover:bg-green-400 text-black font-bold uppercase text-xs transition-colors rounded"
        >
          <Download size={14} />
          Snapshot_Current_Buffer
        </button>
      </div>
    </div>
  );
}

function ParameterSlider({ 
  label, 
  value, 
  onChange, 
  min = 0, 
  max = 1 
}: { 
  label: string; 
  value: number; 
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[9px] uppercase tracking-tighter">
        <span className="opacity-70">{label}</span>
        <span className="font-mono text-green-500">[{value.toFixed(2)}]</span>
      </div>
      <input 
        type="range" 
        min={min} 
        max={max} 
        step={max > 1 ? 1 : 0.01}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1 bg-green-500/10 rounded-lg appearance-none cursor-pointer accent-green-500"
      />
    </div>
  );
}
