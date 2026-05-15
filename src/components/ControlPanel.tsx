import { EffectMode, EffectSettings } from '../types';
import { Sliders, Zap, Download, Activity } from 'lucide-react';
import { getAsciiText } from '../lib/asciiUtils';

interface ControlPanelProps {
  media: HTMLImageElement | HTMLVideoElement | null;
  mode: EffectMode;
  setMode: (mode: EffectMode) => void;
  settings: EffectSettings;
  updateSettings: (mode: keyof EffectSettings, update: any) => void;
  onExport: () => void;
  isRecording: boolean;
  onToggleRecording: () => void;
}

export default function ControlPanel({ 
  media,
  mode, 
  setMode, 
  settings, 
  updateSettings, 
  onExport,
  isRecording,
  onToggleRecording
}: ControlPanelProps) {
  const modes: EffectMode[] = ['original', 'ascii', 'dot-matrix', 'motion-blur', 'glitch', 'crt', 'pixelate', 'rgb-split', 'edge-detection', 'dither', 'orbit', 'spiral', 'scatter', 'lego', 'surveillance'];

  const effectDescriptions: Record<string, string> = {
    'motion-blur': 'Multiple blur modes (linear, radial, zoom, wave) for creating motion blur effects on images and videos.',
    'surveillance': 'Video art effects implemented based on blob tracking algorithm, with many rich customization options.',
    'ascii': 'Convert images into ASCII art with customizable character sets, fonts, and visual parameters for retro-style text representations.',
  };

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
            {m === 'pixelate' ? 'PIXEL' : m === 'surveillance' ? 'CCTV TRACK' : m === 'motion-blur' ? 'BLUR SUITE' : m.replace('-', '_')}
          </button>
        ))}
      </div>

      {effectDescriptions[mode] && (
        <div className="mb-4 p-3 bg-green-500/5 border border-green-500/20 text-[10px] text-green-500/80 leading-relaxed italic">
          {effectDescriptions[mode]}
        </div>
      )}

      <div className="flex items-center gap-2 mb-2 mt-4">
        <Sliders size={14} className="text-green-500" />
        <span className="text-[10px] font-bold uppercase opacity-50">Parameters</span>
      </div>

      <div className="space-y-6">
        {mode === 'ascii' && (
          <div className="space-y-4">
            <div className="space-y-3">
              <ParameterSlider 
                label="Resolution" 
                value={settings.ascii.fontSize} 
                min={4} max={30}
                onChange={(v) => updateSettings('ascii', { fontSize: v })}
              />
              <div className="grid grid-cols-2 gap-3">
                <ParameterSlider 
                  label="Line_Height" 
                  value={settings.ascii.lineHeight} 
                  min={0.5} max={2.0}
                  onChange={(v) => updateSettings('ascii', { lineHeight: v })}
                />
                <ParameterSlider 
                  label="Kerning" 
                  value={settings.ascii.charSpacing} 
                  min={-10} max={10}
                  onChange={(v) => updateSettings('ascii', { charSpacing: v })}
                />
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[8px] uppercase opacity-50 block mb-1">Font_Face</span>
              <div className="grid grid-cols-5 gap-1">
                {['monospace', 'serif', 'system-ui', 'retro', 'pixel'].map((f) => (
                  <button
                    key={f}
                    onClick={() => updateSettings('ascii', { fontFamily: f })}
                    className={`py-1.5 text-[8px] uppercase border transition-all ${
                      settings.ascii.fontFamily === f 
                        ? 'bg-green-500 text-black border-green-500 font-bold' 
                        : 'border-green-500/20 text-green-500/60 hover:border-green-500/50'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-green-500/10">
              <ParameterSlider 
                label="Brightness" 
                value={settings.ascii.brightnessOffset} 
                min={-0.5} max={0.5}
                onChange={(v) => updateSettings('ascii', { brightnessOffset: v })}
              />
              <ParameterSlider 
                label="Contrast" 
                value={settings.ascii.contrast} 
                min={0.5} max={3.0}
                onChange={(v) => updateSettings('ascii', { contrast: v })}
              />
            </div>

            <div className="space-y-1">
              <span className="text-[8px] uppercase opacity-50 block mb-1">Character_Set</span>
              <div className="grid grid-cols-4 gap-1">
                {['standard', 'blocks', 'braille', 'kana', 'emoji', 'binary', 'custom'].map((cs) => (
                  <button
                    key={cs}
                    onClick={() => updateSettings('ascii', { charset: cs })}
                    className={`py-1.5 text-[8px] uppercase border transition-all ${
                      settings.ascii.charset === cs 
                        ? 'bg-green-500 text-black border-green-500 font-bold' 
                        : 'border-green-500/20 text-green-500/60 hover:border-green-500/50'
                    }`}
                  >
                    {cs}
                  </button>
                ))}
              </div>
            </div>

            {settings.ascii.charset === 'custom' && (
              <div className="space-y-1">
                <span className="text-[8px] uppercase opacity-50">Custom_Chars</span>
                <input 
                  type="text"
                  value={settings.ascii.customCharset}
                  onChange={(e) => updateSettings('ascii', { customCharset: e.target.value })}
                  className="w-full bg-black/50 border border-green-500/30 text-green-500 text-[10px] px-2 py-1.5 focus:outline-none focus:border-green-500"
                />
              </div>
            )}

            <div className="space-y-1">
              <span className="text-[8px] uppercase opacity-50 block mb-1">Color_Profile</span>
              <div className="grid grid-cols-5 gap-1">
                {['green', 'white', 'rgb', 'amber', 'cyan'].map((c) => (
                  <button
                    key={c}
                    onClick={() => updateSettings('ascii', { colorMode: c })}
                    className={`py-1.5 text-[8px] uppercase border transition-all ${
                      settings.ascii.colorMode === c 
                        ? 'bg-green-500 text-black border-green-500 font-bold' 
                        : 'border-green-500/20 text-green-500/60 hover:border-green-500/50'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-green-500/10">
              <button 
                onClick={() => updateSettings('ascii', { invert: !settings.ascii.invert })}
                className={`py-2 text-[9px] uppercase border font-bold transition-all ${
                  settings.ascii.invert ? 'bg-green-500 text-black border-green-500' : 'border-green-500/10 text-green-500/70'
                }`}
              >
                Invert
              </button>
              <button 
                onClick={() => updateSettings('ascii', { transparent: !settings.ascii.transparent })}
                className={`py-2 text-[9px] uppercase border font-bold transition-all ${
                  settings.ascii.transparent ? 'bg-green-500 text-black border-green-500' : 'border-green-500/10 text-green-500/70'
                }`}
              >
                Alpha
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                {['none', 'clear', 'blur'].map((m) => (
                  <button 
                    key={m}
                    onClick={() => updateSettings('ascii', { overlay: m })}
                    className={`py-2 text-[9px] uppercase border font-bold transition-all ${
                      settings.ascii.overlay === m ? 'bg-green-500 text-black border-green-500' : 'border-green-500/10 text-green-500/70'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>

              {settings.ascii.overlay !== 'none' && (
                <ParameterSlider 
                  label="Overlay_Strength" 
                  value={settings.ascii.overlayIntensity} 
                  min={0} max={1}
                  onChange={(v) => updateSettings('ascii', { overlayIntensity: v })}
                />
              )}
            </div>
              
            {!settings.ascii.transparent && (
                <div className="flex items-center gap-2 px-2 py-1.5 bg-black/30 border border-green-500/20">
                  <span className="text-[8px] uppercase text-green-500/50">BG_COLOR</span>
                  <input 
                    type="color"
                    value={settings.ascii.backgroundColor}
                    onChange={(e) => updateSettings('ascii', { backgroundColor: e.target.value })}
                    className="w-full h-4 bg-transparent border-none cursor-pointer"
                  />
                </div>
              )}

            <div className="grid grid-cols-3 gap-1">
              <button 
                onClick={() => {
                  if (!media) return;
                  const text = getAsciiText(media, settings.ascii);
                  navigator.clipboard.writeText(text);
                }}
                className="py-2 text-[8px] uppercase bg-green-500/5 border border-green-500/20 text-green-500 hover:bg-green-500/10 font-bold"
              >
                Copy_TXT
              </button>
              <button 
                onClick={() => {
                  if (!media) return;
                  const text = getAsciiText(media, settings.ascii);
                  const blob = new Blob([text], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `ascii-kit-${Date.now()}.txt`;
                  link.click();
                }}
                className="py-2 text-[8px] uppercase bg-green-500/5 border border-green-500/20 text-green-500 hover:bg-green-500/10 font-bold"
              >
                Save_TXT
              </button>
              <button 
                onClick={() => {
                  const canvas = document.getElementById('main-canvas') as HTMLCanvasElement;
                  if (!canvas) return;
                  const link = document.createElement('a');
                  link.download = `ascii-kit-${Date.now()}.png`;
                  link.href = canvas.toDataURL('image/png');
                  link.click();
                }}
                className="py-2 text-[8px] uppercase bg-green-500 text-black border border-green-500 hover:bg-green-400 font-bold"
              >
                PNG
              </button>
            </div>
          </div>
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
              label="Persistence" 
              value={settings.motionBlur.trail} 
              onChange={(v) => updateSettings('motionBlur', { trail: v })}
            />
            <ParameterSlider 
              label="Feedback_Intensity" 
              value={settings.motionBlur.intensity} 
              min={0} max={10}
              onChange={(v) => updateSettings('motionBlur', { intensity: v })}
            />
            <div className="grid grid-cols-2 gap-1 mt-2">
              {['linear', 'radial', 'zoom', 'wave'].map((bm) => (
                <button
                  key={bm}
                  onClick={() => updateSettings('motionBlur', { mode: bm })}
                  className={`py-2 text-[8px] uppercase border font-bold ${
                    settings.motionBlur.mode === bm ? 'bg-green-500 text-black border-green-500' : 'border-green-500/10 text-green-500/70'
                  }`}
                >
                  {bm}
                </button>
              ))}
            </div>
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

        {mode === 'orbit' && (
          <>
            <ParameterSlider 
              label="Particle_Count" 
              value={settings.orbit.count} 
              min={100} max={10000}
              onChange={(v) => updateSettings('orbit', { count: v })}
            />
            <ParameterSlider 
              label="Radius" 
              value={settings.orbit.radius} 
              min={0.1} max={2.0}
              onChange={(v) => updateSettings('orbit', { radius: v })}
            />
            <ParameterSlider 
              label="Orbit_Speed" 
              value={settings.orbit.speed} 
              min={0} max={5}
              onChange={(v) => updateSettings('orbit', { speed: v })}
            />
            <ParameterColorModes effect="orbit" colorMode={settings.orbit.colorMode} updateSettings={updateSettings} />
          </>
        )}

        {mode === 'spiral' && (
          <>
            <ParameterSlider 
              label="Revolutions" 
              value={settings.spiral.revolutions} 
              min={1} max={50}
              onChange={(v) => updateSettings('spiral', { revolutions: v })}
            />
            <ParameterSlider 
              label="Speed" 
              value={settings.spiral.speed} 
              min={0} max={5}
              onChange={(v) => updateSettings('spiral', { speed: v })}
            />
            <ParameterColorModes effect="spiral" colorMode={settings.spiral.colorMode} updateSettings={updateSettings} />
          </>
        )}

        {mode === 'scatter' && (
          <>
            <ParameterSlider 
              label="Intensity" 
              value={settings.scatter.amount} 
              min={0} max={2}
              onChange={(v) => updateSettings('scatter', { amount: v })}
            />
            <ParameterSlider 
              label="Dot_Size" 
              value={settings.scatter.size} 
              min={1} max={10}
              onChange={(v) => updateSettings('scatter', { size: v })}
            />
            <ParameterColorModes effect="scatter" colorMode={settings.scatter.colorMode} updateSettings={updateSettings} />
          </>
        )}

        {mode === 'lego' && (
          <>
            <ParameterSlider 
              label="Brick_Size" 
              value={settings.lego.size} 
              min={4} max={40}
              onChange={(v) => updateSettings('lego', { size: v })}
            />
            <ParameterColorModes effect="lego" colorMode={settings.lego.colorMode} updateSettings={updateSettings} />
          </>
        )}

        {mode === 'surveillance' && (
          <>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-green-500 font-bold tracking-[0.2em]">SHOW_CALLOUTS</span>
                <button 
                  onClick={() => updateSettings('surveillance', { showCallouts: !settings.surveillance.showCallouts })}
                  className={`w-10 h-4 border ${settings.surveillance.showCallouts ? 'bg-green-500/50 border-green-500' : 'border-green-500/20'} rounded-none transition-colors`}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-green-500 font-bold tracking-[0.2em]">BLOB_TRACKING</span>
                <button 
                  onClick={() => updateSettings('surveillance', { showTracking: !settings.surveillance.showTracking })}
                  className={`w-10 h-4 border ${settings.surveillance.showTracking ? 'bg-green-500/50 border-green-500' : 'border-green-500/20'} rounded-none transition-colors`}
                />
              </div>
            </div>
            <ParameterSlider 
              label="Track_Precision" 
              value={settings.surveillance.trackingPrecision} 
              min={0.1} max={1.0}
              onChange={(v) => updateSettings('surveillance', { trackingPrecision: v })}
            />
            <div className="grid grid-cols-5 gap-1 mt-2">
              {['red', 'green', 'white', 'rgb', 'amber'].map((c) => (
                <button
                  key={c}
                  onClick={() => updateSettings('surveillance', { colorMode: c })}
                  className={`py-1 text-[8px] uppercase border ${
                    settings.surveillance.colorMode === c ? 'bg-green-500/20 border-green-500' : 'border-green-500/10'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="mt-auto pt-6 flex flex-col gap-2">
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
        step={max > 5 ? 1 : 0.01}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1 bg-green-500/10 rounded-lg appearance-none cursor-pointer accent-green-500"
      />
    </div>
  );
}

function ParameterColorModes({ 
  effect, 
  colorMode, 
  updateSettings 
}: { 
  effect: keyof EffectSettings; 
  colorMode: string; 
  updateSettings: any 
}) {
  return (
    <div className="grid grid-cols-3 gap-1 mt-2">
      {['green', 'white', 'rgb', 'amber', 'cyan'].map((c) => (
        <button
          key={c}
          onClick={() => updateSettings(effect, { colorMode: c })}
          className={`py-1 text-[8px] uppercase border ${
            colorMode === c ? 'bg-green-500/20 border-green-500' : 'border-green-500/10'
          }`}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
