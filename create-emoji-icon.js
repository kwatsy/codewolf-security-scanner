const fs = require('fs');
const { createCanvas } = require('canvas');

async function createEmojiVibeWolfIcon() {
    console.log('🐺 Creating VibeWolf emoji icon...');
    
    // Create a 128x128 canvas
    const canvas = createCanvas(128, 128);
    const ctx = canvas.getContext('2d');
    
    // Background with gradient
    const gradient = ctx.createLinearGradient(0, 0, 128, 128);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(1, '#16213e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
    
    // Create rounded corners
    ctx.globalCompositeOperation = 'destination-in';
    ctx.beginPath();
    ctx.roundRect(0, 0, 128, 128, 16);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    
    // Draw the wolf emoji (large)
    ctx.font = '72px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Add a subtle glow effect
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 8;
    ctx.fillStyle = '#ffffff';
    ctx.fillText('🐺', 64, 64);
    
    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    
    // Add security badge in corner
    ctx.font = '16px Arial, sans-serif';
    ctx.fillStyle = '#00ff88';
    ctx.fillText('🛡️', 100, 28);
    
    // Save the icon
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync('./images/icon.png', buffer);
    
    console.log('✅ VibeWolf emoji icon created successfully!');
    console.log('📄 Saved as: ./images/icon.png');
    console.log('📏 Size: 128x128 pixels');
    console.log('🎨 Features: Wolf emoji + security shield + gradient background');
}

// Run the function
createEmojiVibeWolfIcon().catch(console.error);
