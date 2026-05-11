import React from 'react';

export default function Logo({ size = 40 }: { size?: number }) {
  return (
    <div 
      className="relative flex items-center justify-center font-mono font-bold leading-none select-none"
      style={{ width: size, height: size, fontSize: size * 0.15 }}
    >
      <div className="text-green-500 overflow-hidden flex flex-col items-center">
        <div className="flex gap-[1px]">
          <span>0</span><span>0</span>
          <span className="opacity-0">0</span>
          <span>0</span><span>0</span>
        </div>
        <div className="flex gap-[1px]">
          <span>0</span><span>0</span><span>0</span><span>0</span><span>0</span>
        </div>
        <div className="flex gap-[1px]">
          <span>0</span>
          <span className="text-black bg-green-500 border border-green-500">0</span>
          <span>0</span>
          <span className="text-black bg-green-500 border border-green-500">0</span>
          <span>0</span>
        </div>
        <div className="flex gap-[1px]">
          <span>0</span><span>0</span><span>0</span><span>0</span><span>0</span>
        </div>
        <div className="flex gap-[1px]">
          <span className="opacity-0">0</span>
          <span>0</span><span>0</span><span>0</span>
          <span className="opacity-0">0</span>
        </div>
      </div>
      
      {/* Glow effect */}
      <div className="absolute inset-0 bg-green-500/20 blur-lg rounded-full -z-10"></div>
    </div>
  );
}
