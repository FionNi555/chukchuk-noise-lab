import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Activity, Github, Layers } from 'lucide-react';
import Header from './components/Header';
import UploadArea from './components/UploadArea';
import CanvasEngine from './components/CanvasEngine';
import ControlPanel from './components/ControlPanel';
import Logo from './components/Logo';
import { EffectMode, EffectSettings, INITIAL_SETTINGS } from './types';

const DEFAULT_VIDEO_URL = "https://assets.mixkit.co/videos/preview/mixkit-abstract-motion-of-white-lines-and-dots-in-a-black-background-44163-large.mp4";

export default function App() {
  const [booting, setBooting] = useState(true);
  const [initializing, setInitializing] = useState(true);
  const [media, setMedia] = useState<HTMLImageElement | HTMLVideoElement | null>(null);
  const [mode, setMode] = useState<EffectMode>('ascii');
  const [settings, setSettings] = useState<EffectSettings>(INITIAL_SETTINGS);
  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);

  // Initialize with default video
  useEffect(() => {
    const video = document.createElement('video');
    video.src = DEFAULT_VIDEO_URL;
    video.muted = true;
    video.loop = true;
    video.autoplay = true;
    video.playsInline = true;
    video.crossOrigin = "anonymous";
    
    let isMounted = true;

    const handleLoadSuccess = () => {
      if (!isMounted) return;
      video.play().catch(() => {});
      setMedia(video);
      setInitializing(false);
    };

    video.oncanplay = handleLoadSuccess;
    video.onerror = () => {
      if (!isMounted) return;
      console.warn("Default video failed to load, proceeding to manual input.");
      setInitializing(false);
    };

    // Safety timeout: Ensure the start button appears even if video hangs
    const timer = setTimeout(() => {
      if (isMounted) setInitializing(false);
    }, 4000);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      video.oncanplay = null;
      video.onerror = null;
    };
  }, []);

  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);

  const updateSettings = (effect: keyof EffectSettings, update: any) => {
    setSettings(prev => ({
      ...prev,
      [effect]: { ...prev[effect], ...update }
    }));
  };

  const handleExport = () => {
    const canvas = document.getElementById('main-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `chukchuk-noise-${mode}-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const startRecording = () => {
    const canvas = document.getElementById('main-canvas') as HTMLCanvasElement;
    if (!canvas) return;

    const stream = canvas.captureStream(30);
    const newRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    
    const chunks: Blob[] = [];
    newRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    newRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `chukchuk-render-${Date.now()}.webm`;
      link.click();
    };

    newRecorder.start();
    setRecorder(newRecorder);
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (recorder) {
      recorder.stop();
      setIsRecording(false);
      setRecorder(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-mono text-green-500 overflow-hidden select-none">
      <AnimatePresence>
        {booting && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center gap-6"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <Logo size={120} />
            </motion.div>
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center gap-4"
            >
              <h1 className="text-xl font-bold tracking-[0.5em] uppercase neon-text-glow">
                Chukchuk Noise Lab
              </h1>
              
              {initializing ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-48 h-1 bg-green-500/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ x: '-100%' }}
                      animate={{ x: '100%' }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      className="w-full h-full bg-green-500"
                    />
                  </div>
                  <span className="text-[10px] opacity-50 animate-pulse uppercase tracking-widest mt-2">Initializing_Visual_Engines...</span>
                </div>
              ) : (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setBooting(false)}
                  className="px-8 py-3 bg-green-500 text-black font-bold uppercase tracking-[0.2em] text-xs rounded hover:bg-white transition-colors duration-300 shadow-[0_0_20px_rgba(34,197,94,0.4)]"
                >
                  START_SESSION_V3.0
                </motion.button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Grid Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-10 bg-[linear-gradient(rgba(0,255,65,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      
      <Header />

      <main className="flex-1 container mx-auto grid grid-cols-12 gap-6 p-6 z-10 overflow-hidden">
        {/* Left Sidebar: Integrated Console */}
        <aside className="col-span-12 lg:col-span-4 xl:col-span-3 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
          <div className="space-y-4">
            <section>
              <div className="flex items-center gap-2 mb-2 px-1">
                <div className="w-1 h-3 bg-green-500"></div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">01_Input_System</span>
              </div>
              <UploadArea onUpload={setMedia} />
            </section>
            
            <section className="flex-1">
              <div className="flex items-center gap-2 mb-2 px-1">
                <div className="w-1 h-3 bg-green-500"></div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">02_Effect_Lab</span>
              </div>
              <ControlPanel 
                media={media}
                mode={mode} 
                setMode={setMode} 
                settings={settings} 
                updateSettings={updateSettings}
                onExport={handleExport}
                isRecording={isRecording}
                onToggleRecording={isRecording ? stopRecording : startRecording}
              />
            </section>

            <section className="terminal-panel p-4 rounded-lg text-[9px] space-y-2 border-green-500/10">
              <div className="flex items-center justify-between text-green-500/70 border-b border-green-500/10 pb-2 mb-2">
                <span className="flex items-center gap-2 uppercase"><Activity size={10} /> System_Log</span>
                <span className="opacity-50">V3.0.0</span>
              </div>
              <div className="space-y-1 font-mono">
                <div className="flex justify-between"><span>Kernel:</span> <span className="text-green-500">Ready</span></div>
                <div className="flex justify-between"><span>Memory:</span> <span className="text-green-500">124MB/s</span></div>
                <div className="flex justify-between"><span>Latency:</span> <span className="text-green-500">2.4ms</span></div>
              </div>
            </section>
          </div>
        </aside>

        {/* Right Stage: Full-Scale Observation Deck */}
        <section className="col-span-12 lg:col-span-8 xl:col-span-9 flex flex-col gap-4 h-full min-h-0">
          <div className="flex-1 relative flex flex-col min-h-0">
            <div className="flex items-center justify-between px-4 py-2 border-t border-x border-green-500/20 bg-black/40 rounded-t-lg">
               <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-green-500/80">Observation_Stream_Live</span>
               </div>
               <div className="text-[9px] text-green-500/40 uppercase">Mode: {mode} // Buffer: Active</div>
            </div>
            <div className="flex-1 min-h-0">
              <CanvasEngine 
                media={media} 
                mode={mode} 
                settings={settings} 
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between terminal-panel p-3 rounded-lg text-[9px] uppercase tracking-[0.2em] px-6 border-green-500/20">
            <div className="flex gap-8">
              <span className="flex items-center gap-2 opacity-60"><Layers size={12}/> VRAM_Usage: 14%</span>
              <span className="flex items-center gap-2 opacity-60"><Activity size={12}/> FPS: 60</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-green-500/80">Sync_Lock: Established</span>
              <div className="px-2 py-0.5 bg-green-500/10 border border-green-500/30 rounded text-[8px]">PROTOTYPE_MODE</div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Decoration */}
      <footer className="p-2 border-t border-green-500/20 bg-black/50 text-[8px] uppercase tracking-[0.2em] flex justify-between px-6 z-10">
        <div className="flex gap-4">
          <span>Secure_Socket_Established</span>
          <span>Encrypted_Stream</span>
        </div>
        <div className="opacity-50">© 2026 CHUKCHUK_NOISE_LAB // PROTOTYPE_X</div>
      </footer>
    </div>
  );
}

