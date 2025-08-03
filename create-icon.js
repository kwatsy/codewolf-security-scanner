const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

async function createVibeWolfIcon() {
    console.log('🐺 Creating VibeWolf Security Scanner icon...');
    
    // Create a 128x128 canvas
    const canvas = createCanvas(128, 128);
    const ctx = canvas.getContext('2d');
    
    // Background with rounded corners
    ctx.fillStyle = '#2d3748';
    ctx.fillRect(0, 0, 128, 128);
    
    // Create rounded corners effect
    ctx.globalCompositeOperation = 'destination-in';
    ctx.beginPath();
    ctx.roundRect(0, 0, 128, 128, 16);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    
    // Shield shape - outer
    ctx.fillStyle = '#1a202c';
    ctx.strokeStyle = '#4a5568';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(64, 16);
    ctx.lineTo(32, 28);
    ctx.lineTo(32, 64);
    ctx.quadraticCurveTo(32, 88, 48, 104);
    ctx.quadraticCurveTo(56, 108, 64, 112);
    ctx.quadraticCurveTo(72, 108, 80, 104);
    ctx.quadraticCurveTo(96, 88, 96, 64);
    ctx.lineTo(96, 28);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Shield shape - inner (red)
    ctx.fillStyle = '#e53e3e';
    ctx.beginPath();
    ctx.moveTo(64, 24);
    ctx.lineTo(40, 32);
    ctx.lineTo(40, 64);
    ctx.quadraticCurveTo(40, 82, 52, 96);
    ctx.quadraticCurveTo(58, 100, 64, 102);
    ctx.quadraticCurveTo(70, 100, 76, 96);
    ctx.quadraticCurveTo(88, 82, 88, 64);
    ctx.lineTo(88, 32);
    ctx.closePath();
    ctx.fill();
    
    // Wolf head (white circle)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(64, 52, 12, 0, Math.PI * 2);
    ctx.fill();
    
    // Wolf ears
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    // Left ear
    ctx.moveTo(56, 44);
    ctx.lineTo(60, 36);
    ctx.lineTo(64, 44);
    ctx.closePath();
    ctx.fill();
    
    // Right ear
    ctx.beginPath();
    ctx.moveTo(64, 44);
    ctx.lineTo(68, 36);
    ctx.lineTo(72, 44);
    ctx.closePath();
    ctx.fill();
    
    // Wolf eyes
    ctx.fillStyle = '#2d3748';
    ctx.beginPath();
    ctx.arc(60, 50, 2, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(68, 50, 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Wolf nose
    ctx.beginPath();
    ctx.arc(64, 54, 1, 0, Math.PI * 2);
    ctx.fill();
    
    // Security lock
    ctx.fillStyle = '#38a169';
    ctx.fillRect(60, 72, 8, 6);
    
    // Lock shackle
    ctx.strokeStyle = '#38a169';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(64, 70, 2, Math.PI, 0, false);
    ctx.stroke();
    
    // Save as PNG
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync('images/icon.png', buffer);
    
    console.log('✅ Created proper PNG icon at images/icon.png');
    console.log('🐺 VibeWolf Security Scanner icon ready!');
    console.log('📦 You can now package your extension with: vsce package');
}

// Check if canvas is available
try {
    require('canvas');
    createVibeWolfIcon().catch(console.error);
} catch (error) {
    console.log('❌ Canvas library not found. Installing...');
    console.log('📦 Please run: npm install canvas');
    console.log('🔄 Then run this script again.');
}
