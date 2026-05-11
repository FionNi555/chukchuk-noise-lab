import { Github, HelpCircle } from 'lucide-react';
import Logo from './Logo';

export default function Header() {
  return (
    <header className="px-6 py-4 border-b border-green-500/20 bg-black/80 backdrop-blur-md z-20">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Logo size={48} />
          <div>
            <h1 className="text-lg font-bold tracking-[0.2em] uppercase neon-text-glow leading-none">
              Chukchuk <span className="text-green-500/50">Noise</span> Lab
            </h1>
            <p className="text-[8px] uppercase tracking-[0.3em] opacity-50 mt-1">
              Visual_Processing_Unit // V_3.0
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <nav className="hidden md:flex gap-4 text-[10px] uppercase font-bold tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Lab_Docs</a>
            <a href="#" className="hover:text-white transition-colors">Presets</a>
            <a href="#" className="hover:text-white transition-colors">Community</a>
          </nav>
          
          <div className="flex items-center gap-3">
             <button className="p-2 hover:bg-green-500/10 rounded-full transition-colors">
               <Github size={18} />
             </button>
             <button className="p-2 hover:bg-green-500/10 rounded-full transition-colors">
               <HelpCircle size={18} />
             </button>
             <div className="h-4 w-px bg-green-500/20 mx-1"></div>
             <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
               <span className="text-[10px] font-bold uppercase tracking-tighter">Authenticated</span>
             </div>
          </div>
        </div>
      </div>
    </header>
  );
}
