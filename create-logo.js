// Simple script to create a VibeWolf logo using Canvas API
const fs = require('fs');

// Create a simple text-based logo for now
const logoSvg = `<svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
  <!-- Dark background circle -->
  <circle cx="64" cy="64" r="60" fill="#1a202c" stroke="#4a5568" stroke-width="4"/>
  
  <!-- Wolf emoji style -->
  <text x="64" y="80" font-family="Arial, sans-serif" font-size="48" text-anchor="middle" fill="#ffffff">🐺</text>
  
  <!-- Shield overlay -->
  <path d="M64 20 L30 30 L30 60 C30 80 45 95 64 100 C83 95 98 80 98 60 L98 30 Z" 
        fill="none" stroke="#e53e3e" stroke-width="3" opacity="0.8"/>
  
  <!-- Security dots -->
  <circle cx="45" cy="45" r="2" fill="#38a169"/>
  <circle cx="83" cy="45" r="2" fill="#38a169"/>
  <circle cx="64" cy="35" r="2" fill="#38a169"/>
</svg>`;

// Write the SVG file
fs.writeFileSync('images/icon.svg', logoSvg);

console.log('✅ VibeWolf logo created: images/icon.svg');
console.log('🐺 Simple wolf + shield design ready!');
