import { hexToRgb } from '../lib/utils';

export const applySurveillance = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  settings: {
    intensity: number;
    showCallouts: boolean;
    showTracking: boolean;
    trackingPrecision: number;
    colorMode: 'green' | 'red' | 'white' | 'rgb' | 'amber';
  }
) => {
  const themes: Record<string, string> = {
    green: '#0f0',
    red: '#f00',
    white: '#fff',
    amber: '#ffb000',
    cyan: '#00ffff'
  };
  
  const themeColor = themes[settings.colorMode] || '#f00';
  const time = performance.now() * 0.001;

  // 1. Draw UI elements
  ctx.save();
  ctx.strokeStyle = themeColor;
  ctx.fillStyle = themeColor;
  ctx.font = '10px monospace';
  ctx.lineWidth = 1;

  // Corner markers
  const margin = 20;
  const len = 40;
  
  // Draw corners
  const corners = [
    {x: margin, y: margin, vx: 1, vy: 1},
    {x: width - margin, y: margin, vx: -1, vy: 1},
    {x: margin, y: height - margin, vx: 1, vy: -1},
    {x: width - margin, y: height - margin, vx: -1, vy: -1}
  ];
  
  corners.forEach(c => {
    ctx.beginPath();
    ctx.moveTo(c.x, c.y + len * c.vy);
    ctx.lineTo(c.x, c.y);
    ctx.lineTo(c.x + len * c.vx, c.y);
    ctx.stroke();
  });

  // Top info
  ctx.fillText(`SYSTEM: ONLINE // CCTV_TRACKER_V4`, margin + 10, margin + 15);
  ctx.fillText(`SCENE: ${Math.floor(time / 10) % 20}/20 [AUTO_SCAN]`, width - margin - 180, margin + 15);
  ctx.fillText(`LOC: 51.5074° N, 0.1278° W // ${new Date().toLocaleTimeString()}`, margin + 10, height - margin - 5);

  // Crosshair
  ctx.setLineDash([2, 4]);
  ctx.beginPath();
  ctx.moveTo(width/2 - 30, height/2); ctx.lineTo(width/2 + 30, height/2);
  ctx.moveTo(width/2, height/2 - 30); ctx.lineTo(width/2, height/2 + 30);
  ctx.stroke();
  ctx.setLineDash([]);

  // 2. Blob Tracking (Simulated)
  if (settings.showTracking) {
    // Sample a few points to find "interesting" areas
    const points = [];
    const step = Math.floor(400 * (1.1 - settings.trackingPrecision));
    const imageData = ctx.getImageData(0, 0, width, height).data;
    
    for (let y = margin; y < height - margin; y += step) {
      for (let x = margin; x < width - margin; x += step) {
        const i = (y * width + x) * 4;
        const brightness = (imageData[i] + imageData[i+1] + imageData[i+2]) / 3;
        
        if (brightness > 180) { // Threshold for tracking
          points.push({x, y, b: brightness});
        }
      }
    }

    // Draw tracking boxes around detected "blobs"
    // To avoid too many boxes, we just take the top few
    points.sort((a, b) => b.b - a.b).slice(0, 5).forEach((p, idx) => {
      const size = 30 + (Math.sin(time * 5 + idx) * 10);
      ctx.strokeRect(p.x - size/2, p.y - size/2, size, size);
      ctx.fillText(`TARGET_${idx} : ${p.b.toFixed(0)}%`, p.x + size/2 + 5, p.y);
      
      // Draw sub-target brackets
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // 3. Callouts (Magnified areas)
  if (settings.showCallouts) {
    const seed = Math.floor(time / 3); 
    const calloutCount = 2;
    
    for (let i = 0; i < calloutCount; i++) {
      const randX = ((seed + i * 137) % 70) / 100 * width + width * 0.15;
      const randY = ((seed + i * 263) % 70) / 100 * height + height * 0.15;
      const boxSize = 60;
      
      // Target box
      ctx.strokeStyle = themeColor;
      ctx.lineWidth = 2;
      ctx.strokeRect(randX, randY, boxSize, boxSize);
      ctx.lineWidth = 1;
      
      // Callout window
      const winX = i === 0 ? margin * 2 : width - margin * 2 - 100;
      const winY = margin * 4;
      const winSize = 100;
      
      // Connection line
      ctx.beginPath();
      ctx.moveTo(randX + boxSize/2, randY + boxSize/2);
      ctx.lineTo(winX + winSize/2, winY + winSize/2);
      ctx.globalAlpha = 0.2;
      ctx.stroke();
      ctx.globalAlpha = 1.0;

      // Magnified area
      ctx.save();
      ctx.beginPath(); ctx.rect(winX, winY, winSize, winSize); ctx.clip();
      ctx.drawImage(ctx.canvas, randX, randY, boxSize, boxSize, winX, winY, winSize, winSize);
      ctx.restore();
      
      ctx.strokeRect(winX, winY, winSize, winSize);
      ctx.fillText(`ROI_${i}`, winX, winY - 5);
    }
  }

  // Scanning line
  const scanY = (time * 150) % height;
  ctx.globalAlpha = 0.2;
  ctx.fillRect(0, scanY, width, 1);
  ctx.globalAlpha = 1.0;

  ctx.restore();
};
