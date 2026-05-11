import React, { useRef } from 'react';
import { Upload, Camera, Link as LinkIcon, Clipboard } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface UploadAreaProps {
  onUpload: (media: HTMLImageElement | HTMLVideoElement) => void;
}

export default function UploadArea({ onUpload }: UploadAreaProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const url = URL.createObjectURL(file);
    if (file.type.startsWith('video/')) {
      const video = document.createElement('video');
      video.src = url;
      video.muted = true;
      video.loop = true;
      video.autoplay = true;
      video.playsInline = true;

      video.onerror = () => {
        alert("CRITICAL_ERROR: VIDEO_DECODE_FAILURE. Format may be unsupported by this browser.");
      };

      const handleReady = () => {
        video.removeEventListener('canplay', handleReady);
        video.play().catch(err => {
          console.warn("Video play deferred:", err);
        });
        onUpload(video);
      };

      video.addEventListener('canplay', handleReady);
      video.load();
    } else {
      const img = new Image();
      img.src = url;
      img.onload = () => onUpload(img);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      video.muted = true;
      video.autoplay = true;
      video.playsInline = true;
      video.onloadedmetadata = () => {
        video.play();
        onUpload(video);
      };
    } catch (err) {
      console.error("Camera error:", err);
      alert("CAMERA_ACCESS_DENIED");
    }
  };

  return (
    <div 
      className="flex flex-col gap-4 p-6 terminal-panel rounded-lg neon-shadow"
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
    >
      <div className="flex items-center gap-2 mb-2">
        <Upload size={16} className="text-green-500" />
        <span className="text-xs font-bold uppercase tracking-widest">Input_Selector</span>
      </div>

      <div 
        onClick={() => fileInputRef.current?.click()}
        className="group relative flex flex-col items-center justify-center border-2 border-dashed border-green-500/20 rounded-md p-10 cursor-pointer hover:border-green-500/50 hover:bg-green-500/5 transition-all"
      >
        <Upload className="w-8 h-8 mb-2 opacity-50 group-hover:scale-110 group-hover:opacity-100 transition-all" />
        <span className="text-[10px] uppercase opacity-50">Drag_Drop or Click_To_Mount</span>
        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden" 
          accept="image/*,video/*"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <button 
          onClick={startCamera}
          className="flex flex-col items-center justify-center p-3 rounded border border-green-500/20 hover:bg-green-500/10 transition-colors gap-1 group"
        >
          <Camera size={14} className="opacity-50 group-hover:opacity-100" />
          <span className="text-[9px] uppercase">Cam</span>
        </button>
        <button className="flex flex-col items-center justify-center p-3 rounded border border-green-500/20 hover:bg-green-500/10 transition-colors gap-1 group">
          <Clipboard size={14} className="opacity-50 group-hover:opacity-100" />
          <span className="text-[9px] uppercase">Clp</span>
        </button>
        <button className="flex flex-col items-center justify-center p-3 rounded border border-green-500/20 hover:bg-green-500/10 transition-colors gap-1 group">
          <LinkIcon size={14} className="opacity-50 group-hover:opacity-100" />
          <span className="text-[9px] uppercase">Url</span>
        </button>
      </div>
    </div>
  );
}
